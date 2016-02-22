
google.appengine.pocketjuke.production.update_party = function(party_info){
  //document.querySelector("#party_name").innerHTML = party_info.party_name;
  var remaining = 11;
  var tracks = '';
  tracks+= party_info.Activity_list[0].track_id;
  for(var i =1;i < party_info.Activity_list.length;i++){
    tracks+=','+ party_info.Activity_list[i].track_id;

  }
  $.ajax({
       url: 'https://api.spotify.com/v1/tracks',
       data: {
         ids: tracks
       },
       success: function (response) {
           for(var i = 0;i<party_info.Activity_list.length;i++){
             document.querySelector("#card_"+queue_position[10-i]+"_inner").style.backgroundImage = "url(" + response.tracks[i].album.images[0].url+')';
             document.querySelector("#card_"+queue_position[10-i]+"_inner").style.backgroundSize = "100%";
             document.querySelector("#card_"+queue_position[10-i]+"_name").innerHTML = response.tracks[i].name;
             $("#card_"+queue_position[10-i]).fadeIn();
             remaining--;
           }
           for(var i = 0;i<remaining;i++){
             $("#card_"+queue_position[i]).fadeOut();
           }
       }
   });
};
/*
# Description: updates the song info for the cards in the plalist position
#
# Version update: 0.1 added ajax call, still need to get it working
*/
update_party = function(party_details){
  document.querySelector("#party_name").innerHTML = party_details.party_name;
}
google.appengine.pocketjuke.production.update_party_details = function(){
  gapi.client.pocketjuke.pocketjuke.getpartyinfoAuthed({
    "response": document.querySelector("#party_name").innerHTML
  }).execute(function(resp){
    if(!resp.code){
      google.appengine.pocketjuke.production.update_party(resp);
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
