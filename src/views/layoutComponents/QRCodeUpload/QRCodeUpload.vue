<template>
    <div>
        <div v-if="!status" class="container-init" :style="style">
            <div>
                <img src="./img/boader.png">pic1</img>
                <img>pic2</img>
            </div>
            <div>
                
            </div>

        </div>
        <div class="container-img" v-else>

        </div>
        <el-dialog title="">

        </el-dialog>
    </div>

</template>

<script>

export default {
    name: "QRCodeUpload",
    props: ["value", "content", "height", "borderRadius"],
    data() {
        return {

        }
    },
    computed: {
        status() {
            return !!this.value
        },
        style() {
            return {
                height: this.height + "px",
                borderRadius: this.borderRadius + "px"
            }
        }
    }
}
</script>

<style scoped lang="scss">
.container-init {
    background: linear-gradient(334deg, #2eb1e7, #0b137c 83%);
    border: 1px solid #5c94e4;
    border-image: linear-gradient(180deg, #3667fb 2%, #86efff) 2 2;
    border-radius: 10px;
    filter: blur(10px);
    display: flex;
}
</style>