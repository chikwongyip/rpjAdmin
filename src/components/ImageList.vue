<template>
    <section>
  <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-select v-model="filters.product_id"
                      placeholder="请选择产品类型">
              <el-option
                v-for="item in productList"
                :key="item.product_id"
                :label="item.product_name"
                :value="item.product_id">
              </el-option> 
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="searchData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- table content -->
      <el-table :data="imageList" highlight-current-row v-loading="listLoading" @selection-change="handleSelectionChange">
        <el-table-column prop="pic_id" label="图片ID" width="140"></el-table-column>
        <el-table-column prop="product_name" label="产品名称" width="120"></el-table-column>
        <el-table-column prop="product_pic" label="产品图片"></el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.index, scope.row)">查看</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- navigation -->
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
      <el-dialog title="图片" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <div>
          <el-image
              :src="editForm.url"
              style="width:500px;height:500px"
              :load="imageOnLoad"
          >
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
      </el-dialog>
      <!-- 新增 -->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="产品名称" prop="product_name">
            <el-select v-model="addForm.product_id"
                       placeholder="请选择产品类型">
              <el-option
                v-for="item in productList"
                :key="item.product_id"
                :label="item.product_name"
                :value="item.product_id">
              </el-option> 
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-upload
                action=""
                :multiple="true"
                :auto-upload="false"
                :show-file-list="true"
                :limit="6"
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
    import { getProductList, addImages, deleteImages } from '@/api/admin'; 
    
    export default {
      name:"BrandList",
      inject:['reload'],
      data(){
        return{
          filters:{
            product_id:''
          },
          data:[],
          productList:[],
          listLoading:false,
          editFormVisible:false,
          currentPage:1,           //当前页
          pageSize:10,             //每页显示条数
          editForm:{
            url:""
          },
          addFormVisible:false,
          addLoading:false,
          addForm:{
            product_id:"",
            image:{}
          },
          fileList:[],
          uploadVisible:false,
          uploadImageUrl:"",
                //校验规则
          addFormRules:{
            product_id:[
              { requrie:true,message:"请选择产品名称", trigger:'blur' },
            ],
            image:[
              { requrie:true,message:"请上传图片", trigger:'blur' },
            ]
          }
        }
      },
      methods:{
        getData(){
          getProductList().then( res => {
            if(res.data.errno === 0){
              this.productList = res.data.data.product;
              this.dataSearch = res.data.data.images
              this.data = res.data.data.images
              // this.imageList = res.data.data.images;
              // this.dataSearch = res.data.data.product;
              // this.images = res.data.data.images;
              // this.brand = res.data.data.brand;
              // this.category = res.data.data.category; 
            }
          })
        },
        searchData(){
          this.listLoading = true
          let searchResult = []
          this.data = this.dataSearch
          searchResult = this.data.filter(item => {
            return (item.product_id == this.filters.product_id)
          })
          console.log(searchResult)
          this.data = searchResult
          this.listLoading = false
        },
        handleSelectionChange(selected){
          this.selectedList = selected
        },
        handleDel(index,row){
          let id = Object.assign({},row).pic_id
          if (id){
            this.$confirm('确认删除该记录吗？','提示',{type:"warning"}
            ).then(() => {
              let param = new FormData()
              param.append("pic_id",id)
              deleteImages(param).then(result =>{
                if(result.data.errno === 0){
                  this.$message.success("删除成功")
                  this.reload()
                }else{
                  this.$message.error(result.data.message)
                  localStorage.removeItem('token')
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
          this.editForm.url = process.env.VUE_APP_IMG + Object.assign({},row).product_pic
          this.editFormVisible = true
        },
        handleAdd(){
          this.addFormVisible = true
          this.addLoading = false
          this.addForm = {
            product_id: "",
            image:{}
          }
          this.fileList = []
        },
        addSubmit(){
          this.$refs.addForm.validate((isValid) => {
            if(isValid){
              this.$confirm("确认提交？","提示",{}).then(() => {
                this.addLoading = true;
                let param = new FormData()
                param.append("product_id",this.addForm.product_id)
                this.fileList.forEach((file, index) => {
                  param.append(`image${index}`, file.raw)
                })
                // if(this.fileList[0]){
                //   param.append("image",this.fileList[0].raw) 
                // }
                addImages(param).then((response) => {
                if (response.data.errno === 0){
                  this.addLoading = false
                  this.$message({
                    message:"提交成功",
                    type:"success"
                  })
                  this.$refs['addForm'].resetFields()
                  this.fileList = []
                  this.addLoading= false
                  this.reload()
                  }else{
                    this.$refs['addForm'].resetFields()
                    this.fileList = []
                    localStorage.removeItem('token')
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
        },
        imageOnLoad(e){
          console.log(e)
        }
      },
      mounted(){
        this.getData()
      },
      computed:{
        imageList(){
          const start = (this.currentPage-1) * this.pageSize
          const end = start + this.pageSize
          return this.data.slice(start,end)   
        }
    }
  }
</script>
  
<style scoped>
  
</style>