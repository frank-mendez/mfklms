'use client'

import { User } from '@prisma/client'
import { useDeleteUser } from '@/react-query/users'
import { useErrorModal } from '@/hooks'
import { ErrorModal } from '@/components/common'
import { CloseIcon, LoadingSpinner, WarningIcon } from '@/assets/icons'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  user
}: DeleteUserModalProps) {
  const { errorModal, showError, hideError } = useErrorModal()
  const deleteUserMutation = useDeleteUser()

  const handleDelete = async () => {
    if (!user) return

    try {
      await deleteUserMutation.mutateAsync(user.id)
      onClose()
    } catch (error: any) {
      showError('Delete Failed', error.message)
    }
  }

  if (!isOpen || !user) return null

  const isLoading = deleteUserMutation.isPending

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <WarningIcon className="h-5 w-5 text-warning" />
            Delete User
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div className="alert alert-warning">
            <WarningIcon className="stroke-current shrink-0 h-6 w-6" />
            <span>
              This action cannot be undone. This will permanently delete the user account.
            </span>
          </div>

          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2">User to be deleted:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user.firstName || user.lastName 
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
                : 'Not provided'}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Status:</strong> {user.status}</p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Please type <strong className="text-error">DELETE</strong> to confirm this action.
          </p>
        </div>

        <div className="modal-action">
          <button
            className="btn"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <LoadingSpinner className="loading loading-spinner loading-sm" />}
            Delete User
          </button>
        </div>

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
