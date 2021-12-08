import { useRef, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/base16/atelier-savanna-light.css'

hljs.registerLanguage('javascript', javascript)

const ConfigBlock = props => {
  const codeRef = useRef(null)

  useEffect(() => {
    hljs.highlightElement(codeRef.current)
  }, [props.configRaw])

  return (
    <pre>
      <code ref={codeRef}>{props.configRaw}</code>
    </pre>
  )
}

export default ConfigBlock
