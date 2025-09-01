import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useBorrowers, useCreateBorrower, useDeleteBorrower } from '@/react-query/borrowers'
import React from 'react'

// Mock fetch
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

const createWrapper = () => {
  const testQueryClient = createTestQueryClient()
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: testQueryClient }, children)
}

describe('useBorrowers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches borrowers successfully', async () => {
    const mockBorrowers = [
      { id: 1, name: 'John Doe', contactInfo: 'john@example.com' },
      { id: 2, name: 'Jane Smith', contactInfo: 'jane@example.com' },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBorrowers,
    } as Response)

    const { result } = renderHook(() => useBorrowers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockBorrowers)
    expect(fetch).toHaveBeenCalledWith('/api/borrowers')
  })

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useBorrowers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeInstanceOf(Error)
  })

  it('handles 404 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => 'Not found',
    } as Response)

    const { result } = renderHook(() => useBorrowers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

describe('useCreateBorrower', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates borrower successfully', async () => {
    const newBorrower = {
      name: 'New Borrower',
      contactInfo: 'new@example.com',
    }

    const mockCreatedBorrower = { id: 1, ...newBorrower }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCreatedBorrower,
    } as Response)

    const { result } = renderHook(() => useCreateBorrower(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(newBorrower)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockCreatedBorrower)
    expect(fetch).toHaveBeenCalledWith('/api/borrowers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBorrower),
    })
  })

  it('handles creation error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Invalid data',
    } as Response)

    const { result } = renderHook(() => useCreateBorrower(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      name: 'Invalid Borrower',
      contactInfo: '',
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})

describe('useDeleteBorrower', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deletes borrower successfully', async () => {
    const borrowerId = 1

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as Response)

    const { result } = renderHook(() => useDeleteBorrower(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(borrowerId)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(fetch).toHaveBeenCalledWith(`/api/borrowers/${borrowerId}`, {
      method: 'DELETE',
    })
  })

  it('handles deletion error', async () => {
    const borrowerId = 1

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Cannot delete borrower with active loans',
    } as Response)

    const { result } = renderHook(() => useDeleteBorrower(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(borrowerId)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})
