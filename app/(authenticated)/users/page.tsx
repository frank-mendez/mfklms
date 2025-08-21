'use client'

import { useState } from 'react'
import { useUsers, useUpdateUserStatus, useUpdateUserRole } from '../../../react-query/users'
import { UserStatus, UserRole, User } from '@prisma/client'
import { useErrorModal } from '@/hooks/useErrorModal'
import { ErrorModal } from '@/components/common'
import { PlusIcon, EyeIcon, EditIcon, DeleteIcon, ErrorIcon, LoadingSpinner, UsersIcon } from '@/assets/icons'

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')
  
  const { errorModal, showError, hideError } = useErrorModal()
  
  const { data: usersData, isLoading, error } = useUsers({
    page: currentPage,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
  })

  const updateStatusMutation = useUpdateUserStatus()
  const updateRoleMutation = useUpdateUserRole()

  const handleStatusUpdate = async (userId: string, newStatus: UserStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ userId, status: newStatus })
    } catch (error: any) {
      showError('Status Update Failed', error.message)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role: newRole })
    } catch (error: any) {
      showError('Role Update Failed', error.message)
    }
  }

  const getStatusBadgeClass = (status: UserStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-success'
      case 'PENDING':
        return 'badge badge-warning'
      case 'DEACTIVATED':
        return 'badge badge-error'
      default:
        return 'badge'
    }
  }

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'SUPERADMIN':
        return 'badge badge-error'
      case 'ADMIN':
        return 'badge badge-warning'
      case 'USER':
        return 'badge badge-info'
      default:
        return 'badge'
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>Error loading users: {error.message}</span>
        </div>
      </div>
    )
  }

  const users = usersData?.users || []
  const pagination = usersData?.pagination

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select 
              className="select select-bordered select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'ALL')}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="DEACTIVATED">Deactivated</option>
            </select>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Role</span>
            </label>
            <select 
              className="select select-bordered select-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | 'ALL')}
            >
              <option value="ALL">All Roles</option>
              <option value="SUPERADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: User) => (
                <tr key={user.id}>
                  <td>{user.id.slice(-8)}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-sm">
                            {user.firstName?.[0] || user.email[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium">{user.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.verified ? 'badge-success' : 'badge-warning'}`}>
                      {user.verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">
                      <EyeIcon />
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleRoleUpdate(user.id, user.role === 'USER' ? 'ADMIN' : 'USER')}
                      disabled={updateRoleMutation.isPending}
                    >
                      <EditIcon />
                      {updateRoleMutation.isPending ? 'Updating...' : 'Edit Role'}
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleStatusUpdate(user.id, user.status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <DeleteIcon />
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">No users found</p>
                      <p className="text-sm">Start by creating your first user</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={hideError}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  )
}
