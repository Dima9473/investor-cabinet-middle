import { Context } from 'koa'
import HttpStatus from 'http-status'

import { GIGACHAT_ENABLED } from '../lib/constants/gigachat'
import { OperationsRequest } from '../types/banks/operationsRequest'
import { PortfolioSnapshot } from '../types/banks/tBank/portfolioSnapshot'
import { Operation } from '../types/banks/tBank/operation'
import { mapGigaChatErrorToHttp } from '../utils/errors/mapGigaChatError'
import { BanksService } from '../utils/services/banks/banksService'
import {
    buildPortfolioMetricsFromSnapshot,
} from '../utils/services/llm/buildPortfolioMetrics'
import { analyzePortfolioWithGigaChat } from '../utils/services/llm/portfolioAnalysisService'

/**
 * LLM-анализ портфеля.
 * Цепочка: GetPortfolio + операции (T-Bank) → агрегация → GigaChat (только метрики).
 */
export const analyzePortfolio = async (ctx: Context) => {
    if (!GIGACHAT_ENABLED) {
        ctx.throw(503, 'LLM-анализ отключён (GIGACHAT_ENABLED=false)')
    }

    try {
        const request = ctx.request.body as OperationsRequest
        const bank: BanksService = ctx.bank

        const [portfolioRaw, operationsInfo] = await Promise.all([
            bank.getPortfolio({ accountId: request.accountId }),
            bank.getOperationsByAccountId(request),
        ])

        const portfolio = portfolioRaw as PortfolioSnapshot

        const operations = (operationsInfo?.operations ?? []) as Operation[]
        const metrics = buildPortfolioMetricsFromSnapshot(
            portfolio,
            operations.length > 0 ? operations : undefined,
            request,
        )
        const analysis = await analyzePortfolioWithGigaChat(metrics)

        ctx.body = {
            bankName: bank.getBankName(),
            period: metrics.period,
            metrics,
            analysis,
            portfolioSnapshotUsed: true,
        }
        ctx.response.status = HttpStatus.OK
    } catch (error: unknown) {
        const err = error as { status?: number; message?: string }

        if (err.status) {
            ctx.throw(err.status, err.message ?? 'Internal server error')
        }

        const mapped = mapGigaChatErrorToHttp(error)
        ctx.throw(mapped.status, mapped.message)
    }
}
