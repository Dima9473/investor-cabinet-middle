import Router from "@koa/router";
import { bodyParser } from "@koa/bodyparser";

import {
    getAccounts,
    getAnalytics,
    getCandles,
    getLastPrices,
    getLegacyAccounts,
    getLegacyOperations,
    getOperations,
    getPortfolio,
} from "../controllers/readOnly";

export default function apiRoutes(): Router {
    const router = new Router();
    router.use(bodyParser({ enableTypes: ["json"], jsonLimit: "256kb" }));
    router.get("/health", (ctx) => {
        ctx.status = 200;
        ctx.body = { status: "ok" };
    });
    router.post("/accounts/:bankName", getAccounts);
    router.post("/portfolio/:bankName", getPortfolio);
    router.post("/operations/:bankName", getOperations);
    router.post("/analytics/:bankName", getAnalytics);
    router.post("/market-data/:bankName/last-prices", getLastPrices);
    router.post("/market-data/:bankName/candles", getCandles);
    router.post("/legacy/accounts/:bankName", getLegacyAccounts);
    router.post("/legacy/operations/:bankName", getLegacyOperations);

    return router;
}
