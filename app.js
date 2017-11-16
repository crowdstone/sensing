'use strict'

var bien = 0;
var moyen = 0;
var mal = 0;
var nav = false;

const Foglet = require('foglet').Foglet

const app = new Foglet({
  verbose: true, // activate logs. Put false to disable them in production!
  rps: {
    type: 'spray-wrtc',
    options: {
      protocol: 'foglet-hello-world', // name of the protocol run by your app
      webrtc:	{ // WebRTC options
        trickle: true, // enable trickle (divide offers in multiple small offers sent by pieces)
        iceServers : [] // iceServers, we lkeave it empty for now
      },
      timeout: 2 * 60 * 1000, // WebRTC connections timeout
      delta: 10 * 1000, // spray-wrtc shuffle interval
      signaling: { //
        address: 'http://localhost:3000/',
        room: 'foglet-hello-world-room' // room to join
      }
    }
  }
})

// connect to the signaling server
app.share()

// connect our app to the fog
app.connection()
.then(() => {
  console.log('application connected!')
  var id = app.getRandomNeighbourId();
  if(id !== null)
    app.sendUnicast(id, 'init');

  afficher();

  if(navigator.geolocation)
    nav = true;
  // listen for incoming broadcast
  app.onBroadcast((id, msg) => {
    console.log('I have received a message from peer', id, ':', msg)
    choix(msg);
    
  })
  
  app.onUnicast((id, msg) => {
    console.log('I have received a message from neighbour peer', id, ':', msg)
    if(msg == "init"){
      var values = [bien,moyen,mal];
      app.sendUnicast(id,values);
    }
    else{
      recupData(msg);
    }
  })

  // send our message each time we hit the button
  const btn = document.getElementById("send-message")
  btn.addEventListener("click", () => {
    var x;
    for (var i=0; i<document.radioCheck.length;i++) {
      if (document.radioCheck[i].checked) {
        console.log("Système = "+document.radioCheck[i].value)
        x = document.radioCheck[i].value;
      }
    }
    
    if(nav)
      navigator.geolocation.getCurrentPosition(maPosition);
      
    choix(x);
    app.sendBroadcast(x)
  }, false)
})
.catch(console.error) // catch connection errors

function choix(x){
  if(x == "Bien"){
      bien++;
    }
    else if (x == "Moyen"){
      moyen++;
    }
    else{
      mal++;
    }
    afficher();
}

function recupData(msg){
  //console.log(msg.toString());
  bien += msg[0];
  moyen += msg[1];
  mal += msg[2];
  afficher();
}

function maPosition(position) {
  var infopos = "Position déterminée :\n";
  infopos += "Latitude : "+position.coords.latitude +"\n";
  infopos += "Longitude: "+position.coords.longitude+"\n";
  infopos += "Altitude : "+position.coords.altitude +"\n";
  document.getElementById("maPos").innerHTML = infopos;
  //alert(infopos);
}

function afficher(){
  document.getElementById("bien").innerHTML =  bien ;
  document.getElementById("moyen").innerHTML =  moyen ;
  document.getElementById("mal").innerHTML =  mal ;
}