'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function isIdBuilder(regex) {
    return (id) => typeof id === 'string' && new RegExp(regex.source, regex.flags).test(id);
}
const isNumericId = isIdBuilder(/^[1-9][0-9]*$/);
const isEntityId = isIdBuilder(/^((Q|P|L|M)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)$/);
const isEntitySchemaId = isIdBuilder(/^E[1-9][0-9]*$/);
const isItemId = isIdBuilder(/^Q[1-9][0-9]*$/);
const isPropertyId = isIdBuilder(/^P[1-9][0-9]*$/);
const isLexemeId = isIdBuilder(/^L[1-9][0-9]*$/);
const isFormId = isIdBuilder(/^L[1-9][0-9]*-F[1-9][0-9]*$/);
const isSenseId = isIdBuilder(/^L[1-9][0-9]*-S[1-9][0-9]*$/);
const isMediaInfoId = isIdBuilder(/^M[1-9][0-9]*$/);
const isGuid = isIdBuilder(/^((Q|P|L|M)[1-9][0-9]*|L[1-9][0-9]*-(F|S)[1-9][0-9]*)\$[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
const isHash = isIdBuilder(/^[0-9a-f]{40}$/);
const isRevisionId = isIdBuilder(/^\d+$/);
const isNonNestedEntityId = isIdBuilder(/^(Q|P|L|M)[1-9][0-9]*$/);
function isPropertyClaimsId(id) {
    if (typeof id !== 'string')
        return false;
    const [entityId, propertyId] = id.split('#');
    return isEntityId(entityId) && isPropertyId(propertyId);
}
function isEntityPageTitle(title) {
    if (typeof title !== 'string')
        return false;
    if (title.startsWith('Item:')) {
        return isItemId(title.substring(5));
    }
    if (title.startsWith('Lexeme:')) {
        return isLexemeId(title.substring(7));
    }
    if (title.startsWith('Property:')) {
        return isPropertyId(title.substring(9));
    }
    return isItemId(title);
}
function getNumericId(id) {
    if (!isNonNestedEntityId(id))
        throw new Error(`invalid entity id: ${id}`);
    return id.replace(/^(Q|P|L|M)/, '');
}
function getImageUrl(filename, width) {
    let url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
    if (typeof width === 'number')
        url += `?width=${width}`;
    return url;
}
function getEntityIdFromGuid(guid) {
    const parts = guid.split(/[$-]/);
    if (parts.length === 6) {
        // Examples:
        // - q520$BCA8D9DE-B467-473B-943C-6FD0C5B3D02C
        // - P6216-a7fd6230-496e-6b47-ca4a-dcec5dbd7f95
        return parts[0].toUpperCase();
    }
    else if (parts.length === 7) {
        // Examples:
        // - L525-S1$66D20252-8CEC-4DB1-8B00-D713CFF42E48
        // - L525-F2-52c9b382-02f5-4413-9923-26ade74f5a0d
        return parts.slice(0, 2).join('-').toUpperCase();
    }
    else {
        throw new Error(`invalid guid: ${guid}`);
    }
}

var helpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getEntityIdFromGuid: getEntityIdFromGuid,
    getImageUrl: getImageUrl,
    getNumericId: getNumericId,
    isEntityId: isEntityId,
    isEntityPageTitle: isEntityPageTitle,
    isEntitySchemaId: isEntitySchemaId,
    isFormId: isFormId,
    isGuid: isGuid,
    isHash: isHash,
    isItemId: isItemId,
    isLexemeId: isLexemeId,
    isMediaInfoId: isMediaInfoId,
    isNonNestedEntityId: isNonNestedEntityId,
    isNumericId: isNumericId,
    isPropertyClaimsId: isPropertyClaimsId,
    isPropertyId: isPropertyId,
    isRevisionId: isRevisionId,
    isSenseId: isSenseId
});

/** Example: keep only 'fr' in 'fr_FR' */
/**
 * a polymorphism helper:
 * accept either a string or an array and return an array
 */
function forceArray(array) {
    if (typeof array === 'string') {
        return [array];
    }
    if (Array.isArray(array)) {
        // TODO: return readonly array
        return [...array];
    }
    return [];
}
/** simplistic implementation to filter-out arrays and null */
function isPlainObject(obj) {
    return Boolean(obj) && typeof obj === 'object' && !Array.isArray(obj);
}
// encodeURIComponent ignores !, ', (, ), and *
// cf https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
const fixedEncodeURIComponent = (str) => {
    return encodeURIComponent(str).replace(/[!'()*]/g, encodeCharacter);
};
const replaceSpaceByUnderscores = (str) => str.replace(/\s/g, '_');
function uniq(array) {
    return Array.from(new Set(array));
}
const encodeCharacter = (char) => '%' + char.charCodeAt(0).toString(16);
function rejectObsoleteInterface(args) {
    if (args.length !== 1 || !isPlainObject(args[0])) {
        throw new Error(`Since wikibase-sdk v9.0.0, this function expects arguments to be passed in an object
    See https://github.com/maxlath/wikibase-sdk/blob/main/CHANGELOG.md`);
    }
}
/**
 * Checks if the `element` is of one of the entries of `all`
 * @example const isSite: site is Site = isOfType(sites, site)
 */
function isOfType(all, element) {
    return typeof element === 'string' && all.includes(element);
}
/** key is a key on the object */
function isAKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
/** like Object.entries() but with typed keys */
function typedEntries(input) {
    // @ts-expect-error string is not assignable to K as K is more specific
    return Object.entries(input);
}
/** like Object.keys() but with typed keys */
function typedKeys(obj) {
    return Object.keys(obj);
}

function wikibaseTimeToDateObject(wikibaseTime) {
    // Also accept claim datavalue.value objects
    if (typeof wikibaseTime === 'object') {
        wikibaseTime = wikibaseTime.time;
    }
    const sign = wikibaseTime[0];
    let [yearMonthDay, withinDay] = wikibaseTime.slice(1).split('T');
    // Wikidata generates invalid ISO dates to indicate precision
    // ex: +1990-00-00T00:00:00Z to indicate 1990 with year precision
    yearMonthDay = yearMonthDay.replace(/-00/g, '-01');
    const rest = `${yearMonthDay}T${withinDay}`;
    return fullDateData(sign, rest);
}
const fullDateData = (sign, rest) => {
    const year = rest.split('-')[0];
    const needsExpandedYear = sign === '-' || year.length > 4;
    return needsExpandedYear ? expandedYearDate(sign, rest, year) : new Date(rest);
};
const expandedYearDate = (sign, rest, year) => {
    let date;
    // Using ISO8601 expanded notation for negative years or positive
    // years with more than 4 digits: adding up to 2 leading zeros
    // when needed. Can't find the documentation again, but testing
    // with `new Date(date)` gives a good clue of the implementation
    if (year.length === 4) {
        date = `${sign}00${rest}`;
    }
    else if (year.length === 5) {
        date = `${sign}0${rest}`;
    }
    else {
        date = sign + rest;
    }
    return new Date(date);
};
const toEpochTime = (wikibaseTime) => wikibaseTimeToDateObject(wikibaseTime).getTime();
const toISOString = (wikibaseTime) => wikibaseTimeToDateObject(wikibaseTime).toISOString();
// A date format that knows just three precisions:
// 'yyyy', 'yyyy-mm', and 'yyyy-mm-dd' (including negative and non-4 digit years)
// Should be able to handle the old and the new Wikidata time:
// - in the old one, units below the precision where set to 00
// - in the new one, those months and days are set to 01 in those cases,
//   so when we can access the full claim object, we check the precision
//   to recover the old format
const toSimpleDay = (wikibaseTime) => {
    // Also accept claim datavalue.value objects, and actually prefer those,
    // as we can check the precision
    if (typeof wikibaseTime === 'object') {
        const { time, precision } = wikibaseTime;
        // Year precision
        if (precision === 9)
            wikibaseTime = time.replace('-01-01T', '-00-00T');
        // Month precision
        else if (precision === 10)
            wikibaseTime = time.replace('-01T', '-00T');
        else
            wikibaseTime = time;
    }
    return wikibaseTime.split('T')[0]
        // Remove positive years sign
        .replace(/^\+/, '')
        // Remove years padding zeros
        .replace(/^(-?)0+/, '$1')
        // Remove days if not included in the Wikidata date precision
        .replace(/-00$/, '')
        // Remove months if not included in the Wikidata date precision
        .replace(/-00$/, '');
};
const wikibaseTimeToEpochTime = toEpochTime;
const wikibaseTimeToISOString = (value) => {
    try {
        return toISOString(value);
    }
    catch (_a) {
        const { sign, yearMonthDay, withinDay } = recoverDateAfterError(value);
        return `${sign}${yearMonthDay}T${withinDay}`;
    }
};
const wikibaseTimeToSimpleDay = (value) => {
    try {
        return toSimpleDay(value);
    }
    catch (_a) {
        const { sign, yearMonthDay } = recoverDateAfterError(value);
        return `${sign}${yearMonthDay}`;
    }
};
function recoverDateAfterError(value) {
    value = typeof value === 'string' ? value : value.time;
    const sign = value[0];
    let [yearMonthDay, withinDay] = value.slice(1).split('T');
    if (!sign || !yearMonthDay || !withinDay) {
        throw new Error('TimeInput is invalid: ' + JSON.stringify(value));
    }
    yearMonthDay = yearMonthDay.replace(/-00/g, '-01');
    return { sign, yearMonthDay, withinDay };
}

var timeHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    wikibaseTimeToDateObject: wikibaseTimeToDateObject,
    wikibaseTimeToEpochTime: wikibaseTimeToEpochTime,
    wikibaseTimeToISOString: wikibaseTimeToISOString,
    wikibaseTimeToSimpleDay: wikibaseTimeToSimpleDay
});

function stringValue(datavalue) {
    return datavalue.value;
}
function monolingualtext(datavalue, options) {
    return options.keepRichValues ? datavalue.value : datavalue.value.text;
}
function entity(datavalue, options) {
    const { entityPrefix: prefix } = options;
    const { value } = datavalue;
    let id;
    if (value.id) {
        id = value.id;
    }
    else {
        // Legacy
        const letter = entityLetter[value['entity-type']];
        id = `${letter}${value['numeric-id']}`;
    }
    return typeof prefix === 'string' ? `${prefix}:${id}` : id;
}
const entityLetter = {
    item: 'Q',
    'entity-schema': 'E',
    lexeme: 'L',
    property: 'P',
    form: 'F',
    sense: 'S',
};
function quantity(datavalue, options) {
    const { value } = datavalue;
    const amount = parseFloat(value.amount);
    if (options.keepRichValues) {
        const richValue = {
            amount: parseFloat(value.amount),
            // ex: http://www.wikidata.org/entity/
            unit: value.unit.replace(/^https?:\/\/.*\/entity\//, ''),
        };
        if (value.upperBound != null)
            richValue.upperBound = parseFloat(value.upperBound);
        if (value.lowerBound != null)
            richValue.lowerBound = parseFloat(value.lowerBound);
        return richValue;
    }
    else {
        return amount;
    }
}
function coordinate(datavalue, options) {
    if (options.keepRichValues) {
        return datavalue.value;
    }
    else {
        return [datavalue.value.latitude, datavalue.value.longitude];
    }
}
function time(datavalue, options) {
    let timeValue;
    if (typeof options.timeConverter === 'function') {
        timeValue = options.timeConverter(datavalue.value);
    }
    else {
        timeValue = getTimeConverter(options.timeConverter)(datavalue.value);
    }
    if (options.keepRichValues) {
        const { timezone, before, after, precision, calendarmodel } = datavalue.value;
        return { time: timeValue, timezone, before, after, precision, calendarmodel };
    }
    else {
        return timeValue;
    }
}
// Each time converter should be able to accept 2 keys of arguments:
// - either datavalue.value objects (prefered as it gives access to the precision)
// - or the time string (datavalue.value.time)
const timeConverters = {
    iso: wikibaseTimeToISOString,
    epoch: wikibaseTimeToEpochTime,
    'simple-day': wikibaseTimeToSimpleDay,
    none: (wikibaseTime) => typeof wikibaseTime === 'string' ? wikibaseTime : wikibaseTime.time,
};
function getTimeConverter(key = 'iso') {
    const converter = timeConverters[key];
    if (!converter)
        throw new Error(`invalid converter key: ${JSON.stringify(key).substring(0, 100)}`);
    return converter;
}
const parsers = {
    commonsMedia: stringValue,
    'external-id': stringValue,
    'entity-schema': entity,
    'geo-shape': stringValue,
    'globe-coordinate': coordinate,
    math: stringValue,
    monolingualtext,
    'musical-notation': stringValue,
    quantity,
    string: stringValue,
    'tabular-data': stringValue,
    time,
    url: stringValue,
    'wikibase-form': entity,
    'wikibase-item': entity,
    'wikibase-lexeme': entity,
    'wikibase-property': entity,
    'wikibase-sense': entity,
};
const legacyParsers = {
    'musical notation': parsers['musical-notation'],
    // Known case: mediainfo won't have datatype="globe-coordinate", but datavalue.type="globecoordinate"
    globecoordinate: parsers['globe-coordinate'],
};
function parseSnak(datatype, datavalue, options) {
    let parser;
    if (datatype) {
        // @ts-expect-error legacyParsers datatypes aren't in DataValueByDataType
        parser = parsers[datatype] || legacyParsers[datatype];
    }
    else {
        parser = parsers[datavalue.type];
    }
    if (!parser) {
        throw new Error(`${datatype} claim parser isn't implemented. Please report to https://github.com/maxlath/wikibase-sdk/issues`);
    }
    return parser(datavalue, options);
}

function truthyPropertyClaims(propertyClaims) {
    const aggregate = {};
    for (const claim of propertyClaims) {
        const { rank } = claim;
        aggregate[rank] = aggregate[rank] || [];
        aggregate[rank].push(claim);
    }
    // on truthyness: https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Truthy_statements
    return aggregate.preferred || aggregate.normal || [];
}
function nonDeprecatedPropertyClaims(propertyClaims) {
    return propertyClaims.filter(claim => claim.rank !== 'deprecated');
}
function truthyClaims(claims) {
    const truthClaimsOnly = {};
    for (const [property, value] of typedEntries(claims)) {
        truthClaimsOnly[property] = truthyPropertyClaims(value);
    }
    return truthClaimsOnly;
}

var rankHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    nonDeprecatedPropertyClaims: nonDeprecatedPropertyClaims,
    truthyClaims: truthyClaims,
    truthyPropertyClaims: truthyPropertyClaims
});

/**
 * Tries to replace wikidata deep snak object by a simple value
 * e.g. a string, an entity Qid or an epoch time number
 * Expects a single snak object
 * Ex: entity.claims.P369[0]
 */
function simplifySnak(snak, options = {}) {
    const { keepTypes, keepSnaktypes, keepHashes } = parseKeepOptions(options);
    let value;
    const { datatype, datavalue, snaktype, hash } = snak;
    if (datavalue) {
        value = parseSnak(datatype, datavalue, options);
    }
    else {
        if (snaktype === 'somevalue')
            value = options.somevalueValue;
        else if (snaktype === 'novalue')
            value = options.novalueValue;
        else
            throw new Error('no datavalue or special snaktype found');
    }
    // No need to test keepHashes as it has no effect if neither
    // keepQualifiers or keepReferences is true
    if (keepTypes || keepSnaktypes || keepHashes) {
        // When keeping qualifiers or references, the value becomes an object
        // instead of a direct value
        const valueObj = { value };
        if (keepTypes)
            valueObj.type = datatype;
        if (keepSnaktypes)
            valueObj.snaktype = snaktype;
        if (keepHashes)
            valueObj.hash = hash;
        return valueObj;
    }
    else {
        return value;
    }
}
function simplifyClaim(claim, options = {}) {
    const { keepQualifiers, keepReferences, keepIds, keepTypes, keepSnaktypes, keepRanks } = parseKeepOptions(options);
    const { mainsnak, rank } = claim;
    const value = simplifySnak(mainsnak, options);
    // No need to test keepHashes as it has no effect if neither
    // keepQualifiers or keepReferences is true
    if (!(keepQualifiers || keepReferences || keepIds || keepTypes || keepSnaktypes || keepRanks)) {
        return value;
    }
    // When keeping other attributes, the value becomes an object instead of a direct value
    let valueObj = { value };
    if (isPlainObject(value) && 'value' in value) {
        valueObj = value;
    }
    else {
        valueObj = { value };
    }
    if (keepRanks)
        valueObj.rank = rank;
    if (keepQualifiers) {
        valueObj.qualifiers = simplifyQualifiers(claim.qualifiers, options);
    }
    if (keepReferences) {
        claim.references = claim.references || [];
        valueObj.references = simplifyReferences(claim.references, options);
    }
    if (keepIds)
        valueObj.id = claim.id;
    return valueObj;
}
function simplifyClaims(claims, options = {}) {
    const { propertyPrefix } = options;
    const simplified = {};
    for (let [propertyId, propertyArray] of typedEntries(claims)) {
        if (propertyPrefix) {
            propertyId = propertyPrefix + ':' + propertyId;
        }
        simplified[propertyId] = simplifyPropertyClaims(propertyArray, options);
    }
    return simplified;
}
function simplifyPropertyClaims(propertyClaims, options = {}) {
    // Avoid to throw on empty inputs to allow to simplify claims array
    // without having to know if the entity as claims for this property
    // Ex: simplifyPropertyClaims(entity.claims.P124211616)
    if (propertyClaims == null || propertyClaims.length === 0)
        return [];
    const { keepNonTruthy, keepNonDeprecated } = parseKeepOptions(options);
    const { minTimePrecision } = options;
    if (keepNonDeprecated) {
        propertyClaims = nonDeprecatedPropertyClaims(propertyClaims);
    }
    else if (!(keepNonTruthy)) {
        propertyClaims = truthyPropertyClaims(propertyClaims);
    }
    const simplifiedArray = [];
    for (const claim of propertyClaims) {
        const isDroppedClaim = timeSnakPrecisionIsTooLow(claim.mainsnak, minTimePrecision);
        if (!isDroppedClaim) {
            const simplifiedClaim = simplifyClaim(claim, options);
            // Filter-out novalue and somevalue claims,
            // unless a novalueValue or a somevalueValue is passed in options
            // Considers null as defined
            if (simplifiedClaim !== undefined)
                simplifiedArray.push(simplifiedClaim);
        }
    }
    // Deduplicate values unless we return a rich value object
    if (simplifiedArray[0] && typeof simplifiedArray[0] !== 'object') {
        return uniq(simplifiedArray);
    }
    else {
        return simplifiedArray;
    }
}
function simplifySnaks(snaks = {}, options = {}) {
    const { propertyPrefix } = options;
    const simplified = {};
    for (let [propertyId, propertyArray] of typedEntries(snaks)) {
        if (propertyPrefix) {
            propertyId = propertyPrefix + ':' + propertyId;
        }
        simplified[propertyId] = simplifyPropertySnaks(propertyArray, options);
    }
    return simplified;
}
function simplifyPropertySnaks(propertySnaks, options = {}) {
    if (propertySnaks == null || propertySnaks.length === 0)
        return [];
    const { minTimePrecision } = options;
    const simplifiedArray = [];
    for (const snak of propertySnaks) {
        const isDroppedSnak = timeSnakPrecisionIsTooLow(snak, minTimePrecision);
        if (!isDroppedSnak) {
            const simplifiedSnak = simplifySnak(snak, options);
            // Filter-out novalue and somevalue snaks,
            // unless a novalueValue or a somevalueValue is passed in options
            // Considers null as defined
            if (simplifiedSnak !== undefined)
                simplifiedArray.push(simplifiedSnak);
        }
    }
    // Deduplicate values unless we return a rich value object
    if (simplifiedArray[0] && typeof simplifiedArray[0] !== 'object') {
        return uniq(simplifiedArray);
    }
    else {
        return simplifiedArray;
    }
}
function simplifyQualifiers(qualifiers, options = {}) {
    return simplifySnaks(qualifiers, options);
}
function simplifyPropertyQualifiers(propertyQualifiers, options = {}) {
    return simplifyPropertySnaks(propertyQualifiers, options);
}
function simplifyQualifier(qualifier, options = {}) {
    return simplifySnak(qualifier, options);
}
function simplifyReferences(references, options = {}) {
    return references.map(reference => simplifyReference(reference, options));
}
function simplifyReference(reference, options = {}) {
    const snaks = simplifySnaks(reference.snaks, options);
    if (options.keepHashes)
        return { snaks, hash: reference.hash };
    else
        return snaks;
}
const keepOptions = ['keepQualifiers', 'keepReferences', 'keepIds', 'keepHashes', 'keepTypes', 'keepSnaktypes', 'keepRanks', 'keepRichValues'];
const parseKeepOptions = (options = {}) => {
    if (options.keepAll) {
        for (const optionName of keepOptions) {
            if (options[optionName] == null)
                options[optionName] = true;
        }
    }
    return options;
};
function timeSnakPrecisionIsTooLow(snak, minTimePrecision) {
    if (minTimePrecision == null)
        return false;
    if (snak.datatype !== 'time' || snak.snaktype !== 'value')
        return false;
    const { value } = snak.datavalue;
    return value.precision < minTimePrecision;
}

function singleValue(data) {
    const simplified = {};
    for (const [lang, obj] of typedEntries(data)) {
        simplified[lang] = obj != null ? obj.value : null;
    }
    return simplified;
}
function multiValue(data) {
    const simplified = {};
    for (const [lang, obj] of typedEntries(data)) {
        simplified[lang] = obj != null ? obj.map(o => o.value) : [];
    }
    return simplified;
}
function simplifyLabels(labels) {
    return singleValue(labels);
}
function simplifyDescriptions(descriptions) {
    return singleValue(descriptions);
}
function simplifyAliases(aliases) {
    return multiValue(aliases);
}
function simplifyLemmas(lemmas) {
    return singleValue(lemmas);
}
function simplifyRepresentations(representations) {
    return singleValue(representations);
}
function simplifyGlosses(glosses) {
    return singleValue(glosses);
}

const simplifyForm = (form, options = {}) => {
    const { id, representations, grammaticalFeatures, claims } = form;
    if (!isFormId(id))
        throw new Error('invalid form object');
    return {
        id,
        representations: simplifyRepresentations(representations),
        grammaticalFeatures,
        claims: simplifyClaims(claims, options),
    };
};
const simplifyForms = (forms, options = {}) => forms.map(form => simplifyForm(form, options));

const simplifySense = (sense, options = {}) => {
    const { id, glosses, claims } = sense;
    if (!isSenseId(id))
        throw new Error('invalid sense object');
    return {
        id,
        glosses: simplifyGlosses(glosses),
        claims: simplifyClaims(claims, options),
    };
};
function simplifySenses(senses, options = {}) {
    return senses.map(sense => simplifySense(sense, options));
}

// Generated by 'npm run update-wikimedia-constants'
const specialSites = {
    commonswiki: 'commons',
    foundationwiki: 'foundation',
    mediawikiwiki: 'mediawiki',
    metawiki: 'meta',
    outreachwiki: 'outreach',
    sourceswiki: 'sources',
    specieswiki: 'species',
    wikidatawiki: 'wikidata',
    wikifunctionswiki: 'wikifunctions',
    wikimaniawiki: 'wikimania',
};
const sites = [
    'aawiki',
    'aawikibooks',
    'aawiktionary',
    'abwiki',
    'abwiktionary',
    'acewiki',
    'adywiki',
    'afwiki',
    'afwikibooks',
    'afwikiquote',
    'afwiktionary',
    'akwiki',
    'akwikibooks',
    'akwiktionary',
    'alswiki',
    'alswikibooks',
    'alswikiquote',
    'alswiktionary',
    'altwiki',
    'amiwiki',
    'amwiki',
    'amwikiquote',
    'amwiktionary',
    'angwiki',
    'angwikibooks',
    'angwikiquote',
    'angwikisource',
    'angwiktionary',
    'anpwiki',
    'anwiki',
    'anwiktionary',
    'arcwiki',
    'arwiki',
    'arwikibooks',
    'arwikinews',
    'arwikiquote',
    'arwikisource',
    'arwikiversity',
    'arwiktionary',
    'arywiki',
    'arzwiki',
    'astwiki',
    'astwikibooks',
    'astwikiquote',
    'astwiktionary',
    'aswiki',
    'aswikibooks',
    'aswikiquote',
    'aswikisource',
    'aswiktionary',
    'atjwiki',
    'avkwiki',
    'avwiki',
    'avwiktionary',
    'awawiki',
    'aywiki',
    'aywikibooks',
    'aywiktionary',
    'azbwiki',
    'azwiki',
    'azwikibooks',
    'azwikiquote',
    'azwikisource',
    'azwiktionary',
    'banwiki',
    'banwikisource',
    'barwiki',
    'bat_smgwiki',
    'bawiki',
    'bawikibooks',
    'bbcwiki',
    'bclwiki',
    'bclwikiquote',
    'bclwiktionary',
    'bdrwiki',
    'be_x_oldwiki',
    'bewiki',
    'bewikibooks',
    'bewikiquote',
    'bewikisource',
    'bewiktionary',
    'bewwiki',
    'bgwiki',
    'bgwikibooks',
    'bgwikinews',
    'bgwikiquote',
    'bgwikisource',
    'bgwiktionary',
    'bhwiki',
    'bhwiktionary',
    'biwiki',
    'biwikibooks',
    'biwiktionary',
    'bjnwiki',
    'bjnwikiquote',
    'bjnwiktionary',
    'blkwiki',
    'blkwiktionary',
    'bmwiki',
    'bmwikibooks',
    'bmwikiquote',
    'bmwiktionary',
    'bnwiki',
    'bnwikibooks',
    'bnwikiquote',
    'bnwikisource',
    'bnwikivoyage',
    'bnwiktionary',
    'bowiki',
    'bowikibooks',
    'bowiktionary',
    'bpywiki',
    'brwiki',
    'brwikiquote',
    'brwikisource',
    'brwiktionary',
    'bswiki',
    'bswikibooks',
    'bswikinews',
    'bswikiquote',
    'bswikisource',
    'bswiktionary',
    'btmwiki',
    'btmwiktionary',
    'bugwiki',
    'bxrwiki',
    'cawiki',
    'cawikibooks',
    'cawikinews',
    'cawikiquote',
    'cawikisource',
    'cawiktionary',
    'cbk_zamwiki',
    'cdowiki',
    'cebwiki',
    'cewiki',
    'chowiki',
    'chrwiki',
    'chrwiktionary',
    'chwiki',
    'chwikibooks',
    'chwiktionary',
    'chywiki',
    'ckbwiki',
    'ckbwiktionary',
    'commonswiki',
    'cowiki',
    'cowikibooks',
    'cowikiquote',
    'cowiktionary',
    'crhwiki',
    'crwiki',
    'crwikiquote',
    'crwiktionary',
    'csbwiki',
    'csbwiktionary',
    'cswiki',
    'cswikibooks',
    'cswikinews',
    'cswikiquote',
    'cswikisource',
    'cswikiversity',
    'cswikivoyage',
    'cswiktionary',
    'cuwiki',
    'cvwiki',
    'cvwikibooks',
    'cywiki',
    'cywikibooks',
    'cywikiquote',
    'cywikisource',
    'cywiktionary',
    'dagwiki',
    'dawiki',
    'dawikibooks',
    'dawikiquote',
    'dawikisource',
    'dawiktionary',
    'dewiki',
    'dewikibooks',
    'dewikinews',
    'dewikiquote',
    'dewikisource',
    'dewikiversity',
    'dewikivoyage',
    'dewiktionary',
    'dgawiki',
    'dinwiki',
    'diqwiki',
    'diqwiktionary',
    'dsbwiki',
    'dtpwiki',
    'dtywiki',
    'dvwiki',
    'dvwiktionary',
    'dzwiki',
    'dzwiktionary',
    'eewiki',
    'elwiki',
    'elwikibooks',
    'elwikinews',
    'elwikiquote',
    'elwikisource',
    'elwikiversity',
    'elwikivoyage',
    'elwiktionary',
    'emlwiki',
    'enwiki',
    'enwikibooks',
    'enwikinews',
    'enwikiquote',
    'enwikisource',
    'enwikiversity',
    'enwikivoyage',
    'enwiktionary',
    'eowiki',
    'eowikibooks',
    'eowikinews',
    'eowikiquote',
    'eowikisource',
    'eowikivoyage',
    'eowiktionary',
    'eswiki',
    'eswikibooks',
    'eswikinews',
    'eswikiquote',
    'eswikisource',
    'eswikiversity',
    'eswikivoyage',
    'eswiktionary',
    'etwiki',
    'etwikibooks',
    'etwikiquote',
    'etwikisource',
    'etwiktionary',
    'euwiki',
    'euwikibooks',
    'euwikiquote',
    'euwikisource',
    'euwiktionary',
    'extwiki',
    'fatwiki',
    'fawiki',
    'fawikibooks',
    'fawikinews',
    'fawikiquote',
    'fawikisource',
    'fawikivoyage',
    'fawiktionary',
    'ffwiki',
    'fiu_vrowiki',
    'fiwiki',
    'fiwikibooks',
    'fiwikinews',
    'fiwikiquote',
    'fiwikisource',
    'fiwikiversity',
    'fiwikivoyage',
    'fiwiktionary',
    'fjwiki',
    'fjwiktionary',
    'fonwiki',
    'foundationwiki',
    'fowiki',
    'fowikisource',
    'fowiktionary',
    'frpwiki',
    'frrwiki',
    'frwiki',
    'frwikibooks',
    'frwikinews',
    'frwikiquote',
    'frwikisource',
    'frwikiversity',
    'frwikivoyage',
    'frwiktionary',
    'furwiki',
    'fywiki',
    'fywikibooks',
    'fywiktionary',
    'gagwiki',
    'ganwiki',
    'gawiki',
    'gawikibooks',
    'gawikiquote',
    'gawiktionary',
    'gcrwiki',
    'gdwiki',
    'gdwiktionary',
    'glkwiki',
    'glwiki',
    'glwikibooks',
    'glwikiquote',
    'glwikisource',
    'glwiktionary',
    'gnwiki',
    'gnwikibooks',
    'gnwiktionary',
    'gomwiki',
    'gomwiktionary',
    'gorwiki',
    'gorwikiquote',
    'gorwiktionary',
    'gotwiki',
    'gotwikibooks',
    'gpewiki',
    'gucwiki',
    'gurwiki',
    'guwiki',
    'guwikibooks',
    'guwikiquote',
    'guwikisource',
    'guwiktionary',
    'guwwiki',
    'guwwikinews',
    'guwwikiquote',
    'guwwiktionary',
    'gvwiki',
    'gvwiktionary',
    'hakwiki',
    'hawiki',
    'hawiktionary',
    'hawwiki',
    'hewiki',
    'hewikibooks',
    'hewikinews',
    'hewikiquote',
    'hewikisource',
    'hewikivoyage',
    'hewiktionary',
    'hifwiki',
    'hifwiktionary',
    'hiwiki',
    'hiwikibooks',
    'hiwikiquote',
    'hiwikisource',
    'hiwikiversity',
    'hiwikivoyage',
    'hiwiktionary',
    'howiki',
    'hrwiki',
    'hrwikibooks',
    'hrwikiquote',
    'hrwikisource',
    'hrwiktionary',
    'hsbwiki',
    'hsbwiktionary',
    'htwiki',
    'htwikisource',
    'huwiki',
    'huwikibooks',
    'huwikinews',
    'huwikiquote',
    'huwikisource',
    'huwiktionary',
    'hywiki',
    'hywikibooks',
    'hywikiquote',
    'hywikisource',
    'hywiktionary',
    'hywwiki',
    'hzwiki',
    'iawiki',
    'iawikibooks',
    'iawiktionary',
    'idwiki',
    'idwikibooks',
    'idwikiquote',
    'idwikisource',
    'idwiktionary',
    'iewiki',
    'iewikibooks',
    'iewiktionary',
    'iglwiki',
    'igwiki',
    'igwikiquote',
    'igwiktionary',
    'iiwiki',
    'ikwiki',
    'ikwiktionary',
    'ilowiki',
    'inhwiki',
    'iowiki',
    'iowiktionary',
    'iswiki',
    'iswikibooks',
    'iswikiquote',
    'iswikisource',
    'iswiktionary',
    'itwiki',
    'itwikibooks',
    'itwikinews',
    'itwikiquote',
    'itwikisource',
    'itwikiversity',
    'itwikivoyage',
    'itwiktionary',
    'iuwiki',
    'iuwiktionary',
    'jamwiki',
    'jawiki',
    'jawikibooks',
    'jawikinews',
    'jawikiquote',
    'jawikisource',
    'jawikiversity',
    'jawikivoyage',
    'jawiktionary',
    'jbowiki',
    'jbowiktionary',
    'jvwiki',
    'jvwikisource',
    'jvwiktionary',
    'kaawiki',
    'kaawiktionary',
    'kabwiki',
    'kawiki',
    'kawikibooks',
    'kawikiquote',
    'kawikisource',
    'kawiktionary',
    'kbdwiki',
    'kbdwiktionary',
    'kbpwiki',
    'kcgwiki',
    'kcgwiktionary',
    'kgewiki',
    'kgwiki',
    'kiwiki',
    'kjwiki',
    'kkwiki',
    'kkwikibooks',
    'kkwikiquote',
    'kkwiktionary',
    'klwiki',
    'klwiktionary',
    'kmwiki',
    'kmwikibooks',
    'kmwiktionary',
    'knwiki',
    'knwikibooks',
    'knwikiquote',
    'knwikisource',
    'knwiktionary',
    'koiwiki',
    'kowiki',
    'kowikibooks',
    'kowikinews',
    'kowikiquote',
    'kowikisource',
    'kowikiversity',
    'kowiktionary',
    'krcwiki',
    'krwiki',
    'krwikiquote',
    'kshwiki',
    'kswiki',
    'kswikibooks',
    'kswikiquote',
    'kswiktionary',
    'kuswiki',
    'kuwiki',
    'kuwikibooks',
    'kuwikiquote',
    'kuwiktionary',
    'kvwiki',
    'kwwiki',
    'kwwikiquote',
    'kwwiktionary',
    'kywiki',
    'kywikibooks',
    'kywikiquote',
    'kywiktionary',
    'ladwiki',
    'lawiki',
    'lawikibooks',
    'lawikiquote',
    'lawikisource',
    'lawiktionary',
    'lbewiki',
    'lbwiki',
    'lbwikibooks',
    'lbwikiquote',
    'lbwiktionary',
    'lezwiki',
    'lfnwiki',
    'lgwiki',
    'lijwiki',
    'lijwikisource',
    'liwiki',
    'liwikibooks',
    'liwikinews',
    'liwikiquote',
    'liwikisource',
    'liwiktionary',
    'lldwiki',
    'lmowiki',
    'lmowiktionary',
    'lnwiki',
    'lnwikibooks',
    'lnwiktionary',
    'lowiki',
    'lowiktionary',
    'lrcwiki',
    'ltgwiki',
    'ltwiki',
    'ltwikibooks',
    'ltwikiquote',
    'ltwikisource',
    'ltwiktionary',
    'lvwiki',
    'lvwikibooks',
    'lvwiktionary',
    'madwiki',
    'madwiktionary',
    'maiwiki',
    'map_bmswiki',
    'mdfwiki',
    'mediawikiwiki',
    'metawiki',
    'mgwiki',
    'mgwikibooks',
    'mgwiktionary',
    'mhrwiki',
    'mhwiki',
    'mhwiktionary',
    'minwiki',
    'minwiktionary',
    'miwiki',
    'miwikibooks',
    'miwiktionary',
    'mkwiki',
    'mkwikibooks',
    'mkwikisource',
    'mkwiktionary',
    'mlwiki',
    'mlwikibooks',
    'mlwikiquote',
    'mlwikisource',
    'mlwiktionary',
    'mniwiki',
    'mniwiktionary',
    'mnwiki',
    'mnwikibooks',
    'mnwiktionary',
    'mnwwiki',
    'mnwwiktionary',
    'moswiki',
    'mowiki',
    'mowiktionary',
    'mrjwiki',
    'mrwiki',
    'mrwikibooks',
    'mrwikiquote',
    'mrwikisource',
    'mrwiktionary',
    'mswiki',
    'mswikibooks',
    'mswikisource',
    'mswiktionary',
    'mtwiki',
    'mtwiktionary',
    'muswiki',
    'mwlwiki',
    'myvwiki',
    'mywiki',
    'mywikibooks',
    'mywikisource',
    'mywiktionary',
    'mznwiki',
    'nahwiki',
    'nahwikibooks',
    'nahwiktionary',
    'napwiki',
    'napwikisource',
    'nawiki',
    'nawikibooks',
    'nawikiquote',
    'nawiktionary',
    'nds_nlwiki',
    'ndswiki',
    'ndswikibooks',
    'ndswikiquote',
    'ndswiktionary',
    'newiki',
    'newikibooks',
    'newiktionary',
    'newwiki',
    'ngwiki',
    'niawiki',
    'niawiktionary',
    'nlwiki',
    'nlwikibooks',
    'nlwikinews',
    'nlwikiquote',
    'nlwikisource',
    'nlwikivoyage',
    'nlwiktionary',
    'nnwiki',
    'nnwikiquote',
    'nnwiktionary',
    'novwiki',
    'nowiki',
    'nowikibooks',
    'nowikinews',
    'nowikiquote',
    'nowikisource',
    'nowiktionary',
    'nqowiki',
    'nrmwiki',
    'nsowiki',
    'nvwiki',
    'nywiki',
    'ocwiki',
    'ocwikibooks',
    'ocwiktionary',
    'olowiki',
    'omwiki',
    'omwiktionary',
    'orwiki',
    'orwikisource',
    'orwiktionary',
    'oswiki',
    'outreachwiki',
    'pagwiki',
    'pamwiki',
    'papwiki',
    'pawiki',
    'pawikibooks',
    'pawikisource',
    'pawiktionary',
    'pcdwiki',
    'pcmwiki',
    'pdcwiki',
    'pflwiki',
    'pihwiki',
    'piwiki',
    'piwiktionary',
    'plwiki',
    'plwikibooks',
    'plwikinews',
    'plwikiquote',
    'plwikisource',
    'plwikivoyage',
    'plwiktionary',
    'pmswiki',
    'pmswikisource',
    'pnbwiki',
    'pnbwiktionary',
    'pntwiki',
    'pswiki',
    'pswikibooks',
    'pswikivoyage',
    'pswiktionary',
    'ptwiki',
    'ptwikibooks',
    'ptwikinews',
    'ptwikiquote',
    'ptwikisource',
    'ptwikiversity',
    'ptwikivoyage',
    'ptwiktionary',
    'pwnwiki',
    'quwiki',
    'quwikibooks',
    'quwikiquote',
    'quwiktionary',
    'rmwiki',
    'rmwikibooks',
    'rmwiktionary',
    'rmywiki',
    'rnwiki',
    'rnwiktionary',
    'roa_rupwiki',
    'roa_rupwiktionary',
    'roa_tarawiki',
    'rowiki',
    'rowikibooks',
    'rowikinews',
    'rowikiquote',
    'rowikisource',
    'rowikivoyage',
    'rowiktionary',
    'ruewiki',
    'ruwiki',
    'ruwikibooks',
    'ruwikinews',
    'ruwikiquote',
    'ruwikisource',
    'ruwikiversity',
    'ruwikivoyage',
    'ruwiktionary',
    'rwwiki',
    'rwwiktionary',
    'sahwiki',
    'sahwikiquote',
    'sahwikisource',
    'satwiki',
    'sawiki',
    'sawikibooks',
    'sawikiquote',
    'sawikisource',
    'sawiktionary',
    'scnwiki',
    'scnwiktionary',
    'scowiki',
    'scwiki',
    'scwiktionary',
    'sdwiki',
    'sdwikinews',
    'sdwiktionary',
    'sewiki',
    'sewikibooks',
    'sgwiki',
    'sgwiktionary',
    'shiwiki',
    'shnwiki',
    'shnwikibooks',
    'shnwikinews',
    'shnwikivoyage',
    'shnwiktionary',
    'shwiki',
    'shwiktionary',
    'shywiktionary',
    'simplewiki',
    'simplewikibooks',
    'simplewikiquote',
    'simplewiktionary',
    'siwiki',
    'siwikibooks',
    'siwiktionary',
    'skrwiki',
    'skrwiktionary',
    'skwiki',
    'skwikibooks',
    'skwikiquote',
    'skwikisource',
    'skwiktionary',
    'slwiki',
    'slwikibooks',
    'slwikiquote',
    'slwikisource',
    'slwikiversity',
    'slwiktionary',
    'smnwiki',
    'smwiki',
    'smwiktionary',
    'snwiki',
    'snwiktionary',
    'sourceswiki',
    'sowiki',
    'sowiktionary',
    'specieswiki',
    'sqwiki',
    'sqwikibooks',
    'sqwikinews',
    'sqwikiquote',
    'sqwiktionary',
    'srnwiki',
    'srwiki',
    'srwikibooks',
    'srwikinews',
    'srwikiquote',
    'srwikisource',
    'srwiktionary',
    'sswiki',
    'sswiktionary',
    'stqwiki',
    'stwiki',
    'stwiktionary',
    'suwiki',
    'suwikibooks',
    'suwikiquote',
    'suwikisource',
    'suwiktionary',
    'svwiki',
    'svwikibooks',
    'svwikinews',
    'svwikiquote',
    'svwikisource',
    'svwikiversity',
    'svwikivoyage',
    'svwiktionary',
    'swwiki',
    'swwikibooks',
    'swwiktionary',
    'szlwiki',
    'szywiki',
    'tawiki',
    'tawikibooks',
    'tawikinews',
    'tawikiquote',
    'tawikisource',
    'tawiktionary',
    'taywiki',
    'tcywiki',
    'tetwiki',
    'tewiki',
    'tewikibooks',
    'tewikiquote',
    'tewikisource',
    'tewiktionary',
    'tgwiki',
    'tgwikibooks',
    'tgwiktionary',
    'thwiki',
    'thwikibooks',
    'thwikinews',
    'thwikiquote',
    'thwikisource',
    'thwiktionary',
    'tiwiki',
    'tiwiktionary',
    'tkwiki',
    'tkwikibooks',
    'tkwikiquote',
    'tkwiktionary',
    'tlwiki',
    'tlwikibooks',
    'tlwikiquote',
    'tlwiktionary',
    'tlywiki',
    'tnwiki',
    'tnwiktionary',
    'towiki',
    'towiktionary',
    'tpiwiki',
    'tpiwiktionary',
    'trvwiki',
    'trwiki',
    'trwikibooks',
    'trwikinews',
    'trwikiquote',
    'trwikisource',
    'trwikivoyage',
    'trwiktionary',
    'tswiki',
    'tswiktionary',
    'ttwiki',
    'ttwikibooks',
    'ttwikiquote',
    'ttwiktionary',
    'tumwiki',
    'twwiki',
    'twwiktionary',
    'tyvwiki',
    'tywiki',
    'udmwiki',
    'ugwiki',
    'ugwikibooks',
    'ugwikiquote',
    'ugwiktionary',
    'ukwiki',
    'ukwikibooks',
    'ukwikinews',
    'ukwikiquote',
    'ukwikisource',
    'ukwikivoyage',
    'ukwiktionary',
    'urwiki',
    'urwikibooks',
    'urwikiquote',
    'urwiktionary',
    'uzwiki',
    'uzwikibooks',
    'uzwikiquote',
    'uzwiktionary',
    'vecwiki',
    'vecwikisource',
    'vecwiktionary',
    'vepwiki',
    'vewiki',
    'viwiki',
    'viwikibooks',
    'viwikiquote',
    'viwikisource',
    'viwikivoyage',
    'viwiktionary',
    'vlswiki',
    'vowiki',
    'vowikibooks',
    'vowikiquote',
    'vowiktionary',
    'warwiki',
    'wawiki',
    'wawikibooks',
    'wawikisource',
    'wawiktionary',
    'wikidatawiki',
    'wikifunctionswiki',
    'wikimaniawiki',
    'wowiki',
    'wowikiquote',
    'wowiktionary',
    'wuuwiki',
    'xalwiki',
    'xhwiki',
    'xhwikibooks',
    'xhwiktionary',
    'xmfwiki',
    'yiwiki',
    'yiwikisource',
    'yiwiktionary',
    'yowiki',
    'yowikibooks',
    'yowiktionary',
    'yuewiktionary',
    'zawiki',
    'zawikibooks',
    'zawikiquote',
    'zawiktionary',
    'zeawiki',
    'zghwiki',
    'zh_classicalwiki',
    'zh_min_nanwiki',
    'zh_min_nanwikibooks',
    'zh_min_nanwikiquote',
    'zh_min_nanwikisource',
    'zh_min_nanwiktionary',
    'zh_yuewiki',
    'zhwiki',
    'zhwikibooks',
    'zhwikinews',
    'zhwikiquote',
    'zhwikisource',
    'zhwikiversity',
    'zhwikivoyage',
    'zhwiktionary',
    'zuwiki',
    'zuwikibooks',
    'zuwiktionary',
];

const wikidataBase = 'https://www.wikidata.org/wiki/';
function getSitelinkUrl({ site, title }) {
    rejectObsoleteInterface(arguments);
    if (!site)
        throw new Error('missing a site');
    if (!title)
        throw new Error('missing a title');
    if (isAKey(siteUrlBuilders, site)) {
        return siteUrlBuilders[site](title);
    }
    const shortSiteKey = site.replace(/wiki$/, '');
    if (isAKey(siteUrlBuilders, shortSiteKey)) {
        return siteUrlBuilders[shortSiteKey](title);
    }
    const { lang, project } = getSitelinkData(site);
    title = fixedEncodeURIComponent(replaceSpaceByUnderscores(title));
    return `https://${lang}.${project}.org/wiki/${title}`;
}
const wikimediaSite = (subdomain) => (title) => `https://${subdomain}.wikimedia.org/wiki/${title}`;
const siteUrlBuilders = {
    commons: wikimediaSite('commons'),
    foundation: wikimediaSite('foundation'),
    mediawiki: title => `https://www.mediawiki.org/wiki/${title}`,
    meta: wikimediaSite('meta'),
    outreach: wikimediaSite('outreach'),
    sources: title => `https://wikisource.org/wiki/${title}`,
    species: wikimediaSite('species'),
    wikidata: entityId => {
        const prefix = prefixByEntityLetter[entityId[0]];
        let title = prefix ? `${prefix}:${entityId}` : entityId;
        // Required for forms and senses
        title = title.replace('-', '#');
        return `${wikidataBase}${title}`;
    },
    wikifunctions: wikimediaSite('wikifunctions'),
    wikimania: wikimediaSite('wikimania'),
};
const prefixByEntityLetter = {
    E: 'EntitySchema',
    L: 'Lexeme',
    P: 'Property',
};
const sitelinkUrlPattern = /^https?:\/\/([\w-]{2,10})\.(\w+)\.org\/\w+\/(.*)/;
function getSitelinkData(site) {
    if (site.startsWith('http')) {
        const url = site;
        const matchData = url.match(sitelinkUrlPattern);
        if (!matchData)
            throw new Error(`invalid sitelink url: ${url}`);
        let [lang, project, title] = matchData.slice(1);
        title = decodeURIComponent(title);
        if (lang === 'commons') {
            return { lang: 'en', project: 'commons', key: 'commons', title, url };
        }
        if (!isOfType(projectNames, project)) {
            throw new Error(`project is unknown: ${project}`);
        }
        // Known case: wikidata, mediawiki
        if (lang === 'www') {
            return { lang: 'en', project, key: project, title, url };
        }
        // Support multi-parts language codes, such as be_x_old
        const sitelang = lang.replace(/-/g, '_');
        const key = `${sitelang}${project}`.replace('wikipedia', 'wiki');
        return { lang, project, key, title, url };
    }
    else {
        if (isAKey(specialSites, site)) {
            const project = specialSites[site];
            return { lang: 'en', project, key: site };
        }
        if (!isOfType(sites, site)) {
            throw new Error(`site not found: ${site}. Updating wikibase-sdk to a more recent version might fix the issue.`);
        }
        let [lang, projectSuffix, rest] = site.split('wik');
        // Detecting cases like 'frwikiwiki' that would return [ 'fr', 'i', 'i' ]
        if (rest != null)
            throw new Error(`invalid sitelink key: ${site}`);
        // Support keys such as be_x_oldwiki, which refers to be-x-old.wikipedia.org
        lang = lang.replace(/_/g, '-');
        const project = projectsBySuffix[projectSuffix];
        if (!project)
            throw new Error(`sitelink project not found: ${project}`);
        return { lang, project, key: site };
    }
}
const isSite = (site) => isOfType(sites, site);
/** @deprecated use isSite */
const isSitelinkKey = isSite;
const projectsBySuffix = {
    i: 'wikipedia',
    isource: 'wikisource',
    iquote: 'wikiquote',
    tionary: 'wiktionary',
    ibooks: 'wikibooks',
    iversity: 'wikiversity',
    ivoyage: 'wikivoyage',
    inews: 'wikinews',
};
const projectNames = [
    ...Object.values(projectsBySuffix),
    ...Object.values(specialSites),
];

var sitelinksHelpers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getSitelinkData: getSitelinkData,
    getSitelinkUrl: getSitelinkUrl,
    isSite: isSite,
    isSitelinkKey: isSitelinkKey
});

function simplifySitelinks(sitelinks, options = {}) {
    let { addUrl, keepBadges, keepAll } = options;
    keepBadges = keepBadges || keepAll;
    return typedKeys(sitelinks).reduce(aggregateValues({
        sitelinks,
        addUrl,
        keepBadges,
    }), {});
}
const aggregateValues = ({ sitelinks, addUrl, keepBadges }) => (index, key) => {
    // Accomodating for wikibase-cli, which might set the sitelink to null
    // to signify that a requested sitelink was not found
    if (sitelinks[key] == null) {
        index[key] = sitelinks[key];
        return index;
    }
    const { title, badges } = sitelinks[key];
    if (addUrl || keepBadges) {
        index[key] = { title };
        if (addUrl)
            index[key].url = getSitelinkUrl({ site: key, title });
        if (keepBadges)
            index[key].badges = badges;
    }
    else {
        index[key] = title;
    }
    return index;
};

const simplify$1 = {
    labels: simplifyLabels,
    descriptions: simplifyDescriptions,
    aliases: simplifyAliases,
    claims: simplifyClaims,
    statements: simplifyClaims,
    sitelinks: simplifySitelinks,
    lemmas: simplifyLemmas,
    forms: simplifyForms,
    senses: simplifySenses,
};
const simplifyEntity = (entity, options = {}) => {
    const { type } = entity;
    if (!type)
        throw new Error('missing entity type');
    const simplified = {
        id: entity.id,
        type,
        modified: entity.modified,
    };
    if (type === 'item') {
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'aliases');
        simplifyIfDefined(entity, simplified, 'claims', options);
        simplifyIfDefined(entity, simplified, 'sitelinks', options);
    }
    else if (type === 'property') {
        simplified.datatype = entity.datatype;
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'aliases');
        simplifyIfDefined(entity, simplified, 'claims', options);
    }
    else if (type === 'lexeme') {
        simplifyIfDefined(entity, simplified, 'lemmas');
        simplified.lexicalCategory = entity.lexicalCategory;
        simplified.language = entity.language;
        simplifyIfDefined(entity, simplified, 'claims', options);
        simplifyIfDefined(entity, simplified, 'forms', options);
        simplifyIfDefined(entity, simplified, 'senses', options);
    }
    else if (type === 'mediainfo') {
        simplifyIfDefined(entity, simplified, 'labels');
        simplifyIfDefined(entity, simplified, 'descriptions');
        simplifyIfDefined(entity, simplified, 'statements', options);
    }
    return simplified;
};
const simplifyIfDefined = (entity, simplified, attribute, options) => {
    if (entity[attribute] != null) {
        simplified[attribute] = simplify$1[attribute](entity[attribute], options);
    }
};
const simplifyEntities = (entities, options = {}) => {
    // @ts-expect-error support downloaded json directly
    if (entities.entities)
        entities = entities.entities;
    const { entityPrefix } = options;
    // TODO: key as string is only a best effort.
    // key is either EntityID or `${prefix}:${EntityId}` based on options.entityPrefix
    const result = {};
    for (const [key, entity] of Object.entries(entities)) {
        const resultKey = entityPrefix ? `${entityPrefix}:${key}` : key;
        result[resultKey] = simplifyEntity(entity, options);
    }
    return result;
};

function entities(res) {
    // @ts-expect-error Legacy convenience for the time the 'request' lib was all the rage
    res = res.body || res;
    const { entities } = res;
    return simplifyEntities(entities);
}
function pagesTitles(res) {
    // @ts-expect-error Same behavior as above
    res = res.body || res;
    return res.query.search.map(result => result.title);
}

var parse = /*#__PURE__*/Object.freeze({
    __proto__: null,
    entities: entities,
    pagesTitles: pagesTitles
});

function simplifySparqlResults(input) {
    if (typeof input === 'string') {
        input = JSON.parse(input);
    }
    const { vars } = input.head;
    const results = input.results.bindings;
    const { richVars, associatedVars, standaloneVars } = identifyVars(vars);
    const simplifiedSparqlResults = results.map(result => getSimplifiedResult(richVars, associatedVars, standaloneVars, result));
    return simplifiedSparqlResults;
}
function parseValue(valueObj) {
    // blank nodes will be filtered-out in order to get things simple
    if (!valueObj || valueObj.type === 'bnode')
        return null;
    const { value } = valueObj;
    if (valueObj.type === 'uri')
        return parseUri(value);
    const datatype = (valueObj.datatype || '').replace('http://www.w3.org/2001/XMLSchema#', '');
    if (datatype === 'decimal' || datatype === 'integer' || datatype === 'float' || datatype === 'double') {
        return parseFloat(value);
    }
    if (datatype === 'boolean') {
        return value === 'true';
    }
    // return the raw value if the datatype is missing
    return value;
}
function parseUri(uri) {
    // ex: http://www.wikidata.org/entity/statement/
    if (uri.match(/http.*\/entity\/statement\//)) {
        return convertStatementUriToGuid(uri);
    }
    return uri
        // ex: http://www.wikidata.org/entity/
        .replace(/^https?:\/\/.*\/entity\//, '')
        // ex: http://www.wikidata.org/prop/direct/
        .replace(/^https?:\/\/.*\/prop\/direct\//, '');
}
function convertStatementUriToGuid(uri) {
    // ex: http://www.wikidata.org/entity/statement/
    uri = uri.replace(/^https?:\/\/.*\/entity\/statement\//, '');
    const parts = uri.split('-');
    return parts[0] + '$' + parts.slice(1).join('-');
}
function identifyVars(vars) {
    let richVars = vars.filter(varName => {
        const isAssociatedPattern = new RegExp(`^${varName}[A-Z]\\w+`);
        return vars.some(v => isAssociatedPattern.test(v));
    });
    richVars = richVars.filter(richVar => {
        return !richVars.some(otherRichVar => {
            return richVar !== otherRichVar && richVar.startsWith(otherRichVar);
        });
    });
    const associatedVarPattern = new RegExp(`^(${richVars.join('|')})[A-Z]`);
    const associatedVars = vars.filter(varName => associatedVarPattern.test(varName));
    const standaloneVars = vars.filter(varName => {
        return !richVars.includes(varName) && !associatedVarPattern.test(varName);
    });
    return { richVars, associatedVars, standaloneVars };
}
function getSimplifiedResult(richVars, associatedVars, standaloneVars, input) {
    const simplifiedResult = {};
    for (const varName of richVars) {
        const richVarData = {};
        const value = parseValue(input[varName]);
        if (value != null)
            richVarData.value = value;
        for (const associatedVarName of associatedVars) {
            if (associatedVarName.startsWith(varName))
                addAssociatedValue(input, varName, associatedVarName, richVarData);
        }
        if (Object.keys(richVarData).length > 0)
            simplifiedResult[varName] = richVarData;
    }
    for (const varName of standaloneVars) {
        const value = parseValue(input[varName]);
        if (value != null)
            simplifiedResult[varName] = value;
    }
    return simplifiedResult;
}
function addAssociatedValue(input, varName, associatedVarName, richVarData) {
    // ex: propertyType => Type
    let shortAssociatedVarName = associatedVarName.split(varName)[1];
    // ex: Type => type
    shortAssociatedVarName = shortAssociatedVarName[0].toLowerCase() + shortAssociatedVarName.slice(1);
    // ex: altLabel => aliases
    shortAssociatedVarName = shortAssociatedVarName === 'altLabel' ? 'aliases' : shortAssociatedVarName;
    const associatedVarData = input[associatedVarName];
    if (associatedVarData != null)
        richVarData[shortAssociatedVarName] = associatedVarData.value;
}

var simplify = /*#__PURE__*/Object.freeze({
    __proto__: null,
    aliases: simplifyAliases,
    claim: simplifyClaim,
    claims: simplifyClaims,
    descriptions: simplifyDescriptions,
    entities: simplifyEntities,
    entity: simplifyEntity,
    form: simplifyForm,
    forms: simplifyForms,
    glosses: simplifyGlosses,
    labels: simplifyLabels,
    lemmas: simplifyLemmas,
    propertyClaims: simplifyPropertyClaims,
    propertyQualifiers: simplifyPropertyQualifiers,
    qualifier: simplifyQualifier,
    qualifiers: simplifyQualifiers,
    reference: simplifyReference,
    references: simplifyReferences,
    representations: simplifyRepresentations,
    sense: simplifySense,
    senses: simplifySenses,
    sitelinks: simplifySitelinks,
    snak: simplifySnak,
    sparqlResults: simplifySparqlResults
});

// See https://www.wikidata.org/w/api.php?action=help&modules=query%2Bsearch
const namespacePattern = /^\d+[|\d]*$/;
function cirrusSearchPagesFactory(buildUrl) {
    return function cirrusSearchPages(options) {
        rejectObsoleteInterface(arguments);
        // Accept sr parameters with or without prefix
        for (const [key, value] of Object.entries(options)) {
            if (key.startsWith('sr')) {
                const shortKey = key.replace(/^sr/, '');
                if (options[shortKey] != null)
                    throw new Error(`${shortKey} and ${key} are the same`);
                options[shortKey] = value;
            }
        }
        const { search, haswbstatement, format = 'json', limit, offset, profile, sort } = options;
        let { namespace, prop } = options;
        if (!(search || haswbstatement))
            throw new Error('missing "search" or "haswbstatement" parameter');
        let srsearch = '';
        if (search)
            srsearch += search;
        if (haswbstatement) {
            const statements = haswbstatement instanceof Array ? haswbstatement : [haswbstatement];
            for (const statement of statements) {
                if (statement[0] === '-')
                    srsearch += ` -haswbstatement:${statement.slice(1)}`;
                else
                    srsearch += ` haswbstatement:${statement}`;
            }
        }
        if (limit != null && (typeof limit !== 'number' || limit < 1)) {
            throw new Error(`invalid limit: ${limit}`);
        }
        if (offset != null && (typeof offset !== 'number' || offset < 0)) {
            throw new Error(`invalid offset: ${offset}`);
        }
        if (namespace instanceof Array)
            namespace = namespace.join('|');
        else if (typeof namespace === 'number')
            namespace = namespace.toString();
        if (namespace && !namespacePattern.test(namespace)) {
            throw new Error(`invalid namespace: ${namespace}`);
        }
        if (profile != null && typeof profile !== 'string') {
            throw new Error(`invalid profile: ${profile} (${typeof profile}, expected string)`);
        }
        if (sort != null && typeof sort !== 'string') {
            throw new Error(`invalid sort: ${sort} (${typeof sort}, expected string)`);
        }
        let srprop;
        if (prop != null) {
            if (prop instanceof Array)
                prop = prop.join('|');
            if (typeof prop !== 'string') {
                throw new Error(`invalid prop: ${prop} (${typeof prop}, expected string)`);
            }
            srprop = prop.toString();
        }
        return buildUrl({
            action: 'query',
            list: 'search',
            srsearch: srsearch.trim(),
            format,
            srnamespace: namespace,
            srlimit: limit,
            sroffset: offset,
            srqiprofile: profile,
            srsort: sort,
            srprop,
        });
    };
}

/** Ensure both via TypeScript and at runtime that the input value is of the expected type. Throws error when it is not */
function validate(name, testFn) {
    return function (value) {
        if (!testFn(value))
            throw new Error(`invalid ${name}: ${value} (type: ${typeOf(value)})`);
    };
}
const entityId = validate('entity id', isEntityId);
const propertyId = validate('property id', isPropertyId);
const entityPageTitle = validate('entity page title', isEntityPageTitle);
const revisionId = validate('revision id', isRevisionId);
function typeOf(value) {
    // just handling what differes from typeof
    const type = typeof value;
    if (type === 'object') {
        if (value === null)
            return 'null';
        if (value instanceof Array)
            return 'array';
        if (value instanceof Promise)
            return 'promise';
    }
    if (type === 'number') {
        if (Number.isNaN(value))
            return 'NaN';
    }
    return type;
}

function getEntitiesFactory(buildUrl) {
    return function getEntities({ ids, languages, props, format = 'json', redirects, }) {
        rejectObsoleteInterface(arguments);
        // ids can't be let empty
        if (!(ids && ids.length > 0))
            throw new Error('no id provided');
        // Allow to pass ids as a single string
        ids = forceArray(ids);
        ids.forEach(o => entityId(o));
        if (ids.length > 50) {
            console.warn(`getEntities accepts 50 ids max to match Wikidata API limitations:
      this request won't get all the desired entities.
      You can use getManyEntities instead to generate several request urls
      to work around this limitation`);
        }
        // Properties can be either one property as a string
        // or an array or properties;
        // either case me just want to deal with arrays
        const query = {
            action: 'wbgetentities',
            ids: ids.join('|'),
            format,
        };
        if (redirects === false)
            query.redirects = 'no';
        if (languages) {
            languages = forceArray(languages);
            query.languages = languages.join('|');
        }
        if (props && props.length > 0)
            query.props = forceArray(props).join('|');
        return buildUrl(query);
    };
}

function getEntitiesFromSitelinksFactory(buildUrl) {
    return function getEntitiesFromSitelinks({ titles, sites, languages, props, format = 'json', redirects, }) {
        rejectObsoleteInterface(arguments);
        // titles cant be let empty
        if (!(titles && titles.length > 0))
            throw new Error('no titles provided');
        // default to the English Wikipedia
        if (!(sites && sites.length > 0))
            sites = ['enwiki'];
        // Properties can be either one property as a string
        // or an array or properties;
        // either case me just want to deal with arrays
        titles = forceArray(titles);
        sites = forceArray(sites).map(parseSite);
        props = forceArray(props);
        const query = {
            action: 'wbgetentities',
            titles: titles.join('|'),
            sites: sites.join('|'),
            format,
        };
        // Normalizing only works if there is only one site and title
        if (sites.length === 1 && titles.length === 1) {
            query.normalize = true;
        }
        if (languages) {
            languages = forceArray(languages);
            query.languages = languages.join('|');
        }
        if (props.length > 0) {
            query.props = props.join('|');
        }
        if (redirects === false)
            query.redirects = 'no';
        return buildUrl(query);
    };
}
/** convert language code to Wikipedia sitelink code */
function parseSite(site) {
    if (isOfType(sites, site)) {
        return site;
    }
    else {
        const wiki = site.replace(/-/g, '_') + 'wiki';
        return wiki;
    }
}

function getEntityRevisionFactory(instance, wgScriptPath) {
    return function getEntityRevision({ id, revision }) {
        rejectObsoleteInterface(arguments);
        entityId(id);
        revisionId(revision);
        return `${instance}/${wgScriptPath}/index.php?title=Special:EntityData/${id}.json&revision=${revision}`;
    };
}

function getManyEntitiesFactory(buildUrl) {
    const getEntities = getEntitiesFactory(buildUrl);
    return function getManyEntities({ ids, languages, props, format, redirects }) {
        rejectObsoleteInterface(arguments);
        if (!(ids instanceof Array))
            throw new Error('getManyEntities expects an array of ids');
        return getChunks(ids)
            .map(idsGroup => getEntities({ ids: idsGroup, languages, props, format, redirects }));
    };
}
function getChunks(ids) {
    const chunks = [];
    while (ids.length > 0) {
        const chunk = ids.slice(0, 50);
        ids = ids.slice(50);
        chunks.push(chunk);
    }
    return chunks;
}

function sparqlQueryFactory(sparqlEndpoint) {
    return function sparqlQuery(sparql) {
        const query = fixedEncodeURIComponent(sparql);
        return `${sparqlEndpoint}?format=json&query=${query}`;
    };
}

// Fiter-out properties. Can't be filtered by
// `?subject a wikibase:Item`, as those triples are omitted
// https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#WDQS_data_differences
const itemsOnly = 'FILTER NOT EXISTS { ?subject rdf:type wikibase:Property . } ';
const getReverseClaimsFactory = (sparqlEndpoint) => {
    const sparqlQuery = sparqlQueryFactory(sparqlEndpoint);
    return function getReverseClaims(options) {
        let { properties } = options;
        const { values, limit, caseInsensitive, keepProperties } = options;
        const valueFn = caseInsensitive ? caseInsensitiveValueQuery : directValueQuery;
        const filter = keepProperties ? '' : itemsOnly;
        // Allow to request values for several properties at once
        properties = forceArray(properties);
        properties.forEach(o => propertyId(o));
        const valueBlock = getValueBlock(values, valueFn, properties, filter);
        let sparql = `SELECT DISTINCT ?subject WHERE { ${valueBlock} }`;
        if (limit)
            sparql += ` LIMIT ${limit}`;
        return sparqlQuery(sparql);
    };
};
const getValueBlock = (values, valueFn, properties, filter) => {
    properties = properties.map(prefixifyProperty).join('|');
    if (!(values instanceof Array)) {
        return valueFn(properties, getValueString(values), filter);
    }
    const valuesBlocks = values
        .map(getValueString)
        .map(valStr => valueFn(properties, valStr, filter));
    return '{ ' + valuesBlocks.join('} UNION {') + ' }';
};
const getValueString = value => {
    if (isItemId(value)) {
        value = `wd:${value}`;
    }
    else if (typeof value === 'string') {
        value = `'${value}'`;
    }
    return value;
};
const directValueQuery = (properties, value, filter) => {
    return `?subject ${properties} ${value} .
    ${filter}`;
};
// Discussion on how to make this query optimal:
// http://stackoverflow.com/q/43073266/3324977
const caseInsensitiveValueQuery = (properties, value, filter) => {
    return `?subject ${properties} ?value .
    FILTER (lcase(?value) = ${value.toLowerCase()})
    ${filter}`;
};
const prefixifyProperty = property => 'wdt:' + property;

function getRevisionsFactory(buildUrl) {
    return function getRevisions({ ids, format, limit, start, end, prop, user, excludeuser, tag }) {
        rejectObsoleteInterface(arguments);
        ids = forceArray(ids);
        ids.forEach(o => entityPageTitle(o));
        const uniqueId = ids.length === 1;
        const query = {
            action: 'query',
            prop: 'revisions',
        };
        query.titles = ids.join('|');
        query.format = format || 'json';
        if (uniqueId)
            query.rvlimit = limit || 'max';
        if (uniqueId && start)
            query.rvstart = getEpochSeconds(start);
        if (uniqueId && end)
            query.rvend = getEpochSeconds(end);
        if (prop) {
            query.rvprop = forceArray(prop).join('|');
        }
        else {
            query.rvprop = 'ids|flags|timestamp|user|userid|size|slotsize|sha1|slotsha1|contentmodel|comment|parsedcomment|content|tags|roles|oresscores';
        }
        query.rvslots = '*';
        if (user)
            query.rvuser = user;
        if (excludeuser)
            query.rvexcludeuser = excludeuser;
        if (tag)
            query.rvtag = tag;
        return buildUrl(query);
    };
}
const getEpochSeconds = (date) => {
    // Return already formatted epoch seconds:
    // if a date in milliseconds appear to be earlier than 2000-01-01, that's probably
    // already seconds actually
    if (typeof date === 'number' && date < earliestPointInMs)
        return date;
    return Math.trunc(new Date(date).getTime() / 1000);
};
const earliestPointInMs = new Date('2000-01-01').getTime();

const EntityTypes = [
    'item',
    'property',
    'lexeme',
    'form',
    'sense',
    'entity-schema',
];

const searchEntitiesFactory = (buildUrl) => {
    return function searchEntities({ search, language = 'en', uselang, limit = '20', continue: continu = '0', format = 'json', type = 'item', }) {
        rejectObsoleteInterface(arguments);
        uselang = uselang || language;
        if (!(search && search.length > 0))
            throw new Error("search can't be empty");
        if (!isOfType(EntityTypes, type))
            throw new Error(`invalid type: ${type}`);
        return buildUrl({
            action: 'wbsearchentities',
            search,
            language,
            limit,
            continue: continu,
            format,
            uselang,
            type,
        });
    };
};

const isBrowser = typeof location !== 'undefined' && typeof document !== 'undefined';
function buildUrlFactory(instanceApiEndpoint) {
    return queryObj => {
        // Request CORS headers if the request is made from a browser
        // See https://www.wikidata.org/w/api.php ('origin' parameter)
        if (isBrowser)
            queryObj = Object.assign(Object.assign({}, queryObj), { origin: '*' });
        const queryEntries = Object.entries(queryObj)
            // Remove null or undefined parameters
            .filter(([, value]) => value != null)
            .map(([key, value]) => [key, String(value)]);
        const query = new URLSearchParams(queryEntries).toString();
        return instanceApiEndpoint + '?' + query;
    };
}

const tip = `Tip: if you just want to access functions that don't need an instance or a sparqlEndpoint,
those are also exposed directly on the module object. Exemple:
import { isItemId, simplify } from 'wikibase-sdk'`;
const common = Object.assign(Object.assign(Object.assign(Object.assign({ simplify,
    parse }, helpers), sitelinksHelpers), rankHelpers), timeHelpers);
function WBK(config) {
    if (!isPlainObject(config))
        throw new Error('invalid config');
    const { instance, sparqlEndpoint } = config;
    let { wgScriptPath = 'w' } = config;
    wgScriptPath = wgScriptPath.replace(/^\//, '');
    if (!(instance || sparqlEndpoint)) {
        throw new Error(`one of instance or sparqlEndpoint should be set at initialization.\n${tip}`);
    }
    let wikibaseApiFunctions;
    let instanceRoot;
    let instanceApiEndpoint;
    if (instance) {
        validateEndpoint('instance', instance);
        instanceRoot = instance
            .replace(/\/$/, '')
            .replace(`/${wgScriptPath}/api.php`, '');
        instanceApiEndpoint = `${instanceRoot}/${wgScriptPath}/api.php`;
        const buildUrl = buildUrlFactory(instanceApiEndpoint);
        wikibaseApiFunctions = {
            searchEntities: searchEntitiesFactory(buildUrl),
            cirrusSearchPages: cirrusSearchPagesFactory(buildUrl),
            getEntities: getEntitiesFactory(buildUrl),
            getManyEntities: getManyEntitiesFactory(buildUrl),
            getRevisions: getRevisionsFactory(buildUrl),
            getEntityRevision: getEntityRevisionFactory(instance, wgScriptPath),
            getEntitiesFromSitelinks: getEntitiesFromSitelinksFactory(buildUrl),
        };
    }
    else {
        wikibaseApiFunctions = {
            searchEntities: missingInstance('searchEntities'),
            cirrusSearchPages: missingInstance('cirrusSearchPages'),
            getEntities: missingInstance('getEntities'),
            getManyEntities: missingInstance('getManyEntities'),
            getRevisions: missingInstance('getRevisions'),
            getEntityRevision: missingInstance('getEntityRevision'),
            getEntitiesFromSitelinks: missingInstance('getEntitiesFromSitelinks'),
        };
    }
    let wikibaseQueryServiceFunctions;
    if (sparqlEndpoint) {
        validateEndpoint('sparqlEndpoint', sparqlEndpoint);
        wikibaseQueryServiceFunctions = {
            sparqlQuery: sparqlQueryFactory(sparqlEndpoint),
            getReverseClaims: getReverseClaimsFactory(sparqlEndpoint),
        };
    }
    else {
        wikibaseQueryServiceFunctions = {
            sparqlQuery: missingSparqlEndpoint('sparqlQuery'),
            getReverseClaims: missingSparqlEndpoint('getReverseClaims'),
        };
    }
    return Object.assign(Object.assign(Object.assign({ instance: {
            root: instanceRoot,
            apiEndpoint: instanceApiEndpoint,
        } }, common), wikibaseApiFunctions), wikibaseQueryServiceFunctions);
}
const validateEndpoint = (name, url) => {
    if (!(typeof url === 'string' && url.startsWith('http'))) {
        throw new Error(`invalid ${name}: ${url}`);
    }
};
const missingConfig = (missingParameter) => (name) => () => {
    throw new Error(`${name} requires ${missingParameter} to be set at initialization`);
};
const missingSparqlEndpoint = missingConfig('a sparqlEndpoint');
const missingInstance = missingConfig('an instance');

const wdk = WBK({
    instance: 'https://www.wikidata.org',
    sparqlEndpoint: 'https://query.wikidata.org/sparql',
});

exports.default = wdk;
exports.wdk = wdk;
