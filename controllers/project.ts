import Koa from "koa";
import HttpStatus from 'http-status'

type ProjectRequest = {
    projectName: string
}

export const addProject = async (ctx: Koa.Context, next: Function) => {
    console.log('post here')
    try {
        const data = <ProjectRequest>ctx.request.body
        console.log(`projectName: ${data.projectName}`)
        ctx.body = { projectName: data.projectName }
        ctx.status = HttpStatus.OK
    } catch {
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = null;
    }
}