'use strict'

var bien = 0;
var moyen = 0;
var mal = 0;

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

  // listen for incoming broadcast
  app.onBroadcast((id, msg) => {
    console.log('I have received a message from peer', id, ':', msg)
    test(msg);
    
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
    
    test(x);
    app.sendBroadcast(x)
  }, false)
})
.catch(console.error) // catch connection errors

function test(x){
  if(x == "Bien"){
      bien++;
    }
    else if (x == "Moyen"){
      moyen++;
    }
    else{
      mal++;
    }
    document.getElementById("bien").innerHTML =  bien ;
    document.getElementById("moyen").innerHTML =  moyen ;
    document.getElementById("mal").innerHTML =  mal ;
}