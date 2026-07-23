function personalizeSolutionCustomScript(){
    $(".IDKWSQZ6NKP31BW43").attr("href","/small-and-medium-enterprises");
}

 function addremoveBtn(){

    $('.personaliz-step-1 .choice.left').click((e)=>{

        $('.personaliz-step-1 .choice').parent().each((k,v)=>{
            if($(v).attr('data-status') == 'click'){
                $('.personaliz-step-1 .personalize-next-btn').attr('data-attribute', '');
                $(v).parent().attr('data-status','none').find('.personalize-remove-btn').remove();
            };
        })


        $(e.currentTarget).parent().append(
            $('<div>').addClass('personalize-remove-btn r-9').append(
                $('<img>').attr({'src':'/img/affin-always-card-boxes/delete.png'})
            )
        ).attr('data-status', 'click')

        $('.personaliz-step-1 .personalize-next-btn').attr('data-attribute', 'personal');

    });

    $('.personaliz-step-1 .choice.right').click((e)=>{

        $('.personaliz-step-1 .choice').parent().each((k,v)=>{
            if($(v).attr('data-status') == 'click'){
                $('.personaliz-step-1 .personalize-next-btn').attr('data-attribute', '');
                $(v).parent().attr('data-status','none').find('.personalize-remove-btn').remove();
            };
        })


        $(e.currentTarget).parent().append(
            $('<div>').addClass('personalize-remove-btn r-7').append(
                $('<img>').attr({'src':'/img/affin-always-card-boxes/delete.png'})
            )
        ).attr('data-status', 'click')

        $('.personaliz-step-1 .personalize-next-btn').attr('data-attribute', 'sme');

    });

    $('.personaliz-step-personal .choice.right').click((e)=>{


        $('.personaliz-step-personal .choice').parent().each((k,v)=>{
            if($(v).attr('data-status') == 'click'){
                $('.personaliz-step-personal .personalize-next-btn').attr('data-attribute', '');
                $(v).parent().attr('data-status','none').find('.personalize-remove-btn').remove();
            };
        })


        $(e.currentTarget).parent().append(
            $('<div>').addClass('personalize-remove-btn r-7').append(
                $('<img>').attr({'src':'/img/affin-always-card-boxes/delete.png'})
            )
        ).attr('data-status', 'click');

        $('.personaliz-step-personal .personalize-next-btn').attr('data-attribute', $(e.currentTarget).parent().attr('data-path'));

    })

    $('.personaliz-step-personal .choice.left').click((e)=>{

        $('.personaliz-step-personal .choice').parent().each((k,v)=>{
            if($(v).attr('data-status') == 'click'){
                $('.personaliz-step-personal .personalize-next-btn').attr('data-attribute', '');
                $(v).parent().attr('data-status','none').find('.personalize-remove-btn').remove();
            };
        })


        $(e.currentTarget).parent().append(
            $('<div>').addClass('personalize-remove-btn r-9').append(
                $('<img>').attr({'src':'/img/affin-always-card-boxes/delete.png'})
            )
        ).attr('data-status', 'click');

        $('.personaliz-step-personal .personalize-next-btn').attr('data-attribute', $(e.currentTarget).parent().attr('data-path'));
    })

    $('.personaliz-step-sme .choice.right').click((e)=>{
        var status = $(e.currentTarget).parent().attr('data-status');
        var count = 0;

        $('.personaliz-step-sme .choice').parent().each((k,v)=>{
            if($(v).attr('data-status') == 'click'){
                $('.personaliz-step-sme .personalize-next-btn').attr('data-attribute', '');
                $(v).parent().attr('data-status','none').find('.personalize-remove-btn').remove();
            };
        })

        $(e.currentTarget).parent().append(
            $('<div>').addClass('personalize-remove-btn r-7').append(
                $('<img>').attr({'src':'/img/affin-always-card-boxes/delete.png'})
            )
        ).attr('data-status', 'click');

        $('.personaliz-step-sme .personalize-next-btn').attr('data-attribute',  $(e.currentTarget).parent().attr('data-path'));
    })

    $('.personaliz-step-sme .choice.left').click((e)=>{
        var status = $(e.currentTarget).parent().attr('data-status');
        var count = 0;

        $('.personaliz-step-sme .choice').parent().each((k,v)=>{
            if($(v).attr('data-status') == 'click'){
                $('.personaliz-step-sme .personalize-next-btn').attr('data-attribute', '');
                $(v).parent().attr('data-status','none').find('.personalize-remove-btn').remove();
            };
        })

        $(e.currentTarget).parent().append(
            $('<div>').addClass('personalize-remove-btn r-9').append(
                $('<img>').attr({'src':'/img/affin-always-card-boxes/delete.png'})
            )
        ).attr('data-status', 'click');

        $('.personaliz-step-sme .personalize-next-btn').attr('data-attribute',  $(e.currentTarget).parent().attr('data-path'));

    })
 }

 function PersonalizeNextBtn(lang, tempDomain){
    $('.personaliz-step-1 .personalize-next-btn').click((e)=>{
        if($(e.currentTarget).attr('data-next') == "personalize-step-2" && $(e.currentTarget).attr('data-attribute') == "personal"){
            $('.personaliz-step-1, .personaliz-step-sme, .personaliz-step-slider, .personaliz-step-student').hide();
            $('.personaliz-step-student .personalize-back-btn').attr('data-to', 'personal');

            $('.step-wrapper .stepper1 .blue-circle').fadeOut(); //hide blue circle
            $('.step-wrapper .stepper2 .blue-circle').fadeIn(); //display blue circle

            $('.personaliz-step-personal').fadeIn();
        }

        if($(e.currentTarget).attr('data-next') == "personalize-step-2" && $(e.currentTarget).attr('data-attribute') == "sme"){
            $('.personaliz-step-1, .personaliz-step-personal, .personaliz-step-slider, .personaliz-step-student').hide();
            $('.personaliz-step-student .personalize-back-btn').attr('data-to', 'sme');
            $('.personaliz-step-sme').fadeIn();

            $('.step-wrapper .stepper1 .blue-circle').fadeOut(); //hide blue circle
            $('.step-wrapper .stepper2 .blue-circle').fadeIn(); //display blue circle

            $('.block-personalize-wrapper .row .col-12 .step-wrapper .stepper3').attr('style',"display:none !important")
        }

    });

    $('.personaliz-step-personal .personalize-next-btn').click((e)=>{

        $('.__range input').removeAttr('style').css('background-image', '-webkit-gradient(linear, 0% 0%, 100% 0%, from(rgb(7, 104, 179)), from(rgb(196, 196, 196)))');
        $('.__range-step datalist option').css('background-color', 'rgb(196, 196, 196)');
        $('.__range-step datalist option:first-child').css('background-color', 'rgb(7, 104, 179)');

        if($(e.currentTarget).attr('data-next') == "personalize-step-3" &&
            ($(e.currentTarget).attr('data-attribute') == "student" ||  $(e.currentTarget).attr('data-attribute') == "retired" ))
        {
            if($(e.currentTarget).attr('data-attribute') == "student"){
                if (lang === 'en') {
                    $('.age-wrapper .age-label.below').text('below 18 years');
                    $('.age-wrapper .age-label.more').text('more than 18 years');
                } else if (lang === 'ms') {
                    $('.age-wrapper .age-label.below').text('bawah 18 tahun');
                    $('.age-wrapper .age-label.more').text('18 tahun ke atas');
                } else {
                    $('.age-wrapper .age-label.below').text('below 18 years');
                    $('.age-wrapper .age-label.more').text('more than 18 years');
                }
                $('.age-wrapper input.age_below').val('below_18');
                $('.age-wrapper input.age_more').val('more_18');
                $('.personaliz-step-student .personalize-next-btn.retired').removeAttr('style').hide();
                $('.personaliz-step-student .personalize-next-btn.student').css('display','inline-block').fadeIn();

                var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
                url.searchParams.set('income', 0);
                url.searchParams.set('age', 'below_18');

                $('.personaliz-step-student .personalize-next-btn.student').attr('href', tempDomain.pathname + url.pathname+url.search);

            }

            if($(e.currentTarget).attr('data-attribute') == "retired" ){
                if (lang === 'en') {
                    $('.age-wrapper .age-label.below').text('below 60 years');
                    $('.age-wrapper .age-label.more').text('more than 60 years');
                } else if (lang === 'ms') {
                    $('.age-wrapper .age-label.below').text('bawah 60 tahun');
                    $('.age-wrapper .age-label.more').text('60 tahun ke atas');
                } else {
                    $('.age-wrapper .age-label.below').text('below 60 years');
                    $('.age-wrapper .age-label.more').text('more than 60 years');
                }
                $('.age-wrapper input.age_below').val('below_60');
                $('.age-wrapper input.age_more').val('more_60');
                $('.personaliz-step-student .personalize-next-btn.student').removeAttr('style').hide();
                $('.personaliz-step-student .personalize-next-btn.retired').css('display','inline-block').fadeIn();

                var url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
                url.searchParams.set('income', 0);//set income to 0
                url.searchParams.set('age', 'below_60');//set age to below_60

                $('.personaliz-step-student .personalize-next-btn.retired').attr('href',  tempDomain.pathname + url.pathname+url.search);

            }

            $('.step-wrapper .stepper2 .blue-circle').fadeOut(); //hide blue circle
            $('.step-wrapper .stepper3 .blue-circle').fadeIn(); //display blue circle

            $('.personaliz-step-1, .personaliz-step-personal, .personaliz-step-sme, .personaliz-step-slider').hide();
            $('.personaliz-step-student').fadeIn();
        }

        if($(e.currentTarget).attr('data-next') == "personalize-step-3" &&
            ($(e.currentTarget).attr('data-attribute') == "working-adult" ||  $(e.currentTarget).attr('data-attribute') == "married" ))
        {

            if($(e.currentTarget).attr('data-attribute') == "working-adult"){

                var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                url.searchParams.set('income', 0);//set income to 0
                url.searchParams.set('age', 0);//set age to 0
                $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href',  tempDomain.pathname + url.pathname+url.search);

                $('.personaliz-step-slider .personalize-next-btn.working-adult').css('display','inline-block').fadeIn();
                $('.personaliz-step-slider .personalize-next-btn.married').removeAttr('style').hide();
            }

            if($(e.currentTarget).attr('data-attribute') == "married" ){

                var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                url.searchParams.set('income', 0);//set income to 0
                url.searchParams.set('age', 0);//set age to 0
                $('.personaliz-step-slider .personalize-next-btn.married').attr('href',  tempDomain.pathname + url.pathname+url.search);


                $('.personaliz-step-slider .personalize-next-btn.married').css('display','inline-block').fadeIn();
                $('.personaliz-step-slider .personalize-next-btn.working-adult').removeAttr('style').hide();
            }

            $('.personaliz-step-1, .personaliz-step-personal, .personaliz-step-sme, .personaliz-step-student' ).hide();
            $('.personaliz-step-slider .personalize-back-btn').attr('data-next', 'personal');

            $('.step-wrapper .stepper2 .blue-circle').fadeOut(); //hide blue circle
            $('.step-wrapper .stepper3 .blue-circle').fadeIn(); //display blue circle

            $('.personaliz-step-slider').fadeIn();
        }

    })

    $('.personaliz-step-student .personalize-back-btn').click((e)=>{
        if($(e.currentTarget).attr('data-back') == "personalize-step-2" && $(e.currentTarget).attr('data-to') == "sme" ){
            $('.personaliz-step-1, .personaliz-step-personal, .personaliz-step-slider, .personaliz-step-student').hide();
            $('.personaliz-step-sme').fadeIn();
        }

        if($(e.currentTarget).attr('data-back') == "personalize-step-2" && $(e.currentTarget).attr('data-to') == "personal" ){
            $('.personaliz-step-1, .personaliz-step-sme, .personaliz-step-slider, .personaliz-step-student').hide();
            $('.personaliz-step-personal').fadeIn();
        }

        $('.step-wrapper .stepper2 .blue-circle').fadeIn(); //display blue circle
        $('.step-wrapper .stepper3 .blue-circle').fadeOut(); //hide blue circle


    })

    $('.personaliz-step-personal .personalize-back-btn').click((e)=>{
        if($(e.currentTarget).attr('data-next') == "personalize-step-1"){
            $('.personaliz-step-personal, .personaliz-step-slider, .personaliz-step-student').hide();
            $('.personaliz-step-1').fadeIn();
        }

        $('.step-wrapper .stepper1 .blue-circle').fadeIn(); //hide blue circle
        $('.step-wrapper .stepper2 .blue-circle').fadeOut(); //display blue circle
    })

    $('.personaliz-step-sme .personalize-back-btn').click((e)=>{

        if($(e.currentTarget).attr('data-next') == "personalize-step-1"){
            $('.personaliz-step-1, .personaliz-step-slider, .personaliz-step-student, .personaliz-step-sme').hide();
            $('.personaliz-step-1').fadeIn();


            $('.step-wrapper .stepper1 .blue-circle').fadeIn(); //hide blue circle
            $('.step-wrapper .stepper2 .blue-circle').fadeOut(); //display blue circle

            $('.block-personalize-wrapper .row .col-12 .step-wrapper .stepper3').css('display',"flex");

        }
    })

    $('.personaliz-step-slider .personalize-back-btn').click((e)=>{

        if($(e.currentTarget).attr('data-next') == "personal"){
            $('.personaliz-step-1, .personaliz-step-slider, .personaliz-step-student,  .personaliz-step-sme').hide();
            $('.personaliz-step-personal').fadeIn();
        }

        $('.step-wrapper .stepper2 .blue-circle').fadeIn(); //hide blue circle
        $('.step-wrapper .stepper3 .blue-circle').fadeOut(); //display blue circle
    })

 }


function personalize_income_range(tempDomain){

    document.querySelectorAll(".__range-step.income").forEach(function(ctrl) {
        var el = ctrl.querySelector('input');
        var output = ctrl.querySelector('output');
        var newPoint, newPlace, offset;
        el.oninput =function(){
            // colorize step options
            ctrl.querySelectorAll("option").forEach(function(opt) {
                if(opt.value<=el.valueAsNumber)
                    opt.style.backgroundColor = '#0768B3';
                else
                    opt.style.backgroundColor = '#C4C4C4';
            });
            // colorize before and after
            var valPercent = (el.valueAsNumber  - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min));
            var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+
            valPercent+', #0768B3), color-stop('+
            valPercent+', #C4C4C4));';
            el.style = style;

            // Popup
            if((' ' + ctrl.className + ' ').indexOf(' ' + '__range-step-popup' + ' ') > -1)
            {
                var result =ctrl.querySelector('option[value="'+el.value+'"]').textContent;

                if(result == "0"){
                    $('.salary-range-result').text('0');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "student" ){
                        var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
                        url.searchParams.set('income', 0);
                        $('.personaliz-step-student .personalize-next-btn.student').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "retired"){
                        let url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
                        url.searchParams.set('income', 0);
                        $('.personaliz-step-student .personalize-next-btn.retired').attr('href', url.pathname+url.search);


                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('income', 0);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('income', 0);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }

                }else if(result == "5k"){
                    $('.salary-range-result').text('5,000');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "student" ){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
                        url.searchParams.set('income', 5000);
                        $('.personaliz-step-student .personalize-next-btn.student').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "retired"){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
                        url.searchParams.set('income', 5000);
                        $('.personaliz-step-student .personalize-next-btn.retired').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('income', 5000);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('income', 5000);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }

                }else if(result == "10k"){
                    $('.salary-range-result').text('10,000');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "student" ){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
                        url.searchParams.set('income', 10000);
                        $('.personaliz-step-student .personalize-next-btn.student').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "retired"){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
                        url.searchParams.set('income', 10000);
                        $('.personaliz-step-student .personalize-next-btn.retired').attr('href', url.pathname+url.search);


                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('income', 10000);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('income', 10000);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);

                    }

                }else if(result == "15k"){
                    $('.salary-range-result').text('15,000');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "student" ){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
                        url.searchParams.set('income', 15000);
                        $('.personaliz-step-student .personalize-next-btn.student').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "retired"){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
                        url.searchParams.set('income', 15000);
                        $('.personaliz-step-student .personalize-next-btn.retired').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('income', 15000);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('income', 15000);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);

                    }

                }else if(result == ">20k"){
                    $('.salary-range-result').text('>20,000');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "student" ){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
                        url.searchParams.set('income', 20000);
                        $('.personaliz-step-student .personalize-next-btn.student').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "retired"){

                        var url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
                        url.searchParams.set('income', 20000);
                        $('.personaliz-step-student .personalize-next-btn.retired').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('income', 20000);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('income', 20000);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);

                    }


                }
            }
        };
        el.oninput();
    });
}

function personalize_age_range(tempDomain){
    document.querySelectorAll(".__range-step.age").forEach(function(ctrl) {
        var el = ctrl.querySelector('input');
        var output = ctrl.querySelector('output');
        var newPoint, newPlace, offset;
        el.oninput =function(){
            // colorize step options
            ctrl.querySelectorAll("option").forEach(function(opt) {
                if(opt.value<=el.valueAsNumber)
                    opt.style.backgroundColor = '#0768B3';
                else
                    opt.style.backgroundColor = '#C4C4C4';
            });
            // colorize before and after
            var valPercent = (el.valueAsNumber  - parseInt(el.min)) / (parseInt(el.max) - parseInt(el.min));
            var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+
            valPercent+', #0768B3), color-stop('+
            valPercent+', #C4C4C4));';
            el.style = style;

            // Popup
            if((' ' + ctrl.className + ' ').indexOf(' ' + '__range-step-popup' + ' ') > -1)
            {
                var result =ctrl.querySelector('option[value="'+el.value+'"]').textContent;

               if(result == "0"){
                    $('.age-range-result').text('0');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('age', 0);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('age', 0);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }

                }else if(result == "20"){
                    $('.age-range-result').text('20');

                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('age', 20);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('age', 20);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }
                }else if(result == "30"){
                    $('.age-range-result').text('30');
                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('age', 30);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('age', 30);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }

                }else if(result == "40"){
                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('age', 40);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('age', 40);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }
                }else if(result == ">50"){
                    $('.age-range-result').text('>50');
                    if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "married" ){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.married').attr('href'), tempDomain);
                        url.searchParams.set('age', 50);
                        $('.personaliz-step-slider .personalize-next-btn.married').attr('href', url.pathname+url.search);

                    }else if($('.personaliz-step-personal .personalize-next-btn').attr('data-attribute') == "working-adult"){

                        var url = new URL($('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href'), tempDomain);
                        url.searchParams.set('age', 50);
                        $('.personaliz-step-slider .personalize-next-btn.working-adult').attr('href', url.pathname+url.search);
                    }
                }
            }
        };
        el.oninput();
    });
}

function radio_btn(tempDomain){

    $('input[type="radio"]').click((e)=>{
        var val = $(e.currentTarget).val();

        if(val == 'below_18' || val == 'more_18'){
            var url = new URL($('.personaliz-step-student .personalize-next-btn.student').attr('href'), tempDomain);
            url.searchParams.set('age', val);

            $('.personaliz-step-student .personalize-next-btn.student').attr('href', url.pathname+url.search);
        }else if( val == 'below_60' || val == 'more_60'){
            var url = new URL($('.personaliz-step-student .personalize-next-btn.retired').attr('href'), tempDomain);
            url.searchParams.set('age', val);

            $('.personaliz-step-student .personalize-next-btn.retired').attr('href', url.pathname+url.search);
        }

    })
}

if (document.querySelector('.block-personalize-wrapper')) {
    fetch('/currentLang')
        .then(response => response.text())
        .then(lang => {
            let tempURL;
            switch (lang) {
                case 'zh':
                    tempURL = new URL("https://affinalways.com/zh");
                    break;
                case 'ms':
                    tempURL = new URL("https://affinalways.com/bm");
                    break;
                case 'en':
                    default:
                    tempURL = new URL("https://affinalways.com/en");
                    break;
            }

            personalize_age_range(tempURL);
            personalize_income_range(tempURL);
            addremoveBtn();
            radio_btn(tempURL);
            PersonalizeNextBtn(lang, tempURL);
            personalizeSolutionCustomScript();

            var personalised_solutions_based_on_your_lifestyle, select_your_category , describe_yourself, Key_in_your_details;
            var next, back;
            var personal, sme, student, working_adult, married, retired, starts_up, women_entrepreneur, small_and_medium_enterprises;
            var step_1, step_2, step_3;
            var your_age, your_income, my_age_is, my_income_is, years_old;
            var below_18_years, more_than_18_years;

            switch(lang){
                case 'en':
                    personalised_solutions_based_on_your_lifestyle = 'Personalised solutions based on your lifestyle';
                    select_your_category = 'Select your category';
                    describe_yourself='Describe yourself';
                    Key_in_your_details = 'Key in your details';
                    next = 'Next';
                    back = 'Back';

                    step_1 = 'Step 1';
                    step_2 = 'Step 2';
                    step_3 = 'Step 3';

                    personal = 'Personal';
                    sme = 'SME';
                    student = 'Student';
                    working_adult = 'Working Adult';
                    married = 'Married';
                    retired = 'Retired';
                    starts_up = 'Start-ups';
                    women_entrepreneur = 'Women Entrepreneurs';
                    small_and_medium_enterprises = 'Small & Medium Entrepise';

                    your_age = 'Your Age';
                    your_income = 'Your Income';
                    years_old = 'years old';
                    my_age_is = 'My age is ';
                    my_income_is = 'My income is';
                    below_18_years = 'below 18 years';
                    more_than_18_years = 'more than 18 years';
                    break;
                case 'ms':
                    personalised_solutions_based_on_your_lifestyle = 'Penyelesaian khusus berdasarkan gaya hidup anda';
                    select_your_category = 'Pilih kategori anda ';
                    describe_yourself = 'Perkenalkan diri anda';
                    Key_in_your_details = 'Masukkan butiran anda';
                    next = 'Seterusnya';
                    back = 'Kembali';


                    step_1 = 'Langkah 1';
                    step_2 = 'Langkah 2';
                    step_3 = 'Langkah 3';

                    personal = 'Peribadi';
                    sme = 'PKS';
                    student = 'Pelajar';
                    working_adult = 'Dewasa yang bekerja';
                    married = 'Pasangan berkahwin';
                    retired = 'Pesara';
                    starts_up = 'Pemula Niaga';
                    women_entrepreneur = 'Usahawan Wanita';
                    small_and_medium_enterprises = 'Perusahaan Kecil & Sederhana';

                    your_age = 'Umur';
                    your_income = 'Pendapatan';
                    years_old = 'tahun';
                    my_age_is = 'Umur saya ialah ';
                    my_income_is = 'Pendapatan saya ialah';
                    below_18_years = 'bawah 18 tahun';
                    more_than_18_years = '18 tahun ke atas';

                    $('a[href="/women-entrepreneur"]').attr('href', '/bm/women-entrepreneur');
                    $('a[href="/small-and-medium-enterprises"]').attr('href', '/bm/small-and-medium-enterprises');
                    $('a[href="/start-ups"]').attr('href', '/bm/start-ups');

                    break;
                default:
                    personalised_solutions_based_on_your_lifestyle = 'Personalised solutions based on your lifestyle';
                    select_your_category = 'Select your category';
                    describe_yourself='Describe yourself';
                    Key_in_your_details = 'Key in your details';
                    next = 'Next';
                    back = 'Back';

                    step_1 = 'Step 1';
                    step_2 = 'Step 2';
                    step_3 = 'Step 3';

                    personal = 'Personal';
                    sme = 'SME';
                    student = 'Student';
                    working_adult = 'Working Adult';
                    married = 'Married';
                    retired = 'Retired';
                    starts_up = 'Start-ups';
                    women_entrepreneur = 'Women Entrepreneurs';
                    small_and_medium_enterprises = 'Small & Medium Entrepise';

                    your_age = 'Your Age';
                    your_income = 'Your Income';
                    years_old = 'years old';
                    my_age_is = 'My age is ';
                    my_income_is = 'My income is';
                    below_18_years = 'below 18 years';
                    more_than_18_years = 'more than 18 years';
                    break;
            }

            $('.personalize-main-title').text(personalised_solutions_based_on_your_lifestyle);
            $('p[data-text=select_your_category]').text(select_your_category);
            $('p[data-text=describe_yourself]').text(describe_yourself);
            $('p[data-text=Key_in_your_details]').text(Key_in_your_details);
            $('.personalize-next-btn').text(next);
            $('.personalize-back-btn').text(back);

            $('p[data-text=step_1]').text(step_1);
            $('p[data-text=step_2]').text(step_2);
            $('p[data-text=step_3]').text(step_3);

            $('p[data-text=personal]').text(personal);
            $('p[data-text=sme]').text(sme);
            $('p[data-text=student]').text(student);
            $('p[data-text=working_adult]').text(working_adult);
            $('p[data-text=married]').text(married);
            $('p[data-text=retired]').text(retired);
            $('p[data-text=start_ups]').text(starts_up);
            $('p[data-text=women_entrepreneur]').text(women_entrepreneur);
            $('p[data-text=small_and_medium_enterprises]').text(small_and_medium_enterprises);

            $('p[data-text=your_age]').text(your_age);
            $('p[data-text=your_income]').text(your_income);
            $('span[data-text=my_age_is]').text(my_age_is);
            $('span[data-text=my_income_is]').text(my_income_is);
            $('span[data-text=years_old]').text(years_old);
            $('label[data-text=below_18_years]').text(below_18_years);
            $('label[data-text=more_than_18_years]').text(more_than_18_years);

        })
}
