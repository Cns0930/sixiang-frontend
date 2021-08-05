<template>
    <div class="processing-page">
        <div class="mask">
            <div class="content">
                <div class="loading-masker">
                    <div class="loading-inner">
                        <div class="loading-bar"></div>
                        <h1 class="loading-text">{{msg}}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'Processing',
        props: {
            msg: {
                type: String,
                default: function () {
                    return '正在处理，请稍后...'
                }
            }
        },
        data() {
            return {
                timer: null
            };
        },
    };
</script>

<style scoped lang="scss">

    .processing-page {
        position: absolute;
        width: 100%;
        height: 100vh;
        left: 0;
        top: 0;
        display: flex;

        .mask {
            z-index: 100;
            opacity: 0.54;
            background: #000000;
            width: 100%;
            display: flex;

            .content {
                text-align: center;
                margin: auto;

                .loading-inner {
                    top: 45%;
                    width: 100%;
                    text-align: center;

                    .loading-bar {
                        width: 760px;
                        height: 32px;
                        border: 1px solid #54CDFF;
                        border-radius: 16px;
                        transition: all .5s linear;
                        animation: animate 1s linear infinite;
                        display: inline-block;
                        background-size: 50px 50px;
                        background-image: linear-gradient(135deg, #2373AE, #2373AE 25%, #3790D2 25%, #3790D2 50%, #2373AE 50%, #2373AE 75%, #3790D2 75%, #3790D2 100%);
                    }

                    .loading-text {
                        font-size: 40px;
                        margin-top: 15px;
                        color: #FFFFFF;
                    }
                }

                @keyframes animate {
                    from {
                    }
                    to {
                        background-position: 100px 0;
                    }
                }
            }
        }


    }
</style>
