<template>
    <div class="run">
        <template v-for="(step,index) in stepsData">
            <component v-if="index == active" :is="step.component"
                :config="step.configType ==2? step.configFn(itemState,itemGetters):step.config" @goNext="goNext"
                @goPrev="goPrev" :stepData="step" ref="components">
            </component>
        </template>
    </div>
</template>

<script>
import { getStep, } from "@/api/step/index";
import { getField } from "@/api/superForm/index";
import { getTemplate } from '@/api/template/index'
import { components } from "@/views/pageComponents/index"

import { deserializeTableData } from "../attributeComponents/index";
import _ from "lodash"

export default {
    name: "Run",
    components: { ...components },
    data() {
        return {
            active: 0,
            itemName: this.$route.query.itemName,
            stepsData: [],
            // itemState: {},
            itemGetters: {}
        }
    },
    computed: {
        itemState() {
            return this.$store.state["run"]
        }
    },
    async created() {
        let result = await this.loadAll();
        this.stepsData = result[0].data.map(v => {
            
            if(typeof v.stepObject.configFn =="string" && v.stepObject.configFn.indexOf('function')>-1){
                v.stepObject.configFn = eval(`(${v.stepObject.configFn})`)
            }
            return v.stepObject
            });

        let allFields = result[1].data.map(v => ({ id: v.id, fieldType: v.fieldType, children: v.children, ...v.object })).map(deserializeTableData);
        console.log(allFields)
        let itemState = allFields.filter(v => v.fieldType == 1).reduce((result, item) => {

            let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
            let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo }, attrObj, { attributes: item.componentDefs.getAttributes ? item.componentDefs.getAttributes() || {} : {} })
            result[item.fieldNo] = mergeObj;
            return result;
        }, {});



        this.itemGetters = allFields.filter(v => v.fieldType == 2).reduce((result, item) => {

            let attrObj = _.mapValues(item.componentDefs, (o) => o.value);
            let mergeObj = _.merge({ label: item.label, fieldNo: item.fieldNo }, attrObj, { attributes: item.componentDefs.getAttributes ? item.componentDefs.getAttributes() || {} : {} })
            result[item.fieldNo] = mergeObj;
            return result;
        }, {});
        // 注册模块
        let module = {
            namespace:true,
            state: {},
            getters: {}
        };

        module.state = itemState;
        
        
        if (this.$store.hasModule("run")) {
            this.$store.unregisterModule("run");
        }
        // console.log(JSON.stringify(module.state, null, 4));
        this.$store.registerModule("run", module);

        
      
        this.$store.commit("putTemplateList",result[2].data)
    },
    methods: {
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
            this.active++;
        },
        goPrev() {

        }
    }

}
</script>

<style scoped lang="scss">
.run {
   
}
</style>