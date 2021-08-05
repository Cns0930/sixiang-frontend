

import { mapState, mapGetters } from "vuex"
import Rules from "@/utils/ruleConfig"
export default {
    name: "CommonMixin",
    data() {
        return {
            rules:{},
            itemGetters: {},
            item_code:"run"
        }
    },
    props:['stepData'],
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

                console.log("更改 itemGetters")
                let that = this
                let props = v.reduce((result, item) => {
                    result[item] = {
                        get() {
                            return that.getters[`${that.item_code}/${item}`]
                        }
                    }
                    return result
                }, {})
                this.itemGetters={}
                Object.defineProperties(this.itemGetters, props)
                console.log(this.itemGetters)
            },
            immediate: true
        }
    },
    created(){
        
        this.rules = new Rules(this.itemState,this.itemGetters).rules
    },
    
}


