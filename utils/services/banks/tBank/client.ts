import axios from "axios";
import { z } from "zod";

import { ApiError } from "../../../../errors/apiError";
import { TBankConfig } from "../../../../lib/constants/env";
import {
    accountsResponseSchema,
    candlesResponseSchema,
    instrumentResponseSchema,
    lastPricesResponseSchema,
    operationsByCursorResponseSchema,
    portfolioResponseSchema,
    withdrawLimitsResponseSchema,
} from "./schemas";

type PostOptions<TSchema extends z.ZodTypeAny> = {
    body: unknown;
    method: string;
    schema: TSchema;
    service: string;
};

export type TBankOperationsRequest = {
    accountId: string;
    cursor?: string;
    from?: string;
    limit?: number;
    operationTypes?: string[];
    state?: string;
    to?: string;
    withoutCommissions?: boolean;
    withoutOvernights?: boolean;
    withoutTrades?: boolean;
};

export type TBankCandlesRequest = {
    from: string;
    instrumentId: string;
    interval: string;
    limit?: number;
    to: string;
};

const mapUpstreamError = (error: unknown): ApiError => {
    if (!axios.isAxiosError(error)) {
        return new ApiError({
            code: "TBANK_UNAVAILABLE",
            message: "T-Bank API is unavailable",
            status: 502,
        });
    }

    const upstreamStatus = error.response?.status;

    if (upstreamStatus === 400) {
        return new ApiError({ code: "TBANK_BAD_REQUEST", message: "T-Bank rejected the request", status: 400 });
    }

    if (upstreamStatus === 401 || upstreamStatus === 403) {
        return new ApiError({ code: "TBANK_AUTH_FAILED", message: "T-Bank authentication failed", status: 502 });
    }

    if (upstreamStatus === 404) {
        return new ApiError({ code: "TBANK_RESOURCE_NOT_FOUND", message: "T-Bank resource was not found", status: 404 });
    }

    if (upstreamStatus === 429) {
        return new ApiError({ code: "TBANK_RATE_LIMITED", message: "T-Bank request limit was reached", status: 503 });
    }

    return new ApiError({ code: "TBANK_UNAVAILABLE", message: "T-Bank API is unavailable", status: 502 });
};

export class TBankClient {
    private readonly config: TBankConfig;

    constructor(config: TBankConfig) {
        this.config = config;
    }

    private async post<TSchema extends z.ZodTypeAny>(options: PostOptions<TSchema>): Promise<z.output<TSchema>> {
        const headers: Record<string, string> = {
            Accept: "application/json",
            Authorization: `Bearer ${this.config.token}`,
            "Content-Type": "application/json",
        };

        if (this.config.appName) {
            headers["x-app-name"] = this.config.appName;
        }

        try {
            const response = await axios.post(
                `${this.config.apiBaseUrl}.${options.service}/${options.method}`,
                options.body,
                {
                    headers,
                    maxBodyLength: 1_048_576,
                    maxContentLength: 10_485_760,
                    maxRedirects: 0,
                    timeout: this.config.timeoutMs,
                },
            );
            const parsed = options.schema.safeParse(response.data);

            if (!parsed.success) {
                throw new ApiError({
                    code: "TBANK_INVALID_RESPONSE",
                    details: parsed.error.issues.map((issue) => ({ message: issue.message, path: issue.path })),
                    message: "T-Bank returned an unexpected response",
                    status: 502,
                });
            }

            return parsed.data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            throw mapUpstreamError(error);
        }
    }

    getAccounts() {
        return this.post({
            body: { status: "ACCOUNT_STATUS_ALL" },
            method: "GetAccounts",
            schema: accountsResponseSchema,
            service: "UsersService",
        });
    }

    getPortfolio(accountId: string) {
        return this.post({
            body: { accountId, currency: "RUB" },
            method: "GetPortfolio",
            schema: portfolioResponseSchema,
            service: "OperationsService",
        });
    }

    getWithdrawLimits(accountId: string) {
        return this.post({
            body: { accountId },
            method: "GetWithdrawLimits",
            schema: withdrawLimitsResponseSchema,
            service: "OperationsService",
        });
    }

    getOperationsByCursor(request: TBankOperationsRequest) {
        return this.post({
            body: request,
            method: "GetOperationsByCursor",
            schema: operationsByCursorResponseSchema,
            service: "OperationsService",
        });
    }

    getCandles(request: TBankCandlesRequest) {
        return this.post({
            body: request,
            method: "GetCandles",
            schema: candlesResponseSchema,
            service: "MarketDataService",
        });
    }

    getLastPrices(instrumentIds: string[]) {
        return this.post({
            body: { instrumentId: instrumentIds },
            method: "GetLastPrices",
            schema: lastPricesResponseSchema,
            service: "MarketDataService",
        });
    }

    getInstrument(instrumentId: string) {
        return this.post({
            body: { classCode: "", id: instrumentId, idType: "INSTRUMENT_ID_TYPE_ID" },
            method: "GetInstrumentBy",
            schema: instrumentResponseSchema,
            service: "InstrumentsService",
        });
    }
}
