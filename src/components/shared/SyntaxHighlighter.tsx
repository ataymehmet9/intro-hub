import { Prism } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { SyntaxHighlighterProps as ReactSyntaxHighlighterProps } from 'react-syntax-highlighter'

type SyntaxHighlighterProps = ReactSyntaxHighlighterProps

const SyntaxHighlighter = (props: SyntaxHighlighterProps) => {
  const { children, ...rest } = props

  return (
    <Prism style={oneDark} {...rest}>
      {children}
    </Prism>
  )
}

export default SyntaxHighlighter
