<template>
	<div id="app">
		<landing-page/>
		<!-- <video-player :options="videoOptions"/> -->
	</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import VideoPlayer from './components/VideoPlayer.vue'
import LandingPage from './components/LandingPage.vue'
import * as config from '../config.dev.js';

export default {
	name: 'App',
	components: {
		// HelloWorld,
		// VideoPlayer,
		LandingPage
	},
	mounted(){
		this.config = config;
	},
	data() {
		return {
			videoOptions: {
				// autoplay: true,
				controls: true,
				sources: [
					{
						// src:"http://localhost:8080/stream/out.m3u8",
						src: config.NGINX_ENDPOINT + "/out.m3u8",
						type: "application/x-mpegURL",
					},
				],

			}
		};
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

</style>
