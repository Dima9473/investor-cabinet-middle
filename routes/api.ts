
import Router from "@koa/router";

import { getAccounts } from "../controllers/accounts";
import { useBank } from "../middlewares/useBank";
import { getOperations } from "../controllers/operations";
import { Context, Next } from "koa";
import body from 'koa-body'
import { validateAccount, validateOperation } from "../validation/validators/validator";

export default function apiRoutes(): Router {
    const router = new Router();
    const bodyParser = body()

    router.use((ctx: Context, next: Next) => {
        if (typeof ctx.request.body !== 'undefined'){
            return next()
        }

        return bodyParser(ctx, next)
    })

    router.post('/accounts/:bankName?', useBank, getAccounts, validateAccount);
    router.post('/operations/:bankName?', useBank, getOperations, validateOperation);

    return router
}
