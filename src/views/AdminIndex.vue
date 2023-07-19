<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="$route.path"
               class="el-menu-vertical-demo"
               router
               @select="handleMenuSelect"
      >
        <el-menu-item index="/admin/company">
          <i class="el-icon-menu"></i>
          <span slot="title">Company</span>
        </el-menu-item>
        <el-menu-item index="/admin/brand">
          <i class="el-icon-menu"></i>
          <span slot="title">Brand</span>
        </el-menu-item>
        <el-menu-item index="/admin/category">
          <i class="el-icon-menu"></i>
          <span slot="title">Category</span>
        </el-menu-item>
        <el-menu-item index="/admin/product">
          <i class="el-icon-menu"></i>
          <span slot="title">Product</span>
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
      <el-main class="main">
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
        console.log(this.company.logo)
      })
    },
    imageOnLoad(e){
      console.log(e)
    }
  },
  mounted() {
    this.getData()
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