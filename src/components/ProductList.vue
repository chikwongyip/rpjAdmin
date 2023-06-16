<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-dropdown split-button type="primary" @command="handleBrandCommand">
            {{ selectBrand }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,brand_id) in brand" :key="brand_id" :data-item="brand" :command="item">
                {{item.brand_name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-dropdown split-button type="primary" @command="handleCategoryCommand">
            {{ selectCategory }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,category_id) in category" :key="category_id" :data-item="category" :command="item">
                {{item.category_name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="productList" highlight-current-row v-loading="listLoading" @selection-change="handleSelectionChange">
      <el-table-column prop="top" label="置顶标志" width="100"></el-table-column>
      <el-table-column prop="product_id" label="产品id" width="100"></el-table-column>
      <el-table-column prop="brand_id" label="品牌id" width="100"></el-table-column>
      <el-table-column prop="category_id" label="类型id" width="100"></el-table-column>
      <el-table-column prop="product_name" label="产品名称" width="150"></el-table-column>
      <el-table-column prop="brand_name" label="品牌名称" width="150"></el-table-column>
      <el-table-column prop="category_name" label="类型名称" width="150"></el-table-column>
      <el-table-column prop="product_desc" label="产品描述" width="1000"></el-table-column>
      <el-table-column prop="product_standard" label="产品标准参数" width="300"></el-table-column>
      <el-table-column prop="product_model" label="产品型号" width="80"></el-table-column>
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
        <el-form-item label="product_id">
          <el-input v-model="editForm.product_id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="category_id">
          <el-input v-model="editForm.category_id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="brand_id">
          <el-input v-model="editForm.brand_id" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="editForm.product_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-dropdown split-button type="primary" @command="handleBrandCommand" :model="brand">
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-model="brand.brand_name"></el-dropdown-item>
              </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-dropdown split-button type="primary" @command="handleCategoryCommand" :model="category">
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-model="category.category_name"></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="产品描述">
          <el-input type="textarea"
                    placeholder="请输入产品描述"
                    maxlength="500"
                    show-word-limit
                    v-model="editForm.product_desc"
                    auto-complete="off"
                    :rows="20"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="产品规格">
          <el-input v-model="editForm.product_standard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input v-model="editForm.product_model" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增界面   -->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="200x" :rules="addFormRules" ref="addForm">
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="addForm.product_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-dropdown split-button type="primary" @command="handleBrandCommand">
            {{ selectBrand }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,brand_id) in brand" :key="brand_id" :data-item="brand" :command="item">
                {{item.brand_name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-dropdown split-button type="primary" @command="handleCategoryCommand">
            {{ selectCategory }}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item,category_id) in category" :key="category_id" :data-item="category" :command="item">
                {{item.category_name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="产品描述" prop="product_desc">
          <el-input type="textarea"
                    placeholder="请输入产品描述"
                    maxlength="500"
                    show-word-limit
                    v-model="addForm.product_desc"
                    auto-complete="off"
                    :rows="20"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="产品规格" prop="product_standard">
          <el-input v-model="addForm.product_standard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品型号" prop="product_model">
          <el-input v-model="addForm.product_model" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品图片">
          <el-upload
              action=""
              :multiple="true"
              :auto-upload="false"
              :show-file-list="true"
              :limit="6"
              :file-list="fileList"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-change="handleChange"
              :on-remove="handleRemove"
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
        <el-button type="primary" @click.native="addSubmit" :loading="addFormLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {getProductList, addProductList,deleteProduct} from "@/api/admin";

export default {
  name:"ProductList",
  data(){
    return{
      filters:{
        product_name:"",
        brand_id:"",
        category_id:"",
      },
      searchResult:[],
      selectID: "",
      selectedList:[],
      selectBrand:"请选择品牌",
      selectCategory:"请选择产品类型",
      currentPage:1,
      pageSize:10,
      listLoading:false,
      selectList:[],
      data:[],
      images:[],
      brand:[],
      category:[],
      logoUrl:"",
      previewImgList:[],
      fileList:[],
      addFormVisible:false,
      addFormLoading:false,
      addForm:{
        top:"",
        product_id:"",
        brand_id:"",
        category_id:"",
        product_name:"",
        product_desc:"",
        product_standard:"",
        product_model:""
      },
      // 增加校验逻辑
      addFormRules:{
        product_name:[
          { requrie:true,message:"请输入产品名称", trigger:'blur' }   //校验brand name 是否合法输入
        ]
      },
      editFormVisible:false,
      editFormLoading:false,
      editForm:{
        top:"",
        product_id:"",
        brand_id:"",
        category_id:"",
        product_name:"",
        product_desc:"",
        product_standard:"",
        product_model:""
      },
      //编辑校验
      editFormRules:{
        product_name:[
          { requrie:true,message:"请输入产品名称", trigger:'blur' }   //校验brand name 是否合法输入
        ]
      },
      uploadVisible:false,
      uploadImageUrl:""
    }
  },
  methods:{
    getData(){
      let param = {
        product_name:this.filters.product_name,
        brand_id:this.filters.brand_id,
        category_id:this.filters.category_id
      }
      return getProductList(param)
    },
    search(){
      if (this.filters.brand_id){
        this.searchResult = []
        this.searchResult = this.data.filter(item => {
          return item.brand_id = this.filters.brand_id
        })
        this.data = this.searchResult
      }
      if (this.filters.category_id){

        this.searchResult = this.data.filter(item => {
          return item.category_id = this.filters.category_id
        })
        this.data = this.searchResult
      }

      if (this.filters.product_name){
        this.searchResult = []
        const regExp =new RegExp(this.filters.product_name,"g");
        this.searchResult = this.data.filter(item => {
          return regExp.test(item.product_name)
        })
        this.data = this.searchResult
      }

    },
    handleCurrentChange(value){
      this.currentPage = value
    },
    handleSizeChange(value){
      this.pageSize = value
    },
    handleSelectionChange(selected){
      this.selectList = selected
    },
    handleAdd(){
      this.fileList = [];
      this.addFormVisible = true;
    },
    handleEdit(index,row){
      this.editForm = Object.assign({},row)
      this.editFormVisible = true
    },
    handleDel(index,row){
      let id = Object.assign({},row).product_id
      if (id){
        this.$confirm('确认删除该记录吗？','提示',{type:"warning"}
        ).then(() => {
          let param = {
            product_id:id
          }
          deleteProduct(param).then(result =>{
            if(result.data.errno === 0){
              this.$message.success("删除成功!")
              this.productList.splice(index,1)
            }
            this.$message.error("删除失败！" + result.data.message)
          })

        })
      }
      this.selectID = null
    },
    handleBrandCommand(item){
      this.addForm.brand_id = item.brand_id;
      this.editForm.brand_id = item.brand_id;
      this.selectBrand = item.brand_name;
      this.filters.brand_id = item.brand_id;

    },
    handleCategoryCommand(item){
      this.addForm.category_id = item.category_id;
      this.editForm.category_id = item.category_id
      this.selectCategory = item.category_name;
      this.filters.category_id = item.category_id;
    },
    handleRemove(file){
      const index = this.fileList.indexOf(file);
      this.fileList.splice(index,1);
    },
    handleChange(file){
      this.fileList.push(file)
    },
    handlePictureCardPreview(file){
      this.uploadImageUrl = file.url;
      this.uploadVisible = true;
    },
    beforeUpload(file){
      const isJpeg = file.type === "image/png" || file.type === "image/jpg" || file.type === "image/dmg";
      if(isJpeg){
        this.$message.error("请选择正确文件格式上传")
      }
    },
    addSubmit(){
      this.$refs.addForm.validate(isValid => {
        if (isValid){
          this.$confirm("确认提交？","提示",{}).then(()=>{
            this.addFormLoading = true;
            let formData = new FormData();
            formData.append("top",this.addForm.top);
            formData.append("product_name",this.addForm.product_name);
            formData.append("brand_id",this.addForm.brand_id);
            formData.append("category_id",this.addForm.category_id);
            formData.append("product_desc",this.addForm.product_desc);
            formData.append("product_model",this.addForm.product_model);
            formData.append("product_standard",this.addForm.product_standard);
            this.fileList.forEach((file,index)=>{
              formData.append(`file${index}`,file.raw)
            })
            addProductList(formData).then((response) => {
              if(response.data.errno === 0){
                this.$message({
                  message:"更新成功",
                  type:"success"
                })
              }
            })
                .catch(error => {
                  this.$message({
                    message:"更新失败" + error,
                    type:"error"
                  })
                })
          })
        }
      })
    },
    editSubmit(){
      this.$refs.editForm.validate( isValid => {
        if (isValid){
          this.$confirm("确认修改","提示",{}).then(() => {
            this.editFormLoading = true;
            let formData = new FormData();
            formData.append("top",this.editForm.top);
            formData.append("product_id",this.editForm.product_id);
            formData.append("product_name",this.editForm.product_name);
            formData.append("brand_id",this.editForm.brand_id);
            formData.append("category_id",this.editForm.category_id);
            formData.append("product_desc",this.editForm.product_desc);
            formData.append("product_model",this.editForm.product_model);
            formData.append("product_standard",this.editForm.product_standard);

          })
        }
      })
    }
  },
  mounted() {
    this.getData()
        .then(response => {
          if (response.data.errno === 0){
            this.data = response.data.data.product;
            this.images = response.data.data.images;
            this.brand = response.data.data.brand;
            this.category = response.data.data.category;
          }
          //TODO:加载失败
        })
        .catch(error => {
          console.log(error)
        })
  },
  watch:{
    filter:{
      handler(){
        this.search();
      }
    }
  },
  computed:{
    productList(){
      const start = (this.currentPage-1) * this.pageSize
      const end = start + this.pageSize
      return this.data.slice(start,end)
    }
  }
}
</script>

<style scoped>

</style>