const validators = require('./validators');

module.exports = koaBodyImages;

function koaBodyImages(opts) {
    opts = opts || {};
    opts.fromKeys = 'fromKeys' in opts ? opts.fromKeys : [];
    opts.multiples = 'multiples' in opts ? opts.multiples : true;

    if ( ! Array.isArray(opts.fromKeys) ) throw new KoaBodyImagesTypeError("Option 'fromKeys' is not an array");
    if ( ! checkArrayElementsTypes(opts.fromKeys, "string")) throw new KoaBodyImagesTypeError("Some of elements in 'fromKeys' option is not a string");
    if ( typeof opts.multiples !== "boolean") throw new KoaBodyImagesTypeError("Option 'multiples' is not a boolean");

    return function (ctx, next) {
        const isMultiples   = Boolean( opts.multiples );
        const isFromKeys    = Boolean( opts.fromKeys.length );

        const { files }     = ctx.request;
        const images        = Object.assign({}, files);

        if ( !files ) return next();

        const keys = Object.keys(files);

        keys.forEach( key => {

            let value = images[key];

            const valueIsMultiples = Array.isArray(value);
            const valueIsFromKeys = Boolean( !isFromKeys || ~opts.fromKeys.indexOf(key) );

            const validationData = {
                value,
                valueIsMultiples,
                valueIsFromKeys,
                isMultiples,
                isFromKeys,
            };


            if ( ! validators.every( f => f(validationData)) ) {
                return delete images[key];
            }

            if( isMultiples && !valueIsMultiples) {
                value = [value];
            }

            const valueImages = getImages(value);

            if ( !valueImages ) {
                return delete images[key];
            }

            images[key] = valueImages;

        });


        ctx.request.images = Object.keys(images).length ? images : undefined;

        console.log(ctx.request.images);
        return next();
    }
}

function checkType(variable, type) {
    return typeof variable === type;
}

function checkArrayElementsTypes(array, type) {
    return array.every( x => checkType(x, type) );
}

function isImage(file) {
    if ( !file || !file.type ) return false;
    return file.type.indexOf("image/") === 0;
}

function getImages(files) {
    files = files || {};
    let images;

    if (Array.isArray(files)) {
        images = files.filter( file => isImage(file));
        console.log(images);
        return images.length ? images : null;
    }
    return isImage(files) ? files : null;

}

class KoaBodyImagesError extends Error {
    constructor(...args) {
        super(...args);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}

class KoaBodyImagesTypeError extends KoaBodyImagesError {
    constructor(...args) {
        super(...args);
    }
}

let middleware = koaBodyImages({fromKeys: [], multiples: true});
middleware({request: {files: { upload: [{type: "image/jpeg"},{type: "image/png"}], test: {type: "image/png"}, test2: {type: "image/webp"}, someKey : {type: 'stream'} }}}, function() {console.log("end")});