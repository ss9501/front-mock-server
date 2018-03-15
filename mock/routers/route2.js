module.exports = {
    $root: '/hr',
    '/filter-hr': {
        '$get': async ctx => {
           ctx.body = 'get filter-hr'
        },
        '$post': async ctx => {
            ctx.body = 'post filter-hr'
         }
    }
};