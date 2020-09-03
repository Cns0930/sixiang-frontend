<template>

</template>

<script>
import { mapState, mapGetters } from "vuex"
export default {
    name: "LayoutComponentMixin",
    inject: ["$itemState", "$itemGetters"],
    // computed: {
    //     itemState() {
    //         return this.$itemState()
    //     },
    //     itemGetters() {
    //         console.log("动态调用",this.$itemGetters()['gudongList_new_arr'])
    //         return this.$itemGetters();
    //     }
    // },
    data(){
        return {
            itemGetters:{},
            item_code:"run"
        }
    },
     computed: {
         ...mapGetters(['sid']),
         ...mapState({
            gettersList: state => state.fieldModel.gettersList
        }),
        itemState() {
            return this.$store.state[this.item_code]
        },
        getters() {
            return this.$store.getters
        },
    },
         
    watch: {
        gettersList: {
            handler(v) {
                
                if(!this.gettersList) return;
                console.log("更改 itemGetters")
                let that = this
                let props = v.reduce((result, item) => {
                    result[item] = {
                        get() {
                            return that.getters["run/" + item]
                        }
                    }
                    return result
                }, {})
                this.itemGetters={}
                Object.defineProperties(this.itemGetters, props)
                console.log("=====",this.itemGetters['gudongList_new_arr'])
                console.log(this.getters['run/gudongList_new_arr'])


                
            },
            immediate: true
        }
    },
}
</script>

<style>
</style>