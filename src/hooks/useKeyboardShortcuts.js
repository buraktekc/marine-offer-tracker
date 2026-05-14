import { useEffect } from 'react'

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    function isEditableTarget(target) {
      if (!target) return false
      const tag = target.tagName?.toLowerCase()
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target.isContentEditable
      )
    }

    function matchCombo(event, combo) {
      const parts = combo.toLowerCase().split('+')
      const key = parts[parts.length - 1]
      const wantsMod = parts.includes('mod')
      const wantsShift = parts.includes('shift')
      const wantsAlt = parts.includes('alt')

      const hasMod = event.metaKey || event.ctrlKey

      if (wantsMod !== hasMod) return false
      if (wantsShift !== event.shiftKey) return false
      if (wantsAlt !== event.altKey) return false

      const pressedKey = event.key.toLowerCase()
      if (key === 'enter') return pressedKey === 'enter'
      if (key === 'esc') return pressedKey === 'escape'
      if (key === '?') return event.key === '?' && event.shiftKey
      return pressedKey === key
    }

    function handler(event) {
      for (const sc of shortcuts) {
        if (!matchCombo(event, sc.combo)) continue

        const hasModifier =
          sc.combo.includes('mod') ||
          sc.combo.includes('shift') ||
          sc.combo.includes('alt')

        if (!hasModifier && isEditableTarget(event.target)) continue

        event.preventDefault()
        sc.handler(event)
        return
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}
