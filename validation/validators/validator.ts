// models/validator.ts

import { accountSchema } from '../../zodSchemas/account';
import { portfolioAnalysisApiResponseSchema } from '../../zodSchemas/analysis/portfolioAnalysisApiResponse';
import { portfolioAnalysisRequestSchema } from '../../zodSchemas/analysis/portfolioAnalysisRequest';
import { chatRequestSchema } from '../../zodSchemas/chat/chatRequest';
import { chatResponseSchema } from '../../zodSchemas/chat/chatResponse';
import { candlesRequestSchema } from '../../zodSchemas/market/candlesRequest';
import { candlesResponseSchema } from '../../zodSchemas/market/candlesResponse';
import { lastPricesRequestSchema } from '../../zodSchemas/market/lastPricesRequest';
import { lastPricesResponseSchema } from '../../zodSchemas/market/lastPricesResponse';
import { marketStreamRequestSchema } from '../../zodSchemas/market/marketStreamRequest';
import { orderBookRequestSchema } from '../../zodSchemas/market/orderBookRequest';
import { orderBookResponseSchema } from '../../zodSchemas/market/orderBookResponse';
import { operationSchema } from '../../zodSchemas/operations/operation';
import { operationsRequestSchema } from '../../zodSchemas/operations/operationsRequest';
import { portfolioRequestSchema } from '../../zodSchemas/portfolio/portfolioRequest';
import { portfolioResponseSchema } from '../../zodSchemas/portfolio/portfolioResponse';
import { positionsResponseSchema } from '../../zodSchemas/portfolio/positionsResponse';

import { validate, validateRequest } from '../validate';

export const validateAccount = validate(accountSchema);

export const validateOperation = validate(operationSchema);

/** Входной payload для POST /operations — до вызова банка */
export const validateOperationsRequest = validateRequest(operationsRequestSchema);

/** Входной payload для POST /analysis/portfolio */
export const validatePortfolioAnalysisRequest = validateRequest(portfolioAnalysisRequestSchema);

/** Ответ LLM-анализа портфеля */
export const validatePortfolioAnalysis = validate(portfolioAnalysisApiResponseSchema);

/** Тело POST /chat */
export const validateChatRequest = validateRequest(chatRequestSchema);

/** Ответ POST /chat */
export const validateChatResponse = validate(chatResponseSchema);

/** Портфель T-Invest */
export const validatePortfolioRequest = validateRequest(portfolioRequestSchema);
export const validatePortfolioResponse = validate(portfolioResponseSchema);
export const validatePositionsResponse = validate(positionsResponseSchema);

/** Котировки T-Invest (unary) */
export const validateLastPricesRequest = validateRequest(lastPricesRequestSchema);
export const validateLastPricesResponse = validate(lastPricesResponseSchema);
export const validateCandlesRequest = validateRequest(candlesRequestSchema);
export const validateCandlesResponse = validate(candlesResponseSchema);
export const validateOrderBookRequest = validateRequest(orderBookRequestSchema);
export const validateOrderBookResponse = validate(orderBookResponseSchema);

/** Стрим котировок */
export const validateMarketStreamRequest = validateRequest(marketStreamRequestSchema);
