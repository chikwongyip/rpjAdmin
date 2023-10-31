<template>
  <el-upload
    class="upload-demo"
    action=""
    :auto-upload="false"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    :on-change="handleUploadChange"
    multiple
    :limit="2"
    :file-list="fileList"
  >
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
  </el-upload>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    fileList: []
  },
  data() {
    return {
      uploadList: []
    };
  },
  methods: {
    handleUploadChange(file) {
      this.uploadList = this.fileList;
      this.uploadList.push(file);
      this.$emit("sendfile", this.uploadList);
    },
    beforeUpload(file) {
      console.log(file.type);
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("仅支持JPG和PNG格式图片！");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过2MB！");
        return false;
      }
      return true;
    },
    handleRemove(file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1);
      this.$emit("sendfile", this.uploadList);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
};
</script>

<style scoped></style>
