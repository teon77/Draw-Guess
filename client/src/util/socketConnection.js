import io from "socket.io-client";
const port = process.env.PORT || 8181;
const serverEndpoint = `http://localhost:${port}/`;

export default io(serverEndpoint);
