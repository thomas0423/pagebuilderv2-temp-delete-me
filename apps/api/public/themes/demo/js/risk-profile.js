
function risk_profile(){

    $(document).ready(function () {

        $('.risk-profile-info').hover(function(e){
            $(e.currentTarget).popover('show');
        },function(e){
            $(e.currentTarget).popover('hide');
        });


        $('.btn-risk-profile').on('click',(e)=>{
            var planCount = 0,investCount = 0;
            if( $(e.currentTarget).attr('data-question') == 'plan-to-invest'){
                $('.btn-risk-profile[data-question=plan-to-invest]').each(function(){
                    if($(this).attr('data-status') == 'click'){
                        planCount++;
                    }
                });

                if($(e.currentTarget).attr('data-status') == 'none' && planCount < 1){
                    $(e.currentTarget).attr('data-status', 'click');
                    $(e.currentTarget).css({'position':'relative', 'outline': 'none !important','border': '2px solid #0768B3'}).append(
                        $('<img>').addClass('risk-profile-close-btn').attr({'src':'/img/affin-always-card-boxes/delete.png'})
                    )
                    $('.bg-next').css({'pointer-events':'all','opacity':'1'});
                }else{
                    $(e.currentTarget).attr('data-status', 'none');
                    $(e.currentTarget).children('.risk-profile-close-btn').remove();
                    $(e.currentTarget).css({'position':'static','border': '2px solid #C4C4C4'});
                    $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
                }
            }else if( $(e.currentTarget).attr('data-question') == 'investment-goal'){
                $('.btn-risk-profile[data-question=investment-goal]').each(function(){
                    if($(this).attr('data-status') == 'click'){
                        investCount++;
                    }
                });

                if($(e.currentTarget).attr('data-status') == 'none' && investCount < 1){
                    $(e.currentTarget).attr('data-status', 'click');
                    $(e.currentTarget).css({'position':'relative', 'outline': 'none !important','border': '2px solid #0768B3'}).append(
                        $('<img>').addClass('risk-profile-close-btn').attr({'src':'/img/affin-always-card-boxes/delete.png'})
                    )
                    $('.bg-next').css({'pointer-events':'all','opacity':'1'});
                }else{
                    $(e.currentTarget).attr('data-status', 'none');
                    $(e.currentTarget).children('.risk-profile-close-btn').remove();
                    $(e.currentTarget).css({'position':'static','border': '2px solid #C4C4C4'})
                    $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
                }
            }

            planCount=0;
            investCount = 0;
        });

        $('.bg-skip').click((e)=>{
            var investCount = 0; var planCount = 0

            if($(e.currentTarget).attr('data-question') == 'investment-goal'){
                $('#plan-to-invest').hide();
                $('#investment-goal').fadeIn();
                $('#passive-income').hide();

                $('.btn-risk-profile[data-question=investment-goal]').each(function(){
                    if($(this).attr('data-status') == 'click'){
                        investCount++;
                    }
                });

                if(investCount < 1){
                    $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
                }else{
                    $('.bg-next').css({'pointer-events':'all','opacity':'1'});
                }

            }else if($(e.currentTarget).attr('data-question') == 'plan-to-invest'){
                $('#plan-to-invest').fadeIn();
                $('#investment-goal').hide();
                $('#passive-income').hide();

                $('.btn-risk-profile[data-question=plan-to-invest]').each(function(){
                    if($(this).attr('data-status') == 'click'){
                        planCount++;
                    }
                });

                if(planCount < 1){
                    $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
                }else{
                    $('.bg-next').css({'pointer-events':'all','opacity':'1'});
                }

            }else if($(e.currentTarget).attr('data-question') == 'passive-income'){
                $('#plan-to-invest').hide();
                $('#investment-goal').hide();
                $('#passive-income').fadeIn();
                $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
            }
        });

        $('.bg-back').click(()=>{

            var planCount=0;
            console.log('back-click', planCount);
            $('#plan-to-invest').fadeIn();
            $('#investment-goal').hide();
            $('#passive-income').hide();

            $('.btn-risk-profile[data-question=plan-to-invest]').each(function(){
                if($(this).attr('data-status') == 'click'){
                    planCount++;
                }
            });

            if(planCount < 1){
                $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
            }else{
                $('.bg-next').css({'pointer-events':'all','opacity':'1'});
            }

        })

        $('input[name=customRadio]').click((e)=>{
            $('.bg-next').css({'pointer-events':'all','opacity':'1'});
        })

        $('.bg-next').click((e)=>{
            var investCount = 0; var planCount = 0
            if($(e.currentTarget).attr('data-question') == 'investment-goal'){
                $('#plan-to-invest').hide();
                $('#investment-goal').fadeIn();
                $('#passive-income').hide();

                $('.btn-risk-profile[data-question=investment-goal]').each(function(){
                    if($(this).attr('data-status') == 'click'){
                        investCount++;
                    }
                });

                if(investCount < 1){
                    $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
                }else{
                    $('.bg-next').css({'pointer-events':'all','opacity':'1'});
                }

            }else if($(e.currentTarget).attr('data-question') == 'plan-to-invest'){
                $('#plan-to-invest').fadeIn();
                $('#investment-goal').hide();
                $('#passive-income').hide();

                $('.btn-risk-profile[data-question=plan-to-invest]').each(function(){
                    if($(this).attr('data-status') == 'click'){
                        planCount++;
                    }
                });

                if(planCount < 1){
                    $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});
                }else{
                    $('.bg-next').css({'pointer-events':'all','opacity':'1'});
                }

            }else if($(e.currentTarget).attr('data-question') == 'passive-income'){
                $('#plan-to-invest').hide();
                $('#investment-goal').hide();
                $('#passive-income').fadeIn();
                $('.bg-next').css({'pointer-events':'none','opacity':'0.8'});

            }else if($(e.currentTarget).attr('data-question') == 'go-to-next-page'){
                var totalScore = 0;
                var planScore = $('.btn-risk-profile[data-question=plan-to-invest][data-status=click]').attr('data-value') ?? 0;
                var investmentScore = $('.btn-risk-profile[data-question=investment-goal][data-status=click]').attr('data-value') ?? 0;
                var passiveScore = $('input[name=customRadio]:checked').val() ?? 0 ;

                totalScore = parseInt(planScore) + parseInt(investmentScore) + parseInt(passiveScore);

                if(totalScore <= 4){
                    window.open('/my-investments?score='+totalScore+'&asset-class=conservative ');
                }else if(totalScore <= 8){
                    window.open('/my-investments?score='+totalScore+'&asset-class=conservative ,balanced');
                }else if(totalScore <= 12){
                    window.open('/my-investments?score='+totalScore+'&asset-class=conservative,balanced,growth');
                }else if(totalScore <= 15){
                    window.open('/my-investments?score='+totalScore+'&asset-class=conservative,balanced,growth,aggressive');
                }
            }
        });
    })
}

if (document.querySelector('.block-risk-profile-wrapper')) {
    risk_profile();
}

