<template>
    <div>
        <content-card>
            <div slot="content" class="content">
                 <template v-if="!!!imgPreview">
                        <div class="notice">
                                <span>请将所有文件放在扫描仪上。纸张正面朝下，头部朝下放进机器。</span>
                                <div class="img-placeholder"/>
                        </div>
                    </template>
                    <template v-if="imgPreview">
                         <span class="msg">已完成扫描，共计扫描{{imgList.length}}张</span>
                         <div class="img-preview-container mini-scroll">
                            <div class="img-preview">
                                <el-row class="image-row" :gutter="20">
                                    <template v-for="(url, index) in imgList">
                                        <el-col :span="8" :key="index">
                                            <!-- <img :src="url" style="width:100%"/> -->
                                            <div class="img" :style="'backgroundImage: url('+url+')'"></div>
                                            <p>第{{imgList.length - index}}张</p>
                                        </el-col>
                                    </template>
                                </el-row>
                            </div>
                        </div>
                    </template>
            </div>
        </content-card>
        <div class="operate-btn">
            <template v-if="!!!imgPreview">
                <el-button type="primary" class="big-btn btn-default" @click="skipNext">跳过扫描</el-button>
                <a href="javascript:;" class="file" v-if="env=='development'">选择文件
                    <input type="file" name="" id="" @change="dev_handleChange" multiple>
                </a>
                <el-button type="warning" class="big-btn btn-warn" @click="startScan">立即扫描</el-button>
            </template>
            <template v-if="imgPreview">
                <el-button type="primary" class="big-btn btn-default" @click="goScan">返回扫描</el-button>
                <el-button type="warning" class="big-btn btn-warn" @click="goNext">下一步</el-button>
            </template>
        </div>
        <div id="dwtcontrolContainer" style="display: none"></div>
        <processing v-if="msg" :msg="msg"/>
    </div>
</template>

<script>
    // 保存 imgList 引用,否则每次都需要reload 页面，重新初始化扫描仪
    import { CommitDocApi, SkipScanApi } from '@/api/ANew'

    import { getDWObject, checkIfImagesInBuffer } from '@/Dynamsoft'

    import ContentCard from '../components/ContentCard'
    import Processing from '../components/Processing'

    const uploadUrl = process.env.NODE_ENV === 'development' ? 'http://192.168.2.195:9001/sjtu/file/img/upload4' : 'http://192.68.61.220:9001/sjtu/file/img/upload4'
    
    import {mapGetters, mapState} from "vuex"
    import CommonMixin from "@/views/ANew/CommonMixin"
    export default {
        name: 'MaterialExtract',
        mixins:[CommonMixin],
        components: {
            ContentCard,
            Processing
        },
        
        data () {
            return {
                // 运行环境
                env: process.env.NODE_ENV,
                // 已扫描文件列表
                imgList: [],
                DWObject: undefined,
                // sid: sessionStorage.getItem('sid'),
                startBtn: {
                    loading: false
                },
                msg: '',
                imgPreview: false
            }
        },
        computed:{
            ...mapState({
                baseInfo:state=>state.home.barcodeInfo
            }),
            ...mapGetters(['sid',"qingxingItems","getUserId"])
        },
        async mounted () {
            this.DWObject = await getDWObject();
        },
        destroyed () {
            console.log('请空扫描图片列表')
            this.imgList = []
        },
        methods: {
            goScan() {
                this.imgPreview = false
            },
            goNext(){
                this.startAnalysis()
            },
            skipNext () {
                this.skipScan();
            },
            async startScan() {
                if (!this.DWObject) {
                    this.DWObject = await getDWObject();
                }
                this.DWObject.MaxUploadImageSize = -1
                this.DWObject.RemoveAllImages()
                this.DWObject.IfShowUI = false
                this.DWObject.AcquireImage(this.OnAcquireImageSuccess, this.OnAcquireImageFailure)
                this.msg = '正在扫描，请稍后......'
                this.DWObject.RegisterEvent('OnPostAllTransfers', this.DynamsoftOnPostAllTransfers)
                this.DWObject.RegisterEvent('OnTransferError', this.OnTransferError)
                this.DWObject.RegisterEvent('OnTransferCancelled', this.OnTransferCancelled)
                this.DWObject.RegisterEvent('OnSourceUIClose', this.OnSourceUIClose)
            },
            OnAcquireImageSuccess(){
                console.log('OnAcquireImageSuccess');
            },
            OnAcquireImageFailure(e){
                console.log('OnAcquireImageFailure', e);
                if(e === -1032) {
                    this.$message.warning({
                        message: '用户取消操作',
                        duration: 5000,
                        showClose: true,
                    });
                }
                this.msg=''
            },
            OnTransferError() {
                console.log('OnTransferError');
                this.msg=''
            },
            OnTransferCancelled() {
                console.log('OnTransferCancelled');
                this.msg=''
            },
            OnSourceUIClose() {
                console.log('OnSourceUIClose');
                this.msg=''
            },
            checkIfImagesInBuffer (){
                if (this.DWObject.HowManyImagesInBuffer === 0) {
                    this.$message.warning({
                        message: '未扫描文件',
                        duration: 5000,
                        showClose: true,
                    })
                    return false
                }
                return true
            },
            DynamsoftOnPostAllTransfers () {
                this.DWObject.CloseSource()
                if (!this.checkIfImagesInBuffer()) {
                    this.msg = ''
                    return
                }
                this.msg = '正在上传，请稍后......'
                const EnumDWTImageTypeToUpload = EnumDWT_ImageType.IT_JPG
                //
                // the upload method is called here
                //
                this.DWObject.ClearAllHTTPFormField()
                this.DWObject.HttpFieldNameOfUploadedImage = 'file'
                let filename = (new Date).getTime() + '.jpg'
                for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++) {
                    this.DWObject.ConvertToGrayScale(i);
                    this.DWObject.SetHTTPFormField('filename', i + '_' + filename)
                    this.DWObject.HTTPUpload(
                        uploadUrl,
                        [i],
                        EnumDWTImageTypeToUpload,
                        EnumDWT_UploadDataFormat.Binary,
                        (resStr) => {},
                        (errcode, errstr, httppostresponsestring) => {
                            console.log(errcode, errstr, httppostresponsestring)
                            if (this.checkErrorStringWithErrorCode(errcode, errstr, httppostresponsestring)) {
                                let imgUrl = httppostresponsestring.replace(/"/g, '')
                                this.imgList.unshift(imgUrl)
                                this.msg=''
                                this.imgPreview = true
                            }
                           if (this.imgList.length === this.DWObject.HowManyImagesInBuffer) {
                                 // 继续扫描, 不判断大小
                                 // console.log('scan document upload finished ...')
                                 // 包装请求，发送给后端，进行识别分析
                                 // this.startAnalysis()
                                 // this.msg=''
                                 // this.imgPreview = true
                            }
                        }
                    )
                }
            },
            startAnalysis () {
                // 如果有记录编号，暂存记录编号，防止重复提交
                // let currentSelfServiceRecordId = sessionStorage.getItem('currentSelfServiceRecordId');
                let currentSelfServiceRecordId =this.$store.state.home.currentSelfServiceRecordId;
                if(currentSelfServiceRecordId) {
                    let data = {
                        selfServiceRecordId: currentSelfServiceRecordId,
                        operation: 'FROMSESSIONSTORAGE',
                    }
                    this.$emit('goNext', data);
                    return;
                }
                //TODO: 添加更新docx
                // this.msg = '正在识别，请稍后...'
                let baseInfo = this.baseInfo;
                // let sub = this.$store.getters.getQingxingIds;
                const params = {
                    baseInfo,
                    sid: this.sid,
                    approval_item: _.isArray(this.qingxingItems) ? this.qingxingItems : [this.qingxingItems],
                    docs: this.imgList,
                    userId:this.getUserId,
                }
                // 请求分析
                CommitDocApi(params).then(res => {
                    const {code, data} = res;
                    if (code === 200) {
                        this.$store.commit("putCurrentSelfServiceRecordId",data.selfServiceRecordId)
                        // sessionStorage.setItem('currentSelfServiceRecordId', data.selfServiceRecordId);
                        this.$emit('goNext', data);
                    } else {
                        this.$message.warning({
                            message: '创建记录失败!',
                            duration: 5000,
                            showClose: true,
                        });
                    }
                })
                // setTimeout(() => {
                //     this.msg = '';
                // }, 3000)
            },
            skipScan () {
                // 如果有记录编号，暂存记录编号，防止重复提交
                // let currentSelfServiceRecordId = sessionStorage.getItem('currentSelfServiceRecordId');
                let currentSelfServiceRecordId =this.$store.state.home.currentSelfServiceRecordId;
                if(currentSelfServiceRecordId) {
                    let data = {
                        selfServiceRecordId: currentSelfServiceRecordId,
                        operation: 'FROMSESSIONSTORAGE',
                    }
                    this.$emit('goNext', data);
                    return;
                }

                let baseInfo = this.baseInfo;
                // let sub = JSON.parse(sessionStorage.getItem('sub'))
                // let sub = this.$store.getters.getQingxingIds;
                const params = {
                    baseInfo,
                    sid: this.sid,
                    approval_item: _.isArray(this.qingxingItems) ? this.qingxingItems : [this.qingxingItems],
                    docs: this.imgList,
                    userId:this.getUserId,
                }

                SkipScanApi(params).then(res => {
                    const {code, data} = res;
                    if (code === 200) {
                         this.$store.commit("putCurrentSelfServiceRecordId",data.selfServiceRecordId)
                        // sessionStorage.setItem('currentSelfServiceRecordId', data.selfServiceRecordId);
                        this.$emit('goNext', data);
                    } else {
                        this.$message.warning({
                            message: '创建记录失败!',
                            duration: 5000,
                            showClose: true,
                        });
                    }
                });
            },
            checkErrorStringWithErrorCode (errorCode, errorString, responseString) {
                // 这里驱动回调有问题，其实这里是成功的回调
                if (errorCode === -2003) {
                    return true
                }
            },
            async dev_handleChange (v) {
                let axios = require('axios')

                let files = Array.from(v.target.files)
                let result = await Promise.all(files.map(file => {
                    let formData = new FormData()
                    formData.append('file', file)
                    return axios.post(uploadUrl,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then(res => res.data)
                }))

                this.imgList = result
                this.startAnalysis()
            }
        },
    }
</script>

<style scoped lang="scss">
    #dwtcontrolContainer {
        display: none !important;
    }

    .content {
        height: calc(100% - 40px);
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .notice {
            font-size: 30px;
            color: #ffffff;
            letter-spacing: 1.36px;

            .img-placeholder {
                background-image: url("~@/assets/png/scan-placeholder.png");
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                margin: 20px 0;
                height: 400px;
                width: 100%;
            }
        }
    }

    .file {
        position: relative;
        display: block;
        background: #d0eeff;
        border: 1px solid #99d3f5;
        border-radius: 4px;
        padding: 4px 12px;
        overflow: hidden;
        color: #1e88c7;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
        width: 100px;
        height: 30px;
        cursor: pointer;
    }

    .file input {
        position: absolute;
        font-size: 100px;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
    }

    .file:hover {
        background: #aadffd;
        border-color: #78c3f3;
        color: #004974;
        text-decoration: none;
    }
    .msg {
        display: flex;
        align-items: center;
        margin: 20px;
        font-size: 30px;
        color: #ffffff;
        letter-spacing: 1.36px;
    }
    .img-preview-container {
        width: 95%;
        height: calc(100% - 40px);
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        .img-preview {
            width: 100%;
            .image-row {
                margin: 0 20px;
                font-size: 14px;
                color: #ffffff;
                text-align: center;
                overflow-x: hidden;
                .img {
                    background-repeat: no-repeat;
                    background-size: contain;
                    background-position: center;
                    margin: 20px 0;
                    height: 400px;
                    width: 100%;
                }
            }
        }
    }
</style>
