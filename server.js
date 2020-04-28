const express = require('express');
const path = require('path');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public'))); // arquivos front-end
app.set('views', path.join(__dirname, 'public')) // definindo as views
app.engine('html', require('ejs').renderFile); // colocando a engine html
app.set('view engine', 'html'); // definindo a engine

app.use('/', (req, res) => {
    res.render('index.html'); // renderizando html
});


let messages = []; // array para guardar mensagem

io.on('connection', socket => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`)
    });

    socket.emit('previousMessage', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
        console.log(data);
    });
}) // toda vez q um novo cliente conectar

server.listen(3030); // ouça a porta 3030