import io from "socket.io-client";
const serverEndpoint = "http://localhost:8181/";

export default io(serverEndpoint);
