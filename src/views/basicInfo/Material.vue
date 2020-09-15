<template>
    <div class="workWrap">
        <header>材料管理</header>
        <section class="workBox">
            <div class="searchBox">
                <el-input placeholder="筛选委办局" v-model="value" clearable style="width: 200px;"></el-input>
                <el-input placeholder="筛选事项" v-model="valueT" clearable style="width: 200px;"></el-input>
                <el-date-picker
                    v-model="timeRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    @change="getTime"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-button>搜索</el-button>
                <div class="handle">
                    <el-button type="primary" @click="materialCreateVisible = true">新建材料</el-button>
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
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)"
                            >审核</el-button>
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
        <!-- 新建窗口 -->
  <!-- 创建模板弹窗 -->
        <el-dialog title="创建模板" :visible.sync="materialCreateVisible" width="50%" :close-on-click-modal="false">
            <div>
               
                审批事项主键(必填):<el-input v-model="materialT_item_id" @keyup.enter.native="addMaterial"></el-input>
                材料编码(必填):<el-input v-model="materialT_code"></el-input>
                材料名称(必填):<el-input v-model="materialT_name"></el-input>
                材料状态(必填):<el-input v-model="materialT_status"></el-input>
                市证照编码(必填):<el-input v-model="materialT_cat_main_code"></el-input>
                超级帮办word模板名称(必填):<el-input v-model="materialT_docx_template_name"></el-input>
                文档编号(必填):<el-input v-model="materialT_document_seq"></el-input>
                排序(必填):<el-input v-model="materialT_sort"></el-input>
                备注:<el-input v-model="materialT_note"></el-input>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="materialCreateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMaterial">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑窗口 -->
        
    </div>
</template>



<script>
import basicMixin from "./basicMixin";
import Vue from "vue";
import { listMaterial, addMaterial } from "../../api/basicInfo/material";

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
            materialCreateVisible: false,

        
            materialT_item_id: "",
            materialT_code: "",
            materialT_name: "",
            materialT_status: "",
            materialT_cat_main_code: "",
            materialT_docx_template_name: "",
            materialT_sort: "",
            materialT_note: "",
            materialT_document_seq: "",
            value: "",
            valueT: "",
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
        //获取材料列表
        async listMaterial() {
            const res = await listMaterial({
                materialName: this.materialT_name,
            });
            if (!res.success) return;
            this.tableData = res.data;
        },
        //增加材料
        async addMaterial() {
            if (!this.materialT_item_id) return;

            const res = await addMaterial({
                approvalItemId: this.materialT_item_id,
                catMainCode: this.materialT_cat_main_code,
                materialCode: this.materialT_code,
                materialName: this.materialT_name,
                materialStatus: this.materialT_status,
                documentSeq: this.materialT_document_seq,
                docxTemplateName: this.materialT_docx_template_name,
                note: this.materialT_note,
                sort: this.materialT_sort,
            });

            if (!res.success) return;

            this.$message.success('新增材料成功');
            this.materialCreateVisible = false;
            this.materialT_item_id = '';
            
            this.listMaterial();
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
