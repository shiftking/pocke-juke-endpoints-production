
update_party = function(party_info){
  //document.querySelector("#party_name").innerHTML = party_info.party_name;
  var items= 0;
  var tracks = '';
  tracks+= party_info.Activity_list[0].track_id;
  if (party_info.Activity_list.length > 11){
    items = 11;
  }else{
    items = party_info.Activity_list.length;
  }
  for(var i =1;i < items;i++){
    tracks+=','+ party_info.Activity_list[i].track_id;

  }
  if(items > 0){
    $.ajax({
         url: 'https://api.spotify.com/v1/tracks',
         data: {
           ids: tracks
         },
         success: function (response) {
           document.querySelector('#playlist').innerHTML = "";
           tracks = response.tracks;
           //add values for the active song
              document.querySelector('#active_song').style.backgroundImage = "url("+tracks[0].album.images[1].url+")";
              document.querySelector('#active_song').style.backgroundSize = "100% 100%";
              document.querySelector('#active_song_name').innerHTML = tracks[0].name;
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
               //add vote number later
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
   }
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
      update_party(resp);
    }
  });

};

pause = function(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); }
  while(curDate-date < millis);
}
leave_party = function(){
  window.location.href = "/leave_web";
}
google.appengine.pocketjuke.production.enableButtons = function(){
  document.querySelector("#leave_party").addEventListener('click',function(e){
    //alert(document.querySelector("#name").value);
    leave_party();
  });

  google.appengine.pocketjuke.production.update_party_details();
  setInterval(function(){

    google.appengine.pocketjuke.production.update_party_details();
  },5000);
};
google.appengine.pocketjuke.production.signin = function(callback) {
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: true},
      callback);
};
