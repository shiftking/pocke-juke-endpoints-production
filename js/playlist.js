google.appengine.pocketjuke.production.signin = function(callback) {
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: true},
      callback);
};
google.appengine.pocketjuke.production.enableButtons = function(){
  document.querySelector("#search_song").addEventListener('click',function(e){
    //alert(document.querySelector("#name").value);
    searchSong(document.querySelector("#name").value);
  });
  var card_class = document.getElementsByClassName('card');

};

google.appengine.pocketjuke.production.add_song = function(id){
  gapi.client.pocketjuke.pocketjuke.addSongAuthed({"track_id":id}).execute(function(resp){
    if(!resp.code){
      //alert(resp.response);
      gapi.client.pocketjuke.pocketjuke.voteSongAuthed({"track_id":id}).execute(function(resp){
        if(!resp.code){
          //alert(resp.response);
        }else{
          //alert("someting wong");
        }
      });
    }else{
      //alert("someting wong");
    }
  });


};
var printSongs = function(resp){
  var songs = resp.tracks.items;
  //alert(songs.length);
  document.querySelector("#results").innerHTML = "";
  if(songs.length > 0){
    for(var i = 0;i<songs.length;i+=2){
      var row = document.createElement('div');
      row.className = "row";
      var card_info_1 = document.createElement('div');
      card_info_1.className = "song_info_card";
      var card_name_1 = document.createElement('p');
      card_name_1.className = "song_title";
      card_name_1.innerHTML = songs[i].name;
      card_info_1.appendChild(card_name_1);
      var song_card_1 = document.createElement('div');
      song_card_1.className = "song_card";
      song_card_1.style.backgroundImage = 'url(' +songs[i].album.images[1].url+')';
      song_card_1.style.backgroundSize = "19.5vh 32.5vw";
      song_card_1.appendChild(card_info_1);
      var link_1 = document.createElement('a');
      link_1.className = "card";
      link_1.href="#";
      link_1.id = songs[i].id;
      link_1.appendChild(song_card_1);
      link_1.addEventListener('click',function(e){
        google.appengine.pocketjuke.production.add_song(this.id);
        //alert(this.id || 'No id');
      });
      var card_info_2 = document.createElement('div');
      card_info_2.className = "song_info_card";
      var card_name_2 = document.createElement('p');
      card_name_2.className = "song_title";
      card_name_2.innerHTML = songs[i+1].name;
      card_info_2.appendChild(card_name_2);
      var song_card_2 = document.createElement('div');
      song_card_2.className = "song_card";
      song_card_2.style.backgroundImage = 'url(' +songs[i +1].album.images[1].url+')';
      song_card_2.style.backgroundSize = "19.5vh 32.5vw";
      song_card_2.appendChild(card_info_2);
      var link_2 = document.createElement('a');
      link_2.className = "card";
      link_2.href="#";
      link_2.id = songs[i+1].id;
      link_2.addEventListener('click',function(e){
        google.appengine.pocketjuke.production.add_song(this.id);
        //alert(this.id || 'No id');
      });
      link_2.appendChild(song_card_2);
      row.appendChild(link_1);
      row.appendChild(link_2);
      document.querySelector("#results").appendChild(row);

    }
  }else{
    //insert a fail card
  }
};
var searchSong = function(query){
  $.ajax({
       url: 'https://api.spotify.com/v1/search',
       data: {
           q: query,
           type: 'track',
           market: 'US',
           limit: '8'
       },
       success: function (response) {
           printSongs(response);
       }
   });

};
