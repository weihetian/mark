function change_url(hashname){
  document.location.hash = hashname;
}


function blow_and_back(){
  blow_right();
  setTimeout(function(){change_shape()}, 1500);

}

window.onhashchange = function(){
    var what_to_do = document.location.hash;

    $('.menu_btn').removeClass('menu_btn_active');
    if(what_to_do=="#hello"){
      blow_and_back();
      $('.menu_hello_btn').addClass('menu_btn_active');
      // movecamera_up();
      moveto_slide(1);
    }else if(what_to_do=="#work"){
      blow_and_back();
      $('.menu_work_btn').addClass('menu_btn_active');
      moveto_slide(2);
    }else if(what_to_do=="#skills"){
      blow_and_back();
      $('.menu_skills_btn').addClass('menu_btn_active');
      moveto_slide(3);
    }else if (what_to_do=="#carvertise_web"){
      project_page(1);
    }else if(what_to_do=="#carvertise_analytics"){
      project_page(2);
    }else if(what_to_do=="#carvertise_backend"){
      project_page(3);
    }else if (what_to_do=="#stak_zapified"){
      project_page(4);
    }else if (what_to_do=="#stak_doodle"){
      project_page(5);
    }
}

$(function(){
  var what_to_do = document.location.hash;
  if (what_to_do==""){
    $('.menu_hello_btn').addClass('menu_btn_active');
    setTimeout(function(){moveto_slide(1)}, 1000);
  }else if (what_to_do=="#hello"){
    $('.menu_hello_btn').addClass('menu_btn_active');
    setTimeout(function(){moveto_slide(1)}, 1000);
  }else if(what_to_do=="#work"){
    $('.menu_work_btn').addClass('menu_btn_active');
    moveto_slide(2);
  }else if (what_to_do=="#carvertise_web"){
    project_page(1);
  }
  else if (what_to_do=="#carvertise_analytics"){
    project_page(2);
  }
  else if (what_to_do=="#carvertise_backend"){
    project_page(3);
  }
  else if (what_to_do=="#stak_zapified"){
    project_page(4);
  }
  else if (what_to_do=="#stak_doodle"){
    project_page(5);
  }
  else if(what_to_do=="#skills"){
    $('.menu_skills_btn').addClass('menu_btn_active');
      moveto_slide(3);
    }
})


function pageshowup(num){
  var allheaders=$('.header');
  $(allheaders).css({ "padding-left" : "0px","opacity":"0"});

  var allbodies = $('.body');
  $(allbodies).css({ "right" : "10px","opacity":"0"});

  if(num==1){
    var header = $("#slide-1").find(".header");
    var body = $("#slide-1").find(".body");
    if(!$('.menu').is(":visible")){
      $('.menu').css({"opacity":"0"});
      $('.menu').show();

      $('.menu').transition({ opacity: 1 },800);

    }
    $(header).transition({ paddingLeft:10, opacity: 1 },800,function(){
      $(body).transition({ x:10, opacity: 1 },800);
    });

  }else if(num==2){
    var header = $("#slide-2").find(".header");
    var body = $("#slide-2").find(".body");

    if(!$('.menu').is(":visible")){
      $('.menu').css({"opacity":"0"});
      $('.menu').show();

      $('.menu').transition({ opacity: 1 },800);

    }

    $(body).css({ "opacity":"1"});

    var timeline = $(".project_list");
    var lines = $(".line");

    var projects = $(".project_list_content");


    $(timeline).css({ "opacity":"0"});
    $(projects).transition({ x:0,opacity: 0},0);

    $(header).transition({ paddingLeft:10, opacity: 1 },800);

    setTimeout(function(){
      $(timeline).transition({ opacity: 1 },800)
    },800);

    setTimeout(function(){
        $(projects).transition({ x:5, opacity: 1 },800)
      },1600);
  }else if(num==3){
    var header = $("#slide-3").find(".header");
    var body = $("#slide-3").find(".body");

    if(!$('.menu').is(":visible")){
      $('.menu').css({"opacity":"0"});
      $('.menu').show();

      $('.menu').transition({ opacity: 1 },800);

    }

    $(header).transition({ paddingLeft:10, opacity: 1 },800,function(){
      $(body).transition({ x:10, opacity: 1 },800,function(){
        var chart = new Chartist.Bar('#chart1', {
          labels: ['Javascript','HTML5', 'JQuery', 'AngularJS', 'CSS3', 'PHP','Mysql','Java','Objective C','C++'],
          series: [
            [10, 10, 10,9,9,9,9,8,8,7]
          ]
        }, {
          seriesBarDistance: 15,
          reverseData: true,
          horizontalBars: true,
          axisY: {
            offset: 70
          }
        });
      });

    });
  }
}


function moveto_slide(num){
  if(num==1){
    movecamera_left();
    //camera_moveup();

    setTimeout(function(){
      show_slide(1);

    }, 1000);
  }else if(num==2){
    movecamera_left();
    setTimeout(function(){ show_slide(2)}, 1000);
  }else if(num==3){
    movecamera_left();
    setTimeout(function(){ show_slide(3)}, 1000);
  }
}

function show_slide(num){
  $('.slide').hide();
  if (num==1){
    $('#slide-1').show();
    pageshowup(1);
  }
  else if(num==2){
    $('#slide-2').show();
    pageshowup(2);
  }else if(num==3){
    $('#slide-3').show();
    pageshowup(3);
  }
}

function project_page(num){

      $('.project_area_body').transition({opacity: 0 },300,function(){
        $('.project_area').scrollTop(0);
        $('.project_area_body').html("");
        $('.project_area').hide();
        $('.project_area_body').load('template/project-'+num+'.html');

        $('.project_area_body').css({"opacity":"1"});
      });

      $('.slide_area').transition({ x:10, opacity: 0 },800,function(){
        $('.slide_area').hide();
      });
      $('.menu').transition({ x:-10, opacity: 0 },800,function(){
        $('.menu').hide();
      });
      movecamera_center();
      setTimeout(function(){

        show_porject()}, 1500);
}

function show_porject(){

    movecamera_top();
    setTimeout(function(){

      $('.project_area').transition({ y:20, opacity: 0 },0,function(){
        $('.project_area').show();

        $('.project_area').transition({ y:0, opacity: 1 },800,function(){

        });
      });

    }, 1000);

}

function backtomain(){
  $('.project_area').transition({ y:20, opacity: 0 },800,function(){
    $('.project_area').hide();
  });

  movecamera_center();
  setTimeout(function(){

    $('.slide_area').show();
    change_url('work');
    $('.slide_area').transition({ x:0, opacity: 1 },800);
  }, 2500);

  //change_url('work');
  // setTimeout(function(){movecamera_left();}, 2500);
  //
  // //setTimeout(function(){ moveto_slide(2)}, 2500);
  // setTimeout(function(){
  //   $('.slide_area').show();
  //   $('.menu').show();
  //   $('.slide_area').transition({ x:0, opacity: 1 },800);
  //   $('.menu').transition({ x:0, opacity: 1 },800);
  // }, 3500);
}


function show_text(){
$('#intro').typeIt({
     strings: ["I am a 24 year old developer who enjoys beautiful and responsive applications.",
     "I believe all websites should have beautiful and responsive designs and I will use any chance I can to make all applications prettier.",
     "4 month from now I ll gradute from college, I am ready to start my journey!"],
     speed: 30
});
}
