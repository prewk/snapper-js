

/**
 * Validator factory
 */
function make() {
    return {
        validate: require('./validator/validate')
    };
}

module.exports = make;