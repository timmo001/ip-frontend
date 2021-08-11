import SocketIOClient from "socket.io-client";

export default function WebSocket() {
  const url = `${window.location.protocol}//${window.location.hostname}:${
    process.env.NODE_ENV === "production" ? window.location.port : 5684
  }`;
  console.log("Socket - url:", url);
  const socket = SocketIOClient(url, {
    path: `${window.location.pathname}/socket.io`.replace("//", "/"),
  });
  socket.on("connect", () => {
    console.log("Socket - Connected");
    // socket.emit('logs', {});
  });
  // socket.on('logs', (data: any) => {
  //   console.log('Socket - log:', data);
  // });
  socket.on("disconnect", () => {
    console.log("Socket - Disconnected");
  });

  return socket;
}
