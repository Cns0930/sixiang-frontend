<template>
  <div id="app">
    <div class="banner"></div>
    <router-view/>
  </div>
</template>




<style scoped lang="scss">
.banner {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 105px;
        background-image: url("~@/assets/new_tab.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position-x: center;
        position: fixed;
        width: 100%;
        z-index: 999;

    }

</style>
<style lang="scss">
*{
    margin:0;
    padding:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  background-image: url("~@/assets/new_background.jpeg");
}


</style>
