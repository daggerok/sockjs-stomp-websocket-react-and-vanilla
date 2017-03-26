var stompClient = null, online = false;

function setConnected(connected) {
  online = connected;
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  if (connected) {
    $("#conversation").show();
  }
  else {
    $("#conversation").hide();
  }
}

function connect() {
  var socket = new SockJS('http://localhost:8080/application-stomp-websocket-endpoint');
  stompClient = Stomp.over(socket);
  stompClient.connect({user: 'max'}, function onConnect(frame) {
    setConnected(true);
    stompClient.subscribe('/topic/greetings', function (greeting) {
      showGreeting(JSON.parse(greeting.body).content);
    });
  }, function onDisconnect(message) {
    online = false;
    stompClient = null;
    $("#disconnect").click();
  });
}

function disconnect() {
  if (stompClient != null) {
    stompClient.disconnect();
  }
  setConnected(false);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

function send(name) {
  if (online && stompClient) {
    stompClient.send("/app/send-greeting-message", {}, JSON.stringify({'name': name}));
  }
}

function sendName() {

  if (!online || !stompClient) {
    connect();
    sleep(2000);
    send('connecting');
  }

  send($("#name").val());
  $("#name").val('');
}

function showGreeting(message) {
  $("#greetings").prepend("<tr><td>" + message + "</td></tr>");
}

$(function () {
  $("form").on('submit', function (e) {
    e.preventDefault();
  });
  $("#connect").click(function () {
    connect();
  });
  $("#disconnect").click(function () {
    disconnect();
  });
  $("#send").click(function () {
    sendName();
  });
});
