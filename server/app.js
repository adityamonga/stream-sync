const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)
const axios = require('axios');
const { response } = require('express');
const config = require('../client/config.dev');
const cors = require('cors');
const fs = require('fs');


io.on('connection', function(socket) {
    console.log('connection established.');
    socket.on('isPlaying', function(data){
        console.log('changing player state');
        io.emit('changePlayerState', data);
    })
})

app.use(cors({
    origin: config.CLIENT_ENDPOINT
}));

app.get('/create_room', (req, res) => {
    axios.get('https://helloacm.com/api/random/?n=16')
    .then((response) => {
        res.send(response.data);
        // room_id = response.data
        // if(fs.existsSync(config.MEDIA_DIR_BASE + '/room_id'))
    }).catch((err) => {
        console.log('failed with err: '+ err)
    });
});

app.get('/room/:room_id', (req, res) => {
    let room_id = req.params.room_id;
    res.send('room ${room_id} entered..')
});

http.listen(config.SERVER_PORT, () => {
    console.log('server running on port :4000..')
    console.log(config);
})
