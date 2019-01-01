var budgetController = (function () {//budget module

})();

var UIController = (function () {//UI Module
    //private zone
    var DOMstrings = {
        inputType: '.add__type',
        inputDesciription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {//public zone
        getInput: function () {//public getInput function
            return {
                type: document.querySelector(DOMstrings.inputType).value,//inc or exp
                desciription: document.querySelector(DOMstrings.inputDesciription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }

        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

var controller = (function (budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function () {
        // Get the field input data
        var input = UICtrl.getInput();
        console.log(input);

        //add item to budget controlled.
        //addnew item to user interface
        //calculate budget
        //display the budget
        console.log('Works');
    };

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) { //pass a event handler
        if (event.keyCode === 13 || event.which === 13) {//return key pressed for older browsers
            ctrlAddItem();
        }
    });

})(budgetController, UIController);


