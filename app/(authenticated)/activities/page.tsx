'use client'

import { useState } from 'react'
import { useActivities } from '@/react-query/activities'
import { EntityType, ActionType } from '@/types'
import { useErrorModal, useRoleAccess } from '@/hooks'
import { ErrorModal } from '@/components/common'
import { ActivityFilters, ActivityTable } from '@/components/activities'
import { ErrorIcon } from '@/assets/icons'

export default function ActivitiesPage() {
  const { canAccessManagement } = useRoleAccess()
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(20)
  const [searchTerm, setSearchTerm] = useState('')
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityType | 'ALL'>('ALL')
  const [actionTypeFilter, setActionTypeFilter] = useState<ActionType | 'ALL'>('ALL')
  const [userFilter, setUserFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  const { errorModal, showError, hideError } = useErrorModal()
  
  const { data: activitiesResponse, isLoading, error } = useActivities({
    page: currentPage,
    limit,
    entityType: entityTypeFilter === 'ALL' ? undefined : entityTypeFilter,
    actionType: actionTypeFilter === 'ALL' ? undefined : actionTypeFilter,
    userId: userFilter || undefined,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  })

  // Check if user has access to this page
  if (!canAccessManagement()) {
    return (
      <div className="alert alert-error">
        <div>
          <h3 className="font-bold">Access Denied</h3>
          <div className="text-xs">You don't have permission to access activity logs. Only super admins can view activity logs.</div>
        </div>
      </div>
    )
  }

  const activities = activitiesResponse?.activities || []
  const pagination = activitiesResponse?.pagination

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setEntityTypeFilter('ALL')
    setActionTypeFilter('ALL')
    setUserFilter('')
    setDateFrom('')
    setDateTo('')
    setCurrentPage(1)
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <ErrorIcon />
        <div>
          <h3 className="font-bold">Error Loading Activities</h3>
          <div className="text-xs">Failed to load activity logs. Please try again.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-sm text-gray-600 mt-1">Track all system activities and user actions</p>
        </div>
      </div>

      {/* Filters Section */}
      <ActivityFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        entityTypeFilter={entityTypeFilter}
        setEntityTypeFilter={setEntityTypeFilter}
        actionTypeFilter={actionTypeFilter}
        setActionTypeFilter={setActionTypeFilter}
        userFilter={userFilter}
        setUserFilter={setUserFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        onResetFilters={handleResetFilters}
      />

      {/* Activities Table */}
      <ActivityTable
        activities={activities}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title="Error"
        message={errorModal.message}
        onClose={hideError}
      />
    </div>
  )
}
