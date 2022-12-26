<template>
  <div class="container">
    <cop-form v-model="formData" :formList="formList" @search="handleSearch">
      <template #lijiatneLabel>李佳998</template>
      <template #lijiatne>
        <el-input v-model="formData.lijiatne"></el-input>
      </template>
    </cop-form>
  </div>
</template>

<script>
import copForm from "@/components/appForm";
import { formList } from "./config";
export default {
  components: { copForm },
  data() {
    return {
      formData: {}
    };
  },
  computed: {
    formList
  },
  methods: {
    handleSearch() {
      console.log(this.formData);
    }
  }
};
</script>

<style lang="css" scoped>
.container {
  padding: 0 16px;
}
</style>
