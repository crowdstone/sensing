'use strict'

/*var bien = 0;
var moyen = 0;
var mal = 0;
*/

var stat = 0;
var all = 0;
var nb = 0;

var maZone;
var ancienneZone;
var lat;
var long;
var init = false;
var dataInit = false;
var maRoom = "sensing";

const Foglet = require('foglet').Foglet

let app;

if(navigator.geolocation)
  navigator.geolocation.getCurrentPosition(maPosInit,errorHandler);
else
  alert('Votre navigateur ne prend malheureusement pas en charge la géolocalisation.');

var iceServers;

function errorHandler(error)
{
    // On log l'erreur sans l'afficher, permet simplement de débugger.
    console.log('Geolocation error : code '+ error.code +' - '+ error.message);

    // Affichage d'un message d'erreur plus "user friendly" pour l'utilisateur.
    alert('Une erreur est survenue durant la géolocalisation. Veuillez réessayer plus tard ou contacter le support.');
}

function maPosInit(position) {
  var infopos = "Position déterminée :\n";
  
  lat = String(position.coords.latitude).split('.');
  long = String(position.coords.longitude).split('.');
  maRoom = "r_"+lat[0]+"."+lat[1].charAt(0)+"_"+long[0]+"."+long[1].charAt(0);
  maZone = lat[0]+"."+lat[1].charAt(0)+"_"+long[0]+"."+long[1].charAt(0);
  ancienneZone = maZone;
  console.log("ma room : "+maRoom);
  mainProg();
}

function choix(x){
  /*
  if(x == "Bien"){
    bien++;
  }
  else if (x == "Moyen"){
    moyen++;
  }
  else{
    mal++;
  }*/
  nb ++;
  all += x;
  stat = all/nb;
  
  afficher();
}

function broad(x, id){
  //console.log("ma zone : "+maZone +" ; la sienne : "+x[1]);
  //if (x[1][0] == maZone[0] && x[1][1]== maZone[1]){
    //if(x[0] == "init"){
  if(x == "init"){
    //var values = [bien,moyen,mal];
    var values = [all, nb];
    app.sendUnicast(id,values);
  }
 /*
  else if (x== "Bien"){
    bien++;
  }
 
  else if (x == "Moyen"){
    moyen++;
  }
  else{
    mal++;
  }
  */
  //ALGO DE VERIFICATION DES DONNEES
  else{
    nb++;
    all += x;
    stat = all / nb;
    afficher();
  }
}

function recupData(msg){
//console.log(msg.toString());
  if(!dataInit){
    dataInit = true;
    /*
    bien += msg[0];
    moyen += msg[1];
    mal += msg[2];
    */
    all += msg[0];
    nb += msg[1];
    afficher();
  }
}

function maPosition(position) {
  var infopos = "Position déterminée :\n";
  
  ancienneZone = maZone;
  
  lat = String(position.coords.latitude).split('.');
  long = String(position.coords.longitude).split('.');
  maZone = lat[0]+"."+lat[1].charAt(0)+"_"+long[0]+"."+long[1].charAt(0);
  
  console.log("ma zone : "+maZone);
  console.log("ancienne zone : "+ancienneZone);
  /*
  if (init === true){
    var x = ["init", maZone];
    app.sendBroadcast(x);
    init = false;
  }
  */
  infopos += "Latitude : "+lat +"\n";
  infopos += "Longitude: "+long+"\n";
  
  //infopos += "Altitude : "+position.coords.altitude +"\n";
  document.getElementById("maPos").innerHTML = infopos;
  //alert(infopos);
}

function afficher(){
  document.getElementById("bien").innerHTML =  nb ;
  document.getElementById("moyen").innerHTML =  all ;
  document.getElementById("mal").innerHTML =  stat ;
}

function mainProg(){
  $.ajax({
  url : "https://service.xirsys.com/",
  data : {
    ident: "etochy",
    secret: "03b1bc5c-cf92-11e7-90e1-9498d86a9f05",
    domain: "www.sensing.com",
    application: "sensingApp",
    room: "sensing",
    secure: 1
  }
  , success:function(response, status){
    console.log(status);
    console.log(response);
    /**
     * Create the foglet protocol.
     * @param {[type]} {protocol:"chat"} [description]
     */
    if(response.d.iceServers){
     iceServers = response.d.iceServers;
    }
    
    app = new Foglet({
      verbose: true, // activate logs. Put false to disable them in production!
      rps: {
        type: 'spray-wrtc',
        options: {
          protocol: maRoom, // name of the protocol run by your app
          webrtc: { // WebRTC options
            trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
            iceServers : iceServers // iceServers, we lkeave it empty for now
          },
          timeout: 2 * 60 * 1000, // WebRTC connections timeout
          delta: 10 * 1000, // spray-wrtc shuffle interval
          signaling: { //
            address: 'https://signaling.herokuapp.com/',
            room: maRoom // room to join
          }
        }
      }
    });
    // connect to the signaling server
    app.share()
    
    // connect our app to the fog
    app.connection()
    .then(() => {
      console.log('application connected!')

      //initialisation
      var id = app.getRandomNeighbourId();
      if(id !== null){
        init = true;
        //console.log("init");
        if(navigator.geolocation)
          navigator.geolocation.getCurrentPosition(maPosition);
        app.sendBroadcast("init");
        init = false;
        
      }else{
        dataInit = true;
        //console.log("dataInit");
      }
      afficher();
      /*
      if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(maPosition);*/
        
      // listen for incoming broadcast
      app.onBroadcast((id, msg) => {
        console.log('I have received a message from peer', id, ':', msg)
        broad(msg, id);
    })
  
    app.onUnicast((id, msg) => {
      console.log('I have received a message from neighbour peer', id, ':', msg)
      recupData(msg);
    })
          // send our message each time we hit the button
    const btn = document.getElementById("send-message")
    btn.addEventListener("click", () => {
      var x;
      
      /*
      for (var i=0; i<document.radioCheck.length;i++) {
        if (document.radioCheck[i].checked) {
          console.log("Système = "+document.radioCheck[i].value)
          x = document.radioCheck[i].value;
        }
      }
      */
      
      console.log("sys : " + document.radioCheck.optradio.value);
      x = parseInt(document.radioCheck.optradio.value);
      if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(maPosition);
      
      // verifier que la zone reste la meme
      if(maZone == ancienneZone){
        choix(x);
        app.sendBroadcast(x);
      }
      else{
        // la zone a changé
        alert("Votre zone géographique a changé, réinitialisation de la page");
        location.reload() ; // rechargement brut de la page #tresTresSale
      }
        
    }, false)
    })
  .catch(console.error) // catch connection errors

  }
});
}
