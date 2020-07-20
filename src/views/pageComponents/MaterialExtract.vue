<template>
  <div>
       <el-button @click="goPrev">上一步</el-button>
      <el-button @click="goNext">下一步</el-button>
  </div>
  
</template>

<script>
import Common from "./Common"
export default {
    name:"MaterialExtract",
    mixins: [Common],
}
</script>

<style>

</style>