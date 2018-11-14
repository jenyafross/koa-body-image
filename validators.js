function isKeyInKeys( opts ){
    return Boolean( opts.valueIsFromKeys );
}

function isMultiples( opts ){
    return Boolean( opts.isMultiples || !opts.valueIsMultiples );
}

module.exports = [
    isKeyInKeys,
    isMultiples,
]
