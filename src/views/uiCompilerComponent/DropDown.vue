<template>
     <el-dropdown  @command="handleAddCondition" trigger="click">
          <span class="el-dropdown-link" style="pointer:cursor">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="condition">添加条件</el-dropdown-item>
                <!-- <el-dropdown-item command="subCondition">添加子条件</el-dropdown-item> -->
                <!-- <el-dropdown-item command="action">添加行为</el-dropdown-item> -->
                <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
</template>

<script>
export default {
    name:"DropDown",
    methods:{
        handleAddCondition(v){
     
            if(v =="condition"){
                this.$emit("addCondition");

            }else if (v== "subCondition"){
                this.$emit("addSubCondition")
            }else if(v=="action"){
                this.$emit("addAction")
            }else if(v=="delete"){
                this.$emit("doDelete")
            }
        }
    }
}
</script>

<style scoped lang="scss">
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>