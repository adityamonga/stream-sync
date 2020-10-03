<template>
  <div class="landing">
    <button>
    <div class="button-wrapper">
      <button class="button cta-button" @click="createRoom">Create Room</button>
    </div>
      </button>
  </div>
  
</template>

<script>
const axios = require('axios')
const config = require('../../config.dev')

export default {
  name: 'LandingPage',
  props: {
    msg: String
  },
  methods:{
    createRoom: function(){
      axios.get(config.SERVER_ENDPOINT + '/create_room').then((response) => {
        window.location.href = config.CLIENT_ENDPOINT+'/room/'+response.data;
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.landing{
  margin:auto;
}
.button-wrapper {
  display: block;
  text-align: center;
}
.button {
  border: none;
  border-radius: 3em;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
  display: inline-block;
  font-size: 1em;
  padding: 1em 2em;
  width: auto;
}
.cta-button {
  background-color: #000;
  color: #fff !important;
}

.cta-button:hover {
  background-color: #777;
}
</style>
