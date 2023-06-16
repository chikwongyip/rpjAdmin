<template>
  <div class="login-container">
    <el-card>
      <h1 class="title">广州瑞谱佳后台登录系统</h1>
      <el-form ref="form" :model="loginForm" :rules="rules" label-width="80px" class="login-form">
        <el-form-item label="username" prop="email">
          <el-input type="username" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { userLogin} from "@/api/login";
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: 'Please enter your username', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          { min: 3, message: 'Password length should be at least 6 characters', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let param = this.loginForm
          userLogin(param).then(response => {
            if (response.data.errno === 0){
              localStorage.token = response.data.data.token;
              this.$router.push('/admin');
            }
          })
              .catch(error =>{
                this.$message(
                    {
                      message:"登录失败！" + error,
                      type:"error"
                    }
                )
              })
        }
      });
    }
  },
  mounted() {
    const username = this.$cookies.get("username");
    if (username){
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
  .login-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 2em;
    margin-bottom: 20px;
  }

  .login-form {
    max-width: 400px;
  }
</style>