import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'
import { UpdateUser } from '@/schemas'
import { Notification, toast } from '@/components/ui'

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
    onSuccess: () => {
      toast.push(
        <Notification type="success" title="Profile updated">
          Profile has been successfully updated
        </Notification>,
      )
      onUpdateSuccess?.()
    },
    onSettled: () => {
      // Invalidate auth queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  return {
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
  }
}
