//enable buttons function to see if the user has signed in
//version: 0.1 added sign in check and login promt
google.appengine.pocketjuke.production.signin = function(callback) {
  gapi.auth.authorize({client_id: google.appengine.pocketjuke.production.CLIENT_ID,
      scope: google.appengine.pocketjuke.production.SCOPES, immediate: false},
      callback);
};
google.appengine.pocketjuke.production.enableButtons = function(){
  //alert('login');
  //login();
}
