import { z } from "zod";

import { ApiError } from "../../errors/apiError";

const environmentSchema = z.object({
    PORT: z.coerce.number().int().positive().default(3000),
    ALLOWED_ORIGINS: z.string().default("https://localhost:9001,http://localhost:9001"),
    TBANK_API_TOKEN: z.string().trim().min(1),
    TBANK_API_BASE_URL: z.string().url().default("https://invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1"),
    TBANK_API_TIMEOUT_MS: z.coerce.number().int().positive().max(60_000).default(10_000),
    TBANK_APP_NAME: z.string().trim().optional(),
    TBANK_ALLOW_CUSTOM_API_HOST: z.enum(["true", "false"]).default("false"),
});

export type TBankConfig = {
    apiBaseUrl: string;
    appName?: string;
    timeoutMs: number;
    token: string;
};

export const PORT = Number(process.env.PORT) || 3000;

export const getAllowedOrigins = (): string[] => (
    process.env.ALLOWED_ORIGINS ?? "https://localhost:9001,http://localhost:9001"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getTBankConfig = (): TBankConfig => {
    const parsed = environmentSchema.safeParse(process.env);

    if (!parsed.success) {
        throw new ApiError({
            code: "TBANK_CONFIGURATION_ERROR",
            message: "T-Bank integration is not configured",
            status: 503,
        });
    }

    const apiUrl = new URL(parsed.data.TBANK_API_BASE_URL);
    const knownHosts = new Set(["invest-public-api.tbank.ru", "sandbox-invest-public-api.tbank.ru"]);
    const customHostAllowed = parsed.data.TBANK_ALLOW_CUSTOM_API_HOST === "true";
    const hasExpectedPath = apiUrl.pathname.startsWith("/rest/tinkoff.public.invest.api.contract.v1");

    const isSecureEndpoint = apiUrl.protocol === "https:"
        && hasExpectedPath
        && !apiUrl.username
        && !apiUrl.password;
    const isAllowedHost = customHostAllowed || knownHosts.has(apiUrl.hostname);

    if (!isSecureEndpoint || !isAllowedHost) {
        throw new ApiError({
            code: "TBANK_CONFIGURATION_ERROR",
            message: "T-Bank API URL is not an allowed HTTPS host",
            status: 503,
        });
    }

    return {
        apiBaseUrl: parsed.data.TBANK_API_BASE_URL.replace(/\/$/, ""),
        appName: parsed.data.TBANK_APP_NAME || undefined,
        timeoutMs: parsed.data.TBANK_API_TIMEOUT_MS,
        token: parsed.data.TBANK_API_TOKEN,
    };
};

