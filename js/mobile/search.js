google.appengine.pocketjuke.production.signin = function(callback) {
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: localStorage.getItem("logged")},
      callback);
};
//Enable buttons
//version: 1.0 added button listener for searching for parties
google.appengine.pocketjuke.production.enableButtons = function(){


    var submit_party = document.querySelector('#search_party');

    submit_party.addEventListener('click',function(event){
      event.preventDefault();
      google.appengine.pocketjuke.production.search_party();
    });
};
//accesses pocketjuke api to search for parties to join
//version: 1.0 added ajax request for api
google.appengine.pocketjuke.production.search_party = function(){
  var name = document.querySelector("#name").value || 'none';
  gapi.client.pocketjuke.pocketjuke.getPartysAuthed({
    "name": name
  }).execute(function(resp){
    if(!resp.code){
      add_parties(resp);
    }else{
      //alert(resp.code);
    }
  });
};
pause = function(millis) {
  var date = new Date();
  var curDate = null;

  do { curDate = new Date(); }
  while(curDate-date < millis);
};
//adds the returned parties that were send by the api call to search for a party.
//version: 1.0 basic response handeling
add_parties = function(response){
  if(response.code_ != 0){
    //alert('adding parties');
    var parties = response.Parties;
    for(var i =0;i <parties.length;i++){
      var frame = document.createElement('div');
      frame.className = "join-results";
      var inner_frame = document.createElement('div');
      inner_frame.className = "col-xs-12 inner-frame";
      var party_art = document.createElement('div');
      party_art.className = "party-art col-xs-4";
      var party_name_cont = document.createElement('div');
      party_name_cont.className = "party-name-cont col-xs-6";
      var party_name = document.createElement('p');
      party_name.className = "party-name ";
      party_name.innerHTML = parties[i].name;
      var form = document.createElement('form');
      form.setAttribute('method',"post");
      form.id = parties[i].name;
      form.className = "form-inline";
      var input_hid = document.createElement('input');
      input_hid.setAttribute('type',"text");
      input_hid.setAttribute("type", "hidden");
      input_hid.name = "party_name";
      input_hid.setAttribute("value", parties[i].name);
      //link.href = "#";
      form.setAttribute('method',"post");
      var join_b = document.createElement('input')
      join_b.setAttribute('type',"submit");
      join_b.setAttribute('value',"join");
      join_b.className = "btn btn-primary";
      join_b.id = parties[i].name;
      var button_div = document.createElement('div');
      button_div.className = "col-xs-2";
      button_div.appendChild(join_b);
      button_div.appendChild(input_hid);
      /*join_b.addEventListener('click',function (){
        gapi.client.pocketjuke.pocketjuke.joinPartyAuthed({
          "name" : this.id
        }).execute(function(){
          pause(1000);
          window.location.href = "/part";
        });
      });*/
      party_name_cont.appendChild(party_name);
      inner_frame.appendChild(party_art);
      inner_frame.appendChild(party_name_cont);
      inner_frame.appendChild(button_div);
      form.appendChild(inner_frame);

      frame.appendChild(form);
      document.querySelector('#results').appendChild(frame);

    }
  }else{
    alert("we didn't find a party");
  }

};
