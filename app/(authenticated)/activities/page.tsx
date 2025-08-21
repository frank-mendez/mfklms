'use client'

import { useState } from 'react'
import { useActivities } from '@/react-query/activities'
import { EntityType, ActionType } from '@prisma/client'
import { useErrorModal } from '@/hooks/useErrorModal'
import { ErrorModal } from '@/components/common'

interface ActivityWithUser {
  id: number
  userId: string
  entityType: EntityType
  entityId: number | null
  actionType: ActionType
  oldValue: any
  newValue: any
  description: string
  timestamp: Date
  ipAddress: string | null
  user: {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
  }
}

export default function ActivitiesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityType | 'ALL'>('ALL')
  const [actionTypeFilter, setActionTypeFilter] = useState<ActionType | 'ALL'>('ALL')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  const { errorModal, showError, hideError } = useErrorModal()
  
  const { data: activitiesResponse, isLoading, error } = useActivities({
    page: currentPage,
    entityType: entityTypeFilter === 'ALL' ? undefined : entityTypeFilter,
    actionType: actionTypeFilter === 'ALL' ? undefined : actionTypeFilter,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  })

  if (error) {
    return (
      <div className="p-6">
        <div className="alert alert-error">
          <span>Error loading activity logs: {error.message}</span>
        </div>
      </div>
    )
  }

  const activities = activitiesResponse?.activities || []
  const pagination = activitiesResponse?.pagination

  const getActionBadgeColor = (action: ActionType) => {
    switch (action) {
      case 'CREATE': return 'badge-success'
      case 'UPDATE': return 'badge-warning'
      case 'DELETE': return 'badge-error'
      case 'READ': return 'badge-info'
      case 'LOGIN': return 'badge-primary'
      case 'LOGOUT': return 'badge-neutral'
      default: return 'badge-ghost'
    }
  }

  const getEntityIcon = (entityType: EntityType) => {
    switch (entityType) {
      case 'USER': return '👤'
      case 'LOAN': return '💰'
      case 'REPAYMENT': return '💸'
      case 'STASH': return '💹'
      case 'OTHER': return '📄'
      default: return '📋'
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Logs</h1>
          <p className="text-base-content/60">Monitor system activities and user actions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Entity Type</span>
            </label>
            <select 
              className="select select-bordered"
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value as EntityType | 'ALL')}
            >
              <option value="ALL">All Entities</option>
              <option value="USER">User</option>
              <option value="LOAN">Loan</option>
              <option value="REPAYMENT">Repayment</option>
              <option value="STASH">Stash</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Action Type</span>
            </label>
            <select 
              className="select select-bordered"
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value as ActionType | 'ALL')}
            >
              <option value="ALL">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="READ">Read</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date From</span>
            </label>
            <input 
              type="date"
              className="input input-bordered"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Date To</span>
            </label>
            <input 
              type="date"
              className="input input-bordered"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Actions</span>
            </label>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setEntityTypeFilter('ALL')
                setActionTypeFilter('ALL')
                setDateFrom('')
                setDateTo('')
                setCurrentPage(1)
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-base-100 rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Entity</th>
                <th>Action</th>
                <th>Description</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <span className="loading loading-spinner loading-md"></span>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-base-content/60">
                    No activity logs found
                  </td>
                </tr>
              ) : (
                activities.map((activity: ActivityWithUser) => (
                  <tr key={activity.id}>
                    <td>
                      <div className="text-sm">
                        <div className="font-medium">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                        <div className="text-base-content/60">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8">
                            <span className="text-xs">
                              {activity.user.firstName?.[0] || activity.user.email[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {activity.user.firstName} {activity.user.lastName}
                          </div>
                          <div className="text-xs text-base-content/60">
                            {activity.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEntityIcon(activity.entityType)}</span>
                        <div>
                          <div className="font-medium text-sm">{activity.entityType}</div>
                          {activity.entityId && (
                            <div className="text-xs text-base-content/60">
                              ID: {activity.entityId}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getActionBadgeColor(activity.actionType)}`}>
                        {activity.actionType}
                      </div>
                    </td>
                    <td>
                      <div className="max-w-xs">
                        <p className="text-sm truncate" title={activity.description}>
                          {activity.description}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-mono">
                        {activity.ipAddress || '-'}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm">
                          👁️
                        </label>
                        <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80">
                          <div className="p-4">
                            <h4 className="font-bold mb-2">Activity Details</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-medium">Action:</span> {activity.actionType}
                              </div>
                              <div>
                                <span className="font-medium">Entity:</span> {activity.entityType}
                                {activity.entityId && ` (ID: ${activity.entityId})`}
                              </div>
                              <div>
                                <span className="font-medium">User:</span> {activity.user.email}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span> {new Date(activity.timestamp).toLocaleString()}
                              </div>
                              {activity.ipAddress && (
                                <div>
                                  <span className="font-medium">IP:</span> {activity.ipAddress}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Description:</span>
                                <p className="mt-1 text-xs">{activity.description}</p>
                              </div>
                              {(activity.oldValue || activity.newValue) && (
                                <div className="divider"></div>
                              )}
                              {activity.oldValue && (
                                <div>
                                  <span className="font-medium">Old Value:</span>
                                  <pre className="text-xs bg-base-200 p-2 rounded mt-1 max-h-20 overflow-auto">
                                    {JSON.stringify(activity.oldValue, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {activity.newValue && (
                                <div>
                                  <span className="font-medium">New Value:</span>
                                  <pre className="text-xs bg-base-200 p-2 rounded mt-1 max-h-20 overflow-auto">
                                    {JSON.stringify(activity.newValue, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-base-content/60">
              Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(currentPage * pagination.limit, pagination.total)} of{' '}
              {pagination.total} activities
            </div>
            <div className="join">
              <button 
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button className="join-item btn btn-sm btn-active">
                {currentPage}
              </button>
              <button 
                className="join-item btn btn-sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= pagination.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={hideError}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  )
}
