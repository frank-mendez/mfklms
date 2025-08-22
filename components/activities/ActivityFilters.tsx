import { EntityType, ActionType, ActivityFiltersProps } from '@/types/activity'

export default function ActivityFilters({
  searchTerm,
  setSearchTerm,
  entityTypeFilter,
  setEntityTypeFilter,
  actionTypeFilter,
  setActionTypeFilter,
  userFilter,
  setUserFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  onResetFilters
}: ActivityFiltersProps) {
  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Search Description</span>
          </label>
          <input
            type="text"
            placeholder="Search activities..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Entity Type Filter */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Entity Type</span>
          </label>
          <select
            className="select select-bordered"
            value={entityTypeFilter}
            onChange={(e) => setEntityTypeFilter(e.target.value as EntityType | 'ALL')}
          >
            <option value="ALL">All Entities</option>
            <option value="USER">Users</option>
            <option value="LOAN">Loans</option>
            <option value="REPAYMENT">Repayments</option>
            <option value="STASH">Stashes</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Action Type Filter */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Action Type</span>
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

        {/* User Filter */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">User Email</span>
          </label>
          <input
            type="text"
            placeholder="Filter by user email..."
            className="input input-bordered"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        </div>

        {/* Date From */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Date From</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Date To</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        {/* Reset Button */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">&nbsp;</span>
          </label>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}
