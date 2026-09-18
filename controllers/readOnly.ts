import { Context } from "koa";
import { z } from "zod";

import { ApiResponse } from "../contracts/readOnly";
import { ApiError } from "../errors/apiError";
import { TBankReadOnlyService } from "../utils/services/banks/tBank/readOnlyService";
import {
    accountsRequestSchema,
    analyticsRequestSchema,
    candlesRequestSchema,
    lastPricesRequestSchema,
    operationsRequestSchema,
    portfolioRequestSchema,
} from "../zodSchemas/readOnlyRequests";

type RequestWithBody = Context["request"] & { body?: unknown };

const parseBody = <TSchema extends z.ZodTypeAny>(ctx: Context, schema: TSchema): z.output<TSchema> => {
    const parsed = schema.safeParse((ctx.request as RequestWithBody).body ?? {});

    if (!parsed.success) {
        throw new ApiError({
            code: "INVALID_REQUEST",
            details: parsed.error.issues.map((issue) => ({ message: issue.message, path: issue.path })),
            message: "Request body is invalid",
            status: 400,
        });
    }

    return parsed.data;
};

const getService = (ctx: Context): TBankReadOnlyService => {
    const bankName = ctx.params.bankName;

    if (bankName !== "t-bank") {
        throw new ApiError({
            code: "BANK_NOT_SUPPORTED",
            message: `Read-only integration for bank '${bankName}' is not implemented`,
            status: 501,
        });
    }

    return new TBankReadOnlyService();
};

const respond = <T>(ctx: Context, data: T): void => {
    const response: ApiResponse<T> = {
        data,
        meta: { generatedAt: new Date().toISOString(), source: "t-bank" },
    };
    ctx.status = 200;
    ctx.body = response;
};

export const getAccounts = async (ctx: Context): Promise<void> => {
    parseBody(ctx, accountsRequestSchema);
    respond(ctx, await getService(ctx).getAccounts());
};

export const getPortfolio = async (ctx: Context): Promise<void> => {
    const request = parseBody(ctx, portfolioRequestSchema);
    respond(ctx, await getService(ctx).getPortfolio(request));
};

export const getOperations = async (ctx: Context): Promise<void> => {
    const request = parseBody(ctx, operationsRequestSchema);
    respond(ctx, await getService(ctx).getOperations(request));
};

export const getAnalytics = async (ctx: Context): Promise<void> => {
    const request = parseBody(ctx, analyticsRequestSchema);
    respond(ctx, await getService(ctx).getAnalytics(request));
};

export const getLastPrices = async (ctx: Context): Promise<void> => {
    const request = parseBody(ctx, lastPricesRequestSchema);
    respond(ctx, { items: await getService(ctx).getLastPrices(request.instrumentIds) });
};

export const getCandles = async (ctx: Context): Promise<void> => {
    const request = parseBody(ctx, candlesRequestSchema);
    respond(ctx, await getService(ctx).getCandles(request));
};

export const getLegacyAccounts = async (ctx: Context): Promise<void> => {
    parseBody(ctx, accountsRequestSchema);
    const { accounts } = await getService(ctx).getAccounts();
    ctx.status = 200;
    ctx.body = accounts.map((account) => ({
        closedDate: account.closedAt,
        id: account.id,
        name: account.name,
        openedDate: account.openedAt,
        status: account.providerStatus,
        type: account.providerType,
    }));
};

export const getLegacyOperations = async (ctx: Context): Promise<void> => {
    const request = parseBody(ctx, operationsRequestSchema);
    ctx.status = 200;
    ctx.body = await getService(ctx).getLegacyOperations(request);
};
