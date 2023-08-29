<template>
  <Transition name="move">
    <el-menu
      :default-active="defaultActive"
      id="menu"
      class="menu"
      :class="isShow ? '' : 'move'"
      :collapse="true"
      :router="true"
    >
      <el-menu-item index="/">
        <i class="iconfont icon-home">&#xe7c6;</i>
        <template #title>主页</template>
      </el-menu-item>
      <el-menu-item index="/img">
        <i class="iconfont icon-image">&#xe6bc;</i>
        <template #title>封面生成</template>
      </el-menu-item>
      <el-menu-item index="/player">
        <i class="iconfont icon-play">&#xe67a;</i>
        <template #title>播放器</template>
      </el-menu-item>
      <el-menu-item index="" class="show" @click="toggleShow">
        <i
          :style="`transform: rotate(${btnRotate})`"
          class="iconfont icon-pre"
        >&#xe685;</i>
      </el-menu-item>
    </el-menu>
  </Transition>
</template>

<script setup>
import { ref } from "vue";

let isShow = ref(true);
let btnRotate = ref("0");
let defaultActive = ref(location.pathname);

const toggleShow = () => {
  isShow.value = !isShow.value;

  if (isShow.value) {
    btnRotate.value = "0";
  } else {
    btnRotate.value = "180deg";
  }
};
</script>

<style lang="less" scoped>
.menu {
  height: 100%;
  left: 0;
  transition: all 0.3s;
  z-index: 999;
  background-color: transparent!important;

  &.move {
    position: absolute;
    left: -69px;
  }

  &:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .show {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background: transparent;

    i {
      transition: transform 0.3s;
    }
  }
}
</style>
