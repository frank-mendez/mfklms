import { LoadingSpinner, UsersIcon } from '@/assets/icons'
import { ActivityTableProps } from '@/types/activity'
import ActivityRow from './ActivityRow'
import ActivityPagination from './ActivityPagination'

export default function ActivityTable({ 
  activities, 
  pagination, 
  isLoading, 
  onPageChange, 
  onResetFilters 
}: ActivityTableProps) {
  return (
    <div className="overflow-x-auto bg-base-200 rounded-lg">
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner className="loading-lg" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No activities found</h3>
          <p className="text-gray-500 mb-4">No activity logs match your current filters.</p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onResetFilters}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="px-6 py-4 border-gray-200 bg-base-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5 text-gray-500" />
                <span className="font-medium">
                  {pagination ? (
                    <>
                      {((pagination.page - 1) * pagination.limit) + 1}-
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
                    </>
                  ) : (
                    'Activities'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Description</th>
                <th>Timestamp</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <ActivityRow key={activity.id} activity={activity} />
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && (
            <ActivityPagination 
              pagination={pagination} 
              onPageChange={onPageChange} 
            />
          )}
        </>
      )}
    </div>
  )
}
