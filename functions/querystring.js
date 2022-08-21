
module.exports = {
    arr2param: function(arr) {
        return arr.join(';;');
    },
    param2arr: function(param) {
        return param.split(';;');
    }
}