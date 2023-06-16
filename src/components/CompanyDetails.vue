<template>
  <el-form ref="companyForm" :model="company" class="company_form">
    <el-form-item label="id">
      <el-input v-model="company.id" class="name" autocomplete="off" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="公司名称" class="item">
      <el-input v-model="company.name"  class="name"></el-input>
    </el-form-item>
    <el-form-item label="公司简介" class="item">
      <el-input type="textarea" :rows="15" placeholder="请输入内容" v-model="company.description" class="description"></el-input>
    </el-form-item>
    <el-form-item label="ICP" class="item">
      <el-input v-model="company.icp"  class="name"></el-input>
    </el-form-item>
    <el-form-item label="电话" class="item">
      <el-input v-model="company.tel"  class="name"></el-input>
    </el-form-item>
    <el-form-item label="地址" class="item">
      <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="company.address" class="description"></el-input>
    </el-form-item>
    <el-form-item label="邮件地址" class="item">
      <el-input v-model="company.email"  class="name"></el-input>
    </el-form-item>
    <el-form-item label = "logo" class="item">
      <el-upload
          action=""
          :multiple="false"
          :auto-upload="false"
          :show-file-list="true"
          :limit="1"
          :file-list="fileList"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          ref="logo">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="uploadVisible">
        <img width="100%" :src=uploadImageUrl alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit('companyForm')">修改</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCompany,editCompany} from "@/api/admin";
export default {
  name: "CompanyDetails",
  data() {
    return {
      formData:{},
      logo:{},
      previewUrl:"",
      fileList:[],
      uploadVisible:false,
      uploadImageUrl:"",
      company: {
        id:'',
        name: '',
        description: '',
        icp: '',
        tel: '',
        address: "",
        email: '',
        logo: {},
        thumb_logo: ''
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((isValid) => {
        if (isValid){
          this.formData = new FormData()
          this.formData.append("id",this.company.id)
          this.formData.append("name",this.company.name)
          this.formData.append("description",this.company.description)
          this.formData.append("icp",this.company.icp)
          this.formData.append("tel",this.company.tel)
          this.formData.append("address",this.company.address)
          this.formData.append("email",this.company.email)
          if(this.fileList[0]){
            this.formData.append("logo",this.fileList[0].raw)
          }
          console.log(this.formData)
          editCompany(this.formData).then((response) => {
            if(response.data.errno === 0){
              this.$message({
                message:"更新成功",
                type:"success"
              })
            }
          })
              .catch((error) => {
                this.$message({
                  message:error+"更新失败",
                  type:"error"
                })
              })
        }
      })
    },
    getData(){
      getCompany().then((response) => {
        if(response.data.errno === 0){
          this.company.id = response.data.data[0].id
          this.company.name = response.data.data[0].name
          this.company.description = response.data.data[0].description
          this.company.icp = response.data.data[0].icp
          this.company.logo = response.data.data[0].logo
          this.company.tel = response.data.data[0].tel
          this.company.address = response.data.data[0].address
          this.company.email = response.data.data[0].email
        }
      })
          .catch((error) => {
            this.$message(
                {
                  message:error+"获取失败",
                  type:"error"
                }
            )
          })
    },
    beforeUpload(file){
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error('仅支持JPG和PNG格式图片！');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB！');
        return false;
      }
      return true;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      this.fileList.splice(index,1);
    },
    handleChange(file) {
      this.fileList.push(file);
    },
    handlePictureCardPreview(file) {
      this.uploadImageUrl = file.url;
      this.uploadVisible = true;
    }
  },
  mounted() {
    this.getData()
  }
}

</script>

<style scoped>
  .company_form{
    label-width:80px;

    .item{
      width:100px;
      vertical-align: left;
      .name{
        width: 200px;
      }
      .description{
        width: 400px;
      }
    }
  }
</style>