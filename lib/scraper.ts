import { parse } from 'node-html-parser'
import { PageContent } from './types'

export async function scrapePages(urls: string[]): Promise<PageContent[]> {
  return Promise.all(urls.map(scrapeOne))
}

async function scrapeOne(url: string): Promise<PageContent> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()
    const root = parse(html)

    root.querySelectorAll('script, style, nav, footer, header').forEach(el => el.remove())

    const title = root.querySelector('title')?.text?.trim() ?? ''

    const headings = root.querySelectorAll('h1, h2, h3')
      .map(h => `${h.tagName}: ${h.text?.trim()}`)
      .filter(h => h.length > 5)
      .slice(0, 30)

    const bodyEl = root.querySelector('main') ?? root.querySelector('article') ?? root.querySelector('body')
    const bodyText = bodyEl?.text?.replace(/\s+/g, ' ')?.trim()?.slice(0, 3000) ?? ''

    return { url, title, headings, bodyText, wordCount: bodyText.split(' ').length }
  } catch (err) {
    return {
      url,
      title: '',
      headings: [],
      bodyText: '',
      wordCount: 0,
      error: err instanceof Error ? err.message : 'Scraping failed',
    }
  }
}
