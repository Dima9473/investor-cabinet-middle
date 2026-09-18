
import Router from "@koa/router";

import { getAccounts } from "../controllers/accounts";
import { getChatUi, postChat, postChatStream } from "../controllers/chat";
import { getGigaChatHealth } from "../controllers/gigachatHealth";
import { getCandles, getLastPrices, getOrderBook } from "../controllers/marketQuotes";
import { postMarketStream } from "../controllers/marketStream";
import { getPortfolio, getPositions } from "../controllers/portfolio";
import { analyzePortfolio } from "../controllers/portfolioAnalysis";
import { useBank } from "../middlewares/useBank";
import { normalizeJsonBody } from "../middlewares/normalizeJsonBody";
import { getOperations } from "../controllers/operations";
import { Context, Next } from "koa";
import body from 'koa-body'
import {
    validateAccount,
    validateOperation,
    validateOperationsRequest,
    validatePortfolioAnalysis,
    validatePortfolioAnalysisRequest,
    validateChatRequest,
    validateChatResponse,
    validatePortfolioRequest,
    validatePortfolioResponse,
    validatePositionsResponse,
    validateLastPricesRequest,
    validateLastPricesResponse,
    validateCandlesRequest,
    validateCandlesResponse,
    validateOrderBookRequest,
    validateOrderBookResponse,
    validateMarketStreamRequest,
} from "../validation/validators/validator";

export default function apiRoutes(): Router {
    const router = new Router();
    const bodyParser = body()

    router.use((ctx: Context, next: Next) => {
        if (typeof ctx.request.body !== 'undefined'){
            return normalizeJsonBody(ctx, next)
        }

        return bodyParser(ctx, () => normalizeJsonBody(ctx, next))
    })

    // T-Invest: счета, операции, портфель, котировки, LLM-анализ
    router.post('/accounts/:bankName?', useBank, getAccounts, validateAccount);
    router.post('/operations/:bankName?', useBank, validateOperationsRequest, getOperations, validateOperation);
    // positions — до /portfolio/:bankName?, иначе bankName=positions
    router.post(
        '/portfolio/positions/:bankName?',
        useBank,
        validatePortfolioRequest,
        getPositions,
        validatePositionsResponse,
    );
    router.post(
        '/portfolio/:bankName?',
        useBank,
        validatePortfolioRequest,
        getPortfolio,
        validatePortfolioResponse,
    );
    router.post(
        '/quotes/last-prices/:bankName?',
        useBank,
        validateLastPricesRequest,
        getLastPrices,
        validateLastPricesResponse,
    );
    router.post(
        '/quotes/candles/:bankName?',
        useBank,
        validateCandlesRequest,
        getCandles,
        validateCandlesResponse,
    );
    router.post(
        '/quotes/orderbook/:bankName?',
        useBank,
        validateOrderBookRequest,
        getOrderBook,
        validateOrderBookResponse,
    );
    router.post(
        '/quotes/stream/:bankName?',
        useBank,
        validateMarketStreamRequest,
        postMarketStream,
    );
    router.post(
        '/analysis/portfolio/:bankName?',
        useBank,
        validatePortfolioAnalysisRequest,
        analyzePortfolio,
        validatePortfolioAnalysis,
    );

    router.get('/gigachat/health', getGigaChatHealth);
    router.get('/chat/ui', getChatUi);
    router.post('/chat', validateChatRequest, postChat, validateChatResponse);
    router.post('/chat/stream', validateChatRequest, postChatStream);

    return router
}
