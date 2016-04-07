var webSocket;
var classPosRow = document.getElementById("classPosRow");
var classPosCol = document.getElementById("classPosCol");
var sizeParams = document.getElementById("sizeParams");
var messages = document.getElementById("messages");
var studentID = document.getElementById("studentID").value;
var sessionID = document.getElementById("sessionID").value;

function sendPosition()
{
    webSocket.send("classPos#" + document.getElementById("sessionID").value
        + "#" + document.getElementById("studentID").value
        + "#" + document.getElementById("classPosRow").value)
        + "#" + document.getElementById("classPosCol");
}

function sendPosition2(param)
{
    webSocket.send("classPos#" + document.getElementById("studentID").value + "#" + document.getElementById("sessionID").value + param);
}

function enterQueue()
{
    webSocket.send("enterQueue#" + document.getElementById("sessionID").value
        + "#" + document.getElementById("studentID").value);
}

function leaveQueue()
{
    webSocket.send("leaveQueue#" + document.getElementById("sessionID").value
        + "#" + document.getElementById("studentID").value);
}

function getLabSize()
{
    webSocket.send("getSize#" + document.getElementById("sessionID").value);
}

function openSocket()
{
    // Ensures only one connection is open at a time
    if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED)
    {
        writeResponse("WebSocket is already opened.");
        return;
    }
    // Create a new instance of the websocket
    webSocket = new WebSocket("ws://10.5.129.13:8080");

    /**
     * Binds functions to the listeners for the websocket.
     */
    webSocket.onopen = function (event)
    {
        // For reasons I can't determine, onopen gets called twice
        // and the first time event.data is undefined.
        // Leave a comment if you know the answer.
        if (event.data === undefined)
            return;

        writeResponse(event.data);
    };

    webSocket.onmessage = function (event)
    {
        writeResponse(event.data);
    };

    webSocket.onclose = function (event)
    {
        writeResponse("Connection closed");
    };

    //TODO put this somewhere else because the socket is not technically open yet
    //getLabSize(); // Ask the server what the size of the classroom is upon connecting
    //webSocket.send("identify#webpage"); //Tells the server that the connection is from a webpage
}

/**
 * Sends the value of the text input to the server
 */
function send()
{
    var text = document.getElementById("messageinput").value;
    webSocket.send(text);
}

function closeSocket()
{
    webSocket.close();
}

function writeResponse(text)
{

    // Expect labSize message of form: 'labSize#rowNum#colNum'
    if (text.contains("labSize#"))
    {
        var rowNum = 0;
        var colNum = 0;
        var splits = text.split("#");
        splits[2] = rowNum;
        splits[3] = colNum;
        sizeParams.innerHTML = "Input a row between 1 and " + rowNum + 1 + " and a column between 1 and " + colNum + 1;

    }
    messages.innerHTML += "<br/>" + text;
}