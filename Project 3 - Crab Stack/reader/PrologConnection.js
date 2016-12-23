/**
 * PrologConnection
 * @constructor
 * @param scene CFGscene
 */
function PrologConnection() {
    this.requestPort = 8081;
}

PrologConnection.prototype = Object.create(Object.prototype);
PrologConnection.prototype.constructor = PrologConnection;


PrologConnection.prototype.getPrologRequest = function(requestString, onSuccess, onError, port)
{
    var request = new XMLHttpRequest();
     console.log(this.requestPort);
    request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

