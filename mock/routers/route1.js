module.exports = {
    $root: '/',
    '/filter-cp-order': {
        '$get': async ctx => {
           ctx.body = 'get filter-cp-order'
        },
        '$post': async ctx => {
            ctx.body = 'post filter-cp-order'
         }
    }
};