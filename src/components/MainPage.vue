<template>
  <section>
    <div>
      <el-image
        :src="company.logo"
        style="width: 300px; height: 300px"
        :load="imageOnLoad"
      >
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </div>
  </section>
</template>

<script>
import { getCompany } from "@/api/admin";
export default {
  data() {
    return {
      company: {
        name: "",
        logo: ""
      }
    };
  },
  methods: {
    getData() {
      getCompany().then((response) => {
        this.company.name = response.data.data[0].name;
        this.company.logo =
          process.env.VUE_APP_IMG + response.data.data[0].logo;
      });
    },
    imageOnLoad(e) {
      console.log(e);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style scoped></style>
