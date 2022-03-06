exports.iterateSeq = function (func, seq) {
    while ( seq.hasNext() ) {
        func(seq.next())
    }
}
