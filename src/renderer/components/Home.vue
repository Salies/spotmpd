<template>
    <div class="wrapper">
        eae, sou o home
        <button @click="load()">load songs</button>
    </div>
</template>

<script>
export default{
    name:'home',
    methods: {
        load(){
            this.$electron.ipcRenderer.send('load-list', [
                "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 07 Pirate's Scorn.flac",
                "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 08 Shit Boat (No Fans).flac",
                "Digital (Bandcamp)/Alestorm/Curse of the Crystal Coconut (Digital Deluxe)/Alestorm - Curse of the Crystal Coconut (Digital Deluxe) - 09 Pirate Metal Drinking Crew.flac",
            ]);
        }
    }
}
</script>