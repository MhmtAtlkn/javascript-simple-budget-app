////////////////////////////budget module////////////////////////////
var budgetController = (function () {

    var Expenses = function (id, description, value) { //function contructer.can create object with new keyword.
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expenses.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }

    };

    Expenses.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

    };

    return {

        addItem: function (type, description, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                //get last item of exp[] or inc[] array. Get that id and add 1. Create new id.
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else { //if array is null
                ID = 0;
            }

            //create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expenses(ID, description, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, val);
            }

            //push new item into data structure
            data.allItems[type].push(newItem);

            return newItem;

        },
        deleteItem: function (type, id) {
            //id=6
            //ids=[1 2 4 6 8]
            //index=3

            var ids, index;

            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the bugdet : income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calcPercentages: function () {
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }

})();

////////////////////////////UI module////////////////////////////
var UIController = (function () {
    //private zone
    var DOMstrings = {
        inputType: '.add__type',
        inputDesciription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentagelabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return { //public zone
        getInput: function () {//public getInput function
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                desciription: document.querySelector(DOMstrings.inputDesciription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }

        },
        addListItem: function (obj, type) {
            //create html string with placeholder text
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer; //income parent element
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"> <i class="ion-ios-close-outline"> </i> </button> </div> </div> </div>'
            } else if (type === 'exp') { //expense parent element
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            }

            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the html into the dom as the las child            
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

        },
        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDesciription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
                current.description = "";
            });

        },
        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentagelabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentagelabel).textContent = '--';
            }
        },
        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);//node list

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---'
                }
            });
        },
        displayMonth: function () {
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            month = months[now.getMonth()];
            document.querySelector(DOMstrings.dateLabel).textContent = month + " - " + year;

        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + "," + DOMstrings.inputValue + "," + DOMstrings.inputDesciription
            );

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

////////////////////////////controller module////////////////////////////
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) { //pass a event handler
            if (event.keyCode === 13 || event.which === 13) { //return key pressed for older browsers
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function () {

        //1. calculate budget
        budgetCtrl.calculateBudget();
        //2.return the budget
        var budget = budgetCtrl.getBudget();
        //3. display the budget
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        //1. calculate percentages
        budgetCtrl.calcPercentages();
        //2.read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        //3. update the ui with new percentages
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {

        var input, newItem;

        //1. Get the input fields data
        input = UICtrl.getInput();

        if (input.desciription !== "" && !isNaN(input.value) && input.value > 0) {

            //2. add item to budget controller and data structure
            newItem = budgetController.addItem(input.type, input.desciription, input.value);

            //3. addnew item to user interface
            UICtrl.addListItem(newItem, input.type);

            //4. clear fields
            UICtrl.clearFields();

            //5. calculate and update budget
            updateBudget();

            //6. calculate and update percentages
            updatePercentages();
        }

    };


    var ctrlDeleteItem = function (event) {

        var itemID, splitID, type;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1
            splitID = itemID.split('-'); //["inc" , "1"]
            type = splitID[0];
            ID = parseInt(splitID[1]);
            //1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);
            //2. delete item from UI
            UICtrl.deleteListItem(itemID);
            //3. update and show the new budget
            updateBudget();
            //4 calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            UICtrl.displayMonth();
            UICtrl.displayBudget(
                {
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1  //-1 is means this property is not exist
                }
            );
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();


