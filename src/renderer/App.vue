<template>
  <div id="app">
    <div class="menubar">
      <router-link to="/">Home </router-link>
      -
      <router-link to="/albums"> Albums</router-link>
    </div>
    <router-view></router-view>
    <controls></controls>
  </div>
</template>

<script>
  import Controls from './components/Controls';

  export default {
    name: 'elizabeth',
    components: { Controls }
  }
</script>

<style>
  *{ /*good 'ol solarize*/
    /*--base-03: #292a2c;*/
    --bg: #181818;
    --base-03: #2b2c30;
    --base-0: #ff91d0;
    --base-1: #e6e6e6;
  }

  body{
    margin:0;
  }

  #app{
    height: 100vh;
    position:relative;
  }

  .menubar{
    width:100%;
    height:24px;
    background-color:var(--base-03);
  }

  .wrapper{
    height:calc(100vh - 104px);
    background-color:var(--bg);
  }
</style>
