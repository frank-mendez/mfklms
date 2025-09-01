import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ActivityFilters from '@/components/activities/ActivityFilters'
import { ActivityFiltersProps } from '@/types/activity'

const mockProps: ActivityFiltersProps = {
  searchTerm: '',
  setSearchTerm: jest.fn(),
  entityTypeFilter: 'ALL',
  setEntityTypeFilter: jest.fn(),
  actionTypeFilter: 'ALL',
  setActionTypeFilter: jest.fn(),
  userFilter: '',
  setUserFilter: jest.fn(),
  dateFrom: '',
  setDateFrom: jest.fn(),
  dateTo: '',
  setDateTo: jest.fn(),
  onResetFilters: jest.fn(),
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('ActivityFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all filter inputs', () => {
    renderWithQueryClient(<ActivityFilters {...mockProps} />)
    
    expect(screen.getByPlaceholderText('Search activities...')).toBeInTheDocument()
    expect(screen.getByText('Reset Filters')).toBeInTheDocument()
  })

  it('calls setSearchTerm when search input changes', () => {
    renderWithQueryClient(<ActivityFilters {...mockProps} />)
    
    const searchInput = screen.getByPlaceholderText('Search activities...')
    fireEvent.change(searchInput, { target: { value: 'test search' } })
    
    expect(mockProps.setSearchTerm).toHaveBeenCalledWith('test search')
  })

  it('calls onResetFilters when reset button is clicked', () => {
    renderWithQueryClient(<ActivityFilters {...mockProps} />)
    
    const resetButton = screen.getByText('Reset Filters')
    fireEvent.click(resetButton)
    
    expect(mockProps.onResetFilters).toHaveBeenCalled()
  })

  it('displays current search term value', () => {
    const propsWithValues = {
      ...mockProps,
      searchTerm: 'test search',
    }
    
    renderWithQueryClient(<ActivityFilters {...propsWithValues} />)
    
    const searchInput = screen.getByDisplayValue('test search')
    expect(searchInput).toBeInTheDocument()
  })

  it('updates dateFrom when start date input changes', () => {
    renderWithQueryClient(<ActivityFilters {...mockProps} />)
    
    // Get all input elements and filter for date type
    const allInputs = document.querySelectorAll('input[type="date"]')
    const startDateField = allInputs[0] as HTMLInputElement
    
    fireEvent.change(startDateField, { target: { value: '2025-01-01' } })
    
    expect(mockProps.setDateFrom).toHaveBeenCalledWith('2025-01-01')
  })

  it('updates dateTo when end date input changes', () => {
    renderWithQueryClient(<ActivityFilters {...mockProps} />)
    
    // Get all input elements and filter for date type
    const allInputs = document.querySelectorAll('input[type="date"]')
    const endDateField = allInputs[1] as HTMLInputElement
    
    fireEvent.change(endDateField, { target: { value: '2025-12-31' } })
    
    expect(mockProps.setDateTo).toHaveBeenCalledWith('2025-12-31')
  })
})
