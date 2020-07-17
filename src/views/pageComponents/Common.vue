
<template>
    
</template>
<script>
import layoutComponent from "@/views/layoutComponents/index"
export default {
    name: "Common",
    components: { ...layoutComponent },
    computed: {
        itemState() {
            return this.$store.state["run"]
        }
    },
    methods: {
        async goNext() {
           
            this.$emit('goNext');
        },
        goPrev() {
            this.$emit('goPrev');
        },
    }
}
</script>

<style>
</style>