google.appengine.pocketjuke.production.signin = function(callback) {
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: true},
      callback);
};

pause = function(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); }
  while(curDate-date < millis);
}
/* Depricated moved to syncronus HTTPS call
google.appengine.pocketjuke.production.add_party = function(){
  var party_name = document.querySelector('#party_name').value;
  var code = document.querySelector("#party_code_1").value;
  gapi.client.pocketjuke.pocketjuke.addPartyAuthed({'name': party_name,'code': code}).execute(function(resp){
    if(!resp.code){
      //alert(resp.response);//used for troubleshooting
      //alert(party_name);
      pause(500);
      window.location.href = '/web_party';
    }else{
      alert(resp.code);
    }
  });
};
*/

google.appengine.pocketjuke.production.enableButtons = function(){


    //var submit_party = document.querySelector('#create_party');

    //submit_party.addEventListener('click',function(){
      //google.appengine.pocketjuke.production.add_party();
    //});
};
