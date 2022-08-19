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
    const url = `https://api.github.com/users/${ctx.params.userName}/repos`;
    const promise = await axios.get(url);
    const status = promise.status;
    const repos = status === HttpStatus.OK ? promise.data : null

    console.log(`==> 🌎  URL ${url}`);
    ctx.status = status;
    ctx.body = repos;

    await next();
});

app.use(router.routes()).use(router.allowedMethods());


app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});