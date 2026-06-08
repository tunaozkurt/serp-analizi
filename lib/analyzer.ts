import Anthropic from '@anthropic-ai/sdk'
import { PageContent, SerpResult, SerpAnalysis, ContentBrief } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const analysisSchema = {
  name: 'serp_analysis',
  description: 'SERP analizi ve içerik brief çıktısı',
  input_schema: {
    type: 'object' as const,
    properties: {
      serpAnalysis: {
        type: 'object',
        properties: {
          keyword: { type: 'string' },
          dominantIntent: { type: 'string' },
          recommendedContentType: { type: 'string' },
          commonPatterns: { type: 'array', items: { type: 'string' } },
          missingIntents: { type: 'array', items: { type: 'string' } },
          contentTypeDistribution: { type: 'object', additionalProperties: { type: 'number' } },
          structureInsights: { type: 'array', items: { type: 'string' } },
          faqClusters: { type: 'array', items: { type: 'string' } },
          competitors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                title: { type: 'string' },
                contentType: { type: 'string' },
                intent: { type: 'string' },
                structure: { type: 'array', items: { type: 'string' } },
                keyTopics: { type: 'array', items: { type: 'string' } },
                faqQuestions: { type: 'array', items: { type: 'string' } },
              },
              required: ['url', 'title', 'contentType', 'intent', 'structure', 'keyTopics', 'faqQuestions'],
            },
          },
        },
        required: ['keyword', 'dominantIntent', 'recommendedContentType', 'commonPatterns', 'missingIntents', 'contentTypeDistribution', 'structureInsights', 'faqClusters', 'competitors'],
      },
      contentBrief: {
        type: 'object',
        properties: {
          keyword: { type: 'string' },
          recommendedContentType: { type: 'string' },
          targetIntent: { type: 'string' },
          suggestedTitle: { type: 'string' },
          outline: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                heading: { type: 'string' },
                level: { type: 'number' },
                description: { type: 'string' },
              },
              required: ['heading', 'level', 'description'],
            },
          },
          faqSection: { type: 'array', items: { type: 'string' } },
          differentiationOpportunities: { type: 'array', items: { type: 'string' } },
          estimatedWordCount: { type: 'string' },
        },
        required: ['keyword', 'recommendedContentType', 'targetIntent', 'suggestedTitle', 'outline', 'faqSection', 'differentiationOpportunities', 'estimatedWordCount'],
      },
    },
    required: ['serpAnalysis', 'contentBrief'],
  },
}

export async function analyzeSerp(
  keyword: string,
  serpResults: SerpResult[],
  pages: PageContent[]
): Promise<{ serpAnalysis: SerpAnalysis; contentBrief: ContentBrief }> {
  const pagesData = pages.map((p, i) => ({
    position: i + 1,
    url: p.url,
    title: p.title,
    headings: p.headings.slice(0, 10),
    bodyPreview: p.bodyText.slice(0, 600),
    wordCount: p.wordCount,
    snippet: serpResults[i]?.snippet ?? '',
  }))

  const prompt = `Sen bir SERP mühendisisin. "${keyword}" anahtar kelimesi için Google'ın ilk 10 sonucunu analiz et.

SERP VERİLERİ:
${JSON.stringify(pagesData, null, 2)}

Analiz et:
- Baskın search intent nedir?
- Hangi içerik tipi ağırlıklı ve ne önerilmeli?
- Rakiplerin ortak yapısal desenleri neler?
- SERP'te karşılanmayan intentler / içerik açıkları neler?
- FAQ kümeleri neler?
- Her rakip için içerik tipi, intent ve yapı analizi yap.
- Bu keyword için en iyi içerik brief'ini oluştur (outline dahil).`

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 16000,
    tools: [analysisSchema],
    tool_choice: { type: 'any' },
    messages: [{ role: 'user', content: prompt }],
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude analiz sonucu döndürmedi')
  }

  return toolUse.input as { serpAnalysis: SerpAnalysis; contentBrief: ContentBrief }
}
