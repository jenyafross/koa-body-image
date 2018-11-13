module.exports = koaBodyImages;

function koaBodyImages(opts) {
    opts = opts || {};
    opts.fromKeys = 'fromKeys' in opts ? opts.fromKeys : [];
    opts.multiples = 'multiples' in opts ? opts.multiples : false;

    return function (ctx, next) {

    }
}