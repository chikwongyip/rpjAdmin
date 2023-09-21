<template>
  <el-upload
    class="upload-demo"
    action=""
    :auto-upload="false"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    multiple
    :limit="1"
    :file-list="fileList">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
  </el-upload>
</template>

<script>
export default {
    name: "UploadFile",
    data() {
        return {
          fileList:[]
        };
    },
    methods: {
      beforeUpload(file){
        console.log(file)
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
        this.fileList.push(file)
        this.$emit('sendFile',this.fileList)
        return true;
      },
      handleRemove(file){
        this.fileList.splice(this.fileList.indexOf(file),1)
        this.$emit('sendFile', this.fileList)
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    },
}
</script>

<style scoped>

</style>