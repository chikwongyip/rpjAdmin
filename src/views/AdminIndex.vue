<template>
  <el-container class="container">
    <el-aside class="sideBar">
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router @select="handleMenuSelect">
        <el-menu-item index="/admin/company" class="sideBarItem">
          <i class="el-icon-menu"></i>Company
        </el-menu-item>
        <el-menu-item index="/admin/brand" class="sideBarItem">
          <i class="el-icon-menu"></i>Brand
        </el-menu-item>
        <el-menu-item index="/admin/category" class="sideBarItem">
          <i class="el-icon-menu"></i>Category
        </el-menu-item>
        <el-menu-item index="/admin/product" class="sideBarItem">
          <i class="el-icon-menu"></i>Product
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // TODO:LOGO
  name: "AdminIndex",
  data(){
    return{
      url:"http://localhost:8000/images/"
    }
  },
  methods:{
    handleMenuSelect(route){
      this.$router.push(route);
    }
  }
}
</script>

<style scoped>

  .container{
    position: absolute;
    width: 100%;
    .header{
      text-align:right;
      font-size:12px;
    }
    .sideBar{
      width: 200px;
      background-color: rgb(238, 241, 246);
    }
    .sideBarItem{
      text-align: left;

    }
  }
</style>