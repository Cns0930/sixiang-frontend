<template>
  <div>
      <el-col  v-for="(v,i) in fields" :span="v.span || 12" v-if="!v.hidden" :key="i">

            <el-form-item :key="i" :label="v.label" :prop="v.ruleKey || ''" :obj="v">
                <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                    @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                    @input="v.oninput && v.oninput($event,itemState,itemGetters)">
                </component>
            </el-form-item>
        </el-col>
  </div>
</template>

<script>
import TestFormItem from '@/components/TestFormItem'

import CommonMixin from "@/views/pageComponents/CommonMixin"
import layoutComponent from "./index"
export default {
    name:"PureComponents",
    props:["fields"],
    mixins:[CommonMixin],
    components: { ElFormItem: TestFormItem, },
}
</script>

<style>

</style>