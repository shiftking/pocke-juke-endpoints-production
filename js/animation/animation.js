var pos_playing_left = -$(window).width()*.50 ;
var pos_playing_top = -$(window).height()*.40;
var window_var_width = $(window).width();
var queue_position = [0,1,2,3,4,5,6,7,8,9,10];
var playing_card = 10;
//function to handle the frames when the document is inintailly loaded
function load_frames(){
  var var_class, postion;
  var width = $(window).width();
  var height = $(window).height();
  var default_top = height*0.4;
  var default_left = width*0.5;
  for(var i = 0;i<11;i++){
    var_class = "#card_" + i;

    position = $(var_class).position();
    $(var_class).animate({
      "top": "-="+(position.top - (default_top))+"px",
      "left": "-="+(default_left  - ((250*.5) + 4))+"px"
    },1000);
    $(var_class).fadeIn();
  }

}
$(function(){
  load_frames();
  set_z_axis();
  initial_pos();
  enable_player();
  enable_user_suggestion();
});

function set_z_axis(){
  var var_class;
  for(var i = 0;i<11;i++){
    var_class = "#card_" + i;
    $(var_class).css('z-index',i);
  }
}
function initial_pos(){

  var var_class;
  var last_pos = $(window).width()*.5;
  var position;
  for(var i = 10;i>=0;i--){
    if(queue_position[i] == playing_card){

      var_class = "#card_" + playing_card;
      position = $(var_class).position();
      $(var_class).animate({
        "left": "+="+last_pos+"px"
      },1000);
      $(var_class).animate({
        "left": "-="+($(var_class).width()*.5)+"px",
        "top": "-="+(position.top - pos_playing_top)+"px"
      },1000);
    }else{
      var_class = "#card_" + queue_position[i];
      $(var_class).animate({
        "left": "+="+last_pos+"px"
      },1000);
      last_pos -= $(window).width()*.035;
    }
    /*
    var_class = "#card_" + i;
    $(var_class).animate({
      "left": "+="+last_pos+"px"

    },1000);
    last_pos -= 60;
    if(i > 9){

      position = $(var_class).position();

      $(var_class).animate({


        "top": "-="+(position.top - pos_playing_top)+"px"
      },1000);
      position = $(var_class).position();
      //window.alert(position.top + " " +position.left);
    }
    */
  }
}

function reset_pos(div_edit) {
  div_edit.animate({
  "top": "+="+(div_edit.position.top)+"px",
  "left": "+="+(div_edit.position.left)+"px"
  },1000)


}
function enable_player(){

  $('.player').animate({
    "top": "+="+($(window).height()*.25)+"px"
  },1000);
  $('.player').fadeIn();

}
function enable_user_suggestion(){

  $('.user-suggestion').fadeIn();
  $('.user-suggestion').animate({
    width: ($(window).width()*.45) + "px"
  },1000);

}
function cycle_queue(){
  //cycle the postion
  for(var i = 0;i < 11;i++){
      if(queue_position[i] == 9){
        queue_position[i] == 0;
        if(playing_card == 0){
          playing_card = 10;
        }else{
          playing_card--;
        }
      }else{
        queue_position[i]--;
      }
  }
  var var_class;
  var position;
  for(var i =0;i < 11; i++){
      var_class = "#card_" + queue_position[i];
  }
}
