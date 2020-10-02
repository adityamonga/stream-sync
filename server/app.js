const Express = require('express')();
const Http = require('http').Server(Express);
const io = require('socket.io')(Http)

io.on('connection', function(socket) {
    console.log('connection established.');
    socket.on('isPlaying', function(data){
        console.log('changing player state');
        io.emit('changePlayerState', data);
    })
})

Http.listen(4000, () => {
    console.log('server running on port :4000..')
})