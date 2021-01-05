<template>
    <div class="workWrap">
        <header>已选事项
        </header>
        <section class="workBox">
            <div class="searchBox">
                <el-tag size="medium" style="margin-top:10px" effect="plain" v-for="item in tagList" :key="item.itemNo">{{item.itemName}}</el-tag>
                <div class="handle">
                    <el-button @click="transferOutput" :disabled="backend.includes('4141')">保存输出到超级帮办</el-button>
                </div>
            </div>
            <div class="tableWrap">
                <el-table v-loading="loading" ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                    tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}" 
                    row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" default-expand-all>
                   
                    <!-- <el-table-column label="序号" type="index" width="70"></el-table-column> -->
                    <el-table-column prop="fieldNo" label="fieldNo"></el-table-column>
                    <el-table-column prop="label" label="label" width="180"></el-table-column>
                    <el-table-column prop="fieldComponentNames" label="组件名" show-overflow-tooltip sortable>
                        <template slot-scope="scope">
                            {{scope.row.fieldComponentNames.toString()}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="fieldType" label="类型" :formatter="formatFieldType" width="160"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" :formatter="timeFormatter" sortable >
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后修改时间" :formatter="timeFormatter" sortable
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="240">
                        <template slot-scope="scope">
                            <el-button size="small" @click="lookFor(scope.row)" icon="el-icon-view">
                            </el-button>
                            <el-button size="small" type="primary" :disabled="scope.row.fieldComponentNames.length>1" @click="handleEdit(scope.row)" icon="el-icon-edit">
                            </el-button>
                            <!-- <el-button @click="transferOutput(scope.row)">保存输出到超级帮办</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="tablePagination">
                <el-pagination @current-change="handleCurrentChange"
                    :current-page.sync="currentPage" :page-size="pagesize" layout="total, prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div> -->
        </section>
        <!-- 查看 -->
        <el-dialog title="字段组件属性查看" :visible.sync="lookVisible" width="80%" :close-on-click-modal="false">
            <div class="look-fiels">               
                    <div class="fields-items" v-for="item in fieldNoList" :key="item.id" v-if="item && lookVisible ">
                        <div class="attribute">
                            <span class="attribute-key" style="font-weight:bold;font-size:18px">事项名称</span>
                            <span class="attribute-value" style="font-weight:bold;font-size:18px">{{item.itemName}}</span>
                        </div>
                        <el-divider></el-divider> 
                        <div class="attribute">
                            <span class="attribute-key">fieldNo</span>
                            <el-input class="attribute-value" v-model="item.fieldNo" disabled></el-input>
                        </div>
                        <div class="attribute">
                            <span class="attribute-key">label</span>
                            <el-input class="attribute-value" v-model="item.label"></el-input>
                        </div>
                        <div class="attribute">
                            <span class="attribute-key">备注(以此为准)</span>
                            <el-input class="attribute-value" v-model="item.remark"></el-input>
                        </div>
                        <div class="attribute" v-for="(v,i) in item.componentDefs" :key="i">
                            <span class="attribute-key">{{v.label || i}} </span>
                            <component class="attribute-value" :is="v.renderTemplateName" v-model="v.value"
                                v-bind="v.attributes" :key="item.fieldNo+v.renderTemplateName"></component>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="lookVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="字段组件属性填写" :visible.sync="editDialogVisible" width="80%" :close-on-click-modal="false" >
                <div class="attribute-content">
                <!-- <div v-if="temp_field_info">
                    <div class="attribute">字段说明信息: {{temp_field_info.descriptionInfo}}</div>
                    <div class="attribute">前端验证信息: {{temp_field_info.validationInfo}}</div>
                </div> -->
                
                <div v-if="temp_fieldObj && editDialogVisible">
                    <el-divider></el-divider>
                    <div class="attribute">
                        <span class="attribute-key">fieldNo</span>
                        <el-input class="attribute-value" v-model="temp_fieldObj.fieldNo" disabled></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">label</span>
                        <el-input class="attribute-value" v-model="temp_fieldObj.label"></el-input>
                    </div>
                    <div class="attribute">
                        <span class="attribute-key">备注(以此为准)</span>
                        <el-input class="attribute-value" v-model="temp_fieldObj.remark"></el-input>
                    </div>
                    <div class="attribute" v-for="(v,i) in temp_fieldObj.componentDefs" :key="i">
                        <span class="attribute-key">{{v.label || i}} </span>
                        <component class="attribute-value" :is="v.renderTemplateName" v-model="v.value"
                            v-bind="v.attributes" :key="temp_fieldObj.fieldNo+v.renderTemplateName"></component>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSaveField(temp_fieldObj);editDialogVisible = false">确 定
                </el-button>
                
            </span>
        </el-dialog>
    </div>
</template>



<script>

import {mixin} from "@/mixin/mixin"
import Vue from "vue";
import defs, {
    deserializeComputedField,
    deserializeBaseField,
    deserializeTableData
} from "../attributeComponents/index";
// import {mapGetters} from "vuex"
import { mapState } from "vuex";
import defRenderers from "@/views/attributeComponents/defRendererComponents/index";
import { addSysTransferLog} from "@/api/item/index";
import { getFieldById,getByIds,batchEdit,getFieldAll} from "@/api/superForm/index";
import {listEqualFields} from "../../api/basicInfo/allEdit";
import { getStep} from "@/api/step/index";
import axios from 'axios';
export default {
    name: "ChangeEdit",
    mixins: [mixin],
    components: {
        ...defRenderers
    },
    data() {
        return {
            backend: process.env.VUE_APP_BASE_IP,
            defRenderers,
            loading:false,
            // 页面信息
            type: "work",
            // 编辑弹框
            editDialogVisible: false,
            // 查看弹窗
            lookVisible:false,
            fieldNoList:[],
            // 筛选
            // filterProjectId: null,
            // filterApprovalId: null,
            filterKeyword: "",
            timeRange: [],
            // 表格
            tableData: [],
            // 弹窗
            // dialogAddVisible: false,
            // dialogUpdateVisible: false,
            // tempItem: {},
            // projectOptions: [],
            // approvalOptions: [],
            // currentPage: 1,
            // pagesize: 15,
            // totalCount: 0,
            // multipleSelection: [],
            // 展示用
            temp_field_info: null,
            // 属性填写用
            temp_fieldObj: null,
            childrenList:[]
        };
    },
    computed: {
         ...mapState({
            // itemId: state => state.home.item.approvalItemId,
        }),
        tagList() {
            return this.$store.state.home.editList || JSON.parse(sessionStorage.getItem('editAll'))
        }
    },
    async created() {

        
    },
    async mounted(){
       await this.getTable()
    },
    methods: {
        async getTable() {
            this.loading = true
            let params = this.tagList.map(ele=>ele.approvalItemId)
            const res = await listEqualFields(params)
            if(!res.success) return;
            let fieldSameList = []
            let resultList = res.data.reduce((acc,cur) => {
                // console.log(cur)
                if(!fieldSameList.includes(cur.fieldNo)) {
                    fieldSameList.push(cur.fieldNo);
                    cur.ids = [];
                    cur.fieldComponentNames = []
                    cur.fieldComponentNames.push(cur.fieldComponentName)
                    cur.ids.push(cur.id)
                    acc.push(cur);
                    if(cur.children) {
                        cur.children.forEach((ele,i)=>{
                            ele.ids = [];
                            ele.ids.push(ele.id)
                        }
                        
                    )}            
                } else {
                    let fieldIndex = fieldSameList.findIndex(v => v == cur.fieldNo);
                    acc[fieldIndex].ids.push(cur.id)
                    // if(!acc[fieldIndex].fieldComponentNames.includes(cur.fieldComponentName)) {
                       acc[fieldIndex].fieldComponentNames.push(cur.fieldComponentName)
                    // }

                    if(cur.children) {
                        cur.children.forEach((ele,i)=>{
                            let indexs = acc[fieldIndex].children.findIndex(v=> v.fieldNo == ele.fieldNo)
                            if(indexs!= -1) {
                              acc[fieldIndex].children[indexs].ids.push(ele.id)
                            }
                            
                        })
                    }
                         
                }
                acc.forEach(ele=>{
                    ele.fieldComponentNames = _.uniq(ele.fieldComponentNames)
                })
                return acc
            },[])
            console.log(resultList,'000')
            this.tableData = resultList
            this.loading = false
        },
        getTime(val) {
            console.log(val);
        },
        // 编辑
        async handleEdit(fieldObj) {
            console.log(fieldObj)
            let result = await getFieldById({id:fieldObj.id});
           
            if(!result.success) return;

            // 处理调研备注信息的展示
            this.temp_field_info = {descriptionInfo: result.data.descriptionInfo, validationInfo: result.data.validationInfo};

            let newFieldObj = deserializeTableData({id:result.data.id,fieldName:fieldObj.fieldName,fieldType: result.data.fieldType, remark: result.data.remark,
            children: result.data.children, ... result.data.object, });
            console.log(newFieldObj,'222')
            newFieldObj.ids = fieldObj.ids,
            this.temp_fieldObj = newFieldObj;
            delete this.temp_fieldObj.list;
            this.editDialogVisible = true;
        },
        // 查看
        async lookFor(fieldObj) {
            console.log(fieldObj,'1111')
            this.fieldNoList = []
            let res = await getByIds(fieldObj.ids);
            // console.log(res)
            if(!res.success) return;
            res.data.forEach(ele=>{
                let newsFieldObj = deserializeTableData({  fieldType: ele.fieldType, remark: ele.remark,
                children:  ele.children, ... ele.object,id: ele.id });
                newsFieldObj.itemName = ele.itemName
                delete newsFieldObj.list;
                this.fieldNoList.push(newsFieldObj) ;
            })
            console.log(this.fieldNoList)
            this.lookVisible = true
        },
        // 单个保存 属于调研的不用传
        async handleSaveField(v) {
            console.log(v)
            //情形默认选中则添加value
            if(v.type && v.type === "qingxingCheckbox") {
                v.componentDefs.options.value.forEach(m => {
                    if(m.chosen) {
                        if(!v.componentDefs.value.value.includes(m.value)) {
                            v.componentDefs.value.value.push(m.value)
                        }
                    } else {
                        v.componentDefs.value.value = v.componentDefs.value.value.filter(v => v != m.value)
                    }
                })
            }
            let vsimple = _.pick(v,['type', 'label','fieldNo', 'fieldName', 'fieldType', 'componentDefs','isList'])
            let param = {
                fieldName: v.fieldName,
                fieldType: v.fieldType,
                ids: v.ids,
                label: v.label,                
                object: vsimple,
                remark: v.remark
            };
            console.log(param)
            let result = await batchEdit(param);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功" });
            await this.getTable()
        },
        // 保存输出到超级帮办
        async transferOutput(){
            let serviceBaseUrl = this.$store.state.setting.bangbanUrl;
            // 去尾处理
            if(serviceBaseUrl.endsWith('/')){
                serviceBaseUrl = serviceBaseUrl.substring(0, serviceBaseUrl.length-1)
            }
            if(serviceBaseUrl == null || serviceBaseUrl == ''){
                this.$message({ type: "error", message: "请先设置超级帮办地址!" });
                return;
            }
            // 获取事项下的步骤
            let stepRes = await Promise.all(             
                this.tagList.map((ele) =>
                   getStep({approvalItemId: ele.approvalItemId})
                ) 
            )
             // 获取事项下的字段
            let fieldRes = await Promise.all(             
                this.tagList.map((ele) =>
                   getFieldAll({ approvalItemId: ele.approvalItemId })
                ) 
            )
            
            if (stepRes.some(v => !v.success)&&fieldRes.some(v => !v.success)) return;
            let lists = []
            this.tagList.forEach((ele,i)=>{
                let params = {
                    stepJson: stepRes[i].data,
                    fieldsJson: fieldRes[i].data,
                    sid: ele.itemNo,
                    sixiangUserName: localStorage.getItem('username'),
                };
                lists.push(params)
            })

            // 步骤保存到超级帮办
            let result = await Promise.all( 
                lists.map(v=>axios.post(serviceBaseUrl+"/api/sixiang/saveJavaScript", v).then(res => res.data))
            );
            console.log(result)
            if(result.every(v=>v.code == 200)){
                this.$message({ type: "success", message: "导入成功 请查看数据库" });
            }else{
                this.$message({ type: "error", message: result.message + " "+ result.data });
                return;
            }

            // 保存传输日志
            let logs = lists.map(item=>({params:item}))
            this.tagList.forEach((ele,i)=>{
                logs[i].approvalItemId = ele.approvalItemId
            })
            let result3 = await Promise.all(
                logs.map(v=>addSysTransferLog(
                    {
                        approvalItemId: v.approvalItemId,
                        description: "step",
                        transferData: JSON.stringify(v.params)
                    }
                )))
        },
        // 组件类型
        formatFieldType(row, column, cellValue, index) {
            if (cellValue == 1) {
                return "基本字段"
            }
            if (cellValue == 2) {
                return "合成字段"
            }
            return "其他"
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
/deep/ .el-dialog__body{
    max-height: 650px;
    // min-height: 560px;
}
.workWrap {
    width: 99.9%;
    height: calc(100% - 22px);
    header {
        font-size: 20px;
        font-weight: 700;
        height: 50px;
        line-height: 50px;
        letter-spacing: 1px;
    }
    .workBox {
        height: calc(100% - 50px);
        padding: 6px 12px 12px 12px;
        box-sizing: border-box;
        background: #fff;
    }
    .searchBox {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        background: #fff;
        & > * {
            margin-left: 10px;
        }
        .handle {
            margin-left: auto;
            // margin-top: -55px;
        }
    }
    .tableWrap {
        margin-top: 16px;
        margin-left: 10px;
        width: calc(100% - 10px);
        overflow: hidden;
        .workTable {
            width: 100%;
        }
    }
    .el-button+.el-button {
    margin-left: 10px;
}
}
.base-field-list {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: red 1px solid;
    height: 100%;
}
.computed-field {
    width: 200px;
    border: green 1px solid;
    height: 100%;
}
.look-fiels{
   display: flex;
   flex-wrap: wrap;
    .fields-items{
        width: 45%;
        margin-bottom: 30px;
    }
    .fields-items:last-child{
        margin-bottom: 0;
    }
}
.el-divider--horizontal {
    margin: 10px 0;
}
.attribute {
        margin: 4px 0;
        display: flex;
        align-items: center;
        .attribute-key {
            width: 200px;
            text-align: right;
            padding-right: 30px;
        }
        .attribute-value {
            flex: 1;
        }
    }
</style>
