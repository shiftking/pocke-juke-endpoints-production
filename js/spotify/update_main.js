
/*
# Description: Add song info for main for the main active card
#
# Version update: 0.1 added ajax call, currently not working due to miss use of access token
*/
add_song_info = function(){
  var active_track = document.querySelector(".song_0").id;
  alert(active_track);
  $.ajax({
       type: "GET",
       url: 'https://api.spotify.com/v1/tracks/',

      headers: {
        'Authorization': 'Bearer '  + "BQBPo-jxRc1AqihSf5fvd2hqlrMi1R88KP1pnMijTW31vgxAeisyrmou34Ty4iR1444BbwK7WsV3yQOuOCC2SzuP6gnnVYVxA0WR8LEcDN8g4LiAy6Jx-sLdGVP8mEF4NXjt0GngUletBlc4luVYPOFItjC4uNgoAikf9ABz2OqbpoSbYg7kiq56pPr6jbzQR1wrPSXuuELh90t6Phh4h4lm4hm7Aqshj2nsVlPDSuouU-_CRl9PDBMfvvZ_yLLPYPaJzmOArC_anlamREdDrmxHX8a981IGCZ0r8eDU22gidHeKzg"
      },
       data: {
           id: '1zHlj4dQ8ZAtrayhuDDmkY',
           market: 'ES'
       },


       success: function (response) {
           update_active_album(response);
       }
   });
};
update_active_album = function(song){
  var active = document.querySelector("#active_song");
  active.style.backgroundImage = "url(" +song.album.images[1].url+")";
  active.style.backgroundSize = "80vh auto";
};
