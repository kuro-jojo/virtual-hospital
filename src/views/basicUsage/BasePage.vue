<template>
  <div class="base">
    <!-- <h2>Basic Rendering Demo</h2>
    <el-divider content-position="center"
      >Image loading takes time, please avoid frequent page switching that may
      cause the DOM to not be found after the data is returned
    </el-divider>
    <el-alert
      title="The demo is a single-page system. If there is an error message after switching pages, it is mainly related to destroying and reloading Cornerstone. Simply refresh the page."
      type="danger"
    >
    </el-alert> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "BaseApp",
};
</script>

<style scoped lang="scss"></style>
