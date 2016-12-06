// @flow

/**
 * Validator factory
 */
function make(): Validator {
    return {
        validate: require('./validator/validate'),
    };
}

module.exports = make;