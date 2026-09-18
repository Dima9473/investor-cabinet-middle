import {
    Account,
    AccountsData,
    AllocationItem,
    AnalyticsData,
    CandleItem,
    CandlesData,
    InstrumentKind,
    LastPriceItem,
    Money,
    Operation,
    OperationsData,
    OperationStatus,
    OperationType,
    PortfolioData,
    PortfolioPosition,
} from "../../../../contracts/readOnly";
import { ApiError } from "../../../../errors/apiError";
import { getTBankConfig } from "../../../../lib/constants/env";
import {
    AnalyticsRequest,
    CandlesRequest,
    OperationsRequest,
    PortfolioRequest,
} from "../../../../zodSchemas/readOnlyRequests";
import { TBankClient, TBankOperationsRequest } from "./client";
import {
    addMoney,
    decimalStringToNano,
    moneyFromNano,
    moneyFromQuotation,
    moneyToNano,
    multiplyMoney,
    normalizeMoney,
    quotationToNano,
    quotationToString,
    ratioPercent,
    zeroMoney,
} from "./money";
import { RawCandle, RawMoney, RawOperation, RawPortfolio, RawPortfolioPosition } from "./schemas";

const operationTypes: Record<OperationType, string[]> = {
    buy: ["OPERATION_TYPE_BUY", "OPERATION_TYPE_BUY_CARD", "OPERATION_TYPE_BUY_MARGIN", "OPERATION_TYPE_DELIVERY_BUY", "OPERATION_TYPE_PRIMARY_ORDER"],
    coupon: ["OPERATION_TYPE_COUPON"],
    deposit: ["OPERATION_TYPE_INPUT", "OPERATION_TYPE_INPUT_SECURITIES", "OPERATION_TYPE_INPUT_SWIFT", "OPERATION_TYPE_INPUT_ACQUIRING", "OPERATION_TYPE_INP_MULTI"],
    dividend: ["OPERATION_TYPE_DIVIDEND", "OPERATION_TYPE_DIVIDEND_TRANSFER", "OPERATION_TYPE_DIV_EXT"],
    fee: ["OPERATION_TYPE_SERVICE_FEE", "OPERATION_TYPE_MARGIN_FEE", "OPERATION_TYPE_BROKER_FEE", "OPERATION_TYPE_SUCCESS_FEE", "OPERATION_TYPE_TRACK_MFEE", "OPERATION_TYPE_TRACK_PFEE", "OPERATION_TYPE_CASH_FEE", "OPERATION_TYPE_OUT_FEE", "OPERATION_TYPE_OUT_STAMP_DUTY", "OPERATION_TYPE_OUTPUT_PENALTY", "OPERATION_TYPE_ADVICE_FEE", "OPERATION_TYPE_OTHER_FEE"],
    other: [],
    sell: ["OPERATION_TYPE_SELL", "OPERATION_TYPE_SELL_CARD", "OPERATION_TYPE_SELL_MARGIN", "OPERATION_TYPE_DELIVERY_SELL"],
    tax: ["OPERATION_TYPE_TAX", "OPERATION_TYPE_BOND_TAX", "OPERATION_TYPE_DIVIDEND_TAX", "OPERATION_TYPE_TAX_CORRECTION", "OPERATION_TYPE_BENEFIT_TAX", "OPERATION_TYPE_TAX_PROGRESSIVE", "OPERATION_TYPE_BOND_TAX_PROGRESSIVE", "OPERATION_TYPE_DIVIDEND_TAX_PROGRESSIVE", "OPERATION_TYPE_BENEFIT_TAX_PROGRESSIVE", "OPERATION_TYPE_TAX_CORRECTION_PROGRESSIVE", "OPERATION_TYPE_TAX_REPO_PROGRESSIVE", "OPERATION_TYPE_TAX_REPO", "OPERATION_TYPE_TAX_REPO_HOLD", "OPERATION_TYPE_TAX_REPO_REFUND", "OPERATION_TYPE_TAX_REPO_HOLD_PROGRESSIVE", "OPERATION_TYPE_TAX_REPO_REFUND_PROGRESSIVE", "OPERATION_TYPE_TAX_CORRECTION_COUPON"],
    withdraw: ["OPERATION_TYPE_OUTPUT", "OPERATION_TYPE_OUTPUT_SECURITIES", "OPERATION_TYPE_OUTPUT_SWIFT", "OPERATION_TYPE_OUTPUT_ACQUIRING", "OPERATION_TYPE_OUT_MULTI"],
};

const candleIntervals = {
    day: "CANDLE_INTERVAL_DAY",
    hour: "CANDLE_INTERVAL_HOUR",
    month: "CANDLE_INTERVAL_MONTH",
    week: "CANDLE_INTERVAL_WEEK",
} as const;

const candleLimits = { day: 2400, hour: 2400, month: 120, week: 300 } as const;

const mapAccountType = (value?: string): Account["type"] => {
    if (value === "ACCOUNT_TYPE_TINKOFF") {
        return "broker";
    }

    if (value === "ACCOUNT_TYPE_TINKOFF_IIS") {
        return "iis";
    }

    if (value === "ACCOUNT_TYPE_INVEST_BOX") {
        return "invest-box";
    }

    return "unknown";
};

const mapAccountStatus = (value?: string): Account["status"] => {
    if (value === "ACCOUNT_STATUS_OPEN") {
        return "open";
    }

    if (value === "ACCOUNT_STATUS_CLOSED") {
        return "closed";
    }

    return "unknown";
};

const mapInstrumentKind = (value?: string): InstrumentKind => {
    const normalized = value?.toLowerCase();

    if (normalized === "share" || normalized === "shares") {
        return "share";
    }

    if (normalized === "bond" || normalized === "bonds") {
        return "bond";
    }

    if (normalized === "etf") {
        return "etf";
    }

    if (normalized === "currency" || normalized === "currencies") {
        return "currency";
    }

    if (normalized === "future" || normalized === "futures") {
        return "future";
    }

    return "other";
};

const mapOperationType = (value?: string): OperationType => {
    for (const [type, providerTypes] of Object.entries(operationTypes)) {
        if (providerTypes.includes(value ?? "")) {
            return type as OperationType;
        }
    }

    return "other";
};

const mapOperationStatus = (value?: string): OperationStatus => {
    if (value === "OPERATION_STATE_EXECUTED") {
        return "done";
    }

    if (value === "OPERATION_STATE_CANCELED") {
        return "cancelled";
    }

    if (value === "OPERATION_STATE_PROGRESS") {
        return "pending";
    }

    return "unknown";
};

const getOperationTypes = (types?: OperationType[]): string[] | undefined => {
    if (!types || types.includes("other")) {
        return undefined;
    }

    return [...new Set(types.flatMap((type) => operationTypes[type]))];
};

const mapOperation = (operation: RawOperation): Operation => {
    const currency = operation.payment?.currency || operation.price?.currency || "RUB";

    return {
        description: operation.description || operation.name || "Операция",
        figi: operation.figi || undefined,
        id: operation.id || `${operation.date ?? "unknown"}:${operation.type ?? "unknown"}`,
        instrumentName: operation.name || undefined,
        instrumentUid: operation.instrumentUid || undefined,
        occurredAt: operation.date || new Date(0).toISOString(),
        payment: normalizeMoney(operation.payment, currency),
        price: operation.price ? normalizeMoney(operation.price, currency) : undefined,
        providerState: operation.state,
        providerType: operation.type,
        quantity: operation.quantity,
        status: mapOperationStatus(operation.state),
        ticker: operation.ticker || undefined,
        type: mapOperationType(operation.type),
    };
};

const sumCash = (items: Money[], currency: string): Money => items
    .filter((item) => item.currency === currency)
    .reduce(addMoney, zeroMoney(currency));

const moneyPercent = (amount: Money, total: Money): number => ratioPercent(moneyToNano(amount), moneyToNano(total));

const portfolioYield = (portfolio: RawPortfolio, totalValue: Money): Money => {
    const yieldPercentNano = quotationToNano(portfolio.expectedYield);
    const denominator = (100n * 1_000_000_000n) + yieldPercentNano;

    if (denominator === 0n) {
        return zeroMoney(totalValue.currency);
    }

    return moneyFromNano(totalValue.currency, (moneyToNano(totalValue) * yieldPercentNano) / denominator);
};

const getIncomeMonth = (date: string): string => new Date(date).toISOString().slice(0, 7);

const calculateVolatility = (values: bigint[], annualPeriods: number): number | null => {
    if (values.length < 3) {
        return null;
    }

    const returns = values.slice(1).map((value, index) => ratioPercent(value - values[index], values[index]) / 100);
    const average = returns.reduce((sum, value) => sum + value, 0) / returns.length;
    const variance = returns.reduce((sum, value) => sum + ((value - average) ** 2), 0) / returns.length;

    return Math.sqrt(variance * annualPeriods) * 100;
};

const calculateMaxDrawdown = (values: bigint[]): number | null => {
    if (values.length < 2) {
        return null;
    }

    let peak = values[0];
    let drawdown = 0;

    for (const value of values) {
        if (value > peak) {
            peak = value;
        }

        drawdown = Math.min(drawdown, ratioPercent(value - peak, peak));
    }

    return Math.abs(drawdown);
};

type InstrumentMetadata = {
    currency?: string;
    name?: string;
    ticker?: string;
};

export class TBankReadOnlyService {
    private readonly client: TBankClient;
    private readonly instrumentCache = new Map<string, Promise<InstrumentMetadata | undefined>>();

    constructor(client = new TBankClient(getTBankConfig())) {
        this.client = client;
    }

    private async getInstrument(instrumentUid: string): Promise<InstrumentMetadata | undefined> {
        const cached = this.instrumentCache.get(instrumentUid);

        if (cached) {
            return cached;
        }

        const request = this.client.getInstrument(instrumentUid)
            .then((response) => response.instrument)
            .catch(() => undefined);
        this.instrumentCache.set(instrumentUid, request);

        return request;
    }

    private async getAccount(accountId: string): Promise<Account> {
        const accounts = await this.getAccounts();
        const account = accounts.accounts.find((item) => item.id === accountId);

        if (!account) {
            throw new ApiError({ code: "ACCOUNT_NOT_FOUND", message: "Investment account was not found", status: 404 });
        }

        return account;
    }

    async getAccounts(): Promise<AccountsData> {
        const response = await this.client.getAccounts();
        const accounts = (response.accounts ?? [])
            .filter((account) => Boolean(account.id) && account.accessLevel !== "ACCOUNT_ACCESS_LEVEL_NO_ACCESS")
            .map<Account>((account) => ({
                closedAt: account.closedDate || undefined,
                id: account.id ?? "",
                name: account.name || "Инвестиционный счёт",
                openedAt: account.openedDate || undefined,
                providerStatus: account.status,
                providerType: account.type,
                status: mapAccountStatus(account.status),
                type: mapAccountType(account.type),
            }));

        return { accounts };
    }

    private async mapPosition(position: RawPortfolioPosition): Promise<PortfolioPosition | null> {
        const instrumentUid = position.instrumentUid || position.positionUid || position.figi;

        if (!instrumentUid || !position.currentPrice) {
            return null;
        }

        const metadata = await this.getInstrument(instrumentUid);
        const currentPrice = normalizeMoney(position.currentPrice);
        const value = multiplyMoney(currentPrice, position.quantity);
        const expectedYield = moneyFromQuotation(position.expectedYield, currentPrice.currency);
        const cost = moneyToNano(value) - moneyToNano(expectedYield);

        return {
            averagePrice: position.averagePositionPrice ? normalizeMoney(position.averagePositionPrice, currentPrice.currency) : undefined,
            currentPrice,
            expectedYield,
            expectedYieldPercent: ratioPercent(moneyToNano(expectedYield), cost),
            figi: position.figi || undefined,
            instrumentType: mapInstrumentKind(position.instrumentType),
            instrumentUid,
            name: metadata?.name || position.ticker || position.figi || "Инструмент",
            providerInstrumentType: position.instrumentType,
            quantity: quotationToString(position.quantity),
            ticker: position.ticker || metadata?.ticker || position.figi || "—",
            value,
        };
    }

    private getAllocation(portfolio: RawPortfolio, totalValue: Money): AllocationItem[] {
        const baseCurrency = totalValue.currency;
        const values: Array<[InstrumentKind, RawMoney | undefined]> = [
            ["share", portfolio.totalAmountShares],
            ["bond", portfolio.totalAmountBonds],
            ["etf", portfolio.totalAmountEtf],
            ["currency", portfolio.totalAmountCurrencies],
            ["future", portfolio.totalAmountFutures],
        ];
        const other = [portfolio.totalAmountOptions, portfolio.totalAmountSp, portfolio.totalAmountDfa]
            .filter((item): item is RawMoney => Boolean(item))
            .map((item) => normalizeMoney(item, baseCurrency))
            .reduce(addMoney, zeroMoney(baseCurrency));
        values.push(["other", other]);

        return values
            .map(([kind, rawValue]) => {
                const value = rawValue
                    ? normalizeMoney(rawValue as RawMoney, baseCurrency)
                    : zeroMoney(baseCurrency);

                return { kind, percent: moneyPercent(value, totalValue), value };
            })
            .filter((item) => moneyToNano(item.value) !== 0n);
    }

    async getPortfolio(request: PortfolioRequest): Promise<PortfolioData> {
        const account = await this.getAccount(request.accountId);

        if (account.type === "invest-box") {
            throw new ApiError({
                code: "PORTFOLIO_NOT_SUPPORTED",
                message: "T-Bank does not provide GetPortfolio for invest-box accounts",
                status: 422,
            });
        }

        const [portfolio, withdrawLimits] = await Promise.all([
            this.client.getPortfolio(request.accountId),
            this.client.getWithdrawLimits(request.accountId),
        ]);
        const totalValue = normalizeMoney(portfolio.totalAmountPortfolio, "RUB");
        const positions = (await Promise.all((portfolio.positions ?? []).map((position) => this.mapPosition(position))))
            .filter((position): position is PortfolioPosition => Boolean(position));

        return {
            accountId: request.accountId,
            allocation: this.getAllocation(portfolio, totalValue),
            asOf: new Date().toISOString(),
            availableCash: (withdrawLimits.money ?? []).map((item) => normalizeMoney(item)),
            baseCurrency: totalValue.currency,
            blockedCash: [...(withdrawLimits.blocked ?? []), ...(withdrawLimits.blockedGuarantee ?? [])]
                .map((item) => normalizeMoney(item)),
            expectedYield: portfolioYield(portfolio, totalValue),
            expectedYieldPercent: Number(quotationToString(portfolio.expectedYield)),
            positions,
            totalValue,
        };
    }

    async getOperations(request: OperationsRequest): Promise<OperationsData> {
        await this.getAccount(request.accountId);
        const providerRequest: TBankOperationsRequest = {
            accountId: request.accountId,
            cursor: request.cursor,
            from: request.from,
            limit: request.limit,
            operationTypes: getOperationTypes(request.types),
            to: request.to,
        };
        const response = await this.client.getOperationsByCursor(providerRequest);
        let items = (response.items ?? []).map(mapOperation);

        if (request.types) {
            items = items.filter((item) => request.types?.includes(item.type));
        }

        return {
            accountId: request.accountId,
            hasNext: response.hasNext === true,
            items,
            nextCursor: response.hasNext && response.nextCursor ? response.nextCursor : null,
        };
    }

    private async getAllIncomeOperations(request: AnalyticsRequest): Promise<Operation[]> {
        await this.getAccount(request.accountId);
        const items: Operation[] = [];
        let cursor: string | undefined;

        for (let page = 0; page < 20; page += 1) {
            const response = await this.client.getOperationsByCursor({
                accountId: request.accountId,
                cursor,
                from: request.from,
                limit: 1000,
                operationTypes: [...operationTypes.dividend, ...operationTypes.coupon],
                state: "OPERATION_STATE_EXECUTED",
                to: request.to,
            });
            items.push(...(response.items ?? []).map(mapOperation).filter((item) => item.status === "done"));

            if (response.hasNext !== true || !response.nextCursor) {
                return items;
            }

            cursor = response.nextCursor;
        }

        throw new ApiError({
            code: "ANALYTICS_RANGE_TOO_LARGE",
            message: "The analytics period contains too many income operations; use a narrower range",
            status: 422,
        });
    }

    private getIncome(items: Operation[], currency: string) {
        const periods = new Map<string, { coupons: Money; dividends: Money }>();

        for (const operation of items) {
            if (operation.payment.currency !== currency) {
                continue;
            }

            const period = getIncomeMonth(operation.occurredAt);
            const current = periods.get(period) ?? { coupons: zeroMoney(currency), dividends: zeroMoney(currency) };

            if (operation.type === "coupon") {
                current.coupons = addMoney(current.coupons, operation.payment);
            } else if (operation.type === "dividend") {
                current.dividends = addMoney(current.dividends, operation.payment);
            }

            periods.set(period, current);
        }

        return [...periods.entries()]
            .sort(([left], [right]) => left.localeCompare(right))
            .map(([period, value]) => ({ period, ...value }));
    }

    private async getPerformance(portfolio: PortfolioData, request: AnalyticsRequest) {
        const to = request.to ?? new Date().toISOString();
        const from = request.from ?? new Date(Date.parse(to) - (365 * 24 * 60 * 60 * 1000)).toISOString();
        const eligible = portfolio.positions
            .filter((position) => ["share", "etf", "currency"].includes(position.instrumentType))
            .filter((position) => position.currentPrice.currency === portfolio.baseCurrency)
            .sort((left, right) => moneyToNano(right.value) > moneyToNano(left.value) ? 1 : -1)
            .slice(0, 20);
        const series = await Promise.all(eligible.map(async (position) => {
            try {
                const response = await this.client.getCandles({
                    from,
                    instrumentId: position.instrumentUid,
                    interval: candleIntervals[request.interval],
                    limit: candleLimits[request.interval],
                    to,
                });

                return { candles: response.candles ?? [], position };
            } catch {
                return { candles: [] as RawCandle[], position };
            }
        }));
        const coveredSeries = series
            .filter((item) => item.candles.length > 0)
            .map((item) => ({
                ...item,
                candlesByTime: new Map(item.candles
                    .filter((candle) => Boolean(candle.time))
                    .map((candle) => [candle.time ?? "", candle])),
            }));
        const coveredValueNano = coveredSeries.reduce(
            (sum, item) => sum + moneyToNano(item.position.value),
            0n,
        );
        const cashNano = moneyToNano(sumCash(portfolio.availableCash, portfolio.baseCurrency));
        const coveragePercent = ratioPercent(coveredValueNano + cashNano, moneyToNano(portfolio.totalValue));
        const timestamps = [...new Set(coveredSeries.flatMap((item) => [...item.candlesByTime.keys()]))]
            .sort();
        const latestByInstrument = new Map<string, RawCandle>();
        const values: Array<{ at: string; valueNano: bigint }> = [];

        for (const at of timestamps) {
            for (const item of coveredSeries) {
                const candle = item.candlesByTime.get(at);

                if (candle) {
                    latestByInstrument.set(item.position.instrumentUid, candle);
                }
            }

            let valueNano = cashNano;

            for (const item of coveredSeries) {
                const candle = latestByInstrument.get(item.position.instrumentUid);

                if (candle?.close) {
                    const close = moneyFromQuotation(candle.close, portfolio.baseCurrency);
                    const quantityNano = decimalStringToNano(item.position.quantity);
                    valueNano += (moneyToNano(close) * quantityNano) / 1_000_000_000n;
                }
            }

            values.push({ at, valueNano });
        }

        if (values.length === 0) {
            return {
                coveragePercent,
                performance: [],
                values: [] as bigint[],
            };
        }

        const firstValue = values[0].valueNano;
        const performance = values.map(({ at, valueNano }) => ({
            absoluteReturn: moneyFromNano(portfolio.baseCurrency, valueNano - firstValue),
            at,
            returnPercent: ratioPercent(valueNano - firstValue, firstValue),
            value: moneyFromNano(portfolio.baseCurrency, valueNano),
        }));

        return { coveragePercent, performance, values: values.map((item) => item.valueNano) };
    }

    async getAnalytics(request: AnalyticsRequest): Promise<AnalyticsData> {
        const to = request.to ?? new Date().toISOString();
        const effectiveRequest: AnalyticsRequest = {
            ...request,
            from: request.from ?? new Date(Date.parse(to) - (365 * 24 * 60 * 60 * 1000)).toISOString(),
            to,
        };
        const [portfolio, incomeOperations] = await Promise.all([
            this.getPortfolio({ accountId: request.accountId }),
            this.getAllIncomeOperations(effectiveRequest),
        ]);
        const performance = await this.getPerformance(portfolio, effectiveRequest);
        const contributionMap = new Map<InstrumentKind, Money>();

        for (const position of portfolio.positions) {
            if (position.expectedYield.currency !== portfolio.baseCurrency) {
                continue;
            }

            const current = contributionMap.get(position.instrumentType) ?? zeroMoney(portfolio.baseCurrency);
            contributionMap.set(position.instrumentType, addMoney(current, position.expectedYield));
        }

        const contributionTotal = [...contributionMap.values()]
            .reduce((sum, item) => sum + (moneyToNano(item) < 0n ? -moneyToNano(item) : moneyToNano(item)), 0n);
        const contribution = [...contributionMap.entries()].map(([kind, amount]) => ({
            amount,
            kind,
            percent: ratioPercent(moneyToNano(amount) < 0n ? -moneyToNano(amount) : moneyToNano(amount), contributionTotal),
        }));
        const largestPositionNano = portfolio.positions
            .filter((position) => position.value.currency === portfolio.baseCurrency)
            .reduce((largest, position) => moneyToNano(position.value) > largest ? moneyToNano(position.value) : largest, 0n);
        const concentration = portfolio.allocation.reduce((sum, item) => sum + ((item.percent / 100) ** 2), 0);
        const annualPeriods = request.interval === "day" ? 252 : request.interval === "week" ? 52 : 12;
        const warnings = [
            "Performance is an estimate based on current eligible holdings and historical candles; it is not the historical account value.",
            "Bonds, futures, options, unsupported currencies, and instruments without candles are excluded from performance.",
            "Income totals include only operations denominated in the portfolio base currency.",
        ];

        return {
            accountId: request.accountId,
            asOf: new Date().toISOString(),
            baseCurrency: portfolio.baseCurrency,
            contribution,
            income: this.getIncome(incomeOperations, portfolio.baseCurrency),
            performance: performance.performance,
            quality: {
                coveragePercent: performance.coveragePercent,
                estimated: performance.performance.length > 0,
                methodology: performance.performance.length > 0 ? "current-holdings-backcast" : "unavailable",
                warnings,
            },
            risk: {
                diversificationScore: portfolio.allocation.length > 1 ? (1 - concentration) * 100 : null,
                largestPositionPercent: moneyToNano(portfolio.totalValue) === 0n
                    ? null
                    : ratioPercent(largestPositionNano, moneyToNano(portfolio.totalValue)),
                maxDrawdownPercent: calculateMaxDrawdown(performance.values),
                volatilityPercent: calculateVolatility(performance.values, annualPeriods),
            },
        };
    }

    async getLastPrices(instrumentIds: string[]): Promise<LastPriceItem[]> {
        const response = await this.client.getLastPrices(instrumentIds);

        return Promise.all((response.lastPrices ?? []).filter((item) => item.price && item.time).map(async (item) => {
            const metadata = item.instrumentUid ? await this.getInstrument(item.instrumentUid) : undefined;

            return {
                at: item.time ?? new Date(0).toISOString(),
                figi: item.figi || "",
                instrumentUid: item.instrumentUid || undefined,
                price: moneyFromQuotation(item.price, metadata?.currency || "UNKNOWN"),
                ticker: item.ticker || metadata?.ticker || undefined,
            };
        }));
    }

    async getCandles(request: CandlesRequest): Promise<CandlesData> {
        const [response, metadata] = await Promise.all([
            this.client.getCandles({
                from: request.from,
                instrumentId: request.instrumentId,
                interval: candleIntervals[request.interval],
                limit: candleLimits[request.interval],
                to: request.to,
            }),
            this.getInstrument(request.instrumentId),
        ]);
        const currency = response.priceCurrency || metadata?.currency || "UNKNOWN";
        const candles: CandleItem[] = (response.candles ?? [])
            .filter((item) => item.time && item.open && item.high && item.low && item.close)
            .map((item) => ({
                at: item.time ?? new Date(0).toISOString(),
                close: moneyFromQuotation(item.close, currency),
                high: moneyFromQuotation(item.high, currency),
                isComplete: item.isComplete === true,
                low: moneyFromQuotation(item.low, currency),
                open: moneyFromQuotation(item.open, currency),
                volume: item.volume ?? "0",
            }));

        return { candles, instrumentId: request.instrumentId, interval: request.interval };
    }

    async getLegacyOperations(request: OperationsRequest) {
        await this.getAccount(request.accountId);
        const response = await this.client.getOperationsByCursor({
            accountId: request.accountId,
            cursor: request.cursor,
            from: request.from,
            limit: request.limit,
            operationTypes: getOperationTypes(request.types),
            to: request.to,
        });

        return { accountId: request.accountId, bankName: "t-bank", operations: response.items ?? [] };
    }
}
