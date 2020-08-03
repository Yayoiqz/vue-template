import crypto from 'crypto'
import Axios from 'axios'
import {
    loggerInfo,
    loggerError,
    loggerPerf
} from '../log'
import path from 'path'
import fs from 'fs'

const Tools = {
    getClientIp (req) {
        let ip = req.headers['x-forwarded-for'] ||
            req.headers['Proxy-Client-IP'] ||
            req.headers['WL-Proxy-Client-IP'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
        const index = ip.lastIndexOf(':')
        if (index > -1) {
            ip = ip.slice(index + 1)
        }
        console.log('getClientIp', ip)
        return ip
    },
    config: {},
    readConfig () {
        let configFile
        let config
        if (process.env.CONFIG_FILE) {
            // 线上
            configFile = process.env.CONFIG_FILE
            console.log('线上/测试自动部署')
        } else {
            if (process.env.CD_TYPE === 'manual') {
                // 测试手动部署
                configFile = path.resolve(__dirname, '../../fe-web-conf.jsonc')
                console.log('测试手动部署')
            } else {
                // 开发
                configFile = path.resolve(__dirname, '../../../fe-web-conf.jsonc')
                console.log('开发')
            }
        }
        fs.readFile(configFile, 'utf8', (err, data) => {
            if (err) {
                config = {
                    server: {
                        main: 'http://localhost:4004'
                    }
                }
                console.log('readConfig Error: ', err)
            } else {
                config = data
            }
            console.log('config : ', config)
            Tools.config = config
        })
    },
    setOption: function (option, ctx) {
        // baseurl配置
        const c = JSON.parse(Tools.config)
        option.server = c.server.main
        const config = {
            headers: {
                authorization: option.headers.token ? `Bearer ${option.headers.token}` : '',
                imei: option.headers.imei,
                device: 'H5',
                'Accept-Language': 'zh-CN;q=0.5',
                // 'Content-Type': 'application/x-www-form-urlencoded'
                'content-type': option.headers['content-type'] ? option.headers['content-type'] : 'application/json'
            },
            baseURL: option.server,
            url: option.url ? option.url : '',
            method: option.method || 'POST',
            responseType: option.responseType || 'json'
            // transformRequest: [function (data) {
            //     // 对 data 进行任意转换处理
            //     return Qs.stringify(data)
            // }]
        }
        // 参数配置
        // switch (option.method) {
        // case 'GET':
        // config.params = option.params || ''
        // break
        // default:
        config.data = option.body || ''
        // break
        // }
        return config
    },
    // call api server 转发到Java
    callServer: function (ctx, next, option) {
        // option.headers = {
        //     ...ctx.headers
        // }
        const startTime = Date.now()
        const traceId = option.headers.traceid
        loggerInfo.info(`request traceId: ${traceId}`, option)
        return Axios(option).then(function (res) {
            let json
            console.log('------------------------------------')
            console.log('time:', (new Date()).toLocaleString())
            console.log('req: ', option)
            // console.log('req body: ', (option.disableEncry ? option.body : Tools.decryption(option.body)))
            console.log('res data: ', res.data)
            try {
                json = res.data
                // json = JSON.parse(Tools.decryption(res.data))
                if (res.headers['set-cookie']) {
                    for (const ele of res.headers['set-cookie']) {
                        // kv0--cookiename:cookievalue
                        const kv0 = ele.split(';')[0].split('=')
                        // if (kv0[0] === 'JSESSIONID') {
                        //     ctx.cookies.set('JSESSIONID', kv0[1])
                        //     break
                        // }
                        if (kv0[0] === 'token') {
                            ctx.cookies.set('token', kv0[1])
                            break
                        }
                    }
                }
            } catch (e) {
                loggerError.error(`parse/decry error  traceId: ${traceId}`, {
                    errorDescription: e.message
                })
                console.log('------------------------------------')
                console.log('time:', (new Date()).toLocaleString())
                console.log('req: ', option)
                console.log('parse/decry error:', e.message)
                json = {
                    success: false,
                    error: 'parse/decry error'
                }
            }
            const endTime = Date.now()
            const duration = endTime - startTime
            loggerInfo.info(`response traceId: ${traceId}`, {
                url: option.url,
                status: res.status,
                data: json,
                duration: duration,
                responseHeaders: res.headers
            })
            ctx.body = json
            next()
        }).catch(function (err) {
            const endTime = Date.now()
            const duration = endTime - startTime
            loggerError.error(`error traceId: ${traceId}`, {
                errorDescription: err.message,
                duration: duration
            })
            ctx.body = err
            ctx.status = 500
            console.log('------------------------------------')
            console.log('time:', (new Date()).toLocaleString())
            console.log('req: ', option)
            console.log('parse/decry error:', err.toString())
            next()
        })
    },
    // 截止于node
    nodeServer: function (ctx, next, option) {
        const traceId = option.headers.traceid
        loggerInfo.info(`request traceId: ${traceId}`, option)
        return Axios(option)
            .then(function (res) {
                ctx.response.status = 200
                const json = {
                    a: 1,
                    b: 2
                }
                loggerInfo.info(`response traceId: ${traceId}`, {
                    status: res.status,
                    data: json,
                    responseHeaders: res.headers
                })
                ctx.body = json
                next(json)
            }).catch(function (error) {
                loggerError.error(`error traceId: ${traceId}`, {
                    errorDescription: error.message
                })
                ctx.body = error
                next(error)
            })
    },
    nodeLogServer: function (ctx, next, option) {
        const traceId = option.headers.traceid
        delete option.token
        delete option.device
        delete option.channel
        delete option.os
        delete option.imei
        delete option.version
        delete option.idfa
        delete option.deviceType
        loggerInfo.info(`nodeLog traceId: ${traceId}`, option)
        return new Promise(function (resolve, reject) {
            ctx.body = {}
            ctx.status = 200
            resolve()
        })
    },
    // trackInfoServer: function (ctx, next) {
    //     loggerTrack.info('track:', ctx.request.body)
    //     ctx.body = {res: 'success'}
    //     next()
    // },
    performanceInfoServer: function (ctx, next) {
        const ip = Tools.getClientIp(ctx.req)
        ctx.request.body.user.ip = ip
        loggerPerf.info('performance:', ctx.request.body)
        ctx.body = {
            res: 'success'
        }
        next()
    },
    nodeResponse: function () {},
    // AES encryption
    encryption: function (content) { // 加密
        var iv = ''
        var clearEncoding = 'utf8'
        var cipherEncoding = 'base64'
        var key = '' // 设定
        var algorithm = 'aes-128-ecb'
        var cipher = crypto.createCipheriv(algorithm, key, iv)
        var cipherChunks = []
        cipherChunks.push(cipher.update(JSON.stringify(content), clearEncoding, cipherEncoding))
        cipherChunks.push(cipher.final(cipherEncoding))
        var datas = cipherChunks.join('')
        return datas
    },
    // AES decryption
    decryption: function (body) { // 解密
        var iv = ''
        var clearEncoding = 'utf8'
        var cipherEncoding = 'base64'
        var key = '' // 设定
        var cipherChunks = []
        var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv)
        cipherChunks.push(decipher.update(body, cipherEncoding, clearEncoding))
        cipherChunks.push(decipher.final(clearEncoding))
        var decryption = cipherChunks.join('')
        return decryption
    }
}
Tools.readConfig()
module.exports = Tools
