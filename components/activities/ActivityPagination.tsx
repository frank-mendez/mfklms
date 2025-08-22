import { ActivityPaginationProps } from '@/types/activity'

export default function ActivityPagination({ pagination, onPageChange, onLimitChange }: ActivityPaginationProps) {
  const pageSizeOptions = [5, 10, 20, 30]
  
  if (!pagination || pagination.totalPages <= 1) {
    return (
      <div className="px-6 py-4 border-t border-gray-200 bg-base-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing {pagination ? pagination.total : 0} results
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              className="select select-bordered select-sm"
              value={pagination?.limit || 10}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-base-100">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} results
        </div>
        
        <div className="flex items-center gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              className="select select-bordered select-sm"
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">per page</span>
          </div>
          
          {/* Page Navigation */}
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              «
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum
              if (pagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.page <= 3) {
                pageNum = i + 1
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i
              } else {
                pageNum = pagination.page - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  className={`join-item btn btn-sm ${
                    pagination.page === pageNum ? 'btn-active' : ''
                  }`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button
              className="join-item btn btn-sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
