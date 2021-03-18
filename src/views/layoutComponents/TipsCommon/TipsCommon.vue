<template>
    <div class="box">
        <!-- <div class="headers">
            <h4 style="margin-right:20px">通知</h4> -->
            <el-radio :label="rv" v-model="radioValue" v-for="(rv,ri) in options" :key="ri"
                @input="handleRadioInput">{{rv}}</el-radio>
        <!-- </div> -->
        <!-- <div class="content"> -->
            <!-- <el-button type="primary" v-show="value" @click="ifShowDialog = !ifShowDialog">是否显示</el-button> -->
            <el-dialog :show-close="false" center class="message-dialog" title="提示信息"  :visible.sync="ifShowDialog" :close-on-click-modal="false" width="60%">
                <div class="content-box">
                    <div class="msgs" v-html="msg"></div>
                    <el-checkbox class="tip-content" v-model="attribute.value" @change="handleExtraChange">{{attribute.label}}</el-checkbox>
                </div>
                <div slot="footer" class="dialog-footer" style="display: flex;justify-content: space-around">
                    <el-button type="primary" class="dialog-primary-btn" @click="closeDialog">取消</el-button>
                    <el-button type="warning" class="dialog-warn-btn" @click="commitConfirm" :disabled='!attribute.value'>确 定</el-button>
                </div>
            </el-dialog>
            
        <!-- </div> -->
        
    </div>
</template>

<script>
export default {
    name: "TipsCommon",
    props: ["value",'msg'],
    data() {
        return {
            options: ["是", "否"],
            radioValue: "否",
            ifShowDialog:false,
            attribute:{
               value:false,
               label:'已阅知'
            },
            // showButton:false,
    //         msg:<div class="zc_wrapper">
	//     <p class="zc_title" style="font-size:30px;">杭州市商事主体住所（经营场所）申报告知书</p>
	//     <p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;一、商事主体申请登记时申报的住所（经营场所）应当符合住所登记申报告知承诺制度的相关规定，不得为住宅、车库、违法建筑、地下空间，列入征地拆迁红线范围、不具备安全条件、非规划为经营性用途的建筑物不得用作住所（经营场所）登记申报。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;二、商事主体应当根据实际使用情况申报住所（经营场所）信息，并应自觉接受登记机关对住所登记的监督管理，同时应依法承担因以下原因引致的一切法律责任：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、提交虚假材料；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、采取其他欺诈手段隐瞒重要事实取得登记；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、商事登记申报与住所的实际使用情况不符；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、违反告知承诺制度。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;（《中华人民共和国公司登记管理条例》第六十四条：提交虚假材料或者采取其他欺诈手段隐瞒重要事实，取得公司登记的，由公司登记机关责令改正，<span style="color:red">处以5万元以上50万元以下的罚款</span>；情节严重的，撤销公司登记或者吊销营业执照。）<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;三、商事登记申请人、中介机构、代理人在商事登记中存在提供虚假材料、违反告知承诺制度等行为的，除依照相关法律法规处理以外，相关部门有权依据《杭州市公共信用信息管理办法》第十一条和第十五条的规定，依法将上述主体的该项失信信息归集至杭州市信用平台。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;四、商事主体应自觉接受相关审批监管部门的监督管理，不得擅自改变房屋用途等从事生产经营活动。商事主体违反上述规定的，应当及时办理住所或经营范围的变更登记。<span class="fred">
	// 	<br>
	// 	<br>
	// 	</span></p><p class="zc_title" style="font-size:30px;">风险提示</p>
	// 	<p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;进行公司（企业）设立、变更、注销登记等相关登记行为时，申请人及其代理人应当提供真实有效的申请文件和材料，严禁盗用、冒用、伪造、擅自涂改一切与公司（企业）登记事项相关的文件和材料。存在前述行为，一经查实，严格依照相关法律规范进行处理；构成犯罪的，移交公安机关依法追究刑事责任。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;附相关法律规范：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;1、《中华人民共和国公司登记管理条例》第二条：申请办理公司登记，申请人应当对申请文件、材料的真实性负责。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;2、《中华人民共和国公司登记管理条例》第六十四条：提交虚假材料或者采取其他欺诈手段隐瞒重要事实，取得公司登记的，由公司登记机关责令改正，<span style="color:red">处以5万元以上50万元以下的罚款；</span>情节严重的，撤销公司登记或者吊销营业执照。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;3、《中华人民共和国公司登记管理条例》第七十一条：伪造、涂改、出租、出借、转让营业执照的，由公司登记机关处以1万元以上10万元以下的罚款；情节严重的，吊销营业执照。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;4、《中华人民共和国公司登记管理条例》第七十四条： 未依法登记为有限责任公司或者股份有限公司，而冒用有限责任公司或者股份有限公司名义的，或者未依法登记为有限责任公司或者股份有限公司的分公司，而冒用有限责任公司或者股份有限公司的分公司名义的，由公司登记机关责令改正或者予以取缔，可以并处10万元以下的罚款。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;5、《中华人民共和国治安管理处罚法》第五十二条：有下列行为之一的，处十日以上十五日以下拘留，可以并处一千元以下罚款；情节较轻的，处五日以上十日以下拘留，可以并处五百元以下罚款：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;（一）伪造、变造或者买卖国家机关、人民团体、企业、事业单位或者其他组织的公文、证件、证明文件、印章的；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;（二）买卖或者使用伪造、变造的国家机关、人民团体、企业、事业单位或者其他组织的公文、证件、证明文件的；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;6、《中华人民共和国居民身份证法》第十七条：有下列行为之一的，由公安机关处二百元以上一千元以下罚款，或者处十日以下拘留，有违法所得的，没收违法所得：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;（一）冒用他人居民身份证或者使用骗领的居民身份证的；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;（二）购买、出售、使用伪造、变造的居民身份证的。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;伪造、变造的居民身份证和骗领的居民身份证，由公安机关予以收缴。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;7、《中华人民共和国刑法》第二百八十条：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;【伪造公司、企业、事业单位、人民团体印章罪】伪造公司、企业、事业单位、人民团体的印章的，处三年以下有期徒刑、拘役、管制或者剥夺政治权利，并处罚金。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;【伪造、变造、买卖身份证件罪】伪造、变造、买卖居民身份证、护照、社会保障卡、驾驶证等依法可以用于证明身份的证件的，处三年以下有期徒刑、拘役、管制或者剥夺政治权利，并处罚金；情节严重的，处三年以上七年以下有期徒刑，并处罚金。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;【使用虚假身份证件、盗用身份证件罪】在依照国家规定应当提供身份证明的活动中，使用伪造、变造的或者盗用他人的居民身份证、护照、社会保障卡、驾驶证等依法可以用于证明身份的证件，情节严重的，处拘役或者管制，并处或者单处罚金。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;（《杭州市公共信用信息管理办法》第十一条：法人和其他组织的失信信息包括：（一）税款、社会保险费、公积金欠缴信息；（二）行政事业性收费、公用事业费、政府性基金欠缴信息；（三）适用一般程序作出的生效行政处罚信息，行政强制执行信息； （四）提供虚假材料、违反告知承诺制度的信息； （五）采用虚构劳动关系、提供虚假资料等手段骗取社会保险待遇信息；（六）发生产品质量、安全生产、食品安全、环境污染等责任事故被监管部门处理的信息；（七）被监管部门处以行业禁入的信息；（八）国家和本省、市规定的其他失信信息。自然人的失信信息除前款所列第三、四、七项外，还包括下列信息：（一）税款、公用事业费欠缴信息；（二）以欺诈、伪造证明材料或者其他手段骗取社会保险待遇信息；（三）乘坐公共交通工具时冒用他人证件、使用伪造证件乘车等逃票信息；（四）参加国家或者地方组织的统一考试作弊的信息；（五）国家和本省、市规定的其他失信信息。第十五条：信息提供主体应当按照公共信用信息目录，及时、准确地向市信用平台提供公共信用信息，并对其提供的信息的真实性、合法性、时效性负责。）<span class="fred">
	// 	<br>
	// 	<br>
	// 	</span></p><p class="zc_title" style="font-size:30px;">申请人承诺书</p>
	// 	<p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;本申请人已详细阅读由委托代理人转交的《杭州市商事主体住所申报告知书》，对本次申报的住所作出如下承诺：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;申请人对住所（经营场所）已依法取得使用权，申请登记的住所（经营场所）信息与实际使用情况一致。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;该住所（经营场所）不属于住宅、车库、违法建筑、危险建筑、非规划为经营性用途的地下空间等不能用作住所（经营场所）的房屋，也不属于已列入征地拆迁红线范围或位于政府及行业专项整治列入的禁限制区域内的建筑物；法律、法规规定应当经有关部门批准方可在住所（经营场所）从事相关经营活动的，承诺在取得有关许可证或批准文件后再开展经营活动。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;住所（经营场所）登记，不具有确认房产权属、认定房屋使用属性或作为征收补偿的依据。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;若违背以上承诺，相关法律后果及责任由本企业或企业相关人员承担，并自愿接受相关行政执法部门的约束和惩戒。<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fred">
	// 	<br>
	// 	<br>
	// 	</span></p><p class="zc_title" style="font-size:30px;">代理人/机构承诺书</p>
	// 	<p style="font-size:20px;">本代理人/机构作出如下承诺：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;本次登记材料均由委托人授权代为填报或提交，所有填报信息均经过本人/本机构的核实，本人/本机构保证所填报和提交的信息均真实有效。本人/本机构代为提交登记申请之前，已将《杭州市商事主体住所（经营场所）申报告知书》完整转交委托人阅知，并承诺与该委托人共同承担因以下原因引致的一切法律责任：<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;1、提交虚假材料；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;2、采取其他欺诈手段隐瞒重要事实取得登记；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;3、商事登记申报与住所的实际使用情况不符；<span class="fred">
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;4、违反告知承诺制度。<span class="fred">
	// 	<!-- <p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>代理人/代理机构（签名或盖章）：<span class="fred"> -->
	// 	</span></p><p class="zc_cont" style="font-size:20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	// 	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="fred">
	// 	<br>
	// 	<br>

	// 	</span></p><div class="sbxxtl">
	//     </div>	
    // </div>

        }
    },
    created(){
        if(!this.value){
            this.emitEvent("否")
        }else if(this.options.includes(this.value)){
            this.radioValue = this.value
        }
    },
    computed: {

    },
    watch:{
        radioValue (newVal, oldVal) {
            this.$emit('change', newVal)
        },
    },
    methods: {
        handleRadioInput(v) {
            if(v == '是') {
               this.ifShowDialog = true
            }else{
                this.ifShowDialog = false
            }
            
        },
        closeDialog() {
           this.ifShowDialog = false,
           this.radioValue = '否'
        },
        handleExtraChange(v) {
           console.log(v)
        },
        commitConfirm() {
            if(!this.attribute.value) {
               this.$message.warning('请先阅读')
            } else{
               this.ifShowDialog = false
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
          width: 80%;
          margin: 0 auto;
        //   border: 1px solid red;
        //   padding: 10px;
         min-height: 300px;
          .msgs{
            //   width: 80%;
              
          }
          .tip-content{
              margin-bottom: 20px;
              width: 100%;
              text-align: center;
          }
      }
  }
</style>