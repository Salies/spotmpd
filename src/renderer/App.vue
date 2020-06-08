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
    --base-03: #002b36;
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
    background:var(--base-03);
  }

  .wrapper{
    height:calc(100vh - 104px);
    background: #181818;
  }
</style>
