<template>
    <div :style="style" class="container">
        <div v-if="!value" class="container-init">
            <div class="left">

                <div class="left-top"></div>
                <div class="right-top"></div>
                <div class="left-bottom"></div>
                <div class="right-bottom"></div>
                <div class="center">
                    <img src="./img/imgPlaceholder.png" />
                    <p class="content">{{content}}</p>
                </div>
            </div>
            <div class="right" :class="{'right-active':!disabled,'right-disabled':disabled}" @click="handleOpenQR">
                <img src="./img/urcode.png" />
                <p class="content">二维码上传</p>
            </div>

        </div>
        <div class="container-img" :style="{borderRadius:borderRadius+'px'}" v-else>
            <el-image style="width: 100%; " :src="value" :preview-src-list="srcList">
            </el-image>
            <div class="right-delete" @click="handleDelete">
                <i class="el-icon-delete"></i>
                <p>删除</p>
            </div>
            <!-- <img :src="value" /> -->
        </div>
        <el-dialog title="扫码上传图片" :visible.sync="openQR" @close="handleCloseDialog">
            <div class="dialog-body">
                <vue-qr :text="url" :callback="qrCallback" qid="testid"></vue-qr>
            </div>

        </el-dialog>
    </div>

</template>

<script>
import VueQr from 'vue-qr'
import axios from 'axios'
import dayjs from "dayjs"
export default {
    name: "QRCodeUpload",
    props: ["value", "content", "height", "borderRadius", "uploadUrlDev", "getImgUrlDev", "uploadUrlProd", "getImgUrlProd", "milliseconds", "disabled"],
    data() {
        return {
            openQR: false,
            url: "",
            uid: "",
            timer: null,
            updateTime: null,
            uploadUrl: ''
        }
    },
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer)
        }

    },
    components: { VueQr },
    created() {
        this.uploadUrl = process.env.NODE_ENV === 'development' ? this.uploadUrlDev : this.uploadUrlProd
        
    },
    computed: {
        srcList() {
            return [this.value]
        },
        style() {
            return {
                height: this.height + "px",
                borderRadius: this.borderRadius + "px"
            }
        }
    },
    methods: {
        async handleOpenQR() {
            if (this.disabled) return;
            let result = await axios.get(this.uploadUrl).then(res => res.data)
            console.log(this.uploadUrl,result);
            if(result.message!="SUCCESS") return;
            this.url = result.data.url;
            this.uid= result.data.uid
            this.openQR = true;
            //  轮询 查询图片
            console.log("询start", this.milliseconds)
            this.timer = setInterval(this.queryImg, this.milliseconds)
        },
        async queryImg() {
            console.log("询start", this.uid)
            if (!this.uid) return;
            let getImgUrl = process.env.NODE_ENV === 'development' ? this.getImgUrlDev : this.getImgUrlProd
            let result = await axios(getImgUrl, { params: { uid: this.uid } }).then(res => res.data)
            if (result.message != "SUCCESS") return;
            if (result.data.length < 1) return;
            console.log(result.data)
            let { ossUrl, updateTime } = result.data[0];
            if (!this.updateTime || dayjs(updateTime).isAfter(dayjs(this.updateTime))) {
                this.emitEvent(ossUrl)
                this.openQR = false
                clearInterval(this.timer)
            }

        },
        handleDelete() {
            this.emitEvent("")
        },
        qrCallback(e) {

        },
        emitEvent(data) {
            this.$emit("input", data);
        },
        handleCloseDialog() {
          
            if (this.timer) {
                clearInterval(this.timer)
                
            }
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    border: 1px solid #5c94e4;

    border-radius: 10px;
}
.container-init {
    // background: linear-gradient(334deg, #2eb1e7, #0b137c 83%);

    height: calc(100% - 20px);
    margin: 10px;
    display: flex;
    min-height: 80px;
    box-sizing: border-box;
    .left {
        flex: 1;
        margin-right: 10px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .left-top {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border-top: 2px solid rgba(255, 255, 255, 0.6);
            border-left: 2px solid rgba(255, 255, 255, 0.6);
        }
        .right-top {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            border-top: 2px solid rgba(255, 255, 255, 0.6);
            border-right: 2px solid rgba(255, 255, 255, 0.6);
        }
        .left-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 40px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.6);
            border-left: 2px solid rgba(255, 255, 255, 0.6);
        }
        .right-bottom {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 40px;
            height: 40px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.6);
            border-right: 2px solid rgba(255, 255, 255, 0.6);
        }
        .center {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .content {
                font-size: 20px;
                color: #ffffff;
                line-height: 25px;
            }
        }
    }
    .right {
        width: 100px;
        border-radius: 4px;
        width: 100px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: pointer;
        .content {
            margin-top: 30px;
            color: #ffffff;
            line-height: 19px;
            font-size: 15px;
        }
    }
    .right-active {
        background: linear-gradient(153deg, #ffd85a 1%, #f2901e 83%);
    }
    .right-disabled {
        background: linear-gradient(
            153deg,
            rgba(185, 199, 220, 0.48),
            rgba(119, 127, 141, 0.3) 83%
        );
    }
}
.container-img {
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    .right-delete {
        position: absolute;
        right: 0;
        height: 100%;
        width: 100px;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 20px;
        i {
            font-size: 30px;
        }
    }
}
.dialog-body {
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>