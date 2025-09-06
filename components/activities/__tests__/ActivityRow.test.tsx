import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActivityRow from '../ActivityRow'
import { ActivityWithUser, EntityType, ActionType } from '@/types/activity'

describe('ActivityRow', () => {
  const mockActivity: ActivityWithUser = {
    id: 1,
    userId: 'user123',
    entityType: 'LOAN' as EntityType,
    entityId: 456,
    actionType: 'CREATE' as ActionType,
    oldValue: null,
    newValue: { amount: 1000 },
    description: 'Created loan for $1000',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    ipAddress: '192.168.1.1',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    user: {
      id: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    }
  }

  it('renders user information correctly', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
  })

  it('renders user email when name is not available', () => {
    const activityWithoutName: ActivityWithUser = {
      ...mockActivity,
      user: {
        id: '1',
        email: 'user@example.com',
        firstName: null,
        lastName: null
      }
    }

    render(
      <table>
        <tbody>
          <ActivityRow activity={activityWithoutName} />
        </tbody>
      </table>
    )
    
    expect(screen.getAllByText('user@example.com')).toHaveLength(2) // Main display and email row
  })

  it('renders user avatar with first letter', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('applies correct action badge class for CREATE', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    const actionBadge = screen.getByText('CREATE')
    expect(actionBadge).toHaveClass('badge', 'badge-success')
  })

  it('applies correct action badge class for UPDATE', () => {
    const updateActivity: ActivityWithUser = { ...mockActivity, actionType: 'UPDATE' }
    
    render(
      <table>
        <tbody>
          <ActivityRow activity={updateActivity} />
        </tbody>
      </table>
    )
    
    const actionBadge = screen.getByText('UPDATE')
    expect(actionBadge).toHaveClass('badge', 'badge-warning')
  })

  it('applies correct action badge class for DELETE', () => {
    const deleteActivity: ActivityWithUser = { ...mockActivity, actionType: 'DELETE' }
    
    render(
      <table>
        <tbody>
          <ActivityRow activity={deleteActivity} />
        </tbody>
      </table>
    )
    
    const actionBadge = screen.getByText('DELETE')
    expect(actionBadge).toHaveClass('badge', 'badge-error')
  })

  it('applies correct entity badge class for LOAN', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    const entityBadge = screen.getByText(/LOAN/)
    expect(entityBadge).toHaveClass('badge', 'badge-success')
  })

  it('displays entity ID when available', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    expect(screen.getByText('#456')).toBeInTheDocument()
  })

  it('does not display entity ID when not available', () => {
    const activityWithoutEntityId: ActivityWithUser = { ...mockActivity, entityId: null }
    
    render(
      <table>
        <tbody>
          <ActivityRow activity={activityWithoutEntityId} />
        </tbody>
      </table>
    )
    
    expect(screen.queryByText(/#/)).not.toBeInTheDocument()
  })

  it('renders description with truncation', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    const description = screen.getByText('Created loan for $1000')
    expect(description).toBeInTheDocument()
    expect(description.closest('div')).toHaveClass('max-w-xs', 'truncate')
  })

  it('formats timestamp correctly', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    // The exact format depends on locale, but we can check for date components
    const timestampElement = screen.getByText(/Jan.*15.*2024/)
    expect(timestampElement).toBeInTheDocument()
  })

  it('displays IP address', () => {
    render(
      <table>
        <tbody>
          <ActivityRow activity={mockActivity} />
        </tbody>
      </table>
    )
    
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
  })

  it('displays N/A when IP address is not available', () => {
    const activityWithoutIP: ActivityWithUser = { ...mockActivity, ipAddress: null }
    
    render(
      <table>
        <tbody>
          <ActivityRow activity={activityWithoutIP} />
        </tbody>
      </table>
    )
    
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })

  it('handles partial user names correctly', () => {
    const activityWithFirstNameOnly: ActivityWithUser = {
      ...mockActivity,
      user: {
        id: '1',
        email: 'john@example.com',
        firstName: 'John',
        lastName: null
      }
    }

    render(
      <table>
        <tbody>
          <ActivityRow activity={activityWithFirstNameOnly} />
        </tbody>
      </table>
    )
    
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('test all action badge classes', () => {
    const actions = ['READ', 'LOGIN', 'LOGOUT'] as const
    const expectedClasses = ['badge-info', 'badge-primary', 'badge-neutral']
    
    actions.forEach((action, index) => {
      const activity: ActivityWithUser = { ...mockActivity, actionType: action }
      const { unmount } = render(
        <table>
          <tbody>
            <ActivityRow activity={activity} />
          </tbody>
        </table>
      )
      
      const actionBadge = screen.getByText(action)
      expect(actionBadge).toHaveClass('badge', expectedClasses[index])
      unmount()
    })
  })

  it('test all entity badge classes', () => {
    const entities = ['USER', 'REPAYMENT', 'STASH', 'OTHER'] as const
    const expectedClasses = ['badge-primary', 'badge-warning', 'badge-accent', 'badge-neutral']
    
    entities.forEach((entity, index) => {
      const activity: ActivityWithUser = { ...mockActivity, entityType: entity }
      const { unmount } = render(
        <table>
          <tbody>
            <ActivityRow activity={activity} />
          </tbody>
        </table>
      )
      
      const entityBadge = screen.getByText(entity)
      expect(entityBadge).toHaveClass('badge', expectedClasses[index])
      unmount()
    })
  })
})
