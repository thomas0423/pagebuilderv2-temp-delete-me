
function affin_always_salary_range(){
    $(document).ready(function() {
        fetch('/currentLang')
            .then(response => response.text())
            .then(lang => {
                const checkResultBtn = document.querySelector('.default-button.btn.check-result-btn');
                if (lang === 'ms') {
                    checkResultBtn.innerHTML = 'Semak keputusan';
                }
            });

        document.querySelectorAll(".block-affin-always-salary-range .__range-step-salary-range").forEach(function(ctrl) {
            var el = ctrl.querySelector('input');
            var output = ctrl.querySelector('output');
            var newPoint, newPlace, offset;
            el.oninput =function(){
                // colorize step options
                ctrl.querySelectorAll("option").forEach(function(opt) {

                    if( opt.value <= (el.valueAsNumber*50) )
                        opt.style.backgroundColor = '#FF0000';
                    else
                        opt.style.backgroundColor = '#fff';
                });
                // colorize before and after
                var valPercent = (el.valueAsNumber  - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min));
                var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+
                valPercent+', #FF0000), color-stop('+
                valPercent+', #fff));';
                el.style = style;

                if( el.valueAsNumber*50 == 20000){
                    $('.salary-range-result').text(" > "+el.valueAsNumber*50);
                }else{
                    $('.salary-range-result').text(el.valueAsNumber*50);
                }
                document.querySelector('.check-result-btn').setAttribute('data-income', el.valueAsNumber*50 );

            };
            el.oninput();
        });
    });
}

function salary_range_window_resize(){
    $(document).ready(function() {
        window.onresize = function(){
            document.querySelectorAll(".__range").forEach(function(ctrl) {
                var el = ctrl.querySelector('input');
                el.oninput();
            });
        };
    });
}

if (document.querySelector('.block-affin-always-salary-range')) {
    affin_always_salary_range();
    salary_range_window_resize();
}
