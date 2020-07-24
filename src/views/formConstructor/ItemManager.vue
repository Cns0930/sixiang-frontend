<template>
    <div class="item-manager">
        <div class="op-bar">
            <el-button @click="handleEditItem({});">创建新事项</el-button>
        </div>
        <div class="main">
            <!-- 事项表格 -->
            <div class="item-table" style="width: 100%;padding:10px 60px">
                <el-table :data="itemlist" border style="width: 100%">
                    <el-table-column fixed prop="sid" label="sid" width="150"></el-table-column>
                    <el-table-column label="事项名称(点击进入)">
                        <template slot-scope="scope">
                            <el-button
                                @click="handleClickItem(scope.row)"
                                type="text"
                                style="color: orange;"
                            >{{scope.row.name}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="department" label="委办局" width="120"></el-table-column>
                    <el-table-column prop="createTime" :formatter="dateFormat" label="创建时间" width="120"></el-table-column>
                    <el-table-column label="操作" width="120">
                        <template slot-scope="scope">
                            <el-button
                                @click="handleEditItem(scope.row);"
                                type="text"
                                size="small"
                            >编辑</el-button>
                            <el-button
                                @click="handleDeleteItem(scope.row)"
                                type="text"
                                size="small"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <el-dialog
            title="事项属性填写"
            :visible.sync="dialogVisible"
            width="80%"
            :close-on-click-modal="false"
        >
            <div class="attribute-content">
                sid
                <el-input v-model="tempItem.sid"></el-input>
                审批事项名称
                <el-input v-model="tempItem.name"></el-input>
                审批事项英文代号(拼音)
                <el-input v-model="tempItem.itemCode"></el-input>
                审批事项大类
                <el-input v-model="tempItem.category"></el-input>
                属性
                <el-input v-model="tempItem.type"></el-input>
                所属委办局
                <div>
                <el-select v-model="tempItem.department">
                    <el-option
                        v-for="(v,i) in departmentOptions"
                        :key="i"
                        :label="v.department"
                        :value="v.department"
                    ></el-option>
                </el-select>
                </div>
                事权性质
                <el-input v-model="tempItem.authority"></el-input>
                序号
                <el-input v-model="tempItem.seq"></el-input>
                备注
                <el-input v-model="tempItem.note"></el-input>
                激活状态
                <el-input v-model="tempItem.status"></el-input>
                所在区域
                <el-input v-model="tempItem.area"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveItem();dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    listAll,
    saveItem,
    listDepartment,
    deleteItem
} from "@/api/item/index";
import axios from "../../api/config";
import dayjs from "dayjs";
export default {
    name: "ItemManeger",
    data() {
        return {
            itemlist: [],
            tempItem: {},
            dialogVisible: false,
            departmentOptions: [],
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        async load() {
            let result = await listAll();
            if (!result.success) {
                this.$message({ type: "warning", message: "获取初始数据失败" });
            }
            this.itemlist = result.data;
            let departments = await listDepartment();
            this.departmentOptions = departments.data;
        },
        async saveItem() {
            let result = await saveItem(this.tempItem);
            if (!result.success) return;
            this.$message({ type: "success", message: "保存成功" });
            this.load();
        },
        async handleDeleteItem(v) {
            let message = '确定要删除'+v.name+'吗';
            if (confirm(message) == true) {
                let result = await deleteItem({ itemId: v.id });
                if (!result.success) return;
                this.$message({ type: "success", message    : "删除成功" });
                this.load();
            }
        },
        handleClickItem(item) {
            this.$store.commit("changeItem", item);
            this.$router.push({path:'/formconstructor', query:{'itemId':item.id}});
        },
        handleEditItem(item) {
            this.tempItem = item;
            this.dialogVisible = true;
        },
        dateFormat(row, column, cellValue, index){
          const daterc = row[column.property]
          return dayjs(daterc).format("YYYY-MM-DD");
        }
    }
};
</script>

<style lang="scss" scoped>
</style>