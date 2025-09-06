import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityPagination from '../ActivityPagination'
import { PaginationData } from '@/types/activity'

describe('ActivityPagination', () => {
  const mockOnPageChange = jest.fn()
  const mockOnLimitChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Single page scenarios', () => {
    it('renders correctly when no pagination data provided', () => {
      render(
        <ActivityPagination
          pagination={{
            page: 1,
            limit: 10,
            totalPages: 0,
            total: 0
          }}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      expect(screen.getByText('Showing 0 results')).toBeInTheDocument()
      expect(screen.getByText('Show:')).toBeInTheDocument()
      expect(screen.getByText('per page')).toBeInTheDocument()
    })

    it('renders correctly when only one page exists', () => {
      const singlePagePagination: PaginationData = {
        page: 1,
        limit: 10,
        total: 5,
        totalPages: 1
      }

      render(
        <ActivityPagination
          pagination={singlePagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      expect(screen.getByText('Showing 5 results')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
      
      // Should not render page navigation buttons for single page
      expect(screen.queryByText('«')).not.toBeInTheDocument()
      expect(screen.queryByText('»')).not.toBeInTheDocument()
    })
  })

  describe('Multi-page scenarios', () => {
    const multiPagePagination: PaginationData = {
      page: 2,
      limit: 10,
      total: 45,
      totalPages: 5
    }

    it('renders pagination info correctly for multi-page data', () => {
      render(
        <ActivityPagination
          pagination={multiPagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      expect(screen.getByText('Showing 11 to 20 of 45 results')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
    })

    it('renders page navigation buttons correctly', () => {
      render(
        <ActivityPagination
          pagination={multiPagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      expect(screen.getByText('«')).toBeInTheDocument()
      expect(screen.getByText('»')).toBeInTheDocument()
      
      // Use role-based queries to find page buttons
      const allButtons = screen.getAllByRole('button')
      const pageButtons = allButtons.filter(btn => 
        /^[1-5]$/.test(btn.textContent || '')
      )
      expect(pageButtons).toHaveLength(5)
    })

    it('highlights current page correctly', () => {
      render(
        <ActivityPagination
          pagination={multiPagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      // Find current page button (page 2) with active class
      const allButtons = screen.getAllByRole('button')
      const currentPageButton = allButtons.find(btn => 
        btn.textContent === '2' && btn.classList.contains('btn-active')
      )
      expect(currentPageButton).toBeInTheDocument()

      const otherPageButton = allButtons.find(btn =>
        btn.textContent === '1' && !btn.classList.contains('btn-active')
      )
      expect(otherPageButton).toBeInTheDocument()
    })
  })

  describe('Page navigation', () => {
    it('calls onPageChange when page number is clicked', () => {
      const pagination: PaginationData = {
        page: 2,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const page3Button = screen.getByText('3')
      fireEvent.click(page3Button)

      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('calls onPageChange when previous button is clicked', () => {
      const pagination: PaginationData = {
        page: 3,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const prevButton = screen.getByText('«')
      fireEvent.click(prevButton)

      expect(mockOnPageChange).toHaveBeenCalledWith(2)
    })

    it('calls onPageChange when next button is clicked', () => {
      const pagination: PaginationData = {
        page: 2,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const nextButton = screen.getByText('»')
      fireEvent.click(nextButton)

      expect(mockOnPageChange).toHaveBeenCalledWith(3)
    })

    it('disables previous button on first page', () => {
      const firstPagePagination: PaginationData = {
        page: 1,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={firstPagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const prevButton = screen.getByText('«')
      expect(prevButton).toBeDisabled()
    })

    it('disables next button on last page', () => {
      const lastPagePagination: PaginationData = {
        page: 5,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={lastPagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const nextButton = screen.getByText('»')
      expect(nextButton).toBeDisabled()
    })
  })

  describe('Page limit changes', () => {
    it('calls onLimitChange when page size is changed', () => {
      const pagination: PaginationData = {
        page: 1,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const limitSelect = screen.getByDisplayValue('10')
      fireEvent.change(limitSelect, { target: { value: '20' } })

      expect(mockOnLimitChange).toHaveBeenCalledWith(20)
    })

    it('renders all page size options', () => {
      const pagination: PaginationData = {
        page: 1,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      // Use getByRole to find the select element and check options
      const selectElement = screen.getByRole('combobox')
      expect(selectElement).toBeInTheDocument()
      
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(4)
      expect(options[0]).toHaveValue('5')
      expect(options[1]).toHaveValue('10')
      expect(options[2]).toHaveValue('20')
      expect(options[3]).toHaveValue('30')
    })
  })

  describe('Page number calculation scenarios', () => {
    it('shows pages 1-5 when total pages is 5 or less', () => {
      const pagination: PaginationData = {
        page: 3,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const allButtons = screen.getAllByRole('button')
      const pageButtons = allButtons.filter(btn => 
        /^[1-5]$/.test(btn.textContent || '')
      )
      expect(pageButtons).toHaveLength(5)
      
      // Verify all page numbers 1-5 are present
      expect(pageButtons.some(btn => btn.textContent === '1')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '2')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '3')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '4')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '5')).toBe(true)
    })

    it('shows pages 1-5 when current page is near beginning (page 1-3)', () => {
      const pagination: PaginationData = {
        page: 2,
        limit: 10,
        total: 100,
        totalPages: 10
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const allButtons = screen.getAllByRole('button')
      const pageButtons = allButtons.filter(btn => 
        /^[1-5]$/.test(btn.textContent || '')
      )
      expect(pageButtons).toHaveLength(5)
      
      // Verify pages 1-5 are present
      expect(pageButtons.some(btn => btn.textContent === '1')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '2')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '3')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '4')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '5')).toBe(true)
    })

    it('shows last 5 pages when current page is near end', () => {
      const pagination: PaginationData = {
        page: 9,
        limit: 10,
        total: 100,
        totalPages: 10
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const allButtons = screen.getAllByRole('button')
      const pageButtons = allButtons.filter(btn => 
        /^[6-9]|10$/.test(btn.textContent || '')
      )
      expect(pageButtons.length).toBeGreaterThanOrEqual(5)
      
      // Verify pages 6-10 are present
      expect(pageButtons.some(btn => btn.textContent === '6')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '7')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '8')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '9')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '10')).toBe(true)
    })

    it('shows current page in middle when not near beginning or end', () => {
      const pagination: PaginationData = {
        page: 5,
        limit: 10,
        total: 100,
        totalPages: 10
      }

      render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      const allButtons = screen.getAllByRole('button')
      const pageButtons = allButtons.filter(btn => 
        /^[3-7]$/.test(btn.textContent || '')
      )
      expect(pageButtons.length).toBeGreaterThanOrEqual(5)
      
      // Verify pages 3-7 are present (current page 5 in middle)
      expect(pageButtons.some(btn => btn.textContent === '3')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '4')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '5')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '6')).toBe(true)
      expect(pageButtons.some(btn => btn.textContent === '7')).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('handles last page with fewer items correctly', () => {
      const lastPagePagination: PaginationData = {
        page: 5,
        limit: 10,
        total: 42,
        totalPages: 5
      }

      render(
        <ActivityPagination
          pagination={lastPagePagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      // Should show "Showing 41 to 42 of 42 results"
      expect(screen.getByText('Showing 41 to 42 of 42 results')).toBeInTheDocument()
    })

    it('handles single item on last page correctly', () => {
      const singleItemLastPage: PaginationData = {
        page: 3,
        limit: 10,
        total: 21,
        totalPages: 3
      }

      render(
        <ActivityPagination
          pagination={singleItemLastPage}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      expect(screen.getByText('Showing 21 to 21 of 21 results')).toBeInTheDocument()
    })
  })

  describe('CSS and structure', () => {
    it('has correct CSS classes', () => {
      const pagination: PaginationData = {
        page: 2,
        limit: 10,
        total: 45,
        totalPages: 5
      }

      const { container } = render(
        <ActivityPagination
          pagination={pagination}
          onPageChange={mockOnPageChange}
          onLimitChange={mockOnLimitChange}
        />
      )

      expect(container.querySelector('.px-6')).toHaveClass('px-6', 'py-4', 'border-t', 'border-gray-200', 'bg-base-100')
      expect(container.querySelector('.join')).toBeInTheDocument()
      expect(container.querySelector('.select')).toHaveClass('select', 'select-bordered', 'select-sm')
    })
  })
})
