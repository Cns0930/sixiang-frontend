<template>
    <div class="run">
        <div class="left">
            <h2 style="text-align:center;margin-bottom:30px">{{stepsData[active]?stepsData[active].title :""}}</h2>
            <template v-for="(step,index) in stepsData">
                <component v-if="index == active" :is="step.component"
                    :config="step.configType ==2? step.configFn(itemState,itemGetters):step.config" @goNext="goNext"
                    @goPrev="goPrev" :stepData="step" ref="components">
                </component>
            </template>
        </div>
        <div class="right">
            <h3>基本字段</h3>
            <div v-for="(v,i) in itemState" style="border-bottom:1px solid #b3a4a4;padding:2px 0">
                <p style="display:inline-block;width:100px;word-break:break-all">{{i}}</p>
                <span style="display:inline-block;width:200px;word-break:break-all">{{v.label}}</span>
                <span style="display:inline-block;width:100px;">{{v.value}}</span>

            </div>

            <h3>合成字段</h3>
            <div v-for="(v,i) in $store.getters" style="border-bottom:1px solid #b3a4a4;padding:2px 0">
                <span style="display:inline-block;width:100px;">{{i}}</span>

                <span v-if="allFields.find(v=>'run/'+v.fieldNo == i)"
                    style="display:inline-block;width:200px;word-break:break-all">{{allFields.find(v=>'run/'+v.fieldNo == i).label}}</span>
                <span style="display:inline-block;width:100px;">{{v}}</span>

            </div>
        </div>
    </div>
</template>

<script>
import { getStep, } from "@/api/step/index";
import { getField } from "@/api/superForm/index";
import { getTemplate } from '@/api/template/index'
import { getById } from '@/api/item/index'
import { components } from "@/views/pageComponents/index"

import { deserializeTableData } from "../attributeComponents/index";
import _ from "lodash"
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { functionReviverRuntime, functionReviverEventRuntime, convertDefToConfigEventRuntime } from "./util"
import { mapState, createNamespacedHelpers } from 'vuex'
import CommonMixin from "@/views/pageComponents/CommonMixin"
const { mapGetters } = createNamespacedHelpers('run')
dayjs.extend(customParseFormat)
export default {
    name: "Run",
    components: { ...components },
    mixins: [CommonMixin],
    provide() {
        return {
            $itemState: () => this.itemState,
            $itemGetters: () => this.itemGetters,
        }
    },
    data() {
        return {
            active: 0,
            // itemName: this.$route.query.itemName,
            stepsData: [],
            // itemState: {},
            // itemGetters: {}
            allFields: [],
            // itemGetters:{},
        }
    },
    computed: {
        itemState() {
            return this.$store.state["run"]
        },
        // getters() {
        //     console.log(this.$store.getters)
        //     return this.$store.getters
        // },
        ...mapState({
            gettersList: state => state.fieldModel.gettersList
        }),
        itemName() {
            return this.$store.state.home.item.name
        }
    },

    async created() {



        await this.init();

        let result = await this.loadAll();
        this.stepsData = result[0].data.map(v => {

            if (typeof v.stepObject.configFn == "string" && v.stepObject.configFn.indexOf('function') > -1) {
                v.stepObject.configFn =functionReviverRuntime(v.stepObject.configFn,v.component); 
            }
             if(v.stepObject.useBeforeEnter){
                    v.stepObject.beforeEnterFn = functionReviverRuntime(`(${v.stepObject.beforeEnterFn})`)
                }
            if(v.stepObject.useAfterEnter){
                v.stepObject.afterEnterFn = functionReviverRuntime(`(${v.stepObject.afterEnterFn})`)
            }
               
            return { ...v.stepObject, stepPagenum: v.stepPagenum }
        }).sort((a, b) => a.stepPagenum - b.stepPagenum)

        this.allFields = result[1].data.map(v => ({ id: v.id, fieldType: v.fieldType, children: v.children, ...v.object })).map(deserializeTableData);
        let baseFields = this.allFields.filter(v => v.fieldType == 1)

        let itemState = convertDefToConfigEventRuntime(baseFields);


        let itemGetters = this.allFields.filter(v => v.fieldType == 2).reduce((result, item) => {
            // let attrObj = _.mapValues(item.componentDefs, (o) => this.parseFunction(o.value));
            if(!item.componentDefs.getter){
                console.log(item.componentDefs)
            }
            result[item.fieldNo] = functionReviverRuntime(item.componentDefs.getter.value, item.fieldNo);

            return result;
        }, {});
        let gettersList = Object.keys(itemGetters)
        this.$store.commit("putGettersList", gettersList)
        console.log(itemGetters,itemState)
        // 注册模块
        let module = {
            namespaced: true,
            state: itemState,
            getters: itemGetters
        };

        if (this.$store.hasModule("run")) {
            this.$store.unregisterModule("run");
        }
        // console.log(JSON.stringify(module.state, null, 4));
        this.$store.registerModule("run", module);


        this.$store.commit("putTemplateList", result[2].data)



    },
    methods: {
        async init() {
            if (this.itemId == null) {
                let itemId = this.$route.query.itemId;
                let result = await getById({ id: itemId });
                if (!result.success) {
                    this.$message({ type: "warning", message: "获取初始事项信息失败" });
                    return;
                }
                this.$store.commit("changeItem", result.data);
            }

        },
        async loadAll() {
            let result = await Promise.all([
                getStep({ itemName: this.itemName }),
                getField({ itemName: this.itemName }),
                getTemplate({ itemName: this.itemName })
            ])
            if (result.some(v => !v.success)) return;
            return result;
        },
        goNext() {
            let nextActive = this.active+1;
            let nextStep = this.stepsData[nextActive]
            let beforeEnterFn = nextStep.beforeEnterFn;
            if(beforeEnterFn){
                beforeEnterFn(this.itemState,this.itemGetters)
            }
            
            this.active++;
        },
        goPrev() {
            this.active--
        },
        parseFunction(data) {
            if (typeof data == "string" && data.indexOf('function') > -1) {
                try {
                    data = eval(`(${data})`)

                    return data;
                } catch (e) {

                    return data;
                }

            }
            return data;
        },
        // functionReviver(value,tag) {

        //     if (typeof value === 'string') {
        //         var rfunc = /function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*)}/,
        //             match = value.match(rfunc);

        //         if (match) {

        //             return new Function("state","getters" ,`

        //             with(this){
        //                 try{


        //                     ${match[1]}
        //                 }catch(e){
        //                     console.warn("错误",'${tag}')
        //                     console.warn(e)
        //                     return null;
        //                 }

        //                 }`).bind({ _, dayjs });
        //         }
        //     }
        //     return value;
        // },

    }

}
</script>

<style scoped lang="scss">
.run {
    display: flex;
    .left {
        width: 30cm;
    }
    .right {
        overflow: auto;
    }
}
</style>