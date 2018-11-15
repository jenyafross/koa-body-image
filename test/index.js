const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const koaBodyImages = require('../');

const supertest = require('supertest');
const request = supertest('http://127.0.0.1:4444');
const validators = require('./validators');


function initServer(options){
    const app = new Koa();
    const router = new Router();
    router.post('/', koaBodyImages(options), ctx => {
        //console.log(ctx.request.images);
        ctx.body = ctx.request.images;
    });

    app.use(koaBody({multipart: true}));
    app.use(router.routes());
    return http.createServer(app.callback()).listen(4444);
}

function toRequest() {
    return request.post('/')
        .attach( 'image0',  'test/asserts/blank.jpg')
        .attach( 'image0',  'test/asserts/blank.jpg')
        .attach( 'image0',  'test/asserts/notImage.txt')
        .attach( 'image1',  'test/asserts/blank.jpg')
        .attach( 'png',     'test/asserts/blank.png')
        .attach( 'gif',     'test/asserts/blank.gif')
        .attach( 'svg',     'test/asserts/blank.svg')
        .attach( 'ico',     'test/asserts/blank.ico')
        .attach( 'wbmp',    'test/asserts/blank.wbmp')
        .attach( 'webp',    'test/asserts/blank.webp')
        .attach( 'neverInResponse', 'test/asserts/notImage.txt');
}

describe("Tests", () => {
    it("All objects are images, all objects are wrapped into arrays", (done) => {
        const server = initServer({fromKeys: [], multiples: true});
        toRequest()
            .expect(validators.areImages)
            .expect(validators.areArrays)
            .end( (err, res) => {
                if(err) return done(err);
                server.close();
                done();
            })
    });

    it("All objects are images, all objects are single objects", done => {
        const server = initServer({fromKeys: [], multiples: false});
        toRequest()
            .expect(validators.areImages)
            .expect(validators.areNotArrays)
            .end( (err, res) => {
                if(err) return done(err);
                server.close();
                done();
            })
    });

    it("All objects are images, all objects are wrapped into arrays, all keys of object in fromKeys", done => {
        const fromKeys = ["neverInResponse", "image0"];
        const server = initServer({fromKeys, multiples: true});
        toRequest()
            .expect(validators.areImages)
            .expect(validators.areArrays)
            .expect(validators.keysInFromKeys(fromKeys))
            .end( (err, res) => {
                if(err) return done(err);
                server.close();
                done();
            })
    });

    it("All objects are images, all objects are single objects, all keys of object in fromKeys", done => {
        const server = initServer({fromKeys: ["neverInResponse", "image0", "image1"], multiples: false});
        toRequest()
            .expect(validators.areImages)
            .expect(validators.areNotArrays)
            .expect(validators.keysInFromKeys(["neverInResponse", "image0", "image1"]))
            .end( (err, res) => {
                if(err) return done(err);
                server.close();
                done();
            })
    });
    it("All objects are images, all objects are single objects, all returned types from specified types", done => {
        const types = ['vnd.microsoft.icon', 'svg+xml', 'vnd.wap.wbmp', 'gif'];
        const server = initServer({multiples: true, types});
        toRequest()
            .expect(validators.areImages)
            .expect(validators.areArrays)
            .expect(validators.areFromTypes(types))
            .end( (err, res) => {
                if(err) return done(err);
                server.close();
                done();
            })
    });
});