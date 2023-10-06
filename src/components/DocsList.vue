<template>
    <section>
  <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="品牌名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="searchData">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- list display -->
      <el-table :data="dataList" highlight-current-row v-loading="listLoading" @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="文档ID" width="140"></el-table-column>
        <el-table-column prop="name" label="文档名称" width="120"></el-table-column>
        <el-table-column prop="docs" label="文件"></el-table-column>
        <el-table-column prop="date" label="上传日期"></el-table-column>
        <el-table-column prop="size" label="文件大小(m)"></el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.index, scope.row)">显示</el-button>
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

      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="文档名称" prop="name">
            <el-form-item label="文档名称">
              <el-input v-model="addForm.name" autocomplete="off"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <upload-file :file-list="fileList"  @sendfile="sendfile"></upload-file>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <el-dialog title="文件" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <div>
          <iframe :src="editForm.docs" frameborder="0"></iframe>
        </div>
      </el-dialog>
    </section>
</template>
  
  <script>
    import { getDocs, addDocs, deleteDocs} from '../api/admin'
    import UploadFile from './UploadFile.vue'
    export default {
      name:"DocsList",
      inject:['reload'],
      components:{
        UploadFile
      },

      data(){
        return{
          filters:{
            name:""
          },
          listLoading:false,
          currentPage:1,
          pageSize:10,
          data:[],
          dataSearch:[],
          addFormVisible:false,
          addForm:{
            name:""
          },
          fileList:[],
          editFormVisible:false,
          editForm:{
            name:"",
            docs:""
          },
          addLoading:false,
          addFormRules:{
            name:[
              { requrie:true,message:"请选择产品名称", trigger:'blur' },
            ]
          }
        }
      },
      methods:{
        getData(){
          getDocs().then( res => {
            if(res.data.errno === 0){
              console.log(res.data)
              this.data = res.data.data
              this.dataSearch = res.data.data
            }
          })
        },
        searchData(){
          this.data = this.dataSearch
          if (this.filters.name) {
                this.searchResult = []
                const regExp = new RegExp(this.filters.name, "g");
                this.searchResult = this.data.filter(item => {
                    return regExp.test(item.product_name)
                })
                this.data = this.searchResult
            }
        },
        handleAdd(){
          this.addFormVisible = true
          this.addLoading = false
          this.addForm.name = ""
          this.fileList = []
        },
        addSubmit(){
          this.$refs.addForm.validate((isValid) => {
            if(isValid){
              this.$refs.addForm.validate((isValid) => {
                if(isValid){
                  let params = new FormData()
                  params.append('name',this.addForm.name)
                  if(this.fileList[0]){
                    params.append('docs',this.fileList[0].raw)
                    params.append('size',this.fileList[0].size)
                  }
                  
                  addDocs(params).then(res => {
                    if(res.data.errno === 0){
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
                }
              })
            }
          })
        },
        handleDel(index, row){
          let id = Object.assign({},row).id
          if (id){
            this.$confirm('确认删除该记录吗？','提示',{type:"warning"}
            ).then(() => {
              let param = new FormData()
              param.append("id",id)
              deleteDocs(param).then(result =>{
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
        handleSelectionChange(selected){
          this.selectedList = selected
        },
        handleEdit(index,row){
          this.editForm.docs = process.env.VUE_APP_IMG + Object.assign({},row).docs
          this.editFormVisible = true
        },
        handleCurrentChange(value){
          this.currentPage = value;
        },
        handleSizeChange(value){
          this.pageSize = value
        },
        sendfile(file){
          this.fileList = []
          this.fileList = file 
        }
      },
      mounted(){
        this.getData()
      },
      computed:{
        dataList(){
          const start = (this.currentPage-1) * this.pageSize
          const end = start + this.pageSize
          return this.data.slice(start,end)   
        }
    }
    }
  
  </script>
  
  <style scoped>
  </style>