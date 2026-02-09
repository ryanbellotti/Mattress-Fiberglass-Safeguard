import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../NavBar';
import { describe, it, expect } from 'vitest';

describe('NavBar Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText('SafeGuard')).toBeInTheDocument();
    expect(screen.getByText('V3.1 AI Nexus')).toBeInTheDocument();
  });

  it('renders all navigation groups', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    expect(screen.getByText('CORE')).toBeInTheDocument();
    expect(screen.getByText('EMERGENCY & TOOLS')).toBeInTheDocument();
    expect(screen.getByText('HUB & KNOWLEDGE')).toBeInTheDocument();
    expect(screen.getByText('REPORTING')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );
    // Checking a subset of links to verify rendering
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Assessment')).toBeInTheDocument();
    expect(screen.getByText('Live AI Expert')).toBeInTheDocument();
    expect(screen.getByText('Cleanup Guide')).toBeInTheDocument();
  });

  it('highlights the active link correctly', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <NavBar />
      </MemoryRouter>
    );

    // Find the link by its text content
    const dashboardLink = screen.getByText('My Dashboard').closest('a');
    const homeLink = screen.getByText('Home').closest('a');

    // Verify active link classes
    expect(dashboardLink).toHaveClass('bg-white/5');
    expect(dashboardLink).toHaveClass('shadow-inner');

    // Verify inactive link classes
    expect(homeLink).not.toHaveClass('shadow-inner');
  });
});
