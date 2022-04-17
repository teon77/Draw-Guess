# Draw-Guess

## Draw and guess game
=====

The game is built using **express** server that handles all the data about rooms, users and the gameplay.
the server serves a **React** client side. The app also uses WebSocket connection using **socket.io** and supports multiple rooms and users.
Currently all the data is handled locally in the server, with the server also self handling rooms creation and deletion.
The game is available at <https://drawing-guess.herokuapp.com/>


## Front-End
=====

### Login
component: <https://github.com/teon77/Draw-Guess/blob/main/client/src/core/Welcome.js>

![alt text](https://github.com/teon77/Draw-Guess/blob/main/pictures/login.png "login view")

### Waiting
component: <https://github.com/teon77/Draw-Guess/blob/main/client/src/core/Waiting.js>
![alt text](https://github.com/teon77/Draw-Guess/blob/main/pictures/waitingRoom.png "waiting view")

### Drawing  
component: <https://github.com/teon77/Draw-Guess/blob/main/client/src/core/Drawing.js>
![alt text](https://github.com/teon77/Draw-Guess/blob/main/pictures/drawingView.png "drawing view")


You can run this game locally using:
```
$ git clone https://github.com/teon77/Draw-Guess.git
cd server
npm run start

cd client
npm start

```
