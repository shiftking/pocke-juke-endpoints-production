
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
google.appengine.pocketjuke.production.SCOPES = ['https://www.googleapis.com/auth/userinfo.email'];



google.appengine.pocketjuke.production.userAuthed = function() {
  var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
    if (!resp.code) {
      localStorage.setItem("logged",true);
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
  if(!localStorage.getItem("logged")){
    localStorage.setItem("logged",false);
  }
  //alert(localStorage.getItem("logged"));

  var apisToLoad;
  var callback = function() {

    if (--apisToLoad == 0) {
      //alert('added api'); //used for troubleshooting
      google.appengine.pocketjuke.production.enableButtons();
      google.appengine.pocketjuke.production.signin(google.appengine.pocketjuke.production.userAuthed);
    }
  }

  apisToLoad = 2; // must match number of calls to gapi.client.load()1
  gapi.client.load('pocketjuke', 'v1', callback, apiRoot);
  gapi.client.load('oauth2', 'v2', callback);

};
