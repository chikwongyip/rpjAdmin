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
            <upload-file :sendData="fileList"></upload-file>
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
          addForms:{
            name:"",
            docs:""
          },
          fileList:[]
        }
      },
      methods:{
        getData(){
          getDocs().then( res => {
            if(res.data.errno === 0){
              this.data = res.data.data
              this.dataSearch = res.data.data
            }
          })
        },
        handleSelectionChange(selected){
          this.selectedList = selected
        },
        handleEdit(index,row){

        },
        handleDel(index, row){

        },
        handleCurrentChange(value){
          this.currentPage = value;
        },
        handleSizeChange(value){
          this.pageSize = value
        },
        getFile(){

        }
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