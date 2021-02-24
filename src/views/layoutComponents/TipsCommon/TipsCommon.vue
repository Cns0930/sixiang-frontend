<template>
    <div class="box">
        <!-- <div class="headers">
            <h4 style="margin-right:20px">通知</h4>
            <el-radio :label="rv" v-model="radioValue" v-for="(rv,ri) in options" :key="ri"
                @input="handleRadioInput">{{rv}}</el-radio>
        </div> -->
        <div class="content">
            <el-button type="primary" v-show="showButton" @click="ifShow = true">{{buttonName || '是否显示'}}</el-button>
            <el-dialog :show-close="false" class="message-dialog" title="系统提示" :visible.sync="ifShowDialog" :close-on-click-modal="false" width="50%">
                <div class="content-box">
                    <div class="msgs" v-html="msg"></div>
                    <el-checkbox class="tips" v-model="attribute.value" @change="handleExtraChange">{{attribute.label}}</el-checkbox>
                </div>
                    <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                        <el-button type="primary" class="dialog-primary-btn" @click="ifShow = false">取消</el-button>
                        <el-button type="warning" class="dialog-warn-btn" @click="commitConfirm">确 定</el-button>
                    </div>
            </el-dialog>
            
        </div>
        
    </div>
</template>

<script>
export default {
    name: "TipsCommon",
    props: ["value",'buttonName'],
    data() {
        return {
            // options: ["是", "否"],
            // radioValue: "",
            ifShowDialog:false,
            attribute:{
               value:true,
               label:'我已阅读'
            },
            showButton:false,
            msg:'<h2>我是展示内容我是展示内容我是展示内容我是展示内容我是展示内容我是展示内容</h2>'

        }
    },
    created(){
        
        // if(!this.value){
        //     this.emitEvent("货币")
        // }else if(this.options.includes(this.value)){
        //     this.radioValue = this.value
        // }else{
        //     this.inputValue = this.value;
        //     this.radioValue = "其他"
        // }
    },
    computed: {
        // inputShow() {
        //     if (this.radioValue == "其他") {
        //         return true;
        //     }
        //     return false;
        // }
    },
    methods: {
        handleRadioInput(v) {
            if(v == '是') {
               this.showButton = true
            }else{
                this.showButton = false
            }
            
        },
        handleExtraChange(v) {
           console.log(v)
        },
        commitConfirm() {
            if(!this.attribute.value) {
               this.$message.warning('请先阅读')
            } else{
               this.ifShowDialog = false
               this.$emit('change', false)
            }
            
        }
    }

}
</script>

<style scoped lang="scss">
  .box{
      width: 50%;
      height: 50%;
      position: relative;
      left: 20%;
      margin-top: 5%;
    //   border: 1px solid red;
      .headers{
          display: flex;
          justify-content: center;
          align-items: center;
      }
      .content-box{
          position: relative;
        //   border: 1px solid red;
        //   padding: 10px;
          .msgs{
              width: 80%;
              margin: 0 auto;
          }
          .tips{
              position: absolute;
              margin-top: 20px;
              left: 10%;
              bottom: 0;
          }
      }
  }
</style>