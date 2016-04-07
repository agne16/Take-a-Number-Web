var webSocket;
var classPosRow = document.getElementById("classPosRow");
var classPosCol = document.getElementById("classPosCol");
var sizeParams = document.getElementById("sizeParams");
var messages = document.getElementById("messages");
var studentID = document.getElementById("studentID").value;
var sessionID = document.getElementById("sessionID").value;

function sendPosition()
{
    webSocket.send("setPosition#" + document.getElementById("sessionID").value
        + "#" + document.getElementById("studentID").value
        + "#c" + document.getElementById("classPosCol").value
        + "r" + document.getElementById("classPosRow").value);
}

function sendPosition2(param)
{
    webSocket.send("setPosition#" + document.getElementById("sessionId").value + "#" + document.getElementById("studentId").value + param);
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
    webSocket.send("getLayout#" + document.getElementById("sessionID").value);
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
    //webSocket = new WebSocket("ws://10.17.141.39:8080");

    /**
     * Binds functions to the listeners for the websocket.
     */
    webSocket.onopen = function (event)
    {
        // For reasons I can't determine, onopen gets called twice
        // and the first time event.data is undefined.
        // Leave a comment if you know the answer.
        //if (event.data === undefined)
        //    return;

        writeResponse("Connected");
        webSocket.send("identify#webpage#" + document.getElementById("studentID").value); //Tells the server that the connection is from a webpage
        getLabSize(); // Ask the server what the size of the classroom is upon connecting
    };

    webSocket.onmessage = function (event)
    {
        writeResponse(event.data);
    };

    webSocket.onclose = function (event)
    {
        writeResponse("Connection closed");
    };

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
    if (text === undefined)
    {
        return;
    }
    // Expect labSize message of form: 'labSize#rowNum#colNum'
    if (text.indexOf("labSize#") > -1)
    {
        var colNum = 0;
        var rowNum = 0;
        var divider = 0;
        var params = text.split("#");
        var splits = params[1].split(",");
        colNum = parseInt(splits[1]) + parseInt(splits[3]) + 1;
        rowNum = Math.max(splits[0], splits[2]);
        divider = parseInt(splits[0]) - 1;
        var rowRange = rowNum + 1;
        var colRange = colNum + 1;
        sizeParams.innerHTML = "Input a row between 1 and " + rowRange + " and a column between 1 and " + colRange;
        createTable(colNum,rowNum,divider);
        return;
    }
    messages.innerHTML += "<br/>" + text;
}

function createTable(numCols, numRows, divider) {
    var table = document.getElementById("buttonTable");
    //var numRows = 5;
    //var numCols = 8;
    //var divider = 4;
    var seatNum = 1;
    for (var i=0; i<numRows; i++){
        var row = table.insertRow(i);
        for (var j=0; j<numCols; j++){
            var cell = row.insertCell(j);
            if (j != divider) {
                //var temp = document.createElement("BUTTON");
                //temp.className = "button seatButton";
                //var t = document.createTextNode("Seat #" + seatNum);
                //temp.appendChild(t);
                //var q = "#" + i + "#" + j;
                //temp.onclick = function() {
                //    sendPosition2(q);
                //}
                //cell.appendChild(temp);
                //cell.innerHTML = "<button class=\"button seatButton\" onclick=\"sendPosition2('" + "#" + i + "#" + j + "');\">" + "Seat #" + seatNum + "</button>";
                var rowVal = i;
                var colVal = j;
                if (colVal > divider)
                {
                    colVal = colVal - 1;
                }

                cell.innerHTML = "<button class=\"button seatButton\" onclick=\"setText('" +  rowVal + "," + colVal + "');\">" + "Seat #" + seatNum + "</button>";
                seatNum++;
            }
            else {
                var temp = "<spacer></spacer>";
                cell.innerHTML = temp;
            }
        }
    }
}

function setText(coord)
{
    var row = coord.split(",")[0];
    var col = coord.split(",")[1];
    document.getElementById("classPosCol").value = col;
    document.getElementById("classPosRow").value = row;
}

