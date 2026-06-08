import { SerpResult } from './types'

export async function fetchSerpResults(keyword: string, location = 'Turkey', language = 'tr'): Promise<SerpResult[]> {
  const params = new URLSearchParams({
    q: keyword,
    location,
    hl: language,
    gl: 'tr',
    num: '10',
    api_key: process.env.SERPAPI_KEY!,
  })

  const res = await fetch(`https://serpapi.com/search.json?${params}`)
  if (!res.ok) throw new Error(`SerpAPI error: ${res.status}`)

  const data = await res.json()
  const organicResults = data.organic_results ?? []

  return organicResults.slice(0, 10).map((r: any, i: number) => ({
    position: i + 1,
    title: r.title ?? '',
    url: r.link ?? '',
    snippet: r.snippet ?? '',
    domain: new URL(r.link ?? 'https://unknown.com').hostname,
  }))
}
