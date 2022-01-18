import { useRef, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/base16/atelier-savanna-light.css'

const ConfigBlock = props => {
  const codeRef = useRef(null)

  useEffect(async () => {
    const languageModule = await import(`highlight.js/lib/languages/${props.type}`)

    hljs.registerLanguage(props.type, languageModule.default)
    hljs.highlightElement(codeRef.current)
  }, [props.type])

  return (
    <pre>
      <code ref={codeRef}>{props.configRaw}</code>
    </pre>
  )
}

export default ConfigBlock
