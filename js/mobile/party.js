
//playlist staus
var playlist_open = false;

google.appengine.pocketjuke.production.signin = function(callback) {
  //alert(localStorage.getItem("logged"));
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: localStorage.getItem("logged")},
      callback);
};

//Song inforamtion retreval from spotify
//version: 1.0 Added active album ingection
add_song_info = function(trackID){
    //alert(trackID);
    $.ajax({
      url: 'https://api.spotify.com/v1/tracks/'+trackID,

      success: function(resp){
          //alert(resp.album.images[0].url);
          //var id = "#" + trackID;
          //window.location.href = resp.album.images[0].url;
          //document.querySelector('#active_song').innerHTML = ""
          document.getElementById(trackID+"_art").style.backgroundImage = 'url(' + resp.album.images[1].url+')';
          document.getElementById(trackID+"_art").style.backgroundSize = "100%";

          document.getElementById(trackID+'_name').innerHTML = resp.name;
      }
    });

};

google.appengine.pocketjuke.production.vote_song = function(id){

      gapi.client.pocketjuke.pocketjuke.voteSongAuthed({"track_id":id}).execute(function(resp){
        if(!resp.code){
          //alert(resp.response);
        }else{
          //alert("someting wong");
        }
      });



};

google.appengine.pocketjuke.production.secondary_playlist = function(){
  var name = document.querySelector("#party_name").innerHTML;
  gapi.client.pocketjuke.pocketjuke.getpartyinfoAuthed({
    response: name
  }).execute(function(resp){
    if(!resp.code){
      if(resp.Activity_list[0].track_id != 1){
        var count;
        if(resp.Activity_list.length > 9){
          count = 9;
        }else{
          count = resp.Activity_list.length;
        }
        var tracks = "";
        tracks += resp.Activity_list[1].track_id;
        for(var i = 2 ; i < count  ; i++){
          tracks += "," + resp.Activity_list[i].track_id;
        }
        $.ajax({
          url: 'https://api.spotify.com/v1/tracks',
          data: {
            ids: tracks
          },
          success: function(resp){
            if(!resp.code){
              var songs = resp.tracks;
              document.querySelector("#active_playlist").innerHTML = "";
              for(var j = 0;j < songs.length;j++){
                if(j < songs.length){
                  var row = document.createElement('div');
                  row.className = "row";
                  var card_info_1 = document.createElement('div');
                  card_info_1.className = "song_info_card";
                  var card_name_1 = document.createElement('p');
                  card_name_1.className = "song_title";
                  card_name_1.innerHTML = songs[j].name;
                  card_info_1.appendChild(card_name_1);
                  var song_card_1 = document.createElement('div');
                  song_card_1.className = "song_card";
                  song_card_1.style.backgroundImage = 'url(' +songs[j].album.images[1].url+')';
                  song_card_1.style.backgroundSize = "19vh 32vw";
                  song_card_1.appendChild(card_info_1);
                  var link_1 = document.createElement('a');
                  link_1.className = "card";
                  link_1.href="#";
                  link_1.id = songs[j].id;
                  link_1.appendChild(song_card_1);
                  link_1.addEventListener('click',function(e){
                    google.appengine.pocketjuke.production.vote_song(this.id);
                    //alert(this.id || 'No id');
                  });
                }

                row.appendChild(link_1);
                j++;
                if(j < songs.length){
                  var card_info_2 = document.createElement('div');
                  card_info_2.className = "song_info_card";
                  var card_name_2 = document.createElement('p');
                  card_name_2.className = "song_title";
                  card_name_2.innerHTML = songs[j].name;
                  card_info_2.appendChild(card_name_2);
                  var song_card_2 = document.createElement('div');
                  song_card_2.className = "song_card";
                  song_card_2.style.backgroundImage = 'url(' +songs[j].album.images[1].url+')';
                  song_card_2.style.backgroundSize = "19vh 32vw";
                  song_card_2.appendChild(card_info_2);
                  var link_2 = document.createElement('a');
                  link_2.className = "card";
                  link_2.href="#";
                  link_2.id = songs[j].id;
                  link_2.addEventListener('click',function(e){
                    google.appengine.pocketjuke.production.vote_song(this.id);
                    //alert(this.id || 'No id');
                  });
                  link_2.appendChild(song_card_2);
                  row.appendChild(link_2);
                }
                document.querySelector("#active_playlist").appendChild(row);
              }
            }
          }
        });
      }
    }
  });
};
//Retrive party information for the active party
//version: 1.0 retreval function added to get infor about the party
//version: 1.1 Added song information function
google.appengine.pocketjuke.production.getPartyInfo = function(){
  gapi.client.pocketjuke.pocketjuke.getpartyinfoAuthed({
    response: document.querySelector("#party_name").innerHTML
  }).execute(function(resp){
    //var party_name = resp.party_name;
    //alert(resp.Activity_list[0].track_id);
    if(!resp.code){
      //alert(resp.response);
      if(resp.Activity_list[0].track_id != 1){
      //document.querySelector('#party_name').innerHTML = resp.party_name;
        document.querySelector("#attending").innerHTML = resp.attending;
        if(resp.Activity_list.length > 4){
          count = 4;
        }else{
          count = resp.Activity_list.length;
        }
        var playlist_button = document.querySelector('#more_songs');
        document.querySelector("#queue").innerHTML = "";
        for(var i = 0 ; i < count; i++){
          //update active song div
          //var playlist_button = document.querySelector('#more_songs');
          if(i == 0){
            //var active_song = document.createElement('p');
            //active_song.className = "song_active";
            //active_song.innerHTML = resp.Activity_list[i].track_id;
            //document.querySelector("#active_song").appendChild(active_song);
            document.querySelector("#active_song").id = resp.Activity_list[i].track_id +"_art";
            add_song_info(resp.Activity_list[i].track_id);
            var active_name = document.createElement('p')
            active_name.id = resp.Activity_list[i].track_id +"_name";
            document.querySelector(".active_song").appendChild(active_name);
          }else{
            var song_entity = document.createElement("a");
            song_entity.id = resp.Activity_list[i].track_id;
            song_entity.addEventListener('click',function(){
              google.appengine.pocketjuke.production.vote_song(this.id);
              //alert(this.id|| "no ID");
            });
            var div_song_name = document.createElement("div");
            div_song_name.className = "song_name";
            var div_song_icon = document.createElement("div");
            div_song_icon.className = "song_icon";
            div_song_icon.id = resp.Activity_list[i].track_id +"_art";
            var song_name = document.createElement("p");
            //song_name.innerHTML = resp.Activity_list[i].track_id;
            song_name.id = resp.Activity_list[i].track_id +'_name';
            div_song_name.appendChild(song_name);
            var div_song_main = document.createElement("div");
            div_song_main.className = "song_main " +"song_"+i;
            //div_song_main.id = resp.Activity_list[i].track_id;
            div_song_main.appendChild(div_song_icon);
            div_song_main.appendChild(div_song_name);
            song_entity.appendChild(div_song_main);
            document.querySelector("#queue").appendChild(song_entity);
            add_song_info(resp.Activity_list[i].track_id);
          }
        }
        document.querySelector("#queue").appendChild(playlist_button);


        document.querySelector('#more_songs').addEventListener('click',function(){

            $("#playlist_landing").css('z-index',1000);
            document.querySelector("#playlist_landing").style.position = "absolute";
            $("#playlist_landing").animate({height: "94vh"},200);
            $("#playlist_landing").animate({width: "82vw"},200);
            $("#playlist_landing").fadeIn();
            $("#active_playlist").animate({height: "94vh"},200);
            $("#active_playlist").animate({width: "82vw"},200);
            $("#active_playlist").fadeIn();
            setTimeout(google.appengine.pocketjuke.production.secondary_playlist,400);
            //add click listener for closing the


            document.querySelector("#playlist").addEventListener('click',function(){
              $("#suggestion_playlist").fadeOut();
              $("#suggestion_playlist").animate({width: "0vw"},200);

              $("#active_playlist").animate({height: "95vh"},200);
              $("#active_playlist").animate({width: "82vw"},200);
              $("#active_playlist").fadeIn();


            });
            document.querySelector("#suggestion").addEventListener('click',function(){
              $("#active_playlist").fadeOut();
              $("#active_playlist").animate({width: "0vw"},200);

              $("#suggestion_playlist").animate({width: "82vw"},200);
              $("#suggestion_playlist").animate({height: "94vw"},200);
              $("#suggestion_playlist").fadeIn();
            });
            document.querySelector("#close").addEventListener('click',function(){
              $("#playlist_landing").fadeOut();
              $("#playlist_landing").css('z-index',0);
              document.querySelector("#playlist_landing").style.position = "realtive";
              $("#playlist_landing").animate({height: "0vh"},200);
              $("#playlist_landing").animate({width: "0vw"},200);
            });

            /*
            $("#playlist_landing").css('z-index',1000);
            document.querySelector("#playlist_landing").style.position = "absolute";
            //$("#playlist_landing").animate({top: "-.1vh",left:"-2vw"},500);
            $("#playlist_landing").animate({height: "95vh"},500);
            $("#playlist_landing").animate({width: "80vw"},500);

            //setTimeout(google.appengine.pocketjuke.production.secondary_playlist,1700);
            $("#playlist_landing").fadeIn();
            */



          /*else{
            $("#playlist_landing").css('z-index',1000);

            document.querySelector('#playlist_landing').innerHTML = "";
            $("#playlist_landing").fadeOut();
            $("#playlist_landing").animate({top: "+=.1vh",left:"+=2vw"},500);
            $("#playlist_landing").animate({height: "2vh"},500);
            $("#playlist_landing").animate({width: "75vw"},500);
            //pause(500);
            document.querySelector("#more_songs_container").style.position = "relative";
            playlist_open = false;
          }*/
        });

        //document.querySelector("#queue").appendChild(more_songs);
        //add_song_info(resp);
      }
    }else{
      alert(resp.code);
    }

  });


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
    var return_button = document.createElement('div');
    return_button.className = "return_button";
    return_button.addEventListener('click',function(){
      window.location.href = '/party';
    });
    document.querySelector('#results').appendChild(return_button);

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

google.appengine.pocketjuke.production.leave_party = function(){

  gapi.client.pocketjuke.pocketjuke.leavePartyAuthed().execute(function(resp){
    if(!resp.code){
    }

  });
  pause(1000);
  window.location.href = '/landing';
};
google.appengine.pocketjuke.production.enableButtons = function(){
  //alert(localStorage.getItem("session_token"));
  google.appengine.pocketjuke.production.getPartyInfo();
  document.querySelector("#search_song").addEventListener('click',function(e){
    //alert(document.querySelector("#name").value);
    searchSong(document.querySelector("#name").value);
  });
  //document.querySelector("#leave_party").addEventListener('click',function(e){
    //alert(document.querySelector("#name").value);
    //google.appengine.pocketjuke.production.leave_party();
  //});
};
pause = function(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); }
  while(curDate-date < millis);
};
