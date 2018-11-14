# koa-body-images [![Build Status](https://travis-ci.org/jenyafross/koa-body-images.svg?branch=master)](https://travis-ci.org/jenyafross/koa-body-images)

The middleware uses [koa-body](https://github.com/dlau/koa-body) with option `multipart: true` to extract images from `ctx.body.files`

## Installation

Install with npm

```bash
npm i koa-body-images
```

## Usage with koa-body

```nodejs
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const koaBodyImages = require('koa-body-images');

const app = new Koa();
const router = new Router();

const options = {fromKeys: ["upload"], multiples: true};

router.post('/', koaBodyImages(options), ctx => {
    ctx.body = ctx.request.images;
});

app.use(koaBody({multipart: true}));
app.use(router.routes());
app.listen(3000);

```

## Options
* `fromKeys` **{Array}**  Array of strings. Extract images only from specified keys.
* `multiples` **{Boolean}** If true, all values of keys will be wrapped into array. If false, the keys which have a several files will be ignored. __Default: true__

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)