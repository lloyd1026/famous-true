<template>
    <div>
        <el-container style="height: 100%">
            <el-header style="text-align: right; font-size: 12px; width: 100%; padding: 0;">
                <Header></Header>
            </el-header>

            <el-container style="height: 100%">
                <el-aside style="height: 100vh;background-color: rgb(238, 241, 246); padding: 0;margin: 0; width: 250px;">
                    <Aside></Aside>
                </el-aside>
                <el-main style="margin: 0;padding: 0;" class="bg">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script>
import Aside from './Aside.vue'
import Header from './Header.vue'

export default {
    name: 'TourHomePage',
    components: { Aside, Header },
    data() {
        return {
            name: ''
        }
    },
    methods: {
        getAllTree() {
            this.$axios.get(this.$httpUrl + '/getAllTree').then(res => res.data).then(res => {
                console.log(res)
                res.data

            })
        },
        getTreeByName() {
            this.$axios.post(this.$httpUrl + '/getTreeByName', { name: this.name }).then(res => res.data).then(res => {
                console.log(res)
            })
        },
    }
}
</script>

<style scoped>
.bg {
    /* margin: 0;
    padding: 0; */
    background: url("../assets/bg3.jpg");
    height: 100vh;
    width: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.fixed-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000; /*确保它在其他元素之上*/
  padding: 20px; /* 内边距 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
 
}
</style>