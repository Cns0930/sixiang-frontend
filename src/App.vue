<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<style lang="scss">
*{
    margin:0;
    padding:0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif,Microsoft YaHei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
}
.-center {
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
}
.-center-column {
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.-center-row {
    display: flex;
    align-items: center;
}

ul{
    list-style: none;
}
</style>
