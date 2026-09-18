import { z } from "zod";

const int64Schema = z.union([
    z.string().regex(/^-?\d+$/),
    z.number().int().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER),
]).transform(String);

export const quotationSchema = z.object({
    nano: z.number().int().min(-999_999_999).max(999_999_999).optional(),
    units: int64Schema.optional(),
}).passthrough();

export const moneyValueSchema = quotationSchema.extend({
    currency: z.string().optional(),
}).passthrough();

const accountSchema = z.object({
    accessLevel: z.string().optional(),
    closedDate: z.string().optional(),
    id: z.string().optional(),
    name: z.string().optional(),
    openedDate: z.string().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
}).passthrough();

export const accountsResponseSchema = z.object({
    accounts: z.array(accountSchema),
}).passthrough();

export const portfolioPositionSchema = z.object({
    averagePositionPrice: moneyValueSchema.optional(),
    averagePositionPriceFifo: moneyValueSchema.optional(),
    blocked: z.boolean().optional(),
    classCode: z.string().optional(),
    currentPrice: moneyValueSchema.optional(),
    dailyYield: moneyValueSchema.optional(),
    expectedYield: quotationSchema.optional(),
    figi: z.string().optional(),
    instrumentType: z.string().optional(),
    instrumentUid: z.string().optional(),
    positionUid: z.string().optional(),
    quantity: quotationSchema.optional(),
    ticker: z.string().optional(),
}).passthrough();

export const portfolioResponseSchema = z.object({
    accountId: z.string().min(1),
    expectedYield: quotationSchema.optional(),
    positions: z.array(portfolioPositionSchema),
    totalAmountBonds: moneyValueSchema.optional(),
    totalAmountCurrencies: moneyValueSchema.optional(),
    totalAmountDfa: moneyValueSchema.optional(),
    totalAmountEtf: moneyValueSchema.optional(),
    totalAmountFutures: moneyValueSchema.optional(),
    totalAmountOptions: moneyValueSchema.optional(),
    totalAmountPortfolio: moneyValueSchema,
    totalAmountShares: moneyValueSchema.optional(),
    totalAmountSp: moneyValueSchema.optional(),
}).passthrough();

export const withdrawLimitsResponseSchema = z.object({
    blocked: z.array(moneyValueSchema).optional(),
    blockedGuarantee: z.array(moneyValueSchema).optional(),
    money: z.array(moneyValueSchema).optional(),
}).passthrough();

export const operationItemSchema = z.object({
    assetUid: z.string().optional(),
    cancelDateTime: z.string().optional(),
    description: z.string().optional(),
    figi: z.string().optional(),
    id: z.string().optional(),
    instrumentType: z.string().optional(),
    instrumentUid: z.string().optional(),
    name: z.string().optional(),
    payment: moneyValueSchema.optional(),
    price: moneyValueSchema.optional(),
    quantity: int64Schema.optional(),
    state: z.string().optional(),
    ticker: z.string().optional(),
    type: z.string().optional(),
    date: z.string().optional(),
}).passthrough();

export const operationsByCursorResponseSchema = z.object({
    hasNext: z.boolean().optional(),
    items: z.array(operationItemSchema),
    nextCursor: z.string().optional(),
}).passthrough();

const historicCandleSchema = z.object({
    close: quotationSchema.optional(),
    high: quotationSchema.optional(),
    isComplete: z.boolean().optional(),
    low: quotationSchema.optional(),
    open: quotationSchema.optional(),
    time: z.string().optional(),
    volume: int64Schema.optional(),
}).passthrough();

export const candlesResponseSchema = z.object({
    candles: z.array(historicCandleSchema),
    priceCurrency: z.string().optional(),
}).passthrough();

const lastPriceSchema = z.object({
    figi: z.string().optional(),
    instrumentUid: z.string().optional(),
    price: quotationSchema.optional(),
    ticker: z.string().optional(),
    time: z.string().optional(),
}).passthrough();

export const lastPricesResponseSchema = z.object({
    lastPrices: z.array(lastPriceSchema),
}).passthrough();

const instrumentSchema = z.object({
    currency: z.string().optional(),
    figi: z.string().optional(),
    instrumentType: z.string().optional(),
    name: z.string().optional(),
    ticker: z.string().optional(),
    uid: z.string().optional(),
}).passthrough();

export const instrumentResponseSchema = z.object({
    instrument: instrumentSchema,
}).passthrough();

export type RawAccount = z.infer<typeof accountSchema>;
export type RawCandle = z.infer<typeof historicCandleSchema>;
export type RawLastPrice = z.infer<typeof lastPriceSchema>;
export type RawMoney = z.infer<typeof moneyValueSchema>;
export type RawOperation = z.infer<typeof operationItemSchema>;
export type RawPortfolio = z.infer<typeof portfolioResponseSchema>;
export type RawPortfolioPosition = z.infer<typeof portfolioPositionSchema>;
export type RawQuotation = z.infer<typeof quotationSchema>;
