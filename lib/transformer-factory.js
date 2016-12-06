

/**
 * Transformer factory
 */
function make() {
    return {
        transform: require('./transformer/transform')
    };
}

module.exports = make;