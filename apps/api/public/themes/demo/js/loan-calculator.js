var amount = 0, rate = 0, period = 0;
var total = 0;

function initRangeInputs() {
    const rangeInputs = document.querySelectorAll('input[type="range"]')

    function handleInputChange(e) {
        let target = e.target
        if (e.target.type !== 'range') {
            target = document.getElementById('range')
        }
        const min = target.min
        const max = target.max
        const val = target.value

        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
    }

    rangeInputs.forEach(input => {
        input.addEventListener('input', handleInputChange)
    })
}

function updateLoanAmount(val) {
    total = calculate_total();
    $('.display-loan-amount').text('RM'+val+'K')
    document.getElementById('total-loan').innerHTML = total;
}

function updateInterestRate(val) {
    total = calculate_total();
    $('.display-interest-rate').text(val+"%")
    document.getElementById('total-loan').innerHTML = total;
}

function updateLoanPeriod(val) {
    total = calculate_total();
    $('.display-loan-repayment').text(val+" years")
    document.getElementById('total-loan').innerHTML = total;
}

function calculate_total() {
    if (document.getElementById('loan_amount')) {
        amount = parseInt(document.getElementById('loan_amount').value * 1000);
        rate = (document.getElementById('interest_rate').value / 12 / 100);
        period = parseInt(document.getElementById('loan_period').value) * 12;
    }

    total = amount * ((rate * Math.pow(1 + rate, period)) / (Math.pow(1 + rate, period) - 1));
    return total.toFixed(2);
}

function showLoanCalculator() {
    document.getElementsByClassName("loan-calculator-content")[0].style.display = "block";
}

function hideLoanCalculator() {
    document.getElementsByClassName("loan-calculator-content")[0].style.display = "none";
}

if (document.querySelector('.loan-calculator-header-block')) {
    initRangeInputs();
    calculate_total();
}
