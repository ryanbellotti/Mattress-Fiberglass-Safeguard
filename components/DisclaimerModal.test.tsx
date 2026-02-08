import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import DisclaimerModal from './DisclaimerModal';

describe('DisclaimerModal', () => {
  it('renders correctly when open', () => {
    render(<DisclaimerModal isOpen={true} onAccept={() => {}} />);

    expect(screen.getByText(/Protocol Initiation/i)).toBeInTheDocument();
    expect(screen.getByText(/Safety Verification Required/i)).toBeInTheDocument();
    expect(screen.getByText(/I UNDERSTAND & INITIALIZE/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DisclaimerModal isOpen={false} onAccept={() => {}} />);

    expect(screen.queryByText(/Protocol Initiation/i)).not.toBeInTheDocument();
  });

  it('calls onAccept when the button is clicked', async () => {
    const handleAccept = vi.fn();
    const user = userEvent.setup();

    render(<DisclaimerModal isOpen={true} onAccept={handleAccept} />);

    const button = screen.getByRole('button', { name: /I UNDERSTAND & INITIALIZE/i });
    await user.click(button);

    expect(handleAccept).toHaveBeenCalledTimes(1);
  });
});
