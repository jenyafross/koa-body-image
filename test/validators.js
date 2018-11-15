function _areImages(values) {
    const areValuesImages = values.every( value => {
        if( Array.isArray(value)) {
            return value.every( x => {
                return ~x.type.indexOf('image/');
            })
        }
        return ~value.type.indexOf('image/');
    });

    if( ! areValuesImages ) throw new Error('Some value is not an image');
}

function _areArrays(values) {
    const areValuesArrays = values.every( value => {
        return Array.isArray(value);
    });

    if ( ! areValuesArrays ) throw new Error('Some value is not an array');
}

function _areNotArrays(values) {
    const areValuesNotArrays = values.every( value => {
        return !Array.isArray(value);
    });

    if ( ! areValuesNotArrays ) throw new Error('Some value is an array');
}

function keysInFromKeys(keys) {
    return res => {
        const body = res.body;
        const responseKeys = Object.keys(body);
        const inFromKeys = responseKeys.every( key => {
            return Boolean(~keys.indexOf(key))
        });
        if ( ! inFromKeys ) throw new Error("Some keys is not in 'fromKey'");
    }
}

function areFromTypes(types) {
    return res => {
        const body = res.body;
        const responseKeys = Object.keys(body);
        const fromTypes = responseKeys.every( key => {
           return types.some( type => {
               if(Array.isArray(body[key])) {
                   return body[key].every( value => Boolean(~value.type.indexOf(type)));
               }
               return Boolean( ~body[key].type.indexOf(type) )
           })
        });

        if ( ! fromTypes ) throw new Error("Some returned type is not from types");
    }
}

function wrap(fn) {
    return res => {
        const body = res.body;
        const keys = Object.keys(body);
        const values = keys.map( key => {
            return body[key];
        });
        return fn(values);
    }
}
module.exports = {
    areImages    : wrap(_areImages),
    areArrays    : wrap(_areArrays),
    areNotArrays : wrap(_areNotArrays),
    areFromTypes,
    keysInFromKeys,
};