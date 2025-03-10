
import Router from "@koa/router";

import { getAccounts } from "../controllers/accounts";

export default function apiRoutes(): Router {
    const router = new Router();

    router.post('/accounts', getAccounts)

    return router
}
