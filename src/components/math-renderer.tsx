import { renderToString } from 'katex'
import 'katex/dist/katex.min.css'

interface MathRendererProps {
  expression: string
  displayMode?: boolean
}

export function MathRenderer({ expression, displayMode = false }: MathRendererProps) {
  const html = renderToString(expression, {
    displayMode,
    throwOnError: false
  })

  return <span dangerouslySetInnerHTML={{ __html: html }} />
}