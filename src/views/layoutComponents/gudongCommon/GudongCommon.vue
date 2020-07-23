<template>
    <div>
        <div class=" tab-type">
            <!-- 股东 名称 tab -->
            <div class="tab-block">

                <!-- tab 标题 -->
                <div class="tab-list-title">
                    股东列表
                </div>
                <!-- tab -->
                <div class="tab-list">
                    <!-- tab item -->
                    <div class="tab-list-item " v-for="(gudong ,gudongIndex) in children" :key="gudongIndex"
                        :class="{active:gudong.isActive,unactive:!gudong.isActive,'warning-border':!gudong.validated}"
                        @click="eventFnProxy(gudong.clickHandler,gudongBase.group,gudong)">

                        <img src="./p.png"></img>
                        <div class="tab-list-info">
                            <div class="tab-list-name">{{gudong.label}}</div>
                            <!-- <div class="tab-list-type">{{gudong.type}}</div> -->

                        </div>

                        <el-tooltip v-if="gudong.removeable" class="remove-btn remove-on-tab" effect="dark" content="删除"
                            placement="right-start">
                            <!-- <div  v-if="gudong.removeable"
                                @click.stop="eventFnProxy(gudong.onremoveclick,gudong,gudongIndex,gudongBase)"
                                style="z-index:30">
                                <span class="minus"></span>
                            </div> -->
                            <!-- <el-button class="delete-btn" size="mini" icon="el-icon-delete"
                                @click.stop="eventFnProxy(gudong.onremoveclick,gudong,gudongIndex,gudongBase)" >

                            </el-button> -->
                            <i class="delete-btn el-icon-close" @click.stop="eventFnProxy(gudong.onremoveclick,gudong,gudongIndex,gudongBase)"></i>
                        </el-tooltip>
                       
                    </div>
                  
                    <!-- tab 添加按钮 -->
                    <el-button v-if="gudongBase.addMore" type="primary" size="small" icon="el-icon-plus"
                        style="width:100px" @click="addGudongDialog">添加
                    </el-button>
                </div>

            </div>
            <!--  股东基本信息 -->
            <div v-if="gudongActive">
                <div class="sub-title" v-if="gudongBase.subTitle">
                    <span>{{gudongBase.subTitle}}</span>

                </div>
                <!-- form 渲染 -->
                <div style="position:relative">
                    <!-- 移除按钮 -->

                    <CommonFormRenderer :list="gudongActive.list" @showLawNotice="$emit('showLawNotice',$event)"
                        key="active" @itemValidated="handleItemValidated($event,gudongActive)">
                    </CommonFormRenderer>
                    <template v-for="(gudongPassive,gudongPassiveIndex) in gudongPassiveList">
                            <CommonFormRenderer v-show="false" :list="gudongPassive.list"
                            @showLawNotice="$emit('showLawNotice',$event)" :key="gudongPassiveIndex" @itemValidated="handleItemValidated($event,gudongPassive)">
                        </CommonFormRenderer>
                    </template>
                

                </div>

            </div>

            
        </div>

        <el-dialog title="系统提示" :visible.sync="dialogVisible" width="45%" append-to-body :close-on-click-modal="false"
            class="message-dialog">
            <el-form ref="form" :model="form" label-width="250px" @submit.native.prevent>
                <el-form-item label="股东名称 ">
                    <el-autocomplete  :debounce='0' :fetch-suggestions="querySearchAsync" v-model="item._temp._tempGudongName"  @select="handleSelect"></el-autocomplete>
                </el-form-item>
            </el-form>
            <div class="dialog-footer">
                <el-button class="dialog-warn-btn" @click="dialogVisible = false">取消</el-button>
                <el-button class="dialog-warn-btn" type="primary" @click="onSubmit(item)">确定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>


// import {getEnterpriseInfo,getEnterpriseInfoLike} from "@/api/common/index"

export default {
    name: "GudongCommon",
    props: ['value', 'children','meta',],
    components: {},
    data() {
        return {
            active:0,
            dialogVisible: false,
            form: {},
        };
    },
    computed: {
     
        gudongBase() {
            return this.item;
        },
        gudongActive() {
            return this.gudongBase.group.find(v => v.isActive === true)
        },
        gudongPassiveList() {
            let gudongPassiveList = this.gudongBase.group.filter(v => v.isActive === false)
            return gudongPassiveList 
        },
        
        isBaseInfo(){
            return !!this.item.isBaseInfo
        },
    },
    methods: {
        addGudongDialog() {
            this.$set(this.item._temp, '_tempGudongName', '');
            this.$set(this.item._temp, '_tmpGudongContribution', '');
            this.$set(this.item._temp, '_tmpGudongContributionTime', '');
            this.$set(this.item._temp, '_tmpGudongIdCardNum', '');
            this.$set(this.item._temp, '_tmpGudongStockType', '自然人股东');
            this.$set(this.item._temp, '_tmpGudongIsNew', '否');
            this.dialogVisible = true;
        },
        async onSubmit(item) {
            let res = await getEnterpriseInfo({value:item._temp._tempGudongName});
            if(res.message==="SUCCESS" && res.data){
                this.$set(this.item._temp, '_tmpGudongIdCardNum', res.data.unifiedSocialCreditCode);
            }
            
            let result = item._temp.pushGroup(item);

            if (result) {
                this.dialogVisible = false;
            }
        },
        handleItemValidated({success=true,context={}},gudong,){
           
           let fieldNo = context.fieldNo;
           gudong.validateStatus =gudong.validateStatus ||{};
           gudong.validateStatus[fieldNo] = success;
         
            gudong.validated =Object.values( gudong.validateStatus).every(Boolean)? true:false;
           
        },
        async querySearchAsync(queryString, cb){
             let res = await getEnterpriseInfoLike({value:queryString});
             if(res.message==="SUCCESS" && res.data.length>0){
                
                cb(res.data.map(v=>({value:v.corporateName})))
            }else{
                cb([])
            }
        },
        handleSelect(){
            
        }
    }

}
</script>

<style lang="scss" scoped>
.tab-block {
    // background: rgba(255, 255, 255, 0.2);

    // background: linear-gradient(
    //     180deg,
    //     rgba(52, 52, 52, 0.1) -0.31%,
    //     rgba(255, 255, 255, 0.1) 100.31%
    // );

    // border-radius: 4px;
    // border: 1px solid rgba(255, 255, 255, 1);
    margin: 10px;
    display: flex;
    .tab-list-title {
        width: 174px;
        color: rgba(255, 255, 255, 1);
        font-size: 18px;
        padding: 30px 10px 0px 0px;
        text-align: right;
    }
}
.tab-list {
    display: flex;
    align-items: center;
    min-height: 70px;

    flex-wrap: wrap;

    .tab-list-item {
        position: relative;
        display: flex;
        align-items: center;

        border-radius: 4px;
        cursor: pointer;
        &.active {
            background: linear-gradient(
                to bottom,
                rgba(126, 152, 255, 1) 0%,
                rgba(0, 146, 253, 1) 100%
            );
        }
        &.unactive {
            background: rgba(8, 59, 145, 1);
        }
        &.warning-border{
            border: 1px solid #FF4949;
        }
        border: 1px solid rgba(212, 215, 224, 1);
        min-width: 150px;
        height: 50px;
        margin: 4px 15px;
        // box-sizing: border-box;
        img {
            padding: 0 10px;
        }
        .tab-list-info {
            padding: 4px;
        }
        .tab-list-name {
            font-size: 16px;
            min-height: 20px;
            // max-width:120px;
            margin-right:28px;
            // overflow:hidden;
            // text-overflow: ellipsis;
            // white-space: nowrap;
        }
        .tab-list-type {
            font-size: 12px;
            height: 16px;
        }
        .remove-on-tab {
            position: absolute;
            right: 0px;
            top: 0px;
        }
        
    }
}
.tab-type .form {
    .remove-btn {
        position: absolute;
        left: 10px;
        top: 46px;
        z-index: 10;
        margin-left: 5px;
        width: 25px;
        height: 25px;
        background-color: #fe7215;
        display: inline-flex;
        vertical-align: middle;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        cursor: pointer;

        .minus {
            width: 18px;
            height: 2px;
            background: white;
        }
    }
}
.delete-btn {
     display:none;
    
}
.tab-list-item:hover .delete-btn{
    z-index: 30;
    color: #fff;
    margin: 0;
    width: 24px;
    height: 24px;
    font-size: 12px;
    background: #881D39;
    border: 1px solid #fff;
    display:flex;
    align-items: center;
    justify-content: center;
}
</style>
<style lang="scss">

</style>