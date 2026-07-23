function landingTC1YoutubeAPI() {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    //function onYouTubeIframeAPIReady() { // this is the ori function but if write like thos wont call so I used window
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: 'M7lc1UVf-VE', //<-- default video that will play
            playerVars: {
                'playsinline': 1
            },
            events: {
                'onReady': onPlayerReady,
                // 'onStateChange': onPlayerStateChange
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        const playBtn = $('.play-btn')[0];
        const close_btn = $('.close')[0];
        const video_wrapper = $('.video-wrapper')[0];

        playBtn.addEventListener("click", () => {
            landingTC1YoutubeIDSearch(player);
            player.playVideo();
            video_wrapper.classList.toggle("display-none");
        });

        video_wrapper.addEventListener("click", () => {
            player.stopVideo();
            video_wrapper.classList.toggle("display-none");
        });
    }
}

function landingTC1YoutubeIDSearch(player) {
    let video_button = $('.video-button-a')[0];
    video_button = video_button.search;
    const urlParams = new URLSearchParams(video_button);
    const youtubeVideoId = urlParams.get('v');

    if (youtubeVideoId) { // if link is null then will load the previos loaded video
        player.loadVideoById(youtubeVideoId);
    }
}

landingTC1YoutubeAPI();