<template>
    <div style="display: flex; line-height: 60px; background-color:rgb(84, 92, 100);">
        <div style="flex: 1;text-align: left;font-size: 25px; color: #fff;">
            <span style="padding-right: 100px;"></span>
            <span>名木古树科普系统</span>
        </div>

        <div v-if="show" style="margin-top: 15px; margin-right: -15px; ">
            <el-dropdown-item @click.native="toUser">
                <el-col :span="12">
                    <div class="demo-basic--circle">
                        <div class="block"><el-avatar :size="30" :src="circleUrl"></el-avatar></div>
                    </div>
                </el-col>
            </el-dropdown-item>
        </div>


        <div v-if="show">
            <span style="font-size: 15px; color: #fff;">{{ user.userName }} 您好</span>
            <el-dropdown style="color: #fff; padding-right: 20px;">
                <i class="el-icon-arrow-down" style="margin-left: 5px; cursor: pointer; font-size: 10px"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <div v-else>
            <el-button style="background-color: rgb(84, 92, 100); color: #fff; margin-right: 20px;"
                @click="login">管理员登录</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            //转换一下
            user: {},
            show:false,
        }
    },
    methods: {
        toUser() {
            console.log("toUser")
        },
        toLeft() {
            console.log("toLeft")

            this.$confirm('确定要退出登录吗?', '提示', {
                confirmButtonText: '确定',   //确认按钮的文字显示
                type: 'warning',
                center: true
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '退出登录成功'
                })
                this.$router.push("/")
                //清空数据
                sessionStorage.clear()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出登录'
                })
            })
        },
        logout() {
            //console.log('logout')
            this.$confirm('确定要退出登录吗?', '提示', {
                confirmButtonText: '确定',   //确认按钮的文字显示
                type: 'warning',
                center: true
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '退出登录成功'
                })
                this.$router.push("/HomePage")
                //清空数据
                sessionStorage.clear()
                this.user = ""
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消退出登录'
                })
            })
        },
        login() {
            this.$router.replace("/adminLogin")
        }
    },
    created() {
        var user = sessionStorage.getItem('CurUser')
        if(user != null && user != undefined){
            this.user = JSON.parse(user)
            this.show = true;
        }
    }
}
</script>

<style scoped></style>