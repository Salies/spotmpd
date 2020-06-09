<template>
    <div class="player-controls">
        eae, sou o controls
        <button @click="playback()">Play/Pause</button>
        <input type="range" v-model="volume" min="0" max="100" step="1" @input="setvol">
    </div>
</template>

<script>
export default{
    name:'controls',
    data: function() {
        return {
            volume: null
        };
    },
    methods:{
        playback(){
            this.$electron.ipcRenderer.send('playback');
        },
        setvol(e){
            this.$electron.ipcRenderer.send('setvol', this.volume);
        }
    },
    mounted(){
        this.$electron.ipcRenderer.send('getDefaultData');

        this.$electron.ipcRenderer.on('defaultDataRecieved', (event, data) => {
            this.volume = data.volume
        })
    }
}
</script>

<style>
.player-controls{
    background:var(--base-03);
    width:100%;
    height:90px;
    position: absolute;
    bottom: 0;
}
</style>