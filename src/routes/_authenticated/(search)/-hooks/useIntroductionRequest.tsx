import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpcClient } from '@/integrations/tanstack-query/root-provider'
import { Notification, toast } from '@/components/ui'

interface CreateIntroductionRequestInput {
  targetContactId: number
  message: string
}

interface UseIntroductionRequestOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useIntroductionRequest(
  options: UseIntroductionRequestOptions = {},
) {
  const { onSuccess, onError } = options
  const queryClient = useQueryClient()

  // Create introduction request mutation
  const createRequestMutation = useMutation({
    mutationFn: (data: CreateIntroductionRequestInput) =>
      trpcClient.introductionRequests.create.mutate(data),
    onSuccess: () => {
      toast.push(
        <Notification type="success" title="Request sent">
          Your introduction request has been sent successfully
        </Notification>,
      )
      // Invalidate search queries to update hasPendingRequest status
      queryClient.invalidateQueries({ queryKey: ['search'] })
      onSuccess?.()
    },
    onError: (error: Error) => {
      toast.push(
        <Notification type="danger" title="Error">
          {error.message || 'Failed to send introduction request'}
        </Notification>,
      )
      onError?.(error)
    },
  })

  return {
    createRequest: createRequestMutation.mutateAsync,
    isCreating: createRequestMutation.isPending,
  }
}

// Made with Bob
