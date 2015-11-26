function arraySum(numArray){
    return numArray.reduce(function(prev, curr){return prev+curr;}, 0)
}

function mergeArrays(array1, array2){
    Array.prototype.push.apply(array1, array2);
}

function swap(a, b){
    var x = function(x){
        console.log("Hello!");
        return x;
    }(a, a=b)
};