// @flow

/**
 * Transformer factory
 */
function make(): Transformer {
    return {
        transform: require('./transformer/transform'),
    };
}

module.exports = make;