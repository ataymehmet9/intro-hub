import '@theme-toggles/react/css/Classic.css'
import { useCallback } from 'react'
import { Classic } from '@theme-toggles/react'
import useDarkMode from '@/utils/hooks/useDarkMode'
import { Tooltip } from '@/components/ui'

const ModeSwitcher = () => {
  const [isDark, setMode] = useDarkMode()

  const onToggle = useCallback(() => {
    setMode(isDark ? 'light' : 'dark')
  }, [isDark, setMode])

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <div className="text-2xl flex align-center">
        <Classic
          toggled={!isDark}
          onToggle={onToggle}
          placeholder=""
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
      </div>
    </Tooltip>
  )
}

export default ModeSwitcher
