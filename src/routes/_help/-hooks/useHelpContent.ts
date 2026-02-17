import { useState } from 'react'

import type { ArticleContent } from '../-types/Content'

export function useHelpContent() {
  const [content, setContent] = useState<ArticleContent | null>(null)

  return {
    content,
    setContent,
  }
}
