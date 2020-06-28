/*
 * I am a musician and I can play music to whomever wants to listen (multicast)
 */

// Requirements
const dgram = require("dgram");
const uuid = require("uuid");
const orchestraProtocol = require("./orchestraProtocol");

// Recuperates the instrument assigned to to the musician
const myInstrument = getInstrument();

if (!myInstrument) {
    return;
}

// Creates the datagram socket that will be used to send messages
const socketUDP = dgram.createSocket('udp4');

// Assignes a fixed uuid
const myUUID = uuid.v4();

console.log("Good evening listenners! I'm a musician and tonight I will play the " + myInstrument + " so sit back and enjoy..");

// Run these function every refresh time
setInterval(playSomeNotes, orchestraProtocol.notesRefresh);

/* * * * * Functions * * * * */
// Manages the arguments
function getInstrument(){
    var myArgs = process.argv.slice(2);

    if (myArgs.length == 0) {
        console.log("Missing instrument parameter...");
        return null;
    }

    if (myArgs.length > 1){
        console.log("Too many parameters...");
        return null;
    }

    if (!orchestraProtocol.knownInstrument(myArgs[0])) {
        console.log("Unknown instrument...");
        return null;
    }

    return myArgs[0];
}

// This function plays a note
function playSomeNotes(){
    var myInfos = {
        "uuid" : myUUID,
        "notes": orchestraProtocol.availableInstruments[myInstrument]
    }
    let payload = JSON.stringify(myInfos);
    let message = new Buffer.from(payload);
    socketUDP.send(message, orchestraProtocol.multicastUdpPort, orchestraProtocol.multicastAddress, function(){
        console.log(payload);
    });
}
