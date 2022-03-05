Object.fromEntries = function(entries) {
    if (!entries || !entries[Symbol.iterator]) { throw new Error('Object.fromEntries() requires a single iterable argument'); }
    let obj = {};
    for (let [key, value] of entries) {
        obj[key] = value;
    }
    return obj;
};

Object.entries = function(obj) {
    let ownProps = Object.keys( obj );
    let i = ownProps.length;
    let resArray = new Array(i);
    while (i--)
        resArray[i] = [ownProps[i], obj[ownProps[i]]];

    return resArray;
};
