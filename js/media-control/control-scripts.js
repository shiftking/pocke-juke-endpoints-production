
function onPlayerStateChange(event) {
      switch(event.data){
        case 0:

            google.appengine.pocketjuke.production.update_playing_status_false();
            break;
        case 1:
            google.appengine.pocketjuke.production.update_playing_status_true();
          break;

      }
};


function onPlayerReady(event) {

};


function onYouTubeIframeAPIReady() {
  //alert('loading Iframe');
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
};
function skipSong(){

  player.pauseVideo();
  google.appengine.pocketjuke.production.update_playing_status_false();
  google.appengine.pocketjuke.production.update_party_details();
}

function stopVideo() {
  player.pauseVideo();

};
function startVideo(){

  player.setVolume(30);
  player.playVideo();

};
