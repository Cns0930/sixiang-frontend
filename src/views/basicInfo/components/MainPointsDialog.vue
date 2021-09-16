<template>
    <div class="main-points">
        <el-dialog title="预览自备材料审查要点" :visible.sync="dialogVisible" width="1200px">
            <div class="content">
                <div class="left">
                    <div class="title">
                        <span>审批要点说明</span>
                    </div>
                    <div class="left-list">
                        <div class="item" v-for="(item, index) in list" :key="index">
                            <div class="one-item">
                                <span>{{item.nam}}</span><span>{{item.nam}}</span>
                            </div>
                            <div class="two-content">
                                <div class="two-item" v-for="(ele, index) in item.two" :key="index">
                                    <span class="index-content">{{index}}</span><span>{{ele.info}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="title">
                        <span>
                            示例图
                        </span>
                    </div>
                    <div class="right-list">
                        <div class="right-center">

                        </div>
                        <div class="right-bottom">
                            <div class="left-png">

                            </div>
                            <div class="page-num-content">
                                <span>1</span> /
                                <span>
                                    2
                                </span>
                            </div>
                            <div class="right-png">

                            </div>
                            <div class="narrow-png">
                            </div>
                            <div class="enlarge-png">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'MainPointsDialog',
    data() {
        return {
            dialogVisible: false,
            list: [
                {
                    nam: "测试1111",
                    two: [
                        {
                            info: "a发生非师范生"
                        },
                        {
                            info: "a发生非师范生"
                        },

                    ]

                },
                {
                    nam: "测试1111",
                    two: [
                        {
                            info: "a发生非师范生"
                        },
                        {
                            info: "a发生非师范生"
                        },

                    ]

                }
            ]
        }
    },
    created() {

    },
    methods: {

    }

}
</script>

<style lang="scss" scoped>
.main-points {
    /deep/.el-dialog__body {
        padding: 10px;
        max-height: none;
    }
    .content {
        display: flex;
        height: 548px;
        .left {
            width: 413px;
            .title {
                height: 50px;
                background: #f4f0e7;
                padding-left: 25px;
                > span {
                    display: inline-block;
                    line-height: 50px;
                    font-weight: 600;
                    text-align: left;
                    color: #333333;
                }
            }
            .left-list {
                width: 100%;
                line-height: 46px;
                font-weight: 600;
                text-align: left;
                color: #333333;
                .one-item {
                    background: #eeeeee;
                    padding-left: 25px;
                }
                .two-content {
                    width: 100%;
                    padding: 12px 25px;
                }
                .two-item {
                    width: 100%;
                    height: 22px;
                    font-size: 16px;
                    font-weight: 400;
                    text-align: left;
                    color: #333333;
                    line-height: 22px;
                    margin-bottom: 12px;
                    .index-content {
                        border: 1px solid #333333;
                        border-radius: 50%;
                        width: 22px;
                        height: 22px;
                        display: inline-block;
                        text-align: center;
                    }
                }
            }
            .active {
                background: linear-gradient(
                    90deg,
                    #e3c895,
                    #d9ba8a 25%,
                    #b9906a
                );
                color: #ffffff;
            }
        }
        .right {
            width: 766px;
            height: 548px;
            .title {
                background: #f4f0e7;
                width: 100%;
                text-align: center;
                > span {
                    font-weight: 600;
                    color: #333333;
                    line-height: 50px;
                }
            }
            .right-list {
                width: 100%;
                height: 498px;
            }
            .right-center {
                height: calc(100% - 40px);
                background: #e5e5e5;
            }
            .right-bottom {
                width: 765px;
                height: 40px;
                background: #757575;
                position: relative;
                .page-num-content {
                    width: 60px;
                    position: absolute;
                    left: 267px + 26px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 40px;
                    padding-left: 13px;
                }
                .left-png {
                    width: 26px;
                    height: 26px;
                    background-image: url("../../../assets/img/1.png");
                    background-size: 26px 26px;
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 7px;
                    left: 267px;
                }
                .right-png {
                    width: 26px;
                    height: 26px;
                    background-image: url("../../../assets/img/1.png");
                    background-size: 26px 26px;
                    background-repeat: no-repeat;
                    position: absolute;
                    top: 7px;
                    left: 353px;
                    transform: rotate(180deg);
                }
                .narrow-png {
                    width: 20px;
                    height: 20px;
                    background: url("../../../assets/img/2.png") 100% no-repeat;
                    position: absolute;
                    top: 10px;
                    right: 306px;
                }
                .enlarge-png {
                    width: 20px;
                    height: 20px;
                    background: url("../../../assets/img/3.png") 100% no-repeat;
                    position: absolute;
                    top: 10px;
                    right: 266px;
                }
            }
        }
    }
}
</style>
