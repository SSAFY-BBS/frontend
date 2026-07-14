const socket = new WebSocket("ws://localhost:8000/ws/notifications");

socket.onopen = () => {
  console.log("connected");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};