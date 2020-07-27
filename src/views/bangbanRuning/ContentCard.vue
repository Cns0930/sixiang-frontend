<template>
    <div class="content-card-home">
        <div class="title" v-if="title">
            <img :src="img" alt=""/>
            <span class="text">{{title}}</span>
            <div  class="title-right">
                <slot name="title-right"></slot>
            </div>
        </div>
        <div class="mini-title" v-if="miniTitle">
            <span class="text">{{miniTitle}}</span>
        </div>
        <div class="content-block mini-scroll" :style="title ? 'height: calc(100% - 81px);' : miniTitle ? 'height: calc(100% - 40px);' : 'height: 100%'">
            <slot name="content"/>
        </div>
    </div>
</template>

<script>
    import defaultImg from '../assets/png/card-icon.png'

    export default {
        name: 'ContentCard',
        props: {
            title: String,
            miniTitle: String,
            img: {
                default: () => defaultImg
            },
            enableTitle: {
                type: Boolean,
                default: true
            }
        }
    }
</script>

<style scoped lang="scss">

    .content-card-home {
        height: calc(100% - 96px);
        z-index: -100;
        background: rgba(2,83,141,0.68);
        border: 2px solid #00CC9E;
        border-radius: 20px;
        overflow: hidden;

        .content-block {
            height: calc(100% - 81px);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .title {
            display: flex;
            align-items: center;
            font-size: 24px;
            border-bottom: 1px solid rgba(255, 255, 255, .5);
            line-height: 64px;
            height: 64px;
            padding: 0 30px;

            img {
                width: 30px;
                height: 30px;
            }

            .text {
                padding-left: 20px;
            }
        }
        .title-right{

            margin-left:auto;
        }

        .mini-title {
            height: 40px;
            line-height: 40px;
            background: rgba(0, 0, 0, 0.12);
            box-shadow: 0 -1px 0 0 rgba(255, 255, 255, 0.5),
            0 1px 0 0 rgba(255, 255, 255, 0.5);
            padding: 0 20px;
            display: flex;
            align-items: center;

            .text {
                background-image: url("../assets/svg/txt.svg");
                background-repeat: no-repeat;
                background-size: contain;
                padding-left: 25px;
                height: 20px;
                line-height: 20px;
                font-size: 20px;
                color: #ffffff;
            }
        }
    }

</style>
