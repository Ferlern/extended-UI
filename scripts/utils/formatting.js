exports.powerToString = function(currentNetPower, graphs) {
    let num = Math.round(currentNetPower*60); 

    let graphString = graphs.length > 1 ? " (sep " + graphs.length + ')' : '';
    let sign = num > 0 ? '+' : '';
    let color = num >= 0 ? '[stat]' : '[red]';
    let powerString;

    let power = Math.floor(Math.log(Math.abs(num)) / Math.log(1000)) - 1;
    if (power > 0) {
        powerString = num.toString().slice(0, -3*power) + 'k'.repeat(power);
    } else {
        powerString = num.toString();
    }
    return color + sign + powerString + '[white]' + graphString;
}
