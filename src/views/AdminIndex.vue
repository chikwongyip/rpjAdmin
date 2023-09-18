<template>
  <el-container style="height: auto; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu default-active="/admin/main"
               class="el-menu-vertical-demo"
               router
      >
        <el-menu-item index="/main">
          <i class="el-icon-menu"></i>
          <span slot="title">Main</span>
        </el-menu-item>
        <el-menu-item index="/company">
          <i class="el-icon-menu"></i>
          <span slot="title">Company</span>
        </el-menu-item>
        <el-menu-item index="/brand">
          <i class="el-icon-menu"></i>
          <span slot="title">Brand</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <i class="el-icon-menu"></i>
          <span slot="title">Category</span>
        </el-menu-item>
        <el-menu-item index="/product">
          <i class="el-icon-menu"></i>
          <span slot="title">Product</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-menu"></i>
          <span slot="title">Product Images</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <el-image
              :src="company.logo"
              style="width:200px;height: 80px"
              :load="imageOnLoad"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getCompany} from "@/api/admin";
export default {
  // TODO:LOGO
  name: "AdminIndex",
  data(){
    return{
      company: {
        name:"",
        logo: ""
      }
    }
  },
  methods:{
    handleMenuSelect(route){
      this.$router.push(route);
    },
    getData(){
      getCompany().then( response => {
        this.company.name = response.data.data[0].name
        this.company.logo = process.env.VUE_APP_IMG + response.data.data[0].logo
      })
    },
    imageOnLoad(e){
      console.log(e)
    }
  },
  mounted() {
    let token = localStorage.getItem('token')
    if(token){
      this.getData() 
    }else{
      this.$router.push('/login')
    }
    // this.getData()
  }
}
</script>

<style scoped>
.header{
  text-align: left;
  font-size: 12px;
  display: flex;
}
</style>