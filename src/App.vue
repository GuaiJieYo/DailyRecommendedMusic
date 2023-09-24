<template>
  <controller></controller>
  <div class="router">
    <router-view></router-view>
  </div>
</template>

<script setup>
import controller from "@/components/controller.vue";
</script>

<style lang="less" scoped>
.router {
  position: relative;
  padding: 5px;
  width: calc(100% - 10px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
