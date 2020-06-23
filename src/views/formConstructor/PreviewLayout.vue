<template>
  <div>
      <el-form label-position="right" label-suffix="：" label-width="200px" hide-required-asterisk class="form-detail"
        :rules="rules" ref="form" :validate-on-rule-change="false" @submit.native.prevent>
            <el-form-item v-else :label="i.type !== 'btn' && i.label" :required="i.required !== false"
                    :prop="i.ruleKey ? i.ruleKey : i.required !== false ? 'required' : ''" :obj="i" @itemValidated="handleItemValidated($event,i)">
                    </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    name:"PreviewLayout"
}
</script>

<style>

</style>