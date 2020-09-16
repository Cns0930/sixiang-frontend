<template>
    <div class="workWrap">
        <header>材料管理</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选材料名称或者材料编号" v-model="valueM" clearable style="width: 200px;"></el-input>
                <el-button @click="materialSearch()">搜索</el-button>
                <div class="handle">
                    <el-button type="primary" @click="materialVisible({})">新建材料</el-button>
                    <el-button type="primary">导出</el-button>
                    <el-button type="primary">导入</el-button>
                </div>
            </div>
            <div class="tableWrap">
                <el-table
                    ref="multipleTable"
                    class="workTable"
                    :data="tableData"
                    style="width: 100%;"
                    border
                    tooltip-effect="dark"
                    :default-sort="{prop: 'createTime', order: 'descending'}"
                >
                    <!-- <el-table-column
              type="selection"
              width="50">
                    </el-table-column>-->
                    <el-table-column label="序号" type="index" width="45" :index="indexMethod"></el-table-column>
                    <!-- <el-table-column
              label="部门"
              sortable
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="大项"
              sortable
              width="120">
                    </el-table-column>-->
                    <el-table-column
                        prop="approvalItemId"
                        label="审批事项编号"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="materialId" label="事项(小项)办事材料编号" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="materialCode" label="材料编码" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="materialName" label="材料名称" width="160"></el-table-column>
                    <el-table-column prop="materialStatus" label="材料状态" width="80"></el-table-column>
                    <el-table-column prop="documentSeq" label="文档编号" width="80"></el-table-column>
                    <el-table-column
                        prop="catMainCode"
                        label="市证照编码"
                        width="100"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column prop="docxTemplateName" label="超级帮办word模板命名" width="160"></el-table-column>
                    <el-table-column prop="descriptionInfo" label="其他说明信息（调研填写）" sortable width="80"></el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        :formatter="(row,column,flag) => formatterTime(row,column,0)"
                        sortable
                        width="140"
                    ></el-table-column>
                    <el-table-column
                        prop="updateTime"
                        label="最后修改时间"
                        width="140"
                        :formatter="(row,column,flag) => formatterTime(row,column,1)"
                        sortable
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="materialVisible(scope.row)">编辑</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDeleteMaterial(scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
              label="启/停用"
              fixed="right">
              <template slot-scope="scope">
                <el-switch
                  v-model="value"
                >
                <span style="display: none;">{{scope.$index}}</span>
                </el-switch>
              </template>
                    </el-table-column>-->
                </el-table>
            </div>
            <div class="tablePagination">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pagesize"
                    layout="total, prev, pager, next"
                    :total="totalCount"
                ></el-pagination>
            </div>
            <!-- <component :is="model.type" v-model="model.val" v-bind="{
          type: 'textarea',
          placeholder:'输入数字信息',
            }" @input="inputs"></component>-->
        </section>
  <!-- 创建模板弹窗 -->
        <el-dialog title="材料信息填写" :visible.sync="materialWriteVisible" width="50%" :close-on-click-modal="false">
            <div>
               
                审批事项主键(必填):<el-input v-model="materialT.approvalItemId" @keyup.enter.native="addMaterial"></el-input>
                材料编码(必填):<el-input v-model="materialT.materialCode"></el-input>
                材料名称(必填):<el-input v-model="materialT.materialName"></el-input>
                材料状态(必填):<el-input v-model="materialT.materialStatus"></el-input>
                市证照编码(必填):<el-input v-model="materialT.catMainCode"></el-input>
                产生来源(必填):
            <div>
                <el-select v-model="materialT.produceSource" placeholder="材料的产生来源">
                    <el-option label="用户自带" value="用户自带"></el-option>
                    <el-option label="当场制作" value="当场制作"></el-option>
                </el-select>
            </div>

                超级帮办word模板名称(必填):<el-input v-model="materialT.docxTemplateName"></el-input>
                文档编号(必填):<el-input v-model="materialT.documentSeq"></el-input>
                排序(必填):<el-input v-model="materialT.sort"></el-input>
                备注:<el-input v-model="materialT.note"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="materialWriteVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMaterial();materialWriteVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑窗口 -->
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import { listMaterial, addMaterial,delMaterial,updateMaterial,getByMaterialId } from "../../api/basicInfo/material";

export default {
    name: "Material",
    mixins: [basicMixin],
    data() {
        return {
            // model: {
            //   type: 'NumberInput',
            //   val: '12',
            //   options: {
            //     type: 'textarea',
            //     placeholder:'输入数字信息',
            //   }
            // },
            type: "material",
            materialT: {},
            materialWriteVisible: false,
            valueM: "",
            timeRange: [],
            tableData: [],
            multipleSelection: [],
        };
    },
    computed: {},
    async created() {
        await this.search();
    },
    methods: {
        // inputs(val) {
        //   console.log(this.model);
        // },
        getTime(val) {
            console.log(val);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: val
            });
            this.tableData = result.data.records;
        },
        async handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: val,
                pageSize: this.pagesize
            });
            this.tableData = result.data.records;
        },
        async materialSearch(){
            this.currentPage = 1;
            let result = await listMaterial({
                keyword: this.valueM,
                pageNum: this.currentPage,
                pageSize: this.pagesize
            });

            if(!result.success) return;
            this.totalCount = result.data.total;
            this.tableData = result.data.records;
            
            this.$message({ type: "success", message: "查询成功" });
            
        },
        async materialVisible(item) {
            let id = item.materialId;
            if(!id){
                item = item;
            }else{
                item = await getByMaterialId({materialId: id});
                item = item.data;
            }
            
            this.materialT = item;
            this.materialWriteVisible = true;
        },
        //获取材料列表
        async listMaterial() {
            const res = await listMaterial({
                approvalItemId: this.materialT.approvalItemId,
                materialStatus: this.materialT.materialStatus,
                // keyword: this.materialM,
                pageNum: this.currentPage,
                pageSize: this.pagesize
            });
            if (!res.success) return;
            this.totalCount = result.data.total;
            console.log("dadathis.current:",this.current," dathis.pagesize",this.pagesize," dathis.totalCount",this.totalCount)
            this.tableData = res.data.records;
            await this.search();
        },
        //增加材料
        async addMaterial() {
            let res;
            if(!this.materialT.materialId){
                res = await addMaterial(this.materialT);
            }else{
                res = await updateMaterial(this.materialT);
            }
            
            if (!res.success) return;

            this.$message.success('保存成功');
            this.materialWriteVisible = false;
            // this.materialT_item_id = '';
            if(!this.materialT.materialId){
                await this.search();
            }else{
                await this.materialSearch();
            }
            
        },
        // 删除
        async handleDeleteMaterial(v) {
            let param = {
                materialId: v.materialId
            };
            let id = v.materialId;
   await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    
            let result = await delMaterial(param);
            if (!result.success) return;
            
            if(!id){
                await this.search();
            }else{
                await this.materialSearch();
            }
        },
    },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/global.scss";
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
        background: #fff;
        & > * {
            margin-left: 10px;
        }
        .handle {
            margin-left: auto;
            margin-top: -55px;
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
}
</style>
