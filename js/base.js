/**
 * @fileoverview
 * Provides methods for the PocketJuke endpoint API
 * Party search page Endpoints API.
 */
 /** google global namespace for Google projects. */
 var google = google || {};

 /** appengine namespace for Google Developer Relations projects. */
 google.appengine = google.appengine || {};

 /** samples namespace for App Engine sample code. */
 google.appengine.pocketjuke = google.appengine.pocketjuke || {};

 /** hello namespace for this sample. */
 google.appengine.pocketjuke.production = google.appengine.pocketjuke.production || {};

//google.appengine.pocketjuke.production = '490877078433-t9spjdkqmkqe8c3c3jbgrgot9lrhgu86.apps.googleusercontent.com';

google.appengine.pocketjuke.production.CLIENT_ID  = '490877078433-t9spjdkqmkqe8c3c3jbgrgot9lrhgu86.apps.googleusercontent.com';
google.appengine.pocketjuke.production.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';


google.appengine.pocketjuke.production.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {

    }
  });
};





/**
 * Initializes the application.
 * @param {string} apiRoot Root of the API's path.
 */
google.appengine.pocketjuke.production.init = function(apiRoot) {
  // Loads the OAuth and helloworld APIs asynchronously, and triggers login
  // when they have completed.
  var apisToLoad;
  var callback = function() {

    if (--apisToLoad == 0) {
      //alert('added api'); //used for troubleshooting
      google.appengine.pocketjuke.production.enableButtons();
      google.appengine.pocketjuke.production.signin(google.appengine.pocketjuke.production.userAuthed);
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()
  gapi.client.load('pocketjuke', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);
};

set_session_token = function(token){
  if(typeof(Storage) !== 'undefined'){
    alert('session storage is correct');
    localStorage.setItem("session_token", token);
  }else{
    alert('session storage is not orrect');
  }
}
//authorise access to spotify api
//version: 1.0 Added active album ingection
login = function(){
  var CLIENT_ID = '91efe6084dc94f1eaa666458968d3389';
  var REDIRECT_URI = 'http://localhost:8080/redirect/';
  var url = 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID + "&redirect_uri=" + encodeURI(REDIRECT_URI)+'&response_type=token';
  var width = 450,
            height = 450,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);

        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                set_session_token(hash.access_token);
                alert("i am recording the hash token");
            }
        }, true);

        var w = window.open(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );
}
