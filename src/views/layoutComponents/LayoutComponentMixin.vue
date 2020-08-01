<template>

</template>

<script>
export default {
    name: "LayoutComponentMixin",
    inject: ["$itemState", "$itemGetters"],
    computed: {
        itemState() {
            return this.$itemState()
        },
        itemGetters() {
            return this.$itemGetters();
        }
    },
}
</script>

<style>
</style>