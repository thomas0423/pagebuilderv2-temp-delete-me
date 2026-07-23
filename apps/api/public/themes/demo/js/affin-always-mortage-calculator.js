
function affin_always_mortage_calculator(){
    $(document).ready(function() {
        document.querySelectorAll(".__range-step-salary").forEach(function(ctrl) {
            var el = ctrl.querySelector('input[name="salary"]');
            var output = ctrl.querySelector('output');
            var newPoint, newPlace, offset;
            el.oninput =function(){
                // colorize step options
                ctrl.querySelectorAll("option").forEach(function(opt) {

                    //console.log(opt.value , el.valueAsNumber );

                    if( opt.value <= (el.valueAsNumber) )

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
                // Popup

                if( el.valueAsNumber == 20000){
                    $('.salary-calculator-result').text(" > "+el.valueAsNumber);
                }else{
                    $('.salary-calculator-result').text(el.valueAsNumber);
                }

                document.querySelector('.check-result-btn').setAttribute('data-salary', el.valueAsNumber );
            };
            el.oninput();
        });

        document.querySelectorAll(".__range-step-mortage").forEach(function(ctrl) {
            var el = ctrl.querySelector('input[name="age"]');
            var output = ctrl.querySelector('output');
            var newPoint, newPlace, offset;
            el.oninput =function(){
                // colorize step options
                ctrl.querySelectorAll("option").forEach(function(opt) {
                    if(opt.value<=el.valueAsNumber)
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

                // Popup

                if( el.valueAsNumber >= 50){

                    document.querySelector('.age-calculator-result').innerHTML = " > 50";
                }else{
                    document.querySelector('.age-calculator-result').innerHTML = el.valueAsNumber;
                }

                $('.check-result-btn').attr('data-age', el.valueAsNumber);
            };
            el.oninput();
        });


        $('.loan-purpose-btn').click((e)=>{
            var params = [];

            if($(e.currentTarget).attr('data-status') == "none"){
                $(e.currentTarget).attr('data-status', 'click').css({'border':'2px solid #ff0000','position':'relative'}).append(
                    $('<img>').addClass('mortage-purpose-close-btn').attr({'src':'/img/affin-always-card-boxes/delete.png'}),
                );
            }else{
                $(e.currentTarget).attr('data-status','none').removeAttr('style').children($('<img>')).remove();
            }

            $('.loan-purpose-btn[data-status=click]').each((key, val)=>{
                params.push($(val).text().toLowerCase().replace(/ /g,"-"));
            })

            $('.check-result-btn').attr('data-purpose', params.toString());
        })
    });

}

if (document.querySelector('.block-affin-always-mortage-calculator')) {
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            console.log(lang);

            var my_first_and_dream_house, purchase_land_and_house_construction, business_premises, cash_out, check_result;

            switch(lang){
                case 'en':
                    my_first_and_dream_house = 'My first and dream house';
                    purchase_land_and_house_construction = 'Purchase land and house construction';
                    business_premises='Business premises';
                    cash_out = 'Cash Out';
                    check_result = 'Check Result';
                    break;
                case 'ms':
                    my_first_and_dream_house = 'Rumah pertama dan kediaman idaman';
                    purchase_land_and_house_construction = 'Pembelian tanah dan pembinaan rumah';
                    business_premises='Premis perniagaan';
                    cash_out = 'Lebihan tunai';
                    check_result = 'Semak Keputusan';
                    break;
                default:
                    my_first_and_dream_house = 'My first and dream house';
                    purchase_land_and_house_construction = 'Purchase land and house construction';
                    business_premises='Business premises';
                    cash_out = 'Cash Out';
                    check_result = 'Check Result';
                    break;
            }

            var wrapper = $('.mortage-purpose-wrapper').children();
            wrapper[0].textContent = my_first_and_dream_house;
            wrapper[1].textContent = purchase_land_and_house_construction;
            wrapper[2].textContent = business_premises;
            wrapper[3].textContent = cash_out;

            $('.check-result-btn').text(check_result)

        })

    affin_always_mortage_calculator();
}
