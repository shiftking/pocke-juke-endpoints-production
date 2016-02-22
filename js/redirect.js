redirect = function(){
  var hash = JSON.parse(event.data);
  alert(hash.access_token);
  window.close();
};
