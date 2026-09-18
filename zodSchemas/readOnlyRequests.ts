import { z } from "zod";

const dateTimeSchema = z.string().datetime().endsWith("Z", "Timestamp must be in UTC and end with Z");
const accountIdSchema = z.string().trim().min(1).max(128);

export const accountsRequestSchema = z.object({}).strict();

export const portfolioRequestSchema = z.object({
    accountId: accountIdSchema,
}).strict();

export const normalizedOperationTypeSchema = z.enum([
    "buy",
    "sell",
    "dividend",
    "coupon",
    "fee",
    "tax",
    "deposit",
    "withdraw",
    "other",
]);

export const operationsRequestSchema = z.object({
    accountId: accountIdSchema,
    cursor: z.string().trim().min(1).max(4096).optional(),
    from: dateTimeSchema.optional(),
    limit: z.number().int().min(3).max(1000).default(100),
    to: dateTimeSchema.optional(),
    types: z.array(normalizedOperationTypeSchema).max(9).optional(),
}).strict().superRefine((value, context) => {
    if (value.from && value.to && Date.parse(value.from) > Date.parse(value.to)) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "from must not be later than to",
            path: ["from"],
        });
    }

});

export const analyticsRequestSchema = z.object({
    accountId: accountIdSchema,
    from: dateTimeSchema.optional(),
    interval: z.enum(["day", "week", "month"]).default("day"),
    to: dateTimeSchema.optional(),
}).strict().superRefine((value, context) => {
    if (value.from && value.to && Date.parse(value.from) > Date.parse(value.to)) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "from must not be later than to",
            path: ["from"],
        });
    }

    const to = Date.parse(value.to ?? new Date().toISOString());
    const from = Date.parse(value.from ?? new Date(to - (365 * 86_400_000)).toISOString());
    const maximumDays = { day: 2_192, month: 3_653, week: 1_827 }[value.interval];

    if ((to - from) / 86_400_000 > maximumDays) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Requested ${value.interval} analytics range is too large`,
            path: ["to"],
        });
    }
});

export const lastPricesRequestSchema = z.object({
    instrumentIds: z.array(z.string().trim().min(1).max(128)).min(1).max(50),
}).strict();

export const candlesRequestSchema = z.object({
    from: dateTimeSchema,
    instrumentId: z.string().trim().min(1).max(128),
    interval: z.enum(["hour", "day", "week", "month"]),
    to: dateTimeSchema,
}).strict().superRefine((value, context) => {
    if (Date.parse(value.from) > Date.parse(value.to)) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "from must not be later than to",
            path: ["from"],
        });
    }

    const maximumDays = { day: 2_192, hour: 93, month: 3_653, week: 1_827 }[value.interval];
    const durationDays = (Date.parse(value.to) - Date.parse(value.from)) / 86_400_000;

    if (durationDays > maximumDays) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Requested ${value.interval} candle range is too large`,
            path: ["to"],
        });
    }
});

export type AnalyticsRequest = z.infer<typeof analyticsRequestSchema>;
export type CandlesRequest = z.infer<typeof candlesRequestSchema>;
export type OperationsRequest = z.infer<typeof operationsRequestSchema>;
export type PortfolioRequest = z.infer<typeof portfolioRequestSchema>;
