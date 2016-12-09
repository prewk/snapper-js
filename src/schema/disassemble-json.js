// @flow

const flattenDeep = require('lodash/flattenDeep');

/**
 * Disassemble a string into parts
 */
function disassembleJson(
    full: Object,
    tokens: Array<string | number>
): Array<TaskAssembledAliasPart> {
    let parts = [JSON.stringify(full)];

    // Iterate through tokens
    tokens.forEach((token) => {
        let wip = [];

        // Iterate through current parts
        parts.forEach((part) => {
            // If this part is a token, save it and continue
            if (tokens.includes(part)) {
                wip.push(part);
                return;
            }

            // Explode this part with token as delimiter
            const exploded = part.split('' + token);
            const results = [];

            // Interleave token into split points
            exploded.forEach((subPart, index) => {
                if (index > 0) {
                    results.push(token);
                }

                results.push(subPart);
            });

            // Gather our interleaved array
            wip.push(results);
        });

        // Flatten into one large array
        parts = flattenDeep(wip);
    });

    const metadata = [];

    // Remove quotation marks if tokens are strings
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (tokens.includes(part)) {
            if (
                typeof part === 'string' && // Token is a string
                i > 0 && // There exists a part before
                i < parts.length - 1 && // There exists a part after
                parts[i - 1].endsWith('"') && // The part before ends with a "
                parts[i + 1].startsWith('"') // The part after starts with a "
            ) {
                // Remove quotation marks
                parts[i - 1] = parts[i - 1].substring(0, parts[i - 1].length - 1);
                parts[i + 1] = parts[i + 1].substr(1);

                metadata.push(['ALIAS', 'JSON', 0]);
            } else if (typeof part === 'string') {
                metadata.push(['ALIAS', 'NONE', '']);
            } else {
                metadata.push(['ALIAS', 'JSON', 0]);
            }
        } else {
            metadata.push(['PART', 'NONE', '']);
        }
    }

    const partsWithMetadata = parts.map((part, index) => {
        let tuple;

        if (metadata[index][0] === 'PART') {
            tuple = ['PART', metadata[index][1], part];
        } else {
            tuple = ['ALIAS', metadata[index][1], part];
        }

        return tuple;
    });

    return partsWithMetadata;
}

module.exports = disassembleJson;