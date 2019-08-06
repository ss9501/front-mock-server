# front-mock-server

前端开发mock工具，可根据配置动态生成路由

```javascript
module.exports = {
    $root: '/',
    '/filter-cs-order': {
        '$get': async ctx => {
            let data  = await fs.readFileSync(path.join(__dirname, '../data/filterCsOrder.json'));
            ctx.body = JSON.parse(data);
        },
        '$post': async ctx => {
            let data  = await fs.readFileSync(path.join(__dirname, '../data/filterCsOrder.json'));
            ctx.body = JSON.parse(data);
         }
    }
};

```
