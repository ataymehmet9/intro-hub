import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'
import { UpdateUser } from '@/schemas'
import { Notification, toast } from '@/components/ui'
import { authClient } from '@/lib/auth-client'

type UseUserOptions = {
  onUpdateSuccess?: () => void
}

export function useUser(options: UseUserOptions = {}) {
  const { onUpdateSuccess } = options

  const queryClient = useQueryClient()

  const updateUserMutation = useMutation({
    mutationFn: (data: UpdateUser) => trpcClient.users.update.mutate(data),
    onError: (error: Error) => {
      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to update profile'}
        </Notification>,
      )
    },
    onSuccess: async (response) => {
      // Update the better-auth session cache with the new user data
      // This ensures the UserProfileDropdown and other components using useSession get the updated data
      queryClient.setQueryData(['better-auth.session'], (oldData: any) => {
        if (oldData?.data?.user) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              user: {
                ...oldData.data.user,
                ...response.data,
              },
            },
          }
        }
        return oldData
      })

      toast.push(
        <Notification type="success" title="Profile updated">
          Profile has been successfully updated
        </Notification>,
      )

      onUpdateSuccess?.()
    },
  })

  return {
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
  }
}
