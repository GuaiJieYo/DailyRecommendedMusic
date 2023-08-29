<template>
  <div>
    <h1>这里是主页兼配置页面</h1>
    <el-text class="mx-1" size="small">也是404页面</el-text><br />
  </div>
  <Inputs></Inputs>
</template>

<script setup>
import Inputs from "@/components/inputs.vue";
</script>

<style lang="less" scoped>
div {
  margin: 50px auto;
  text-align: center;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #303133;
  }
}
</style>
