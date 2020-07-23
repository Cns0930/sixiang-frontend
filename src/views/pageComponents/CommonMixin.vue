
<template>
    
</template>
<script>


import {mapState, createNamespacedHelpers } from 'vuex'
const {  mapGetters } = createNamespacedHelpers('run')




export default {
    name: "CommonMixin",
    
    computed: {
        itemState() {
            return this.$store.state["run"]
        },
        ...mapState({
            gettersList:state=>state.fieldModel.gettersList
        }),
        // ...generatorGetters(),
        // itemGetters:(vm)=>mapGetters(vm.gettersList),
        itemGetters() {
            
            return this.$store.getters
        }
       
      
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