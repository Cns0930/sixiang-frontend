<template>
    <el-col v-for="(v,i) in children" :span="v.span || 12" v-if="!v.hidden" :key="i">

        <el-form-item :key="i" :label="v.label" :prop="v.ruleKey || ''" :obj="v">
            <component :is="v.component" v-model="v.value" v-bind="v.attributes"
                @change="v.onchange && v.onchange($event,itemState,itemGetters)"
                @input="v.oninput && v.oninput($event,itemState,itemGetters)"></component>
        </el-form-item>
    </el-col>
</template>

<script>
export default {
    name: "Collection",
    props: ['value', 'children'],

}
</script>

<style>
</style>