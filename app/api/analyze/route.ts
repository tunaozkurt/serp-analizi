import { NextRequest, NextResponse } from 'next/server'
import { fetchSerpResults } from '@/lib/serp'
import { scrapePages } from '@/lib/scraper'
import { analyzeSerp } from '@/lib/analyzer'

export const maxDuration = 120

export async function POST(req: NextRequest) {
  try {
    const { keyword, location, language } = await req.json()

    if (!keyword?.trim()) {
      return NextResponse.json({ error: 'Anahtar kelime gerekli' }, { status: 400 })
    }

    const serpResults = await fetchSerpResults(keyword, location ?? 'Turkey', language ?? 'tr')

    if (serpResults.length === 0) {
      return NextResponse.json({ error: 'SERP sonucu bulunamadı' }, { status: 404 })
    }

    const urls = serpResults.map(r => r.url)
    const pages = await scrapePages(urls)
    const result = await analyzeSerp(keyword, serpResults, pages)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[analyze] ERROR:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
