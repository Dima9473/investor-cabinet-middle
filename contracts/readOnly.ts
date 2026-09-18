export type Money = {
    currency: string;
    nano: number;
    units: string;
};

export type ApiMeta = {
    generatedAt: string;
    source: "demo" | "t-bank";
};

export type ApiResponse<T> = {
    data: T;
    meta: ApiMeta;
};

export type Account = {
    closedAt?: string;
    id: string;
    name: string;
    openedAt?: string;
    providerStatus?: string;
    providerType?: string;
    status: "closed" | "open" | "unknown";
    type: "broker" | "iis" | "invest-box" | "unknown";
};

export type AccountsData = {
    accounts: Account[];
};

export type InstrumentKind = "bond" | "currency" | "etf" | "future" | "other" | "share";

export type PortfolioPosition = {
    averagePrice?: Money;
    currentPrice: Money;
    expectedYield: Money;
    expectedYieldPercent: number;
    figi?: string;
    instrumentType: InstrumentKind;
    instrumentUid: string;
    name: string;
    providerInstrumentType?: string;
    quantity: string;
    ticker: string;
    value: Money;
};

export type AllocationItem = {
    kind: InstrumentKind;
    percent: number;
    value: Money;
};

export type PortfolioData = {
    accountId: string;
    allocation: AllocationItem[];
    asOf: string;
    availableCash: Money[];
    baseCurrency: string;
    blockedCash: Money[];
    expectedYield: Money;
    expectedYieldPercent: number;
    positions: PortfolioPosition[];
    totalValue: Money;
};

export type OperationType = "buy" | "coupon" | "deposit" | "dividend" | "fee" | "other" | "sell" | "tax" | "withdraw";
export type OperationStatus = "cancelled" | "done" | "pending" | "unknown";

export type Operation = {
    description: string;
    figi?: string;
    id: string;
    instrumentName?: string;
    instrumentUid?: string;
    occurredAt: string;
    payment: Money;
    price?: Money;
    providerState?: string;
    providerType?: string;
    quantity?: string;
    status: OperationStatus;
    ticker?: string;
    type: OperationType;
};

export type OperationsData = {
    accountId: string;
    hasNext: boolean;
    items: Operation[];
    nextCursor: null | string;
};

export type PerformancePoint = {
    absoluteReturn: Money;
    at: string;
    returnPercent: number;
    value: Money;
};

export type IncomePoint = {
    coupons: Money;
    dividends: Money;
    period: string;
};

export type AnalyticsData = {
    accountId: string;
    asOf: string;
    baseCurrency: string;
    contribution: Array<{ amount: Money; kind: InstrumentKind; percent: number }>;
    income: IncomePoint[];
    performance: PerformancePoint[];
    quality: {
        coveragePercent: number;
        estimated: boolean;
        methodology: "current-holdings-backcast" | "unavailable";
        warnings: string[];
    };
    risk: {
        diversificationScore: number | null;
        largestPositionPercent: number | null;
        maxDrawdownPercent: number | null;
        volatilityPercent: number | null;
    };
};

export type LastPriceItem = {
    at: string;
    figi: string;
    instrumentUid?: string;
    price: Money;
    ticker?: string;
};

export type CandleItem = {
    at: string;
    close: Money;
    high: Money;
    isComplete: boolean;
    low: Money;
    open: Money;
    volume: string;
};

export type CandlesData = {
    candles: CandleItem[];
    instrumentId: string;
    interval: "day" | "hour" | "month" | "week";
};
