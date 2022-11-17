
import Router from "@koa/router";

import { getUser } from "../controllers/user";
import { addProject } from "../controllers/project";

export default function apiRoutes(): Router {
    const router = new Router();

    router.get("/repos/:userName?", getUser);
    router.post('/project', addProject)

    return router
}