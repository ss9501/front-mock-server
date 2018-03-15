const fs = require('fs');
const path = require('path');

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