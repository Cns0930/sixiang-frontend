<template>
    <div class="print-select">
        <div class="main">
            <p>请下载需要打印的文件</p>
            <div class="ellipse"></div>
            <el-table ref="multipleTable" :data="printDocuments" tooltip-effect="dark" style="width: 800px" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="60">
                </el-table-column>
                <el-table-column align="center" label="序号" type="index" width="100">
                </el-table-column>
                <el-table-column label="材料名称" prop="documentName">
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <a :href="scope.row.docUrl" target="_blank" class="a-btn"> <i class="el-icon-download" style="margin-right: 5px;color: #eaeaea" />下载</a>
                        <el-divider direction="vertical" />
                        <!-- <a :href="scope.row.pdfUrl" target="_blank" class="a-btn"><i class="el-icon-printer" style="margin-right: 5px;color: #eaeaea" />预览</a>
                        <el-divider direction="vertical" /> -->
                        <a href="javascript:void(0);" @click="printOneFile(scope.row.docUrl)" class="a-btn"><i class="el-icon-printer" style="margin-right: 5px;color: #eaeaea" />打印</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="operate-btn" style="width: 50%;min-width: 800px;">
            <div>
                <!-- <el-button type="primary" class="big-btn dialog-primary-btn" @click="batchDownload">批量下载</el-button> -->
                <el-button type="primary" class="big-btn btn-default dialog-primary-btn" @click="batchPrint">批量打印</el-button>
            </div>
            <el-button type="warning" class="big-btn btn-default warn-btn" @click="postDocs">下一步</el-button>
        </div>
        <processing v-if="isPrinting" msg="正在打印，请稍候" />

        <el-dialog :show-close="false" class="message-dialog" title="系统提示" :visible.sync="showPrintFail" append-to-body :close-on-click-modal="false" width="800px">
            <div class="message-dialog-content">
                <div class="info">打印失败,请检查打印机插件</div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="warning" class="dialog-warn-btn" @click="showPrintFail = false">关闭</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import { BatchDownloadApi, QuerySelfServiceRecord, updateRecordIsBatchPrint, localPrintFile, sendToPdsc, sendAllData } from '@/api/ANew'
import Processing from '@/bangban/views/ANew/components/Processing'
// import approvalConfig from "../config/approvalConfig"
import { mapState, mapGetters } from "vuex"
// import { zhusuo } from "../config/baseInfoObj"


// import { bianGeng1_8_4 } from "../config/configParts/formZhusuoConfig"
// import supportFieldNo from '../config/fieldNoObj/supportFieldNo'
// import formJingbanrenConfig from '../config/configParts/formJingbanrenConfig'

export default {
    name: 'PrintSelect',
    data() {
        return {
            checkList: [],
            docUrl: '',
            pdfUrl: '',
            printDocuments: [],
            multipleSelection: [],
            isPrinting: false,
            showPrintFail: false,
            mobile:"",
            prmname:"",
            allDataParam:{},
        }
    },
    components: { Processing },
    computed: {
        ...mapState({
            companyName: state => state.home.companyName,
            allFieldNo: state => state.home.allFieldNo,
            allFieldNoGetter:state=>state.home.allFieldNoGetter
        }),
        ...mapGetters(['getSid', 'qingxingItems','item_code',"getJingbanrenMobile","getJingbanrenName","getUserId"])
    },
    beforeRouteEnter(to, from, next){
        next(vm => {
            const querySelfServiceRecordId = vm.$route.query.selfServiceRecordId
            // 接口需要的参数
            if(!vm.companyName){
                
                 vm.allDataParam = JSON.parse(sessionStorage.getItem("allDataParam"));
                 vm.$store.commit("putAllFieldNo",JSON.parse(vm.allDataParam.fieldNoText));
                 vm.$store.commit("putAllFieldNoGetter",JSON.parse(vm.allDataParam.allFieldNoGetter));
            }else{
                 vm.allDataParam = {
                    companyName: vm.companyName,
                    fieldNoText: JSON.stringify(vm.allFieldNo),
                    fieldNoTextGetter:JSON.stringify(vm.allFieldNoGetter),
                    sid: vm.getSid,
                    // pdscApprovalName:_.flatMap(approvalConfig.approvalConfig,"children").find(v=>v.value === vm.getSid).label,
                    pdscApprovalItemName: _.isArray(vm.qingxingItems) ? vm.qingxingItems.join(",") :vm.qingxingItems,
                    selfserviceRecordId: querySelfServiceRecordId,
                    userId: vm.getUserId,
                }
                sessionStorage.setItem("allDataParam",JSON.stringify(vm.allDataParam))
            }
            
            

            // 先从vuex 中获取经办人数据
            let jingbanrenMobileFst=null
            let jingbanrenNameFst =null
            vm.mobile =vm.getSid=="310115-418-03-old"? 
            jingbanrenMobileFst|| "" :
            vm.allFieldNo["jingbanren_mobilePhone"] || vm.getJingbanrenMobile;
            // 获取经办人名字，判断是否第一个事项
            vm.prmname = vm.getSid=="310115-418-03-old"?
            jingbanrenNameFst || "":
            vm.allFieldNo["jingbanren_name"] || vm.getJingbanrenName;
            if(vm.mobile){
                sessionStorage.setItem("jingbanrenMobile",vm.mobile)
            }else{
                vm.mobile = sessionStorage.getItem("jingbanrenMobile")
            }
            if(vm.prmname){
                sessionStorage.setItem("jingbanrenPrmname",vm.prmname)
            }else{
                vm.prmname = sessionStorage.getItem("jingbanrenPrmname")
            }
        })
    },
   
    mounted() {
        this.$nextTick(() => {
            this.queryResult()
        })
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        goPreview() {
            const querySelfServiceRecordId = this.$route.query.selfServiceRecordId
            this.$router.push({
                path: '/printpreview',
                query: { 'selfServiceRecordId': querySelfServiceRecordId }
            })
        },
        goPrint() {
            const querySelfServiceRecordId = this.$route.query.selfServiceRecordId
            this.$router.push({
                path: '/printpreview',
                query: { 'selfServiceRecordId': querySelfServiceRecordId }
            })
        },
        batchDownload() {
            const params = this.multipleSelection.map(s => {
                return {
                    url: s.docUrl,
                    name: s.documentName,
                }
            })
            BatchDownloadApi(params).then();
        },
        async postDocs() {

            // let h = this.$createElement;
            let result
            try {
                result = await this.$msgbox({
                    title: "系统提示",
                    message: <div class="">
                        <div class="form-line">

                            <span class="form-title" style="whidth:200px;">请确认该办件是否操作完毕</span>


                        </div>

                    </div>
                    ,
                    showCancelButton: true,
                    customClass: "add-gudong",
                    cancelButtonClass: "confirm-btn el-button--primary",
                    confirmButtonClass: "confirm-btn",

                });
            } catch (e) {
                result = "cancel"
            }
            if (result != "confirm") return;

            const querySelfServiceRecordId = this.$route.query.selfServiceRecordId
            if (querySelfServiceRecordId) {
                // let allDataParam = {
                //     companyName: this.companyName,
                //     fieldNoText: JSON.stringify(this.allFieldNo),
                //     sid: this.getSid,
                //     pdscApprovalName:approvalConfig[0].children.find(v=>v.value === this.getSid).label,
                //     pdscApprovalItemName: _.isArray(this.qingxingItems) ? this.qingxingItems.join(",") :this.qingxingItems,
                //     selfserviceRecordId: querySelfServiceRecordId,
                //     userId: JSON.parse(sessionStorage.getItem("user")).id,
                // }
                // 提交单窗拼接参数
                // 获取经办人移动电话，判断是否第一个事项
                // let jingbanrenMobileFst=(formJingbanrenConfig.list.find(f => f.fieldNo === '1_15'))?.value;
                // let jingbanrenNameFst = (formJingbanrenConfig.list.find(f => f.fieldNo === '1_11'))?.value;
                // let mobile =this.getSid=="310115-418-03"? 
                // jingbanrenMobileFst|| "" :
                // this.allFieldNo["jingbanren_mobilePhone"] || this.getJingbanrenMobile;
                // // 获取经办人名字，判断是否第一个事项
                // let prmname = this.getSid=="310115-418-03"?
                // jingbanrenNameFst || "":
                // this.allFieldNo["jingbanren_name"] || this.getJingbanrenName

                let params = {
                    selfServiceRecordId: querySelfServiceRecordId,
                    assistant: JSON.parse(sessionStorage.getItem("user")).name,
                    mobile:this.mobile,
                    prmname:this.prmname,
                    companyRegisteredAddress: this.getZhusuo() || this.allFieldNo["registeredAddress"]
                };
                let response = await Promise.all([sendToPdsc(params), sendAllData( {...this.allDataParam,status:1})])
                let saveDataRes = response[1];
                if (saveDataRes.message !== 'SUCCESS') {
                    this.$message({ type: "warning", message: "保存数据失败" })
                }
                const { code, message, data } = response[0]
                if (code === 200 && message === 'SUCCESS' && data) {
                    this.$router.push('/postDocs#' + data.ticketId)
                    // 调用打印服务，打印材料凭证
                    console.log('调用打印服务，打印材料凭证', data.pingzhengDocxUrl)
                    this.printOneFile(data.pingzhengDocxUrl)
                } else {
                    this.$router.push('/postDocs#nodata')
                }

            }
        },
        getZhusuo() {
            if (zhusuo && zhusuo.value) {
                return zhusuo.value
            }
            let obj1 = bianGeng1_8_4()
            if (obj1 && obj1.value) {
                return obj1.value
            }
            let obj2 = supportFieldNo.list.find(f => f.fieldNo === '21_4')
            if (obj2 && obj2.value) {
                return obj2.value
            }

        },
        queryResult() {
            const querySelfServiceRecordId = this.$route.query.selfServiceRecordId
            if (querySelfServiceRecordId) {
                QuerySelfServiceRecord({ 'selfServiceRecordId': querySelfServiceRecordId }).then(res => {
                    const { code, message, data } = res
                    if (code === 200 && message === 'SUCCESS' && data) {
                        this.docUrl = data.convert.docUrl
                        this.pdfUrl = data.convert.pdfUrl
                        if (data.convert && data.convert.printDocuments) {
                            this.printDocuments = data.convert.printDocuments
                        }
                    } else {
                        this.$message.error('无法找到该条记录!')
                    }
                })
            }
        },
        printOneFile(docUrl) {
            if (docUrl) {
                let urls = [];
                urls.push(docUrl);
                const params = {
                    url_print_name: urls
                }
                localPrintFile(params).then(res => {
                    if (res.code === 200) {
                        this.$message.success("请求已经发送到打印机");
                    } else {
                        this.showPrintFail = true
                    }
                });
            }
        },
        batchPrint() {
            // 标记当前记录为批量打印
            const querySelfServiceRecordId = this.$route.query.selfServiceRecordId
            if (querySelfServiceRecordId) {
                updateRecordIsBatchPrint({ 'selfServiceRecordId': querySelfServiceRecordId }).then(res => {
                    const { code, message, data } = res
                    if (code === 200 && message === 'SUCCESS' && data) {
                        console.log('已标记为批量打印记录');
                    } else {
                        this.$message.error('无法找到该条记录!')
                    }
                })
            }
            // 批量打印
            this.isPrinting = true
            const urls = this.multipleSelection.map(s => {
                return s.docUrl;
            })
            const params = {
                url_print_name: urls
            }
            localPrintFile(params).then(res => {
                this.isPrinting = false;
                if (res.code === 200) {
                    this.$message.success("请求已经发送到打印机");
                } else {
                    this.showPrintFail = true
                    // this.$message.warning("请检查打印机插件");
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
.document-list {
    list-style: none;
    width: 800px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-checkbox-group {
        width: 100%;
        li,
        label {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    li {
        padding: 5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);
        line-height: 100px;

        &:last-child {
            border-bottom: unset;
        }

        .document-name {
            font-size: 28px;
        }

        .document-url {
            font-size: 12px;
            font-weight: 200;
            float: right;
        }
    }
}

.print-select {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-top: 100px;

    .main {
        width: 80%;
        min-width: 800px;
        padding: 40px 0;
        border: 2px solid #00cc9e;
        background:rgba(6,59 ,152 , 0.7);
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;

        p {
            font-size: 32px;
            margin: 20px 0;
        }

        .ellipse {
            width: 800px;
            height: 4px;
            margin: 10px 0 30px;
            background: #fff;
            border-radius: 50% / 50%;
            background: rgba(255, 255, 255, 0.46);
        }

        .check-group {
            display: flex;
            justify-content: center;
            flex-direction: column;

            .el-checkbox {
                line-height: 60px;
            }
        }
    }
}
</style>

<style lang="scss">
.print-select {
    .el-checkbox {
        color: #ffffff;
        font-size: 18px;
        letter-spacing: 0.68px;
        line-height: 24px;

        .el-checkbox__label {
            font-size: 22px;
        }

        .el-checkbox__inner {
            width: 18px;
            height: 18px;
            &::after {
                left: 6px;
                top: 3px;
            }
        }

        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__inner {
            background-color: transparent !important;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #00c3ff;
        }
    }

    .el-table,
    .el-table thead {
        color: white;
        font-size: 24px;
    }

    .el-table th > .cell {
        padding-left: 14px;
        padding-right: 14px;
    }

    .el-table th,
    .el-table tr {
        background-color: transparent;
    }

    .el-table--enable-row-transition .el-table__body td,
    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: transparent;
    }

    .el-table,
    .el-table__expanded-cell {
        background-color: transparent;
    }

    .el-table__row {
        &:hover {
            background: rgba(255, 255, 255, 0.1);
        }
    }
}
</style>
