<template>
  <div  class="login-page">
    <el-form :model="form" :rules="loginRules" ref="loginForm" class="login-container">
      <h1 class="title">名木古树科普系统</h1>
      <el-form-item prop="userName">
        <el-input type="text" v-model="form.userName" auto-complete="off" placeholder="请输入账号">
          <template v-slot:prepend><i style="font-size:20px" class="el-icon-user"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input type="text" v-model="form.passWord" auto-complete="off" placeholder="请输入密码" show-password>
          <template v-slot:prepend><i style="font-size:20px" class="el-icon-key"></i></template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="width:100%;" type="primary" @click="doLogin">登录</el-button>
      </el-form-item>
      <el-row style="text-align: right;margin-top: -10px;">
        <el-link type="warning" style="margin-left: 10px" @click="toReset">忘记密码?</el-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'AdminLogin',
  components: {},
  data() {
    return {
      form: {
        userName: '',
        passWord: ''
      },
      loginRules: {
        userName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    doLogin() {
      
      this.$refs.loginForm.validate((valid) => {
        if (valid) {    //valid成功为true 失败为false
          //后端验证用户名密码
          this.$axios.post(this.$httpUrl + '/adminLogin', this.form).then(res => res.data).then(res => {
            //console.log(res)
            //成功
            if (res.code === 200) {
              //存储当前用户
              var user = {
                userName:this.form.userName,
                passWord:this.form.passWord,
              }
              sessionStorage.setItem("CurUser", JSON.stringify(user))
              this.$message({
                message: '登录成功！',
                type: 'success'
              });
              
              this.$router.replace('/HomePage/Index')
            } else {  //失败
              
              this.$message.error('账号或密码错误！');
              return false;
            }
          });
        }
        else {
          this.$message.error('账号或密码错误！');
          return false;
        }
      });
    },
    toReset(){

    },
  }
}
</script>

<style>

.login-page{
  background:url("../assets/bg.jpg");
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
  font-size: 20px;
}

</style>