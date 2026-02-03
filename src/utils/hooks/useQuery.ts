import { useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'

export default function useQuery(): URLSearchParams {
    const { search } = useLocation()
    return useMemo(() => new URLSearchParams(search), [search])
}
