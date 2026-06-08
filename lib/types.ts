export interface SerpResult {
  position: number
  title: string
  url: string
  snippet: string
  domain: string
}

export interface PageContent {
  url: string
  title: string
  headings: string[]
  bodyText: string
  wordCount: number
  error?: string
}

export interface ContentAnalysis {
  url: string
  title: string
  contentType: string
  intent: string
  structure: string[]
  keyTopics: string[]
  faqQuestions: string[]
}

export interface SerpAnalysis {
  keyword: string
  dominantIntent: string
  recommendedContentType: string
  commonPatterns: string[]
  missingIntents: string[]
  contentTypeDistribution: Record<string, number>
  structureInsights: string[]
  faqClusters: string[]
  competitors: ContentAnalysis[]
}

export interface ContentBrief {
  keyword: string
  recommendedContentType: string
  targetIntent: string
  suggestedTitle: string
  outline: OutlineItem[]
  faqSection: string[]
  differentiationOpportunities: string[]
  estimatedWordCount: string
}

export interface OutlineItem {
  heading: string
  level: number
  description: string
}

export interface AnalysisResult {
  serpAnalysis: SerpAnalysis
  contentBrief: ContentBrief
}
