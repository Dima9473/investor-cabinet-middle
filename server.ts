import { getGitUser, getReposAsync } from "./utils/fetch";

const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const Router = require('@koa/router');
const Logger = require("koa-logger");
// const serve = require("koa-static");
// const mount = require("koa-mount");
const cors = require('@koa/cors');
const axios = require('axios');
const HttpStatus = require("http-status");

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(BodyParser());
app.use(Logger());
app.use(cors());

const router = new Router();

router.get("/repos/:userName?", async (ctx: any, next: Function) => {
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