import Koa from "koa";
import Router from "@koa/router";
import BodyParser from "koa-bodyparser";
import Logger from "koa-logger";
import Cors from "@koa/cors";
import HttpStatus from 'http-status'

import { getGitUser, getReposAsync } from "./utils/fetch";

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(BodyParser());
app.use(Logger());
app.use(Cors());

const router = new Router();

router.get("/repos/:userName?", async (ctx: Koa.Context, next: Function) => {
    const userName = ctx.params.userName
    try {
        const { data: repos } = await getReposAsync(userName)
        const { data: user } = await getGitUser(userName)
        ctx.status = HttpStatus.OK;
        ctx.body = { company: user.company, repos };

        await next();
    } catch {
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = null;

        await next();
    }
});

app.use(router.routes()).use(router.allowedMethods());


app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});