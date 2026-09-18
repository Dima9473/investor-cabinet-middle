import { z } from 'zod'

/** Структурированный ответ GigaChat — валидируется после парсинга JSON */
export const portfolioAnalysisResponseSchema = z.object({
    summary: z.string(),
    risks: z.array(z.string()),
    diversification: z.string(),
    observations: z.array(z.string()),
    disclaimer: z.string(),
})
