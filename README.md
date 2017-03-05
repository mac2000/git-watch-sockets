Main idea of project is to have always running server which:

1. Listens for incoming webhooks
2. Broadcast messages to every connected client

Having that in place local application can be build which may listen for websocket messages, and if there is something happening on known git repository try to fetch it and in case of fast forward merge apply changes automatically or may be notify user about possible merge conflicts

To use it app should connect to websocket with access_token otherwise server will reject connection

App should be ready for connection loss and should take responsibility for token refresh

Simples possible client will look something like this:

```
const token = '...'
const socket = new WebSocket(`ws://localhost:3000?access_token=${token}`)
socket.onmessage = event => console.log(JSON.parse(event.data))
```

Hook messages passed as is, this app does not trying to be smart and just broad cast everything. Idea is that you can add one hook for each repository instead of many for each hand made app.
