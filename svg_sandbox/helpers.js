function arraySum(numArray){
    return numArray.reduce(function(prev, curr){return prev+curr;}, 0)
}