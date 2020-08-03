import Router from 'koa-router'
// import qs from 'querystring'
import fs from 'fs'
import {
    setOption,
    callServer
} from '../tools'
import FormData from 'form-data'
var app = new Router({
    prefix: '/template'
})
// 普通提交
app.post('/save', async (ctx, next) => {
    const option = setOption({
        url: '/save',
        body: ctx.request.body,
        headers: ctx.headers
    })
    await callServer(ctx, next, option)
})
// 图片上传demo
app.post('/upload', async (ctx, next) => {
    const body = ctx.request.body
    body.photoFile = fs.createReadStream(ctx.request.files.photoFile.path)
    var formdata = new FormData()
    formdata.append('photoFile', body.photoFile)
    formdata.append('useageType', body.useageType)
    const headers = formdata.getHeaders()
    const option = setOption({
        url: '/upload',
        body: formdata,
        headers: {
            ...ctx.headers,
            ...headers
        }
    })
    await callServer(ctx, next, option)
})
module.exports = app
