
import Router from "@koa/router";

import { getAccounts } from "../controllers/accounts";
import { useBank } from "../middlewares/useBank";

export default function apiRoutes(): Router {
    const router = new Router();

    router.use('/accounts/:bankName?', useBank)
    router.post('/accounts/:bankName?', getAccounts);
    // router.post('/accounts', getAccounts);

    return router
}
