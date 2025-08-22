import { EntityType, ActionType, ActivityRowProps, ActivityUser } from '@/types/activity'

export default function ActivityRow({ activity }: ActivityRowProps) {
  const getActionBadgeClass = (action: ActionType) => {
    switch (action) {
      case 'CREATE':
        return 'badge badge-success'
      case 'UPDATE':
        return 'badge badge-warning'
      case 'DELETE':
        return 'badge badge-error'
      case 'READ':
        return 'badge badge-info'
      case 'LOGIN':
        return 'badge badge-primary'
      case 'LOGOUT':
        return 'badge badge-neutral'
      default:
        return 'badge'
    }
  }

  const getEntityBadgeClass = (entity: EntityType) => {
    switch (entity) {
      case 'USER':
        return 'badge badge-primary'
      case 'LOAN':
        return 'badge badge-success'
      case 'REPAYMENT':
        return 'badge badge-warning'
      case 'STASH':
        return 'badge badge-accent'
      case 'OTHER':
        return 'badge badge-neutral'
      default:
        return 'badge'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserDisplayName = (user: ActivityUser) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }
    return user.email
  }

  return (
    <tr>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 !flex items-center justify-center">
              <span className="text-xs">
                {getUserDisplayName(activity.user).charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="font-bold text-sm">{getUserDisplayName(activity.user)}</div>
            <div className="text-xs opacity-50">{activity.user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span className={getActionBadgeClass(activity.actionType)}>
          {activity.actionType}
        </span>
      </td>
      <td>
        <span className={getEntityBadgeClass(activity.entityType)}>
          {activity.entityType}
          {activity.entityId && (
            <span className="text-xs opacity-70"> #{activity.entityId}</span>
          )}
        </span>
      </td>
      <td>
        <div className="max-w-xs truncate" title={activity.description}>
          {activity.description}
        </div>
      </td>
      <td>
        <div className="text-sm">
          {formatDate(activity.timestamp)}
        </div>
      </td>
      <td>
        <div className="text-sm text-gray-500">
          {activity.ipAddress || 'N/A'}
        </div>
      </td>
    </tr>
  )
}
