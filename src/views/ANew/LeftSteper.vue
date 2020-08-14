<template>
    <div class="left-step">
        <el-steps direction="vertical" :active="active" :space="72" process-status="wait" finish-status="success">
            <el-step v-for="(v,i) in stepsData" icon="step-wait" :key="i" class="step">
                <template v-slot:title>
                    <div @click="handleClick(i)">
                        <span :class="active > i ? 'step-no finished-status' : 'step-no'">{{i>10?"":"0"}}{{i+1}}</span>
                        <span>{{v.title}}</span>
                    </div>
                    
                    <div class="doc-list" v-if="v.component == 'CommonMaterial' && active==i && docList && docList.length > 0">
                        <div :class="docIndex === index ? 'doc-item active' : 'doc-item'"
                             v-for="(doc, index) in docList" :key="index" @click="docActiveChange(index)">
                            <p :title="doc.name" style="margin-left: 30px;font-size: 16px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">{{doc.name}}</p>
                        </div>

                    </div>
                </template>
            </el-step>
        </el-steps>
    </div>
</template>

<script>
    import ElSteps from './components/steps/steps'
    import ElStep from './components/steps/step'
    import {mapState} from "vuex"
    import CommonMixin from "@/views/ANew/CommonMixin"
    export default {
        name: 'LeftSteper',
        props: ['stepsData','active'],
        mixins:[CommonMixin],
        components: {
            ElSteps,
            ElStep
        },
        data () {
            return {
               
            }
        },
        computed:{
            ...mapState({
                docList:state=>state.ANew.docList.map(v=>({name:v[0].name})),
                docIndex:state=>state.ANew.docIndex
            })
        },

        methods: {
            docActiveChange (index) {
                if (this.docIndex !== index) {
                    this.$store.commit("putDocIndex",index)
                }
            },
            handleClick (v) {

                if (v > 0) {
                    this.$emit('requestUpdateActive', v,this.active)
                    return
                }
                // if(v<this.active){
                this.$emit('update:active', v)
                // }

            }
        }
    }
</script>

<style lang="scss">
    .left-step {
        padding-top: 35px;
        border-radius: 8px;

        .doc-list {
            margin-top: 18px;
            min-width: 240px;
            width:261px;
            .doc-item {
                line-height: 40px;
                cursor: pointer;
            }

            .active {
                color: white;
                font-weight: bold;
            }
        }

        .step-no {
            font-weight: 600;
            font-size: 24px;
            margin-right: 5px;
            background-color: white;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .finished-status {
            background-image: linear-gradient(180deg, #60FF79 0%, #0E7461 100%);
        }


        .el-step__main {
            z-index: 10;
            padding-left: 30px !important;
        }

        .is-active .el-step__title {
            color: #fff;
            font-size: 24px;
        }

        .is-active .el-step__description {
            color: #fff;
            font-size: 24px;
        }

        .el-step__title,
        .el-step__title.is-wait,
        .el-step__title.is-success {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
        }

        .el-step__description,
        .el-step__description.is-wait,
        .el-step__description.is-success {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
        }

        .step-wait {
            width: 10px;
            height: 10px;
            background: #ffffff;
            border: 4px solid #3498dc;
            border-radius: 10px;
        }

        .el-step__icon {
            background: transparent !important;
        }

        .el-step__line {
            width: 1px !important;
            background-color: #fff !important;
            left: 31px !important;
        }

        .el-step__head {
            padding-left: 20px;
        }
    }
</style>
