import { uploadFile } from '@better-upload/client'
import { useMutation } from '@tanstack/react-query'
import { BETTER_UPLOAD_PROFILE_PIC_NAME } from '@/constants/app.constant'

type UseFileUploadProps = {
  onError?: () => void
}

export const useFileUpload = (props: UseFileUploadProps = {}) => {
  const { onError } = props
  const { mutate: upload, isPending } = useMutation({
    mutationFn: async (file: File) =>
      uploadFile({
        file,
        route: BETTER_UPLOAD_PROFILE_PIC_NAME,
      }),
    onError: (error, variables, onMutateResult) => {
      onError?.()
    },
  })

  return { upload, isPending }
}
