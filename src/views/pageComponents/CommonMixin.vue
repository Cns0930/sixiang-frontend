
<template>

</template>
<script>


import { mapState, createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('run')
import Rules from "@/utils/ruleConfig"

export default {
    name: "CommonMixin",
    data() {
        return {
            rules:{},
            itemGetters: {}
        }
    },
    computed: {
        itemState() {
            return this.$store.state["run"]
        },
        ...mapState({
            gettersList: state => state.fieldModel.gettersList
        }),
        // ...generatorGetters(),
        // itemGetters:(vm)=>mapGetters(vm.gettersList),
        getters() {

            return this.$store.getters
        }


    },
    watch: {
        gettersList: {
            handler(v) {
                let that = this
                let props = v.reduce((result, item) => {
                    result[item] = {
                        get() {
                            return that.getters["run/" + item]
                        }
                    }
                    return result
                }, {})
                this.itemGetters = {}
                Object.defineProperties(this.itemGetters, props)
               
            },
            immediate: true
        }
    },
    created(){
        this.rules = new Rules(this.itemState,this.itemGetters).rules
    },
    methods: {
        async goNext() {

            this.$emit('goNext');
        },
        async goPrev() {
            this.$emit('goPrev');
        },
        // eventFnProxy(fn, ...args) {
        //     if (!fn) return;

        //     fn.call(this, ...args);
        // },
    }
}
</script>

<style>
</style>