<template>
    <div class="public-document">
        <header>
            <h3>材料</h3>
        </header>
        <div>
            <el-input placeholder="按名称查询" v-model="filterKeyword" clearable style="width: 200px;"></el-input>
            <el-select placeholder="类型" v-model="typeFilter" filterable clearable style="width: 200px;">
                <el-option label="标准文档" value="标准文档"></el-option>
                <el-option label="非标文档" value="非标文档"></el-option>
            </el-select>
            <el-select placeholder="来源" v-model="sourceFilter" filterable clearable style="width: 200px;">
                <el-option label="现场制作" value="现场制作"></el-option>
                <el-option label="用户自带" value="用户自带"></el-option>
            </el-select>
            <el-button @click="search">搜索</el-button>
        </div>
        <div>
            <el-table ref="multipleTable" class="workTable" :data="tableData" style="width: 100%;" border
                tooltip-effect="dark" :default-sort="{prop: 'createTime', order: 'descending'}">

                <el-table-column prop="globalDocumentCode" label="文档编号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentName" label="文档名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="globalDocumentType" label="类型" show-overflow-tooltip></el-table-column>
                <el-table-column prop="produceSource" label="来源" show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" show-overflow-tooltip></el-table-column>

                <el-table-column label="操作" fixed="right" width="300">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button size="mini" @click="handleClickItem(scope.row)">
                                编辑
                            </el-button>
                            <el-button size="mini" @click="handleClickItemBangBan(scope.row)">
                                删除
                            </el-button>
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
                                :disabled="!hasManagePermission">
                                编辑
                            </el-button>
                            <el-button size="mini" type="danger" @click="handleClose(scope.row)"
                                :disabled="!hasManagePermission">
                                关闭
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { mixin } from "@/mixin/mixin"
import { addGlobalDcument, deleteDcument, getByGlobalDcumentId, updateGlobalDcument, listGlobalDcument } from '@/api/basicInfo/publicDocument'
import { mapGetters } from "vuex"
export default {
    name: "PublicDocument",
    mixins: [mixin],
    data() {
        return {
            tableData: [],
            /* 筛选条件 */
            // 名称模糊查询
            filterKeyword: "",
            // 类型查询
            typeFilter: "",
            // 来源查询
            sourceFilter: "",



        }
    },
    computed: {
        ...mapGetters({ hasManagePermission: 'config/hasManagePermission' })
    },
    async created() {
        this.search();
    },
    methods: {
        async search() {
            let params = {

            }
            let result = await listGlobalDcument(params);

            this.tableData = result.data.records;
        },
    },

}
</script>

<style scoped lang="scss">
.public-document {
    display: flex;
    flex-direction: column;
}
</style>