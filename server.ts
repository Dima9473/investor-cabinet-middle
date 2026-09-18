import Cors from "@koa/cors";
import Koa from "koa";
import Logger from "koa-logger";

import { ApiError } from "./errors/apiError";
import { getAllowedOrigins, PORT } from "./lib/constants/env";
import apiRoutes from "./routes/api";

export const createApp = (): Koa => {
    const app = new Koa();
    const allowedOrigins = new Set(getAllowedOrigins());
    const router = apiRoutes();

    app.use(async (ctx, next) => {
        try {
            await next();

            if (ctx.status === 404 && !ctx.body) {
                ctx.body = { error: { code: "NOT_FOUND", message: "Route was not found" } };
            }
        } catch (error) {
            const status = typeof error === "object" && error !== null && "status" in error && typeof error.status === "number"
                ? error.status
                : 500;
            const apiError = error instanceof ApiError
                ? error
                : new ApiError({
                    code: status >= 400 && status < 500 ? "INVALID_REQUEST" : "INTERNAL_ERROR",
                    message: status >= 400 && status < 500 ? "Request is invalid" : "Internal server error",
                    status,
                });
            ctx.status = apiError.status;
            ctx.body = {
                error: {
                    code: apiError.code,
                    ...(apiError.details === undefined ? {} : { details: apiError.details }),
                    message: apiError.message,
                },
            };
        }
    });
    app.use(Logger());
    app.use(async (ctx, next) => {
        const origin = ctx.get("Origin");

        if (origin && !allowedOrigins.has(origin)) {
            ctx.status = 403;
            ctx.body = { error: { code: "ORIGIN_NOT_ALLOWED", message: "Request origin is not allowed" } };
            return;
        }

        await next();
    });
    app.use(Cors({
        credentials: true,
        origin: (ctx) => {
            const origin = ctx.get("Origin");

            return allowedOrigins.has(origin) ? origin : "";
        },
    }));
    app.use(router.routes());
    app.use(router.allowedMethods());

    return app;
};

if (require.main === module) {
    createApp().listen(PORT, () => {
        console.log(`Investor cabinet middle is listening on port ${PORT}`);
    });
}
