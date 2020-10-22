<template>
  <div>
      <el-col  v-for="(v,i) in computedFields" :span="v.span || 12" v-if="!v.hidden" :key="i">

            <el-form-item :key="i" :label="v.label" :label-width="v.label?_.isNil(v.labelWidth)? '200px':v.labelWidth:'50px'" :prop="v.ruleKey || ''" :obj="v" @itemValidated="handleItemValidated($event,v)" :siblings="fields" :parent="parent">
                <component :is="v.component" v-model="v.value" v-bind="v.attributes" :siblings="fields" :parent="parent"
                    @change="v.onchange && v.onchange($event,itemState,itemGetters,fields,parent)"
                    @input="v.oninput && v.oninput($event,itemState,itemGetters,fields,parent)">
                </component>
            </el-form-item>
        </el-col>
  </div>
</template>

<script>
import TestFormItem from '@/components/TestFormItem'

import CommonMixin from "@/views/pageComponents/CommonMixin"

export default {
    name:"PureComponents",
    props:["fields","parent"],
    mixins:[CommonMixin],
    components: { ElFormItem: TestFormItem, },
    computed:{
        computedFields(){

            return Object.values(this.fields).sort((a,b)=>a.sort-b.sort)
        }
    },
    methods:{
        handleItemValidated(event,context){
      
            this.$emit("itemValidated",{...event,context})
        },
    },
}
</script>

<style>

</style>