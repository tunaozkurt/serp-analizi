import { chromium } from 'playwright'
import { PageContent } from './types'

export async function scrapePages(urls: string[]): Promise<PageContent[]> {
  const browser = await chromium.launch({ headless: true })
  const results: PageContent[] = []

  for (const url of urls) {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    })
    const page = await context.newPage()

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 })

      const content = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
          .map(h => `${h.tagName}: ${h.textContent?.trim()}`)
          .filter(h => h.length > 5)
          .slice(0, 30)

        const bodyText = document.body.innerText
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 3000)

        const title = document.title

        return { title, headings, bodyText }
      })

      results.push({
        url,
        title: content.title,
        headings: content.headings,
        bodyText: content.bodyText,
        wordCount: content.bodyText.split(' ').length,
      })
    } catch (err) {
      results.push({
        url,
        title: '',
        headings: [],
        bodyText: '',
        wordCount: 0,
        error: err instanceof Error ? err.message : 'Scraping failed',
      })
    } finally {
      await context.close()
    }
  }

  await browser.close()
  return results
}
