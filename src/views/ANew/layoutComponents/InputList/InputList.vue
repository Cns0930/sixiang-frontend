
<template>
    <div>
        <div v-for="(v,i) in value" :key="i" class="input-wrapper">
            <ElInput :value="v" @input="handleInput($event,i)" class="input"></ElInput>
            <el-tooltip class="remove-btn remove-on-tab" effect="dark" content="删除" placement="right-start">
                <i class="delete-btn el-icon-close" @click.stop="handelRemove(i)"></i>
            </el-tooltip>
        </div>
        <el-button-group>
            <el-button type="primary" @click="value.push('')">添加</el-button>
        </el-button-group>
    </div>
</template>
<script>
export default {
    name: "InputList",
    props: ["value"],
    methods: {
        handleInput(e, i) {
            this.$set(this.value, i, e)
        },
        handelRemove(i) {
            this.value.splice(i, 1)
        }
    }
}
</script>

<style scoped lang="scss">
.input-wrapper {
    display:inline-block;
   position: relative;
    .delete-btn {
        display: none;
    }
    &:nth-child(1) .input{
        margin-left:0;
    }

}
    .input-wrapper:hover .delete-btn {
         position: absolute;
         top:6px;
        right:10px;
        z-index: 30;
        color: #fff;
        margin: 0;
        width: 24px;
        height: 24px;
        font-size: 12px;
        background: #881d39;
        border: 1px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
.input {
    width: 150px;
    margin: 6px 10px;
}
</style>