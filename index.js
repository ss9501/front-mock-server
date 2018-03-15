#!/usr/bin/env node

/**
 * gap-node-mock-server
 */
const koa = require('koa');
const devIp = require('dev-ip'); //用来获取本机ip地址
const klawSync = require('klaw-sync');
const mount = require('koa-mount');
const Router = require('koa-router');
const path = require('path');
const _ = require('lodash');

const app = new koa();

const methodFlag = ['$get', '$post'];

const routerDir = path.join(process.cwd(), 'mock/routers');

const host = devIp();

let error;
let mockFiles = [];

const files = klawSync(routerDir, {nodir: true});

const bindRoute = (routerConf, routeKey, rootPath, router) => {
    let handler = routerConf[routeKey];
    routerKey = rootPath + routeKey;

    if (_.isFunction(handler)) {
        router.use(routeKey, handler)
    } else if (_.isObject(handler)) {
        if (methodFlag.some((item) => {
            return handler[item];
        })) {
            methodFlag.forEach(item => {
                if (handler[item] && _.isFunction(handler[item])) {
                    router[item.toLowerCase().replace('$', '')](routeKey, handler[item]);
                } else if (handler[item] && _.isObject(handler[item])) {
                    router[item.toLowerCase().replace('$', '')](routeKey, async (ctx, next) => {
                        ctx.body = handler[item];
                        next();
                    })
                }
            })
        } else {
            router.use(routerKey, async (ctx, next) => {
                ctx.body = handler[item];
                next();
            })
        }
    }
}

const geneRouter = async (confs) => {
    let router = new Router();
    Object.keys(confs).forEach(key => {
        let routerConf = confs[key];
        if (key === '/') { //根路径
            Object.keys(routerConf).forEach(routeKey => {
                bindRoute(routerConf, routeKey, '', router);
            })
        } else {
            Object.keys(routerConf).forEach(routeKey => {
                bindRoute(routerConf, routeKey, key, router);
            })
        }
    })

    return router;
}


const destructFile = async (fileArr) => {
    let target = {};
    for (let i = 0; i < fileArr.length; i++) {
        let filePath = fileArr[i].path;
        try {
            let routeObj = await require(filePath);
            if (routeObj.$root) {
                target[routeObj.$root] = Object.assign({}, target[routeObj.$root], routeObj);  
                delete target[routeObj.$root].$root;
            } else {
                //自定义 '/' 根路由
                target['/'] = Object.assign({}, target['/'], routeObj);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return target;
}

const kog = async () => {
    let data = await destructFile(files);
    let r = await geneRouter(data);

    r.get('/test', async ctx=> {
        ctx.body = 'testtest';
    })

    app.use(mount('/', r.middleware()));
}

kog();

app.listen(3001, function () {
    console.log('mock server start  (￣_,￣ )');
    console.log('listening at http://' + host + ':' + 3001);
})
