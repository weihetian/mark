$(function(){


  init();
  animate();

  $(window).resize(function(){
      SCREEN_WIDTH = window.innerWidth;
      SCREEN_HEIGHT = window.innerHeight;
      camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
  });

})

var scene, camera,renderer;
var controls;
var stats;
var spotLight, cube;
var SCREEN_WIDTH,SCREEN_HEIGHT;

var ball_objects;

var cameraLookAt;
var cameraCurrentPosition;

var cameraTarget;
var cameraPosition;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var sphere_matrix = [[0,0,0],
[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],
[Math.sqrt(2)/2,Math.sqrt(2)/2,0],[-Math.sqrt(2)/2,Math.sqrt(2)/2,0],
[Math.sqrt(2)/2,-Math.sqrt(2)/2,0],[-Math.sqrt(2)/2,-Math.sqrt(2)/2,0],
[Math.sqrt(2)/2,0,Math.sqrt(2)/2],[-Math.sqrt(2)/2,0,Math.sqrt(2)/2],
[Math.sqrt(2)/2,0,-Math.sqrt(2)/2],[-Math.sqrt(2)/2,0,-Math.sqrt(2)/2],
[0,Math.sqrt(2)/2,Math.sqrt(2)/2],[0,Math.sqrt(2)/2,-Math.sqrt(2)/2],
[0,-Math.sqrt(2)/2,Math.sqrt(2)/2],[0,-Math.sqrt(2)/2,-Math.sqrt(2)/2],
[1/2,Math.sqrt(2)/2,1/2,],[1/2,-Math.sqrt(2)/2,1/2],
[1/2,Math.sqrt(2)/2,-1/2],[1/2,-Math.sqrt(2)/2,-1/2],
[-1/2,Math.sqrt(2)/2,1/2],[-1/2,-Math.sqrt(2)/2,1/2],
[-1/2,Math.sqrt(2)/2,-1/2],[-1/2,-Math.sqrt(2)/2,-1/2]
]

var ball_object = function(ball_view){
  this.ball_view = ball_view;
  this.a = 0.01;
  this.v = 0.5;

  this.resetspeed = function(){
    this.a = 0.01;
    this.v = 0.5;

  }
}


var balls = function(num){
  this.ball_array = [];
  this.length = num;

  this.ball_position = [];

  this.inposition=false;


  for(var i=0;i<num;i++){

    var geometry = new THREE.SphereGeometry( 2, 32, 32 );
    var material = new THREE.MeshPhongMaterial( {
        color: 0xecf0f1,
        shininess: 500,
        specular: 0xffffff,
        shading: THREE.SmoothShading
    } );

    var x = Math.floor((Math.random() * 50)-25);
    var y = Math.floor((Math.random() * 50)-25);
    var z = Math.floor((Math.random() * 50)-25);

    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.set( x, y, z );

    var ball = new ball_object(sphere);
    this.ball_array.push(ball);
  }

  var angle_x =(Math.random() * 0.01);
  var angle_y =0.001;
  var angle_z =(Math.random() * 0.01);

  this.resetspeed = function(){
    for(var i=0;i<this.length;i++){

      this.ball_array[i].resetspeed();
    }
  }

  this.push_away = function(vector){

    for(var i=0;i<this.length;i++){
      var ball_view = this.ball_array[i].ball_view;
      var dis = distance(vector,ball_view.position);
      console.log(dis);

      var dir_x = vector.x - ball_view.position.x;
      var dir_y = vector.y - ball_view.position.y;
      var dir_z = vector.z - ball_view.position.z;

      var away_speed = 190/dis;

      if(away_speed<3){
        away_speed=0;
      }
      // if(dis > 10){
      //   var away_speed = 2;
      // }else if(dis>5){
      //   var away_speed = 4;
      // }

      var move_x = away_speed*dir_x/dis;
      var move_y = away_speed*dir_y/dis;
      var move_z = away_speed*dir_z/dis;

      ball_view.position.set(ball_view.position.x-move_x,ball_view.position.y-move_y,ball_view.position.z-move_z);

    }
  }

  this.spin = function(){
    // if(this.inposition){

      var x_axis = new THREE.Vector3( 1, 0,0);
      var y_axis = new THREE.Vector3( 0, 1,0);
      var z_axis = new THREE.Vector3( 0, 0,1);

      for(var i=0;i<this.length;i++){
        var position = this.ball_position[i];

        //here is the y and z spin
         //position.applyAxisAngle( x_axis, angle_x );
         position.applyAxisAngle( y_axis, angle_y );
         //position.applyAxisAngle( z_axis, angle_z );
      }
    // }
    // var x_axis = new THREE.Vector3( 1, 0,0);
    // var y_axis = new THREE.Vector3( 0, 1,0);
    // var z_axis = new THREE.Vector3( 0, 0,1);
    // var angle = Math.PI / 180;
    // for(var i=0;i<this.length;i++){
    //   var position = this.ball_position[i];
    //
    //   position.applyAxisAngle( x_axis, angle );
    // }
  }


  this.currentshape = "";
  this.shape = function(shape){
    this.ball_position = [];
    this.resetspeed();
    if(shape == "circle"){
      this.currentshape = "circle";
      var half_width = 35;
      for(var x=0;x<27;x++){
        this.ball_position.push(new THREE.Vector3(half_width* Math.sin(2*Math.PI * x / 27),0,half_width* Math.cos(2*Math.PI * x / 27)));
      }

    }
    else if(shape == "cube"){
      this.currentshape = "cube";
      var half_width = 20;
      for(var x=0;x<3;x++){
        for(var y=0;y<3;y++){
          for(var z=0;z<3;z++){
            this.ball_position.push(new THREE.Vector3(half_width*x-half_width,half_width*y-half_width,half_width*z-half_width));
          }
        }
      }

    }else if(shape == "sphere"){
      this.currentshape = "sphere";
      var radius = 28;
      for(var i=0;i<this.length;i++){
        var x =sphere_matrix[i][0];
        var y =sphere_matrix[i][1];
        var z =sphere_matrix[i][2];
        this.ball_position.push(new THREE.Vector3(x*radius,y*radius,z*radius));
      }
    }else if(shape == "wind"){
      for(var i=0;i<this.length;i++){
        var x = Math.floor((Math.random() * 50)+100);
        var y = Math.floor((Math.random() * 50)-25);
        var z = Math.floor((Math.random() * 50)+50);
        this.ball_position.push(new THREE.Vector3(x,y,z));

        // this.ball_array[i].speed.x = (Math.random() * 0.1)-0.05;
        // this.ball_array[i].speed.y =(Math.random() * 0.1)-0.05;
        // this.ball_array[i].speed.z = (Math.random() * 0.1)-0.05;
      }
    }
  }



  this.move = function(){

    for(var i=0;i<this.length;i++){
      var position = this.ball_position[i];
      var ball_object = this.ball_array[i];
      var sphere = ball_object.ball_view;



      var dir_x = position.x - sphere.position.x;
      var dir_y = position.y - sphere.position.y;
      var dir_z = position.z - sphere.position.z;
      var dis = Math.sqrt(dir_x*dir_x+dir_y*dir_y+dir_z*dir_z);


      if(dis>30){
        ball_object.a = 0.2;
      }
      else if(dis>20){
        ball_object.a = 0.01;
      }else if(dis>10){
        ball_object.a = -0.01;
      }else if(dis>5){
        ball_object.a = 0;
      }else if(dis<0.5){
        // this.inposition=true;
        ball_object.a = 0;
        ball_object.v=1;
        dis = 1;
      }
      var ball_speed =ball_object.v;
      var ball_a = ball_object.a;
      ball_speed += ball_a;

      var move_x = ball_speed*dir_x/dis;
      var move_y = ball_speed*dir_y/dis;
      var move_z = ball_speed*dir_z/dis;

      // if(this.inposition){
      //   sphere.position.set(position.x,position.y,position.z);
      // }else{
        sphere.position.set(sphere.position.x+move_x, sphere.position.y+move_y, sphere.position.z+move_z);
    //  }

    }
  }



};



function creatballs(num){

}

function init(){
  scene = new THREE.Scene();
  cameraLookAt = new THREE.Vector3(0,0,0);
  cameraTarget = new THREE.Vector3(0,0,0);
  cameraCurrentPosition = new THREE.Vector3(60,0,60)
  cameraPosition = new THREE.Vector3(60,0,60);
  scene.position.set(cameraLookAt.x,cameraLookAt.y,cameraLookAt.z);
  camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight, .1, 500);
  renderer = new THREE.WebGLRenderer({antialias:true});

  renderer.setClearColor(0xffffff);
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;



  // var axis =  new THREE.AxisHelper(10);
  // scene.add (axis);
  //
  // var grid = new THREE.GridHelper(50,5);
  // var color = new THREE.Color("rgb(255,0,0)");
  // grid.setColors(color, 0x000000);
  // scene.add(grid);

  /*Camera*/
  camera.position.x = cameraPosition.x;
  camera.position.y = cameraPosition.y;
  camera.position.z = cameraPosition.z;
  camera.lookAt(new THREE.Vector3(0,0,0));



  // controls = new THREE.OrbitControls( camera);
  // controls.addEventListener( 'change', render );


  /*Lights*/
  var ambient = new THREE.AmbientLight( 0x404040 );
  scene.add( ambient );

  spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 60, 60, 60 );
  spotLight.castShadow = true;
  spotLight.shadowCameraNear = 8;
  spotLight.shadowCameraFar = 30;
  spotLight.shadowDarkness = 0.5;
  spotLight.shadowCameraVisible = false;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;
  spotLight.name = 'Spot Light';
  scene.add( spotLight );


  ball_objects = new balls(27);

  for(var i=0;i<ball_objects.length;i++){

    scene.add( ball_objects.ball_array[i].ball_view );
  }

  ball_objects.shape("cube");
  ball_objects.move();



  $("#matrix-container").append(renderer.domElement);

}

function render() {
  ball_objects.spin();
  ball_objects.move();

  camera_move();
  // camera_position_move();
}

function animate(){
    requestAnimationFrame(animate);
    render();

    renderer.render(scene, camera);
}


//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove(event){
   //console.log("x:"+(event.clientX-windowHalfX)+"y "+(event.clientY-windowHalfY)+"x: 0");
   var vector = new THREE.Vector3(event.clientX-windowHalfX,-event.clientY+windowHalfY,0);
   ball_objects.push_away(vector);
}

function movecamera_left(){

  cameraTarget.x = 40;
  // cameraTarget.z = 50;
}

function movecamera_top(){
  cameraTarget.y = -90;
}

function movecamera_center(){
  cameraTarget.x = 0;
  cameraTarget.y = 0;
}

function movecamera_up(){
  camera.position.x=80;
  camera.position.y=50;
  camera.position.z=60;
  cameraTarget.x = 0;
  cameraTarget.y = 0;
  cameraTarget.z = 0;
}

function camera_moveup(){
  cameraPosition.y = 20;
  alert();
}

function camera_position_move(){
  var speed = 50;
  //cameraLookAt
  var dis = distance(cameraPosition,cameraCurrentPosition);
  if(dis==0){

  }else if(dis<0.5){
    //Stop moving when getting close

    // cameraLookAt.x=cameraTarget.x;
    // cameraLookAt.y=cameraTarget.y;
    // cameraLookAt.z=cameraTarget.z;
    // //alert("good");
    // camera.lookAt(cameraLookAt);
  }else{

  var dir_x = cameraPosition.x-cameraCurrentPosition.x;
  var dir_y = cameraPosition.y-cameraCurrentPosition.y;
  var dir_z = cameraPosition.z-cameraCurrentPosition.z;

  cameraCurrentPosition.x +=dir_x/speed;
  cameraCurrentPosition.y +=dir_y/speed;
  cameraCurrentPosition.z +=dir_z/speed;
  camera.position.x = cameraCurrentPosition.x;
  camera.position.y = cameraCurrentPosition.y;
  camera.position.z = cameraCurrentPosition.z;
  }

}

function camera_move(){
  var speed = 50;
  //cameraLookAt

  var dis = distance(cameraTarget,cameraLookAt);
  if(dis==0){

  }else if(dis<0.5){
    //Stop moving when getting close

    // cameraLookAt.x=cameraTarget.x;
    // cameraLookAt.y=cameraTarget.y;
    // cameraLookAt.z=cameraTarget.z;
    // //alert("good");
    // camera.lookAt(cameraLookAt);
  }else{

  var dir_x = cameraTarget.x-cameraLookAt.x;
  var dir_y = cameraTarget.y-cameraLookAt.y;
  var dir_z = cameraTarget.z-cameraLookAt.z;

  cameraLookAt.x +=dir_x/speed;
  cameraLookAt.y +=dir_y/speed;
  cameraLookAt.z +=dir_z/speed;
  camera.lookAt(cameraLookAt);
  }



}

function blow_right(){
  ball_objects.shape("wind");
}

function change_shape(){
  if(ball_objects.currentshape=="circle"){
    ball_objects.shape("cube");
  }
  else if(ball_objects.currentshape=="cube"){

    ball_objects.shape("sphere");
  }else if(ball_objects.currentshape=="sphere"){
    ball_objects.shape("cube");
  }

}


function distance(vector_1,vector_2){
  var dir_x = vector_1.x-vector_2.x;
  var dir_y = vector_1.y-vector_2.y;
  var dir_z = vector_1.z-vector_2.z;
  return Math.sqrt(dir_x*dir_x+dir_y*dir_y+dir_z*dir_z);
}
