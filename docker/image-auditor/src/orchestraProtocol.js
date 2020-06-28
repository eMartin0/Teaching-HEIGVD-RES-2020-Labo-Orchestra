/**
 * Defines the orchestra protocol and necessities
 */

// Multicast Group infos
exports.multicastAddress = "239.255.11.3";
exports.multicastUdpPort = 9094;

// Defines the TCP port for an auditor
exports.auditorTcpPort = 2205;

// Defines refreshing times
exports.notesRefresh = 1000;
exports.musiciansRefresh = 5000;

// Defines the instruments available
exports.availableInstruments = {
    "piano": "ti-ta-ti",
    "violin": "gzi-gzi",
    "trumpet": "pouet",
    "drum": "boum-boum",
    "flute": "trulu"
};

// Returns true if the instrument is part of the orchestra, false otherwise
exports.knownInstrument = function (key) {
    return key in this.availableInstruments;
};

// Finds an insturment by its sound, return null if unknown
exports.findInstrumentBySound = function (soundStr) {
    var instrument = null;
    for (var key in this.availableInstruments) {
        if (soundStr == this.availableInstruments[key]) {
            instrument = key;
        }
    }
    return instrument;
};
