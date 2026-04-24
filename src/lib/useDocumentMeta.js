import { useEffect } from 'react'

/**
 * useDocumentMeta
 * Imperative, dependency-free hook that updates <title> and a curated set of
 * <meta> tags for the current route. Restores the previous values on unmount
 * so navigation between pages with different metadata Just Works.
 *
 * Note on Open Graph + SPA reality:
 * Most link unfurlers (iMessage, Slack, Facebook) do NOT execute JavaScript
 * before reading <meta> tags, so per-route OG values set here will only be
 * picked up by crawlers that *do* run JS (Twitter does for some cards,
 * Discord does, Telegram does). For the unfurlers that don't, they'll fall
 * back to the values baked into `index.html`. To get true per-user OG
 * previews everywhere we'd need server-rendering (a Vercel/Netlify edge
 * function or full SSR) — flagged in replit.md as a future upgrade.
 *
 * @param {Object} meta
 * @param {string} [meta.title]
 * @param {string} [meta.description]
 * @param {string} [meta.image]    absolute URL preferred
 * @param {string} [meta.url]      canonical URL of this page
 * @param {string} [meta.type]     og:type (default: 'website')
 * @param {string} [meta.themeColor]
 */
export const useDocumentMeta = ({
  title,
  description,
  image,
  url,
  type = 'website',
  themeColor,
} = {}) => {
  useEffect(() => {
    const prev = {
      title: document.title,
      tags: {},
    }

    const setMeta = (selector, attr, value) => {
      if (value == null) return
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [type, name] = selector.replace(/[\[\]"]/g, '').split('=')
        el.setAttribute(type, name)
        document.head.appendChild(el)
      }
      prev.tags[selector] = el.getAttribute(attr)
      el.setAttribute(attr, value)
    }

    if (title) {
      document.title = title
    }
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[name="theme-color"]', 'content', themeColor)

    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:image"]', 'content', image)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[property="og:type"]', 'content', type)

    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:image"]', 'content', image)

    return () => {
      if (prev.title) document.title = prev.title
      for (const [selector, value] of Object.entries(prev.tags)) {
        const el = document.head.querySelector(selector)
        if (!el) continue
        if (value == null) el.removeAttribute('content')
        else el.setAttribute('content', value)
      }
    }
  }, [title, description, image, url, type, themeColor])
}

export default useDocumentMeta
