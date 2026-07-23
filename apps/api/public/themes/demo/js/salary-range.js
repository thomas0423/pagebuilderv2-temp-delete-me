if (document.querySelector('.block-affin-always-range') && document.getElementById("salary")) {
    document.getElementById("salary").value = 3000;
    drag();
}

function drag() {
    if (document.getElementById("salary").value !== null) {
        var x = document.getElementById("salary").value;
        document.getElementById("result").innerHTML = 'My salary is RM' + x;
    }
}
