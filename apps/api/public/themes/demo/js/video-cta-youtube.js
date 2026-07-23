function videoCTAYoutube() {
    let blocks = document.getElementsByClassName('block-video-cta-youtube'); //Get all the video cta utube block

    for (let i = 0; i < blocks.length; i++) {
        let playLinkBtn = blocks[i].getElementsByClassName('play-link')[0]; // Get the play button of that block
        let watchVideoBtn = playLinkBtn.search; // Get youtube video ID from href
        const urlParams = new URLSearchParams(watchVideoBtn);
        const youtubeVideoId = urlParams.get('v');

        let tempId = "video-cta-youtube-modal" + i; // Set the modal toggle id
        let tempTargetId = "#" + tempId;
        playLinkBtn.dataset.target =  tempTargetId

        let videoModal = blocks[i].getElementsByClassName('modal')[0]; // Get the modal and set the id
        videoModal.id = tempId;

        let videoSrc = "https://www.youtube.com/embed/" + youtubeVideoId;

        // let backgroundYoutubeVideo = blocks[i].getElementsByClassName('bg-video-foreground')[0]; // Set block background iframe
        // let bgYoutubeIframe = '<iframe src="' + videoSrc + '?autoplay=1&mute=1&playlist=' + youtubeVideoId + '&loop=1&controls=0" frameborder="0"></iframe>';
        // backgroundYoutubeVideo.innerHTML = bgYoutubeIframe;

        let popupYoutubeVideo = blocks[i].getElementsByClassName('popup-content')[0]; // Set popup modal iframe
        let popupYoutubeIframe = '<iframe id="popup-iframe" src="" frameborder="0" allowfullscreen></iframe>';
        popupYoutubeVideo.innerHTML =  popupYoutubeIframe;

        $(tempTargetId).on('show.bs.modal', function () { // Set back the iframe src when open modal
            $('iframe', tempTargetId).attr("src", videoSrc);
        })

        $(tempTargetId).on('hidden.bs.modal', function () { // Set modal iframe src null when close the modal
            $('iframe', tempTargetId).attr("src", null);
        })
    }
}

videoCTAYoutube()
