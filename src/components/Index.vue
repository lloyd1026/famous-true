<template>
    <div style="width: 1000px; ">
        <h1 style="text-align: center; font-size:xx-large; line-height: 100px;margin-top: 50px;">欢迎进入名木古树科普系统</h1>
        <div style="height: 10px;"></div>
        <el-carousel :interval="2000" type="card" height="350px" width="600px">
            <el-carousel-item v-for="(img, index) in imgList" :key="index">
                <el-image style="width: 100%; height: 100%" :src="img.url"></el-image>
            </el-carousel-item>
        </el-carousel>
        <el-card class="box-card" style="width: 1000px;">
            <div slot="header" class="clearfix">
                <span style="color: #409EFF; font-size: large;">名木古树</span>
            </div>
            <div>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;古树名木，据中国有关部门规定，一般树龄在百年以上的大树即为古树；而那些树种稀有、名贵或具有历史价值、纪念意义的树木则可称为名木。古树分为三个级别，树龄500年以上的树木为一级古树，树龄在300—499年的树木为二级古树，树龄在100—299年的树木为三级古树，名木不分级别。
古树名木承载着中华文明的悠久历史和灿烂文化，寄托着广大人民群众的乡愁情思，延续着优质的生物基因，被誉为“绿色的国宝”“有生命的文物”。
                </p>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2024年1月15日，国家林草局举办2024年第一季度例行发布会，会上介绍，第二次全国古树名木资源普查结果显示，中国普查范围内现有古树名木共计508.19万株，包括散生122.13万株和群状386.06万株。
                </p>
            </div>
        </el-card>
    </div>
</template>


<script>
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            imgList: [
                { url: require("../assets/slideshow/1.jpg") },
                { url: require("../assets/slideshow/6.webp") },
                { url: require("../assets/slideshow/3.jpg") },
                { url: require("../assets/slideshow/4.jpeg") },
                { url: require("../assets/slideshow/5.webp") },
            ]
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 480px;
}
</style>