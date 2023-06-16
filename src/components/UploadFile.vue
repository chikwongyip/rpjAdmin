<template>
  <el-upload
      class="avatar-uploader"
      action="{uploadUrl}"
      :on-success="handleSuccess"
      :on-error="handleError"
      :headers="headers"
      :multiple="true"
      :show-file-list="false">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<span>点击上传</span></div>
    <div class="el-upload__tip" slot="tip">只能上传 xls/xlsx 文件，且不超过 50MB</div>
  </el-upload>
</template>

<script>
export default {
  name: "UploadFile",
  data() {
    return {
      uploadUrl: 'http://localhost:8000/api/admin/upload', // 上传文件的接口地址
      headers: { // 设置请求头
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
  },
  methods: {
    handleSuccess(response) {
      // 上传成功后的响应处理代码
      // this.$emit('upload-success', response);
      console.log(response)
    },
    handleError(err) {
      // 上传失败后的响应处理代码
      console.log('上传失败', err);
    },
  },
}
</script>

<style scoped>

</style>