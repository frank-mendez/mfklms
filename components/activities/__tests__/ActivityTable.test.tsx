import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityTable from '../ActivityTable'
import { ActivityWithUser, PaginationData, EntityType, ActionType } from '@/types/activity'

// Mock the icons
jest.mock('@/assets/icons', () => ({
  LoadingSpinner: ({ className }: { className?: string }) => <div data-testid="loading-spinner" className={className} />,
  UsersIcon: ({ className }: { className?: string }) => <div data-testid="users-icon" className={className} />
}))

// Mock child components
jest.mock('../ActivityRow', () => {
  return function MockActivityRow({ activity }: { activity: ActivityWithUser }) {
    return <tr data-testid={`activity-row-${activity.id}`}><td>{activity.description}</td></tr>
  }
})

jest.mock('../ActivityPagination', () => {
  return function MockActivityPagination({ 
    onPageChange, 
    onLimitChange 
  }: { 
    pagination: PaginationData
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void 
  }) {
    return (
      <div data-testid="activity-pagination">
        <button onClick={() => onPageChange(2)}>Next Page</button>
        <button onClick={() => onLimitChange(25)}>Change Limit</button>
      </div>
    )
  }
})

describe('ActivityTable', () => {
  const mockOnPageChange = jest.fn()
  const mockOnLimitChange = jest.fn()
  const mockOnResetFilters = jest.fn()

  const mockActivities: ActivityWithUser[] = [
    {
      id: 1,
      userId: 'user1',
      entityType: 'LOAN' as EntityType,
      entityId: 123,
      actionType: 'CREATE' as ActionType,
      oldValue: null,
      newValue: { amount: 1000 },
      description: 'Created loan for customer',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      ipAddress: '192.168.1.1',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
      user: {
        id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
    },
    {
      id: 2,
      userId: 'user2',
      entityType: 'USER' as EntityType,
      entityId: 456,
      actionType: 'UPDATE' as ActionType,
      oldValue: { name: 'Old Name' },
      newValue: { name: 'New Name' },
      description: 'Updated user profile',
      timestamp: new Date('2024-01-16T11:30:00Z'),
      ipAddress: '192.168.1.2',
      createdAt: new Date('2024-01-16T11:30:00Z'),
      updatedAt: new Date('2024-01-16T11:30:00Z'),
      user: {
        id: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com'
      }
    }
  ]

  const mockPagination: PaginationData = {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state correctly', () => {
    render(
      <ActivityTable
        activities={[]}
        pagination={undefined}
        isLoading={true}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByTestId('loading-spinner')).toHaveClass('loading-lg')
  })

  it('renders empty state when no activities', () => {
    render(
      <ActivityTable
        activities={[]}
        pagination={undefined}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    expect(screen.getByText('No activities found')).toBeInTheDocument()
    expect(screen.getByText('No activity logs match your current filters.')).toBeInTheDocument()
    expect(screen.getByText('Clear Filters')).toBeInTheDocument()
  })

  it('calls onResetFilters when Clear Filters button is clicked', () => {
    render(
      <ActivityTable
        activities={[]}
        pagination={undefined}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    const clearButton = screen.getByText('Clear Filters')
    fireEvent.click(clearButton)

    expect(mockOnResetFilters).toHaveBeenCalledTimes(1)
  })

  it('renders table with activities when data is available', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={mockPagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    // Check table headers
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Entity')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Timestamp')).toBeInTheDocument()
    expect(screen.getByText('IP Address')).toBeInTheDocument()

    // Check activity rows are rendered
    expect(screen.getByTestId('activity-row-1')).toBeInTheDocument()
    expect(screen.getByTestId('activity-row-2')).toBeInTheDocument()
  })

  it('displays pagination information correctly with pagination data', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={mockPagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    // Should show "1-10 of 25 activities"
    expect(screen.getByText('1-10 of 25 activities')).toBeInTheDocument()
  })

  it('displays "Activities" when no pagination data', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={undefined}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    expect(screen.getByText('Activities')).toBeInTheDocument()
  })

  it('renders pagination component when pagination data is provided', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={mockPagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    expect(screen.getByTestId('activity-pagination')).toBeInTheDocument()
  })

  it('does not render pagination component when no pagination data', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={undefined}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    expect(screen.queryByTestId('activity-pagination')).not.toBeInTheDocument()
  })

  it('passes correct props to ActivityPagination component', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={mockPagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    // Test that callbacks work through to child component
    const nextPageButton = screen.getByText('Next Page')
    const changeLimitButton = screen.getByText('Change Limit')

    fireEvent.click(nextPageButton)
    expect(mockOnPageChange).toHaveBeenCalledWith(2)

    fireEvent.click(changeLimitButton)
    expect(mockOnLimitChange).toHaveBeenCalledWith(25)
  })

  it('calculates pagination display correctly for middle pages', () => {
    const middlePagePagination: PaginationData = {
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3
    }

    render(
      <ActivityTable
        activities={mockActivities}
        pagination={middlePagePagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    // Should show "11-20 of 25 activities"
    expect(screen.getByText('11-20 of 25 activities')).toBeInTheDocument()
  })

  it('calculates pagination display correctly for last page', () => {
    const lastPagePagination: PaginationData = {
      page: 3,
      limit: 10,
      total: 25,
      totalPages: 3
    }

    render(
      <ActivityTable
        activities={mockActivities}
        pagination={lastPagePagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    // Should show "21-25 of 25 activities" (not "21-30")
    expect(screen.getByText('21-25 of 25 activities')).toBeInTheDocument()
  })

  it('has correct CSS classes for table structure', () => {
    const { container } = render(
      <ActivityTable
        activities={mockActivities}
        pagination={mockPagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    const tableContainer = container.querySelector('.overflow-x-auto')
    expect(tableContainer).toHaveClass('overflow-x-auto', 'bg-base-200', 'rounded-lg')

    const table = container.querySelector('.table')
    expect(table).toHaveClass('table', 'table-zebra', 'w-full')

    const header = container.querySelector('.bg-base-100')
    expect(header).toBeInTheDocument()
  })

  it('renders users icon in header correctly', () => {
    render(
      <ActivityTable
        activities={mockActivities}
        pagination={mockPagination}
        isLoading={false}
        onPageChange={mockOnPageChange}
        onLimitChange={mockOnLimitChange}
        onResetFilters={mockOnResetFilters}
      />
    )

    const headerIcon = screen.getAllByTestId('users-icon')[0] // First one in header
    expect(headerIcon).toHaveClass('h-5', 'w-5', 'text-gray-500')
  })
})
