
<template>
    
</template>
<script>
import layoutComponent from "@/views/layoutComponents/index"
import {mapState, createNamespacedHelpers } from 'vuex'
const {  mapGetters } = createNamespacedHelpers('run')
export default {
    name: "Common",
    components: { ...layoutComponent },
    computed: {
        itemState() {
            return this.$store.state["run"]
        },
        ...mapState({
            gettersList:state=>state.fieldModel.gettersList
        }),
        // itemGetters(){
        //     return mapGetters(this.gettersList)
        // }
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
    }
}
</script>

<style>
</style>