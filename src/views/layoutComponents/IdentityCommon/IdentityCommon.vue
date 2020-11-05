<template>
    <div class="idendity-home">
        <template  class="bar">
            <el-button type="primary" size="mini" class="btn" style="margin-left: 20px" @click="getTestIdCard">
                测试 >>> 获取身份证正反面
            </el-button>
            <el-button type="primary" size="mini" class="btn" style="margin-left: 20px" @click="getTestIdCardInfo">
                测试 >>> 身份证识别
            </el-button>
            <!-- <el-button type="primary" size="mini" class="btn" style="margin-left: 20px" @click="getTestIdCardCopyInfo">
                测试 >>> 身份证复印件识别
            </el-button> -->
        </template>
        <div class="idendity">
            <div class="-center id-img ">
                <img v-if="idPositive" :src="idPositive" />
                <img v-else :src="defaultPostive" />
                <span>身份证人像面</span>
                <div class="choose-way">
                    <div>
                        <el-button size="small" @click="callSuiShenBan">随申办</el-button>
                    </div>
                    <div>
                        <el-button size="small" :loading="loading" @click="takePhotoThenRecognise(1)">扫描身份证</el-button>
                    </div>
                    <!-- <div>
                        <el-button size="small" :loading="loading" @click="takePhotoThenRecognise(2)">身份证复印件</el-button>
                    </div> -->
                </div>
            </div>
            <div class="-center id-img">
                <img v-if="idNagetive" :src="idNagetive" />
                <img v-else :src="defaultNagetive" />
                <span>身份证国徽面</span>
                <div class="choose-way">
                    <div>
                        <el-button size="small" @click="callSuiShenBan">随申办</el-button>
                    </div>
                    <div>
                        <el-button size="small" :loading="loading" @click="takePhotoThenRecognise(1)">扫描身份证</el-button>
                    </div>
                    <!-- <div>
                        <el-button size="small" :loading="loading" @click="takePhotoThenRecognise(2)">身份证复印件</el-button>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="result-info" v-if="!!isShowRecognise">
            <div class="data">
                <div class="val-item">
                    <span class="label">识别身份证姓名：</span>
                    <span class="value" v-if="recogniseName">{{ recogniseName }}</span>
                    <span v-else style="color: #cccccc">等待扫描</span>
                </div>
                <div class="val-item">
                    <span class="label">识别身份证号：</span>
                    <span class="value" v-if="recogniseIdNum">{{ recogniseIdNum }}</span>
                    <span v-else style="color: #cccccc">等待扫描</span>
                </div>
            </div>
        </div>
        <processing v-if="msg" :msg="msg" />
        <el-dialog class="message-dialog" title="请扫描随申码" :visible.sync="showSuiShenBanScanModal" append-to-body
            :close-on-click-modal="false" width="800px" @close="handleBarcodeClose">
            <div class="message-dialog-content">
                <div class="img-placeholder">
                    <img src="./scan.png" alt="">
                    <span v-if="suiShenBanSearching"> <i class="el-icon-loading"></i> 已扫描，信息查询中...</span>
                </div>
            </div>
        </el-dialog>
        <el-dialog class="warn-dialog" title="系统提示" :visible.sync="idNumberCheckError" append-to-body
            :close-on-click-modal="false" width="800px">
            <div class="warn-dialog-content">
                <div class="message">
                    证件信息与填写信息不一致请核对
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="warning" class="warn-btn" @click="idNumberCheckError = false">我知道了</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>


import idPositive from './id-positive.png'
import idNagetive from './id-nagetive.png'
import Processing from './Processing'
// import { GetCertBaseDataApi, IdCrodTakePhotoApi, TestIdCard,idCardCopyRecogApi} from '@/api/common'

const uploadUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.2.195:9001/sjtu/file/img/upload4' : 'http://192.68.61.220:9001/sjtu/file/img/upload4'

import _ from "lodash"

export default {
    name: 'IdentityCommon',
    props: ["isShowRecognise", "value"],
    components: {
        Processing
    },
    data() {
        return {
            env: process.env.NODE_ENV,
            loading: false,
            defaultPostive: idPositive,
            defaultNagetive: idNagetive,
            idPositive:"",
            idNagetive:"",
            msg: '',
            showSuiShenBanScanModal: false,
            suiShenBanSearching: false,
            barcode: '',
            // 识别的姓名
            recogniseName: '',
            // 识别的身份证号
            recogniseIdNum: '',
            // 经办人身份检查
            idNumberCheckError: false,
            // 已扫描文件列表
            imgList: [],
            DWObject: undefined,
            //临时的识别类型
            recogType: 0,
        }
    },
    computed: {
     
    },
    created() {
        this.idPositive= this.value.idPositive;
        this.idNagetive = this.value.idNagetive;
        this.recogniseName=this.value.name;
        this.recogniseIdNum=this.value.code;
        this.address=this.value.address;
    },
   
    methods: {
        async takePhotoThenRecognise(type) {
            this.loading = true
            this.imgList = []
            this.recogType = type;
            this.recogniseName = '';
            this.recogniseIdNum = '';
            await this.processScanner();
            this.loading = false
        },

        async processScanner() {
            if (!this.DWObject) {
                this.DWObject = await getDWObject();
            }
            this.DWObject.RemoveAllImages()
            this.DWObject.PixelType = EnumDWT_PixelType.TWPT_RGB
            this.DWObject.BitDepth = 24
            this.DWObject.IfShowUI = false
            this.DWObject.AcquireImage(this.OnAcquireImageSuccess, this.OnAcquireImageFailure)
            this.msg = '正在扫描，请稍后...'
            this.DWObject.RegisterEvent('OnPostAllTransfers', this.DynamsoftOnPostAllTransfers)
            this.DWObject.RegisterEvent('OnTransferError', this.OnTransferError)
            this.DWObject.RegisterEvent('OnTransferCancelled', this.OnTransferCancelled)
            this.DWObject.RegisterEvent('OnSourceUIClose', this.OnSourceUIClose)
        },
        OnAcquireImageSuccess() {
            console.log('OnAcquireImageSuccess');
        },
        OnAcquireImageFailure(e) {
            console.log('OnAcquireImageFailure', e);
            this.DWObject.CloseSource()
            if (e === -1032) {
                this.$message.warning({
                    message: '用户取消操作',
                    duration: 5000,
                    showClose: true,
                });
            }
            this.msg = ''
        },
        OnTransferError() {
            this.msg = ''
        },
        OnTransferCancelled() {
            this.msg = ''
        },
        OnSourceUIClose() {
            console.log('OnSourceUIClose');
            this.msg = ''
        },
        setIdCards() {
            //this.idPositive = this.imgList[0].replace(/"/g, '');
            //this.idNagetive = this.imgList[1].replace(/"/g, '');
            let params
            let apiFn
            if (this.recogType == 1) {
                params = {
                    frontImg: this.imgList[0].replace(/"/g, ''),
                    backImg: this.imgList[1].replace(/"/g, '')
                }
                apiFn = IdCrodTakePhotoApi

            } else {
                params = {
                    a4Img: this.imgList[0].replace(/"/g, ''),
                }
                apiFn = idCardCopyRecogApi
            }


            this.msg = '正在识别校验......'
            apiFn(params).then(res => {
                const { code, data, message } = res;
                this.msg = ''
                if (code === 200 && data) {
                    this.recogniseName = data.baseInfo.name;
                    this.recogniseIdNum = data.baseInfo.idCardNum;
                    this.idPositive = data.frontImg;
                    this.idNagetive = data.backImg;
                    // this.checkInfo();
                    this.address = data.baseInfo.address;
                    // this.$emit("change", { name: this.recogniseName, code: this.recogniseIdNum, address: this.address, idPositive: this.idPositive, idNagetive: this.idNagetive })
                    this.emitEvent();
                } else {
                    this.$message.warning(message);
                }
            });
        },
        checkIfImagesInBuffer() {
            if (this.DWObject.HowManyImagesInBuffer === 0) {
                this.$message.warning({
                    message: '尚未扫描文件,请检查扫描仪连接并确认已开机',
                    duration: 5000,
                    showClose: true,
                })
                return false
            }
            return true
        },
        DynamsoftOnPostAllTransfers() {
            this.DWObject.CloseSource()
            if (!this.checkIfImagesInBuffer()) {
                this.msg = ''
                return
            }
            const EnumDWTImageTypeToUpload = EnumDWT_ImageType.IT_JPG
            //
            // the upload method is called here
            //
            this.DWObject.ClearAllHTTPFormField()
            this.DWObject.HttpFieldNameOfUploadedImage = 'file'
            const Digital = new Date();
            const filename = Digital.getTime() + '.jpg';
            for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++) {
                this.DWObject.SetHTTPFormField('filename', i + '_' + filename)
                this.DWObject.ConvertToGrayScale(i);
                this.msg = '正在上传，请稍后...'
                this.DWObject.HTTPUpload(
                    uploadUrl,
                    [i],
                    EnumDWTImageTypeToUpload,
                    EnumDWT_UploadDataFormat.Binary,
                    (resStr) => { },
                    (errcode, errstr, httppostresponsestring) => {
                        this.checkErrorStringWithErrorCode(errcode, errstr, httppostresponsestring);
                    }
                )
            }
        },
        checkErrorStringWithErrorCode(errorCode, errorString, responseString) {
            console.log('[checkErrorStringWithErrorCode] errorCode, errorString, responseString', errorCode, errorString, responseString)
            // 这里驱动回调有问题，其实这里是成功的回调
            if (errorCode === -2003) {
                this.imgList.unshift(responseString);
                if (this.imgList.length === this.DWObject.HowManyImagesInBuffer) {
                    this.setIdCards();
                }
                return true
            } else {
                this.msg = ''
                this.$message.error('上传失败:' + errorString);
                return false
            }
        },
        // callZZK() {
        //     this.$message({
        //         type: 'warning',
        //         message: '请配置证照库!'
        //     })
        // },
        callSuiShenBan() {
            console.log("初始化拉！new IdentityCommon")
            this.$barcodeScanner.init(this.onBarcodeScanned)
            this.showSuiShenBanScanModal = true
        },
        handleBarcodeClose(){
            console.log("销毁！new IdentityCommon")
            this.$barcodeScanner.destroy();
        },
        async onBarcodeScanned(barcode) {
            this.barcode = barcode
            if (this.barcode && this.barcode.trim()) {
                this.suiShenBanSearching = true
                GetCertBaseDataApi({ code: this.barcode }).then(res => {
                    const { data, message, code } = res
                    if (data && code === '200') {
                        this.idPositive = data.images[0]
                        this.idNagetive = data.images[1]
                        this.showSuiShenBanScanModal = false
                        this.$emit('fillIdCard')
                    } else {
                        this.$message.error(message)
                    }
                    this.suiShenBanSearching = false
                }).catch(e => {
                    this.$message.error('获取证件信息失败!')
                    this.suiShenBanSearching = false
                })
                console.log("销毁！new IdentityCommon")
                this.$barcodeScanner.destroy();
            }
        },
        getTestIdCard() {
            // TestIdCard().then(res => {
            let res = {
                "code": 200,
                "message": "SUCCESS",
                "data": ["http://172.16.2.195/sjtu_image/202005/19/88c7caba1750481b9491082cfcfc84f7.jpg", "http://172.16.2.195/sjtu_image/202005/19/70c38b5102a64da5b3f67ce069e2deb3.jpg"]
            }
            const { code, message, data } = res;
            if (code === 200 && data) {
                this.idPositive = data[0];
                this.idNagetive = data[1];
                
                this.recogniseName = '姚冯鑫'
                this.recogniseIdNum = '339011197811035035'
                this.address = "西安市碑林区南二环西段69号"
                this.emitEvent();
            }
            // });
        },
        getTestIdCardInfo() {
            const params = {
                frontImg: this.idPositive,
                backImg: this.idNagetive
            }
            IdCrodTakePhotoApi(params).then(res => {
                const { code, data, message } = res;
                if (code === 200 && data) {
                    this.recogniseName = data.baseInfo.name;
                    this.recogniseIdNum = data.baseInfo.idCardNum;
                    this.address = data.baseInfo.address;
                    this.$emit("change", { name: this.recogniseName, code: this.recogniseIdNum, address: this.address, idPositive: this.idPositive, idNagetive: this.idNagetive })
                } else {
                    this.$message.warning(message);
                }
            });
        },
        getTestIdCardCopyInfo() {
            let items = [
                // "http://192.168.2.195/sjtu_image/202006/24/221a80048fb247638ce2885da99d023e.jpg",
                // "http://192.168.2.195/sjtu_image/202006/24/cf59d283870d4558880c09ec0e268562.jpg",
                // "http://192.168.2.195/sjtu_image/202006/24/6ad3949e6669473494dd087156f2682b.jpg",
                "http://192.168.2.195/sjtu_image/202006/24/5d69b959155c4e92a013d6c431dc664d.jpg",
                "http://192.168.2.195/sjtu_image/202006/24/4eb453dc3f224da39039d4a9f89ef337.jpg",
                "http://202.120.58.120:28077/ajax/bucket/file/qingpu/qp_scan/2020-07-03/143054707.jpg",
                "http://202.120.58.120:28077/ajax/bucket/file/qingpu/qp_scan/2020-07-03/143054713.jpg",
                "http://202.120.58.120:28077/ajax/bucket/file/qingpu/qp_scan/2020-07-03/143054791.jpg"
            ]
            let img = items[Math.floor(Math.random() * items.length)]
            const params = {
                a4Img: img,

            }
            idCardCopyRecogApi(params).then(res => {
                const { code, data, message } = res;
                if (code === 200 && data) {
                    this.recogniseName = data.baseInfo?.name;
                    this.recogniseIdNum = data.baseInfo?.idCardNum;
                    this.idPositive = data.frontImg || "";
                    this.idNagetive = data.backImg || "";
                } else {
                    this.$message.warning(message);
                }
            });
        },
        emitEvent() {
            let data = { name: this.recogniseName, code: this.recogniseIdNum, address: this.address, idPositive: this.idPositive, idNagetive: this.idNagetive }
            this.$emit("input", data);
            this.$emit("change", data);
        }
    }
}
</script>

<style scoped lang="scss">
.idendity-home {
    .idendity {
        display: flex;
        padding: 30px 0;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);

        .el-divider {
            margin: 10px 0;
        }

        .id-img {
            width: 400px;
            padding: 20px;
            height: 240px;
            border-radius: 8px;
            background: #fff;
            margin: 0 20px;
            position: relative;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid #ffffff;

            &:hover {
                background: rgba(255, 255, 255, 0.5);

                .choose-way {
                    visibility: visible;
                }
            }

            .choose-way {
                visibility: hidden;
                position: absolute;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                div {
                    margin: 10px 0;
                    padding: 0;

                    .el-button {
                        width: 100px;
                        color: #409eff;
                    }
                }
            }

            img {
                height: 100%;
            }

            span {
                position: absolute;
                bottom: 10px;
                right: 10px;
                font-size: 18px;
                color: rgba(0, 0, 0, 0.3);
            }
        }
    }

    .result-info {
        height: 50px;

        .data {
            height: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            font-size: 18px;

            .val-item {
                .label {
                    margin-right: 15px;
                }
            }
        }
    }
}
</style>