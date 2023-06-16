<template>
  <section>
<!-- brand list-->
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.brand_name" placeholder="品牌名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="brandList" highlight-current-row v-loading="listLoading" @selection-change="handleSelectionChange">
      <el-table-column prop="brand_id" label="品牌ID" width="140"></el-table-column>
      <el-table-column prop="brand_image" label="品牌Logo" width="120"></el-table-column>
      <el-table-column prop="brand_name" label="品牌名称"></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        :layout="'total, sizes, prev, pager, next, jumper'"
        :total="data.length"
        :page-size="pageSize"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :background="true"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
    </el-pagination>
<!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="id">
          <el-input v-model="editForm.brand_id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input v-model="editForm.brand_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
<!-- 新增界面   -->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input v-model="addForm.brand_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
              action=""
              :multiple="true"
              :auto-upload="false"
              :show-file-list="true"
              :limit="1"
              :file-list="fileList"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-change="handleUploadChange"
              :on-remove="handleUploadRemove"
              :before-upload="beforeUpload"
              ref="files">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="uploadVisible">
            <img width="100%" :src=uploadImageUrl alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>

import { getBrandList,deleteBrand,updateBrand,addBrand } from "@/api/admin";
export default {
  name:"BrandList",
  data(){
    return{
      previewUrl:'',           //图片预览URL
      formData:{},             //发送附件 formData
      filters:{
        brand_name:''          //根据条件查询
      },
      data:[],                 //请求brand list 获取的所有data
      currentPage:1,           //当前页
      pageSize:10,             //每页显示条数
      listLoading:false,        //加载brand list动画
      selectID: "",
      selectedList:[],
      fileList:[],
      uploadVisible:false,
      uploadImageUrl:"",
      //edit
      editFormVisible:false, //编辑界面显示控制
      editLoading:false,     //编辑加载画面
      //编辑校验
      editFormRules:{
        brand_name:[
          { requrie:true,message:"请输入品牌名称", trigger:'blur' }   //校验brand name 是否合法输入
        ]
      },
      // 编辑后返回内容
      editForm:{
        brand_id:'',   //不可编辑
        brand_name:'',
        image:{}
      },
    //  add
      addFormVisible:false, //添加界面显示控制
      addLoading:false,     //添加加载画面
      //添加内容
      addForm:{
        brand_name:"",
        image:{}
      },
      //校验规则
      addFormRules:{
        brand_name:[
          { requrie:true,message:"请输入品牌名称", trigger:'blur' },
        ],
        image:[
          { requrie:true,message:"请上传图片", trigger:'blur' },
        ]
      }
    }
  },
  methods:{
    getData(){
      //如果filter 位置不为空 则以brand name位置传入
      let param = {}
      if (this.filters.brand_name){
        param = {
          brand_name:this.filters.brand_name
        }
      }
      this.listLoading= true
      getBrandList(param).then((res) => {
        this.listLoading = false
        if(res.data.errno === 0){
          this.data = res.data.data
        }else{
          this.$alert("信息加载失败",{
            confirmButtonText:"确定"
          })
        }
      })
          .catch((err) => {
            this.listLoading = false
            this.$message({
              type:"info",
              message:`${err} 加载失败,请联系管理员!`
            })
          })
    },
    handleSelectionChange(selected){
      this.selectedList = selected
    },
    handleDel(index,row){
      let id = Object.assign({},row).brand_id
      if (id){
        this.$confirm('确认删除该记录吗？','提示',{type:"warning"}
        ).then(() => {
          let param = new FormData()
          param.append("brand_id",id)
          deleteBrand(param).then(result =>{
            if(result.data.errno === 0){
              this.brandList.splice(index,1)
              this.$message.success("删除成功")
            }else{
              this.$message.error(result.data.message)
              this.$router.push('/login');
            }
          })
        })
            .catch(err => {
              this.$message.error(err)
            })
      }
      this.selectID = null
    },
    handleEdit(index,row){
      this.editForm.brand_id = Object.assign({},row).brand_id
      this.editForm.brand_name = Object.assign({},row).brand_name
      this.editFormVisible = true
    },
    handleAdd(){
      this.addFormVisible = true
      this.addLoading = false
      this.addForm = {
        brand_name: ""
      }
      this.fileList = []
    },
    editSubmit(formName){
      this.$refs[formName].validate((valid) =>{
            if (valid){
              this.$confirm("确认提交吗？","提示",{}).then(
                  () => {
                    this.editLoading = true
                    let param = new FormData()
                    param.append("brand_id",this.editForm.brand_id)
                    param.append("brand_name",this.editForm.brand_name)
                    updateBrand(param).then((response) =>{
                      this.editLoading = false
                      if(response.data.errno === 0){
                        this.$message({
                          message:"提交成功",
                          type:"success"
                        })
                        this.$refs[formName].resetFields()
                        this.editFormVisible = false
                        this.getData()
                      }else{
                        this.$router.push('/login');
                      }
                    })
                        .catch(err => {
                          this.$message.error(err)
                        })
                  }
              )
            }
          }
      )
    },
    addSubmit(){
      this.$refs.addForm.validate((isValid) => {
        if(isValid){
          this.$confirm("确认提交？","提示",{}).then(() => {
            this.addLoading = true;
            let param = new FormData()
            param.append("brand_name",this.addForm.brand_name)
            param.append("brand_image",this.fileList[0].raw)
            addBrand(param).then((response) => {
            if (response.data.errno === 0){
              this.addLoading = false
              this.$message({
                message:"提交成功",
                type:"success"
              })
              this.$refs['addForm'].resetFields()
              this.fileList = []
              this.addLoading= false
              }else{
                this.$router.push('/login');
              }
            })
          })
              .catch( () => {
                this.$message({
                  message:"提交失败！",
                  type:"error"
                })
                this.addLoading= false
              })
        }
      })
    },
    // 上传文件之前 将图片转换为16进制格式
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
    handleUploadChange(file){
      this.fileList.push(file)
    },
    handleUploadRemove(file){
      const index = this.fileList.indexOf(file);
      this.fileList.splice(index,1);
    },
    handlePictureCardPreview(file){
      this.uploadImageUrl = file.url;
      this.uploadVisible = true;
    },
    handleCurrentChange(value){
      this.currentPage = value;
    },
    handleSizeChange(value){
      this.pageSize = value
    }
  },
  mounted() {
    this.getData()
  },
  computed:{
    brandList(){
      const start = (this.currentPage-1) * this.pageSize
      const end = start + this.pageSize
      return this.data.slice(start,end)
    }
  }
}
</script>

<style scoped>

</style>