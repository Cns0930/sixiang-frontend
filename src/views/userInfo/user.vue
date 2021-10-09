<template>
    <div id="workWrap">
      <header>用户管理</header>
      <section class="workBox">
        <div class="searchBox">
          <el-input
            placeholder="筛选用户"
            v-model="value"
            clearable
            style="width: 200px;"
            @keyup.native.enter="goSearch">
          </el-input>
          <!-- <el-input
            placeholder="筛选事项"
            v-model="valueT"
            clearable
            style="width: 200px;">
          </el-input> -->
          <!-- <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            @change="getTime"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker> -->
          <el-button @click="goSearch">搜索</el-button>
          <!-- <div class="handle">
            <el-button type="primary">新增</el-button>
            <el-button type="primary">导出</el-button>
            <el-button type="primary">导入</el-button>
          </div> -->
        </div>
        <div class="tableWrap">
          <el-table
            ref="multipleTable"
            class="workTable"
            :data="tableData"
            style="width: 100%;"
            border
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            :default-sort = "{prop: 'date', order: 'descending'}">
            <!-- <el-table-column
              type="selection"
              width="50">
            </el-table-column> -->
            <el-table-column
              label="序号"
              type="index"
              width="45"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              prop="account"
              label="账户"
              width="120">
            </el-table-column>
            <el-table-column
              prop="username"
              label="用户"
              width="120">
            </el-table-column>
            <!-- <el-table-column
              prop="status"
              label="状态"
              width="80">
            </el-table-column> -->
            <el-table-column
              prop="createdTime"
              label="创建时间"
              :formatter="(row,column,flag) => formatterTime(row,column,0)"
              width="140">
            </el-table-column>
            <el-table-column
              prop="firstDepartmentName"
              label="一级部门"
              width="180">
            </el-table-column>
            <el-table-column
              prop="secondDepartmentName"
              label="二级部门"
              width="180">
            </el-table-column>
            <el-table-column
              prop="roles"
              label="角色"
              :formatter="formatterRole"
              width="240">
            </el-table-column>
            <!-- <el-table-column
              prop="updateTime"
              label="最后修改时间"
              width="140"
              :formatter="(row,column,flag) => formatterTime(row,column,1)"
              sortable
              show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column
              label="操作"
              fixed="right"
              >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">修改角色</el-button>
                <el-button
                  size="mini"
                  @click="toLimit(scope.$index, scope.row)">项目限制</el-button>
                <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tablePagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next"
            :total="totalCount">
          </el-pagination>
        </div>
      </section>
      <el-dialog
        title="修改角色"
        :visible.sync="showMask"
        width="30%"
        :before-close="handleClose">
        <div>
           <el-select v-model="roleList" multiple style="width: 300px;" placeholder="请选择角色">
            <el-option
              v-for="item of roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showMask = false">取 消</el-button>
          <el-button type="primary" @click="submitRole">提 交</el-button>
        </span>
      </el-dialog>
    </div>
</template>



<script>
import basicMixin from './basicMixin';
import { getRolelist,editUserrole } from "@/api/item/index";
import Vue from "vue";

export default {
  name: "User",
  mixins: [basicMixin],
  data() {
    return {
      value: '',
      valueT: '',
      timeRange: [],
      tableData: [],
      multipleSelection: [],
      userId: '',
      roleMap: {},//存放角色管理的基本字段--方便映射
      roleOptions: [],
      roleList: [],
      showMask: false,
    };
  },
  computed: {
    
  },
  async created() {
    await this.rolelist();
    await this.search();
  },
  methods: {
    goSearch() {
      this.currentPage = 1;
      this.search(this.value);
    },
    async rolelist() {
      let result = await getRolelist();
      if(!result.success) return;
      result.data.forEach((item) => {
        this.roleMap[item.role] = {
          name: item.name,
          id: item.id
        };
      })
      this.roleOptions = result.data;
    },
    formatterRole(row,column) {
      let val = '';
      if(!row.roles) {
        return val;
      }
      if(row.roles.includes(',')) {
        let arr = row.roles.split(',');
        arr.forEach(item => {
          val += this.roleMap[item].name + ',';
        })
        return val.substring(0,val.length - 1)
      } else {
        return this.roleMap[row.roles].name;
      }
    },
    getTime(val) {
      console.log(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑
    handleEdit(index,row) {
      this.roleList = [];
      this.userId = row.userId;
      this.showMask = true;
      if(!row.roles) {
          this.roleList = []
      } else if(!row.roles.includes(',')) {
          this.roleList[0] = this.roleMap[row.roles].id;
      } else {
          this.roleList = row.roles.split(',').map(v => this.roleMap[v].id);

      }
    },
    handleClose() {
      this.showMask = false;
    },
    //提交
    async submitRole() {
      let result = await editUserrole({
        roles: this.roleList,
        userId: this.userId
      });
      if(result.success) {
        this.$message({ type: "success", message: "修改成功" });
        this.search(this.value);
        this.showMask = false;
      } else {
        this.$message({ type: "fail", message: "修改失败" });
      }
    },
    // 项目限制
    toLimit() {

    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/common.scss";
#workWrap {
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
    &>* {
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
  .el-dialog {
    min-width: 400px;
    .el-dialog__body {
      padding: 20px !important;
    }
    .dialog-footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
}
</style>
