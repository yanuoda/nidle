import { useRef, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/base16/atelier-savanna-light.css'

const ConfigBlock = props => {
  const codeRef = useRef(null)

  useEffect(async () => {
    const languageModule = await import('highlight.js/lib/languages/javascript')
    hljs.registerLanguage('javascript', languageModule.default)
    hljs.highlightElement(codeRef.current)
  }, [props.configRaw])

  return (
    <pre>
      <code ref={codeRef}>{props.configRaw}</code>
    </pre>
  )
}

export default ConfigBlock
