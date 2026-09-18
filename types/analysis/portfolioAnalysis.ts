import { z } from 'zod'

import { portfolioAnalysisResponseSchema } from '../../zodSchemas/analysis/portfolioAnalysisResponse'

/** Ответ LLM-анализа портфеля */
export type PortfolioAnalysis = z.infer<typeof portfolioAnalysisResponseSchema>
