

/**
 * Create a new MapEntryDependency with the given offset pos adjustment
 */
function adjustOffset(dependency, offsetChange, at) {
    const adjusted = Object.assign({}, dependency);

    if (dependency.startPos > at) {
        adjusted.startPos += offsetChange;
        adjusted.stopPos += offsetChange;
    }

    return adjusted;
}

module.exports = adjustOffset;