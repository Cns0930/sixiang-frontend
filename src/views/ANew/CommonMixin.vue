
<script>
// import { mapState, mapGetters } from "vuex"
// import Rules from "@/views/ANew/config/ruleConfig"
export default {
    name: "CommonMixinaa",
    data() {
        return {
            // rules:{},
            // itemGetters: {}
        }
    },
    computed: {
        // ...mapGetters(['sid', "item_code"]),
        // itemState() {
        //     return this.$store.state[this.item_code]
        // },
        // getters() {
        //     return this.$store.getters
        // },
    },
    
    watch: {
        // sid: {
        //     handler() {
        //         console.log("更改 itemGetters")
        //         let getterList = Object.keys(this.getters)
        //             .filter(key => key.startsWith(this.item_code))
        //             .map(fieldNoNamespaced => fieldNoNamespaced.replace(`${this.item_code}/`, ""));

        //         let that = this
        //         let props = getterList.reduce((result, item) => {
        //             result[item] = {
        //                 get() {
        //                     return that.getters[`${that.item_code}/${item}`]
        //                 }
        //             }
        //             return result
        //         }, {})
        //         this.itemGetters={}
        //         Object.defineProperties(this.itemGetters, props)
                
        //     },
        //     immediate: true
        // }
    },
    created(){
        // this.rules = new Rules(this.itemState,this.itemGetters).rules
    },
}
</script>

