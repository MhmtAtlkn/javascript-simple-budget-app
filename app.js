var budgetController = (function () {

    var x = 5;//private variable

    var add = function (y) {//private function
        console.log(x + y);
    }

    return {
        publicObject:add(5),
        variable:x
    }
})();