'use strict';

window.ReactAppWS = (function ReactAppWS() {

  const
    WS_CONNECT_ENDPOINT = 'http://localhost:8080/application-stomp-websocket-endpoint',
    SEND_NAME_URI = '/app/send-greeting-message',
    GREETINGS_TOPIC = '/topic/greetings',
    PING = 30000;

  let
    stompClient = null,
    online = false,
    latestHandler;

  function createClient() {
    const socket = new SockJS(WS_CONNECT_ENDPOINT);
    return Stomp.over(socket);
  }

  function setConnected(connected) {
    online = connected;
  }

  function connect(handler) {

    latestHandler = handler;
    stompClient = createClient();
    stompClient.heartbeat.outgoing = PING;
    stompClient.heartbeat.incoming = PING;
    stompClient.connect(
      // some headers:
      {user: 'max'},

      function onConnect(frame) {
        setConnected(true);
        /*console.log('Connected: ' + frame);*/
        stompClient.subscribe(GREETINGS_TOPIC, function subscribeTopicGreetings(greeting) {
          const bodyStr = greeting.body || '';
          const body = JSON.parse(bodyStr) || '';
          const content = body.content || {};
          latestHandler(content);
        });
      },

      // disconnection (error) handler
      function onDisconnect(message) {
        console.warn('disconnecting...');
        console.warn(message);
        online = false;
        stompClient = null;
      }
    );
  }

  // public API

  function sendMessage(name) {
    if (online && stompClient && isConnected()) {
      stompClient.send(SEND_NAME_URI, {}, JSON.stringify({'name': name}));
    } else {
      connect(latestHandler);
      setTimeout(function () {
        stompClient.send(SEND_NAME_URI, {}, JSON.stringify({'name': name}));
      }, 1500);
    }
  }

  function disconnect() {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
  }

  function reconnect(handler) {
    disconnect();
    connect(handler);
  }

  function isConnected() {
    return stompClient && stompClient.connected;
  }

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect,
  };

})();
