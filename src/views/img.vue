<template>
  <div class="console">
    <el-text class="mx-1" size="large"> 为什么这个预览图片这么大？ </el-text>
    <el-text class="mx-1" size="large">
      因为这是一个dom 我直接将dom转成的图片 缩小dom会使图片不清晰
    </el-text>
    <el-text class="mx-1" size="large">
      这个页面只能生成图片 并不能播放哦~
    </el-text>
    <el-text type="danger" class="mx-1" size="large">
      如果生成的图片文字消失了 再生成一次就好了(这个BUG暂时无解)
    </el-text>
    <el-text class="mx-1" size="large">
      ps:(右键 审查元素 然后点击左上角的小鼠标 然后选择文字就可以更改了
      但是不会保存哦)
    </el-text>
    <el-button
      :loading="isLoading"
      @click="createImage"
      type="success"
      size="large"
      >生成</el-button
    >
  </div>
  <div class="cover">
    <div id="cover">
      <h1 class="copy">@GuaiJieOvO</h1>
      <div
        class="musiccover"
        :style="'background-image: url(' + bgImg + ')'"
      ></div>
      <div class="avatar">
        <h1>「 日推歌单 」</h1>
        <!-- 封面 -->
        <img :src="avatar" :alt="name" />
        <div class="duration">
          <!-- 当前时间 -->
          <div class="ntime">00:30</div>
          <!-- 进度条 -->
          <div class="p-container">
            <div
              :style="'width:' + (30 / endTime) * 100 + '%'"
              class="progress"
            ></div>
          </div>
          <!-- 结束时间 -->
          <div class="etime">{{ endTime ? formatTime(endTime) : "00:00" }}</div>
        </div>
        <!-- 控制按钮 -->
        <div class="btn">
          <i class="iconfont icon-pre">&#xe685;</i>
          <i class="iconfont icon-stop">&#xe86d;</i>
          <i class="iconfont icon-next">&#xe687;</i>
        </div>
      </div>
      <div class="info">
        <div>
          <p>{{ letter }}</p>
          <h1>{{ name }}</h1>
          <h2>《{{ album }}》</h2>
          <h3>-{{ auther }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import store from "@/utils/store.js";
import { useRouter } from "vue-router";
import domtoimage from "dom-to-image";

const router = useRouter();

// dom
let endTime = ref();

// variate
let name = ref(store.name);
let auther = ref(store.auther);
let avatar = ref(store.avatar);
let album = ref(store.album);
let lrc = ref(store.lrc);
let music = ref(store.music);
let letter = ref(store.letter);
let bgImg = ref(store.bgImg);
let isLoading = ref(false);

// 格式化时间
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

const createImage = (e) => {
  ElMessage.info("正在生成中~");
  isLoading.value = true;
  e.target.blur();
  domtoimage
    .toPng(document.getElementById("cover"), { width: 1440, height: 900 })
    .then(function (dataUrl) {
      const now = Date.now();
      ElMessage.success(`生成成功！正在下载文件:cover-${now}`);
      isLoading.value = false;
      const link = document.createElement("a");
      link.download = `cover-${now}.png`;
      link.href = dataUrl;
      link.click();
      link.remove();
    })
    .catch(() => {
      ElMessage.error("生成失败！ 请手动截图");
    });
};

onMounted(() => {
  const inputs = [
    name.value,
    auther.value,
    avatar.value,
    album.value,
    music.value,
  ];

  if (inputs.some((input) => !input || input === "")) {
    ElMessage.error("不要着急嘛，先把信息填完嘛~");
    router.push("/");
  } // 检查是否填写信息 未填写就跳转回主页面

  // 读取音频时长
  const audio = new Audio();
  audio.src = music.value;
  audio.addEventListener("loadedmetadata", getDuration);
  function getDuration() {
    endTime.value = this.duration | 0; // 取整
    audio.removeEventListener("loadedmetadata", getDuration);
  }
});
</script>

<style lang="less" scoped>
@import url("@/styles/img.less");
</style>
