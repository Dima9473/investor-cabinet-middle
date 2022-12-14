import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Logger from "koa-logger";
import Cors from "@koa/cors";
import apiRoutes from "./routes/api";

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(BodyParser());
app.use(Logger());
app.use(Cors());

const router = apiRoutes()

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/", PORT, PORT);
});