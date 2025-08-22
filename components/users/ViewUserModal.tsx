'use client'

import { User } from '@prisma/client'
import { CloseIcon, UsersIcon } from '@/assets/icons'

interface ViewUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export default function ViewUserModal({
  isOpen,
  onClose,
  user
}: ViewUserModalProps) {
  if (!isOpen || !user) return null

  const getStatusBadgeClass = (status: string) => {
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

  const getRoleBadgeClass = (role: string) => {
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

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            User Details
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-base">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-base">
                    {user.firstName || user.lastName
                      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-base">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p>
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p>
                    <span className={getStatusBadgeClass(user.status)}>
                      {user.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Verified</label>
                  <p>
                    <span className={`badge ${user.verified ? 'badge-success' : 'badge-warning'}`}>
                      {user.verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-sm text-gray-600 font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-base">Timeline</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="text-base">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-base">
                    {new Date(user.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
