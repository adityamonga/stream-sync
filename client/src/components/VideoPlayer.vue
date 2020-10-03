<template>
  <div class="media">
		<video id='main-video-player' ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered"></video>
  </div>
</template>
<script src="https://vjs.zencdn.net/7.8.4/video.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vtt.js/0.12.1/vtt.min.js" integrity="sha512-jUblXGbKz+WLL9Tu7kU1FDIcMS7VTNRmjt33SuD9lGvutgXji4pxUKSAYp23DPdVL4zx9Hro+p6zFIybaujh9A==" crossorigin="anonymous"></script>
<script>
import videojs from 'video.js';
import * as io from 'socket.io-client';
import * as config from '../../config.dev';
const socket = io(config.SERVER_ENDPOINT);

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
	this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady(){
	console.log('onPlayerReady', this);
	});

	let videocss = document.createElement('link')
	videocss.setAttribute('src', 'video.js/dist/video-js.css')
	document.head.appendChild(videocss)

	let videojsmin = document.createElement('script')
	videojsmin.setAttribute('src', 'videojs.hls.min.js')
	videojsmin.setAttribute('type', 'application/javascript')
	document.head.appendChild(videojsmin)
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