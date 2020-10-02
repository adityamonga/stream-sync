<template>
  <div class="media">
		<video id='video-player' ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import * as io from 'socket.io-client';
const socket = io('http://localhost:4000');

export default {
	name: 'VideoPlayer',
	props: {
		options: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
		socket: {},
		context: {},
		player: null,
		}
	},
	created() {
		},
	mounted() {
	socket.on('connection', data => {
		console.log('socket added.');
		console.log(data)
	})
	socket.on('changePlayerState', playerState => {
		console.log('update player state to: ' + playerState.isPlaying);
		if (playerState.isPlaying){
			this.player.play();
		}
		else{
			this.player.pause();
		}
	})
	let videocss = document.createElement('link')
	videocss.setAttribute('src', 'video.js/dist/video-js.css')
	document.head.appendChild(videocss)

	let videojsmin = document.createElement('script')
	videojsmin.setAttribute('src', 'videojs.hls.min.js')
	videojsmin.setAttribute('type', 'application/javascript')
	document.head.appendChild(videojsmin)

	this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady(){
		console.log('onPlayerReady', this);
		});
	
	this.player.on('play', function() {
		socket.emit('isPlaying', {isPlaying: true});
	});
	this.player.on('pause', function() {
		socket.emit('isPlaying', {isPlaying: false});
	});
	},
	methods:{},

	beforeDestroy() {
		if (this.player) {
			this.player.dispose()
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>