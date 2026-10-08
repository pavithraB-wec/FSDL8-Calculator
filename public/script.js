let expression = "";

const display = document.getElementById("display");


// ==============================
// PRESS BUTTON
// ==============================

function press(value) {

    // Prevent multiple operators
    if (isOperator(value)) {

        if (expression === "") {

            // Do not allow operator as first character
            if (value !== "-") {
                return;
            }

        }

        // Replace previous operator
        if (isOperator(expression.slice(-1))) {
            expression =
                expression.slice(0, -1) + value;

            display.value = expression;

            return;
        }
    }


    // Prevent multiple decimal points
    if (value === ".") {

        const currentNumber =
            expression.split(/[+\-*/]/).pop();

        if (currentNumber.includes(".")) {
            return;
        }

        // If decimal is first, make it 0.
        if (
            currentNumber === "" &&
            (expression === "" ||
             isOperator(expression.slice(-1)))
        ) {
            expression += "0";
        }
    }


    // Prevent unnecessary leading zeros
    if (value === "0") {

        const currentNumber =
            expression.split(/[+\-*/]/).pop();

        if (currentNumber === "0") {
            return;
        }
    }


    expression += value;

    display.value = expression;
}


// ==============================
// CHECK OPERATOR
// ==============================

function isOperator(value) {

    return (
        value === "+" ||
        value === "-" ||
        value === "*" ||
        value === "/"
    );
}


// ==============================
// CALCULATE
// ==============================

function calculate() {

    if (expression === "") {
        return;
    }


    // Expression cannot end with operator
    if (isOperator(expression.slice(-1))) {

        display.value = "Invalid";

        expression = "";

        return;
    }


    try {

        const result =
            evaluateExpression(expression);

        if (!Number.isFinite(result)) {

            display.value =
                "Cannot divide by 0";

            expression = "";

            return;
        }


        expression =
            String(result);

        display.value =
            expression;

    } catch {

        display.value =
            "Invalid Expression";

        expression = "";
    }
}


// ==============================
// EXPRESSION EVALUATOR
// ==============================

function evaluateExpression(input) {

    const tokens =
        input.match(/(\d+\.?\d*|\.\d+|[+\-*/])/g);


    if (!tokens) {
        throw new Error("Invalid expression");
    }


    // First handle multiplication and division
    let values = [];

    let i = 0;


    function readNumber() {

        const token = tokens[i];

        if (
            token === undefined ||
            isOperator(token)
        ) {
            throw new Error("Invalid number");
        }

        i++;

        return Number(token);
    }


    let firstNumber =
        readNumber();

    values.push(firstNumber);


    while (i < tokens.length) {

        const operator =
            tokens[i];

        i++;


        const number =
            readNumber();


        if (
            operator === "*" ||
            operator === "/"
        ) {

            const previous =
                values.pop();

            if (
                operator === "/" &&
                number === 0
            ) {
                return Infinity;
            }


            if (operator === "*") {

                values.push(
                    previous * number
                );

            } else {

                values.push(
                    previous / number
                );
            }

        } else {

            values.push(
                operator
            );

            values.push(
                number
            );
        }
    }


    // Handle addition and subtraction
    let result =
        values[0];


    for (
        let j = 1;
        j < values.length;
        j += 2
    ) {

        const operator =
            values[j];

        const number =
            values[j + 1];


        if (operator === "+") {

            result += number;

        } else if (operator === "-") {

            result -= number;

        } else {

            throw new Error(
                "Invalid expression"
            );
        }
    }


    return result;
}


// ==============================
// CLEAR
// ==============================

function clearDisplay() {

    expression = "";

    display.value = "";
}


// ==============================
// DELETE LAST CHARACTER
// ==============================

function deleteLast() {

    expression =
        expression.slice(0, -1);

    display.value =
        expression;
}


// ==============================
// KEYBOARD SUPPORT
// ==============================

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        if (
            (key >= "0" && key <= "9") ||
            key === "." ||
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            press(key);

        } else if (key === "Enter") {

            calculate();

        } else if (key === "Escape") {

            clearDisplay();

        } else if (key === "Backspace") {

            deleteLast();
        }
    }
);