<template>
    <div class="preview">
        <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk :rules="rules"
            ref="form" :validate-on-rule-change="false" @submit.native.prevent>
            <el-row>
                <template v-for="(v,i) in itemState">
                    <template v-if="v.hidden"></template>
                    <component v-else-if="v.isList" :is="v.component" :value="v.value"  v-bind="v.attributes"
                        @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                        @input="v.oninput && v.oninput($event,itemState,itemGetters)"></component>

                    <el-col v-else="!v.isList" :span="v.span || 12" :key="i">

                        <el-form-item :label="v.label" :required="v.required !== false"
                            :prop="v.ruleKey ? v.ruleKey : v.required !== false ? 'required' : ''" :obj="v">

                            <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                                @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                                @input="v.oninput && v.oninput($event,itemState,itemGetters)"></component>
                        </el-form-item>
                    </el-col>
                </template>
            </el-row>
        </el-form>

    </div>
</template>

<script>
import { mapState } from "vuex"
import { CheckSocialCreditCode, IdentityCodeValid } from '@/utils/function.js'
import TestFormItem from '@/components/TestFormItem'
import layoutComponent from "@/views/layoutComponents/index"
import CommonMinxin from "@/views/pageComponents/CommonMixin"
// import rules from "@/utils/ruleConfig"
export default {
    name: "PreviewLayout",
    components: { ElFormItem: TestFormItem, ...layoutComponent },
    mixins:[CommonMinxin],
    provide() {
        return {
            $itemState:()=> this.itemState,
            $itemGetters:()=> this.itemGetters,
        }
    },
    data() {
        return {
            // rules
        }

    },
    methods: {
        eventFnProxy(fn, ...args) {
            if (!fn) return;

            fn.call(...args, itemState, null);
        },
    }
}
</script>

<style lang="scss" scoped>
.preview {
    .el-select {
        width: 100%;
    }
}
</style>