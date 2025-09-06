import React from 'react';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import SessionProvider from '../SessionProvider';
import { Session } from 'next-auth';
import { UserRole } from '@prisma/client/wasm';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children, session }: { children: React.ReactNode; session: Session | null }) => (
    <div data-testid="next-auth-provider" data-session={JSON.stringify(session)}>
      {children}
    </div>
  ),
  useSession: jest.fn(),
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Test component that uses session
const TestComponent = () => {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div data-testid="session-loading">Loading...</div>;
  if (status === 'unauthenticated') return <div data-testid="session-unauthenticated">Not signed in</div>;
  
  return (
    <div data-testid="session-authenticated">
      <span data-testid="user-name">{session?.user?.name}</span>
      <span data-testid="user-email">{session?.user?.email}</span>
      <span data-testid="user-role">{session?.user?.role}</span>
    </div>
  );
};

describe('SessionProvider', () => {
  const mockSession: Session = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.USER,
      firstName: 'John',
      lastName: 'Doe',
    },
    expires: '2025-12-31T23:59:59.999Z',
  };

  beforeEach(() => {
    mockUseSession.mockClear();
  });

  it('renders children correctly', () => {
    render(
      <SessionProvider session={null}>
        <div data-testid="test-child">Test Child</div>
      </SessionProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('passes session prop to next-auth SessionProvider', () => {
    render(
      <SessionProvider session={mockSession}>
        <div>Test</div>
      </SessionProvider>
    );

    const provider = screen.getByTestId('next-auth-provider');
    expect(provider).toBeInTheDocument();
    
    const sessionData = provider.getAttribute('data-session');
    expect(sessionData).toBe(JSON.stringify(mockSession));
  });

  it('passes null session to next-auth SessionProvider', () => {
    render(
      <SessionProvider session={null}>
        <div>Test</div>
      </SessionProvider>
    );

    const provider = screen.getByTestId('next-auth-provider');
    expect(provider).toBeInTheDocument();
    
    const sessionData = provider.getAttribute('data-session');
    expect(sessionData).toBe('null');
  });

  it('provides session context to child components', () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <SessionProvider session={mockSession}>
        <TestComponent />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-authenticated')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
  });

  it('handles unauthenticated session state', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    });

    render(
      <SessionProvider session={null}>
        <TestComponent />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-unauthenticated')).toBeInTheDocument();
    expect(screen.getByTestId('session-unauthenticated')).toHaveTextContent('Not signed in');
  });

  it('handles loading session state', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
      update: jest.fn(),
    });

    render(
      <SessionProvider session={null}>
        <TestComponent />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-loading')).toBeInTheDocument();
    expect(screen.getByTestId('session-loading')).toHaveTextContent('Loading...');
  });

  it('handles session with partial user data', () => {
    const partialSession: Session = {
      user: {
        id: '2',
        email: 'jane@example.com',
        role: UserRole.USER,
        // name is undefined
      },
      expires: '2025-12-31T23:59:59.999Z',
    };

    mockUseSession.mockReturnValue({
      data: partialSession,
      status: 'authenticated',
      update: jest.fn(),
    });

    render(
      <SessionProvider session={partialSession}>
        <TestComponent />
      </SessionProvider>
    );

    expect(screen.getByTestId('session-authenticated')).toBeInTheDocument();
    expect(screen.getByTestId('user-name')).toHaveTextContent(''); // empty because name is undefined
    expect(screen.getByTestId('user-email')).toHaveTextContent('jane@example.com');
  });

  it('handles multiple children', () => {
    render(
      <SessionProvider session={mockSession}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </SessionProvider>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('re-renders when session prop changes', () => {
    const { rerender } = render(
      <SessionProvider session={null}>
        <div data-testid="provider-test">Test</div>
      </SessionProvider>
    );

    let provider = screen.getByTestId('next-auth-provider');
    expect(provider.getAttribute('data-session')).toBe('null');

    // Update session
    rerender(
      <SessionProvider session={mockSession}>
        <div data-testid="provider-test">Test</div>
      </SessionProvider>
    );

    provider = screen.getByTestId('next-auth-provider');
    expect(provider.getAttribute('data-session')).toBe(JSON.stringify(mockSession));
  });

  it('maintains component structure', () => {
    const { container } = render(
      <SessionProvider session={mockSession}>
        <main>
          <header>Header</header>
          <div>Content</div>
          <footer>Footer</footer>
        </main>
      </SessionProvider>
    );

    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
