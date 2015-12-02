function arraySum(numArray){
    return numArray.reduce(function(prev, curr){return prev+curr;}, 0)
}

function mergeArrays(array1, array2){
    Array.prototype.push.apply(array1, array2);
}

