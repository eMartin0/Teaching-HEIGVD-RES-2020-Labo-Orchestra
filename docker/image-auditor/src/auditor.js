/*
 * I am an auditor and I like orchestra, since I do I keep track of
 * who is actively playing (played a note in the last 5 seconds) and share
 * this information to whomever asks through a TCP connection
 */

// Requirements
const network = require("net");
const dgram = require("dgram");
const moment = require("moment");
const orchestraProtocol = require('./orchestraProtocol');

// Contains active musicians
let activeMusicians = {};

// Creates datagram socket to join the multicast group and receive UDP datagrams
const socketUDP = dgram.createSocket('udp4');
socketUDP.setMaxListeners(orchestraProtocol.maxListeners);
socketUDP.bind(orchestraProtocol.multicastUdpPort, function(){
    console.log("Joining the magical orchestra");
    socketUDP.addMembership(orchestraProtocol.multicastAddress);
});

// Creates a tcp server
var serverTCP = network.createServer();

// Manages the server
serverTCP.listen(orchestraProtocol.auditorTcpPort, function(){
    console.log("Accepting HTTP requests on port 2205");
});
serverTCP.on("connection", function(socket){
    var activeMusiciansArray = [];
    for(var uuid in activeMusicians){
        activeMusiciansArray.push(activeMusicians[uuid]);
    }
    socket.write(JSON.stringify(activeMusiciansArray));
    socket.end();
});

console.log("I'm an orchestra amator and I'm ready for new notes..");

// Run these function every refresh time
setInterval(listenForNotes, orchestraProtocol.notesRefresh);
setInterval(refreshMusicians, orchestraProtocol.musiciansRefresh);

/* * * * * Functions * * * * */
// This function listen for UDP datagrams on the socket
function listenForNotes(){
    socketUDP.on("message", function(msg){
        newNoteDict = JSON.parse(msg);
        // Creates if the uuid does not exists et replace if exists
        activeMusicians[newNoteDict["uuid"]] = {
            "uuid" : newNoteDict["uuid"],
            "instument": orchestraProtocol.findInstrumentBySound(newNoteDict["notes"]),
            "activeSince" : new Date()
        };
    });
}

// This function deletes inactive musicians 
function refreshMusicians(){
    for (var uuid in activeMusicians) {
        var value = activeMusicians[uuid];
        if (moment().diff(value.activeSince, "milliseconds") > orchestraProtocol.musiciansRefresh) {
            delete activeMusicians[uuid];
        }
    }
}
