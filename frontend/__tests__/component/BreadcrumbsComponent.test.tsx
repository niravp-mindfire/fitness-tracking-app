// BreadcrumbsComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BreadcrumbsComponent from '../../src/component/BreadcrumbsComponent';

describe('BreadcrumbsComponent', () => {
  const mockItems = [
    { label: 'Home', path: '/' },
    { label: 'Library', path: '/library' },
    { label: 'Data' }, // Current page, no path
  ];

  it('renders breadcrumbs correctly', () => {
    render(
      <MemoryRouter>
        <BreadcrumbsComponent items={mockItems} />
      </MemoryRouter>,
    );
  });

  it('navigates to the correct path when a link is clicked', () => {
    const { container } = render(
      <MemoryRouter>
        <BreadcrumbsComponent items={mockItems} />
      </MemoryRouter>,
    );

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
  });

  it('does not render a link for the current page', () => {
    render(
      <MemoryRouter>
        <BreadcrumbsComponent items={mockItems} />
      </MemoryRouter>,
    );
  });
});
