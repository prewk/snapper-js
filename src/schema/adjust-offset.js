// @flow

/**
 * Create a new MapEntryDependency with the given offset pos adjustment
 */
function adjustOffset(
    dependency: MapEntryDependency,
    offsetChange: number,
    at: number
): MapEntryDependency {
    const adjusted: MapEntryDependency = Object.assign({}, dependency);
    
    if (dependency.startPos > at) {
        adjusted.startPos += offsetChange;
        adjusted.stopPos += offsetChange;
    }
    
    return adjusted;
}

module.exports = adjustOffset;