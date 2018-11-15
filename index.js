const validators = require('./validators');
const types = Object.freeze({
    'gif'           : true,
    'jpeg'          : true,
    'pjpeg'         : true,
    'png'           : true,
    'svg+xml'       : true,
    'tiff'          : true,
    'vnd.microsoft.icon': true,
    'vnd.wap.wbmp'  : true,
    'webp'          : true,
    'x-icon'        : true,
    'x-jng'         : true,
    'x-ms-bmp'      : true,
});

module.exports = koaBodyImages;

function koaBodyImages(opts) {
    opts = opts || {};
    opts.fromKeys = 'fromKeys' in opts ? opts.fromKeys : [];
    opts.multiples = 'multiples' in opts ? opts.multiples : true;
    opts.types = 'types' in opts ? opts.types : [];

    //check opts.fromKeys
    if ( ! Array.isArray(opts.fromKeys) ) throw new KoaBodyImagesTypeError("Option 'fromKeys' is not an array");
    if ( ! checkArrayElementsTypes(opts.fromKeys, "string")) throw new KoaBodyImagesTypeError("Some of elements in 'fromKeys' option is not a string");

    //check opts.types
    if ( ! Array.isArray(opts.types) ) throw new KoaBodyImagesTypeError("Option 'types' is not an array");
    if ( ! checkArrayElementsTypes(opts.types, "string")) throw new KoaBodyImagesTypeError("Some of elements in 'types' option is not a string");
    if ( ! opts.types.every( t => t.toLowerCase() in types) ) throw new KoaBodyImagesTypeError("Some of elements in 'types' is not a correct type value");

    //check opts.multiples
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

            const valueIsMultiples  = Array.isArray(value);
            const valueIsFromKeys   = Boolean( !isFromKeys  || ~opts.fromKeys.indexOf(key) );

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

            const valueImages = getImages(value, opts.types);

            if ( !valueImages ) {
                return delete images[key];
            }

            images[key] = valueImages;

        });


        ctx.request.images = Object.keys(images).length ? images : undefined;

        return next();
    }
}

function checkType(variable, type) {
    return typeof variable === type;
}

function checkArrayElementsTypes(array, type) {
    return array.every( x => checkType(x, type) );
}

function isImage(file, types) {
    if ( !file || !file.type ) return false;

    if( types.length ) {
        return types.some( type => file.type.indexOf("image/" + type) === 0);
    }

    return file.type.indexOf("image/") === 0;
}

function getImages(files, types) {
    files = files || {};
    let images;

    if (Array.isArray(files)) {
        images = files.filter( file => isImage(file, types));
        return images.length ? images : null;
    }
    return isImage(files, types) ? files : null;

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