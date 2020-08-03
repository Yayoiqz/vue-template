import Koa from 'koa'
import serve from 'koa-static'
import koaBody from 'koa-body'
import nodeRoutes from './routes'
import path from 'path'
import history from 'koa2-connect-history-api-fallback'

var app = new Koa()
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    if (ctx.request.headers.accept && ctx.request.headers.accept.indexOf('html') !== -1) {
        console.log('html time', new Date().toLocaleString())
        console.log('html ms', ms)
        console.log('html prod-------------request', ctx.request)
        console.log('ip', ctx.ip)
    }
})
app.use(koaBody({
    multipart: true,
    formidable: {
        keepExtensions: true
    }
}))

app.use(history({
    whiteList: ['/HealthCheckStatus']
}))
app.on('close', function (err) {
    console.error(err)
})
app.use(serve(path.join(__dirname, '../dist')))
app.use(nodeRoutes.routes())
app.use(nodeRoutes.allowedMethods())

app.listen(process.env.PORT, function () {
    console.info('listen on port:', process.env.PORT)
})
module.exports = app
