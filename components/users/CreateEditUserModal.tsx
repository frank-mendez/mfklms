'use client'

import { useState, useEffect } from 'react'
import { User, UserRole, UserStatus } from '@prisma/client'
import { useCreateUser, useUpdateUser } from '@/react-query/users'
import { useErrorModal } from '@/hooks'
import { ErrorModal } from '@/components/common'
import { CloseIcon, LoadingSpinner } from '@/assets/icons'

interface CreateEditUserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
}

interface UserFormData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
}

export default function CreateEditUserModal({
  isOpen,
  onClose,
  user
}: CreateEditUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'USER',
    status: 'PENDING'
  })

  const { errorModal, showError, hideError } = useErrorModal()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  const isEditing = !!user
  const isLoading = createUserMutation.isPending || updateUserMutation.isPending

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        email: user.email,
        password: '', // Don't pre-fill password for security
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
        status: user.status
      })
    } else if (!isEditing) {
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'USER',
        status: 'PENDING'
      })
    }
  }, [user, isOpen, isEditing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await updateUserMutation.mutateAsync({
          id: user!.id,
          userData: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role,
            status: formData.status,
            ...(formData.password && { password: formData.password })
          }
        })
      } else {
        await createUserMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          status: formData.status
        })
      }
      onClose()
    } catch {
      showError(
        isEditing ? 'Update Failed' : 'Creation Failed'
      )
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">
            {isEditing ? 'Edit User' : 'Create New User'}
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Password {isEditing ? '(leave blank to keep current)' : '*'}
                </span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered"
                required={!isEditing}
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered"
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered"
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Role</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered"
                disabled={isLoading}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered"
                disabled={isLoading}
              >
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="DEACTIVATED">Deactivated</option>
              </select>
            </div>
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner className="loading loading-spinner loading-sm" />}
              {isEditing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>

        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={hideError}
          title={errorModal.title}
          message={errorModal.message}
        />
      </div>
    </div>
  )
}
