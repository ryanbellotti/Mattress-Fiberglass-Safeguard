import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MattressChecker from '../pages/MattressChecker';
import { checkBrandWithSearch } from '../services/geminiService';

// Mock dependencies
vi.mock('../services/geminiService', () => ({
  checkBrandWithSearch: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Lucide icons to avoid potential issues (though they are usually fine)
// Skipping explicit icon mock as they are just SVG components

describe('MattressChecker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not trigger search when query is empty', async () => {
    render(<MattressChecker />);

    const searchButton = screen.getByRole('button', { name: /audit/i });
    fireEvent.click(searchButton);

    expect(checkBrandWithSearch).not.toHaveBeenCalled();
  });

  it('prioritizes local database match', async () => {
    // Mock the API to return something generic, to prove that local data overrides it
    (checkBrandWithSearch as any).mockResolvedValue({
      riskLevel: 'low',
      containsFiberglass: false,
      summary: 'API Summary',
      sources: ['http://example.com']
    });

    render(<MattressChecker />);

    const input = screen.getByPlaceholderText('Query brand or model name...');
    fireEvent.change(input, { target: { value: 'Tulo' } }); // Tulo is in LOCAL_DATABASE with high risk

    const searchButton = screen.getByRole('button', { name: /audit/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(checkBrandWithSearch).toHaveBeenCalledWith('Tulo');
    // Verify that despite the mock returning low risk, the component uses the local database value (high risk).
    });

    // Check if the displayed result reflects LOCAL_DATABASE data (High Risk) instead of API mock (Low Risk)
    // "Tulo", risk: "high", fg: true

    expect(screen.getByText(/RISK RATING: HIGH/i)).toBeInTheDocument();
    expect(screen.getByText('DETECTION')).toBeInTheDocument(); // fg: true -> DETECTION
    expect(screen.getByText('Database Verified')).toBeInTheDocument();
  });

  it('uses API data when no local match found', async () => {
    (checkBrandWithSearch as any).mockResolvedValue({
      riskLevel: 'low',
      containsFiberglass: false,
      summary: 'Safe mattress summary from API',
      sources: ['http://safe-mattress.com']
    });

    render(<MattressChecker />);

    const input = screen.getByPlaceholderText('Query brand or model name...');
    fireEvent.change(input, { target: { value: 'SafeBrand' } });

    const searchButton = screen.getByRole('button', { name: /audit/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(checkBrandWithSearch).toHaveBeenCalledWith('SafeBrand');
    });

    expect(screen.getByText(/RISK RATING: LOW/i)).toBeInTheDocument();
    expect(screen.getByText('NEGATIVE')).toBeInTheDocument(); // fg: false -> NEGATIVE
    expect(screen.getByText('Safe mattress summary from API')).toBeInTheDocument();

    // Ensure "Database Verified" is NOT present
    expect(screen.queryByText('Database Verified')).not.toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (checkBrandWithSearch as any).mockRejectedValue(new Error('API Error'));

    render(<MattressChecker />);

    const input = screen.getByPlaceholderText('Query brand or model name...');
    fireEvent.change(input, { target: { value: 'ErrorBrand' } });

    const searchButton = screen.getByRole('button', { name: /audit/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(checkBrandWithSearch).toHaveBeenCalled();
    });

    expect(consoleSpy).toHaveBeenCalled();

    // Should stop loading (button should not be disabled)
    // Wait for button to be enabled again
    await waitFor(() => {
        expect(screen.getByRole('button', { name: /audit/i })).not.toBeDisabled();
    });

    consoleSpy.mockRestore();
  });
});
