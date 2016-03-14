
//local variable the keeps track of weather the song is playing or nor
var playing = false;
//local variable to keep track of the update state for telling the server if the song status needs to be update_party_details
var update = false;
//local variable to keep track of weather the staus of the song has been update_party_details
var updated = false;
pause = function(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); }
  while(curDate-date < millis);
};
leave_party = function(){
  window.location.href = "/leave_web";
};

update_party = function(party_info){
  //document.querySelector("#party_name").innerHTML = party_info.party_name;
  var items= 0;
  var tracks = '';
  document.querySelector("#attending").innerHTML = party_info.attending;
  tracks+= party_info.Activity_list[0].track_id;
  if (party_info.Activity_list.length > 11){
    items = 11;
  }else{
    items = party_info.Activity_list.length;
  }
  for(var i =1;i < items;i++){
    tracks+=','+ party_info.Activity_list[i].track_id;

  }

    $.ajax({
         url: 'https://api.spotify.com/v1/tracks',
         data: {
           ids: tracks
         },
         success: function (response) {

           document.querySelector('#playlist').innerHTML = "";
           tracks = response.tracks;
           //add values for the active song
           //check to see if the active song is the same as the first in the response
            if(document.querySelector('.active').id != tracks[0].id){
              document.querySelector('.active').id = tracks[0].id;
              document.querySelector('#active_song').style.backgroundImage = "url("+tracks[0].album.images[1].url+")";
              document.querySelector('#active_song').style.backgroundSize = "100% 100%";
              document.querySelector('#active_song_name').innerHTML = tracks[0].name;
              //reload the audio for this song into the item frame
              var name = tracks[0].name +','+tracks[0].artists[0].name ;
              google.appengine.pocketjuke.production.load_song(name);
              //pause(2000);


            }
            //add remaining
             for(var i = 1;i<tracks.length ;i++){
               //first column
               var card_container = document.createElement('div');
               card_container.className = "col-xs-6";
               var card = document.createElement('div');
               card.className = "song_card";
               //album art
               var album_container = document.createElement('div');
               album_container.className = "col-xs-4";
               var album = document.createElement('div');
               album.style.backgroundImage = "url("+tracks[i].album.images[1].url+")";
               album.style.backgroundSize = "100% 100%";
               album.className = "album_cover";
               album_container.appendChild(album);

               card.appendChild(album_container);

               //song info
               var song_info_container = document.createElement('div');
               song_info_container.className = "col-xs-6";
               var song = document.createElement('div');
               song.className = "song";
               var song_name = document.createElement('p');
               var album_name = document.createElement('p');
               song_name.innerHTML = tracks[i].name;
               song_name.className = 'song-name';
               album_name.innerHTML = tracks[i].artists[0].name;
               album_name.className = "album-name";
               song.appendChild(song_name);
               song.appendChild(album_name);
               song_info_container.appendChild(song);
               card.appendChild(song_info_container);
               card_container.appendChild(card);
               //add vote number laterthe voting of already suggested music
               document.querySelector('#playlist').appendChild(card_container);
               i++;
               if(i < party_info.Activity_list.length ){ //second column
                 var card_container = document.createElement('div');
                 card_container.className = "col-xs-6";
                 var card = document.createElement('div');
                 card.className = "song_card";
                 //album art
                 var album_container = document.createElement('div');
                 album_container.className = "col-xs-4";
                 var album = document.createElement('div');
                 album.style.backgroundImage = "url("+tracks[i].album.images[1].url+")";
                 album.style.backgroundSize = "100% 100%";
                 album.className = "album_cover";
                 album_container.appendChild(album);

                 card.appendChild(album_container);

                 //song info
                 var song_info_container = document.createElement('div');
                 song_info_container.className = "col-xs-6";
                 var song = document.createElement('div');
                 song.className = "song";
                 var song_name = document.createElement('p');
                 var album_name = document.createElement('p');
                 song_name.innerHTML = tracks[i].name;
                 song_name.className = 'song-name';
                 album_name.innerHTML = tracks[i].artists[0].name;
                 album_name.className = "album-name";
                 song.appendChild(song_name);
                 song.appendChild(album_name);
                 song_info_container.appendChild(song);
                 card.appendChild(song_info_container);
                 card_container.appendChild(card);
                 //add vote number later
                 document.querySelector('#playlist').appendChild(card_container);

               }
             }

         }
     });

};
google.appengine.pocketjuke.production.signin = function(callback) {
  //alert(localStorage.getItem("logged"));
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: localStorage.getItem("logged")},
      callback);
};
google.appengine.pocketjuke.production.enableButtons = function(){
  document.querySelector("#leave_party").addEventListener('click',function(e){
    //alert(document.querySelector("#name").value);

    leave_party();
  });
  document.querySelector('#play_song').addEventListener('click',function(){
    //$('#play_overlay').fadeIn();

    if(updated){//server has been updated
      if(playing){//song is palying
        stopVideo();
        playing =false
      }else{//song is not playing
        startVideo();
        playing = false;
      }
    }else{ //server has not been updated
      if(!playing){
        //update server with song palying set true
        startVideo();
        playing = true;
        updated = true;

      }
    }
    //google.appengine.pocketjuke.production.get_video_id(document.querySelector('#active_song_name').innerHTML);
  });
  google.appengine.pocketjuke.production.update_party_details();
  setInterval(function(){

    google.appengine.pocketjuke.production.update_party_details();
  },5000);
};

/*
# Description: updates the song info for the cards in the plalist position
#
# Version update: 0.1 added ajax call, still need to get it working
*/

google.appengine.pocketjuke.production.update_party_details = function(){



  gapi.client.pocketjuke.pocketjuke.getpartyinfoAuthed({
    "response": document.querySelector("#party_name").innerHTML
  }).execute(function(resp){
    if(!resp.code){
      if(resp.Activity_list[0].track_id != 1){
        update_party(resp);
        //alert('updating party');
      }else{
        document.querySelector('#attending').innerHTML = resp.attending;
      }
    }
  });

};




google.appengine.pocketjuke.production.update_playing_status_true = function(){

    gapi.client.pocketjuke.pocketjuke.playAuthed({
      "track_id": document.querySelector('.active').id
    }).execute(function(resp){
      if(!resp.code){

      }
    });

};
google.appengine.pocketjuke.production.update_playing_status_false = function(){
  gapi.client.pocketjuke.pocketjuke.stopAuthed({
    "track_id": document.querySelector('.active').id
  }).execute(function(resp){
    google.appengine.pocketjuke.production.update_party_details();
  });
};
google.appengine.pocketjuke.production.load_song = function(name){

    var results = gapi.client.youtube.search.list({
      q: name,
      part: 'snippet',
      maxResults: 1
    }).execute(function(resp){
      //created = true;

      player.loadVideoById(resp.result.items[0].id.videoId,0,'default');
      if(playing){
        startVideo();

      }else{
        stopVideo();
      }

    });


};

function onPlayerStateChange(event) {
      switch(event.data){
        case 0:
            google.appengine.pocketjuke.production.update_playing_status_false();
            break;
        case 1:
            google.appengine.pocketjuke.production.update_playing_status_true();
          break;
            //setTimeout(startVideo(),7500);
        case 2:
            // /startVideo();
          break;
      }
};


function onPlayerReady(event) {

};
var player;

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


function stopVideo() {
  player.pauseVideo();
};
function startVideo(){

  player.setVolume(30);
  player.playVideo();

};
