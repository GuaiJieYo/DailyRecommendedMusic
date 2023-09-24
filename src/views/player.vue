<template>
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
      <div class="info">
        <p class="name">{{ name }}</p>
        <h2 class="auther">{{ auther }}《{{ album }}》</h2>
      </div>
      <div class="duration">
        <!-- 当前时间 -->
        <div class="ntime">
          {{ nowTime ? formatTime(nowTime | 0) : "00:00" }}
        </div>
        <!-- 进度条 -->
        <div class="p-container">
          <div
            :style="'width:' + (nowTime / endTime) * 100 + '%'"
            class="progress"
          ></div>
        </div>
        <!-- 结束时间 -->
        <div class="etime">{{ endTime ? formatTime(endTime) : "00:00" }}</div>
      </div>
      <!-- 控制按钮 -->
      <div class="btn">
        <i class="iconfont icon-pre">&#xe685;</i>
        <i @click="play" @contextmenu.prevent.stop="restart" class="iconfont">
          {{ isPlay ? "&#xe86d;" : "&#xe67a;" }}
        </i>
        <i class="iconfont icon-next">&#xe687;</i>
      </div>
    </div>
    <div class="lrc">
      <div ref="lrcDom" class="box">
        <div
          :time="item.tag"
          v-for="(item, index) in formattedLrc"
          :key="index"
          :hover="item.content == '' ? false : true"
          :class="item.tag == '0.00' ? 'active' : ''"
          :index="index"
          @click="turnTo(item.tag)"
        >
          <h1>{{ item.content }}</h1>
          <h2>{{ item.translation }}</h2>
        </div>
      </div>
    </div>
    <audio
      ref="audio"
      :src="music"
      @loadedmetadata="getEndTime"
      @ended="
        () => {
          isPlay = false;
        }
      "
    ></audio>
    <button
      @click="
        () => {
          router.back();
        }
      "
      class="close"
    >
      &#xe685;
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import store from "@/utils/store";
import lrcToArry from "@/utils/lrc2arry";
import { useRouter } from "vue-router";

// dom
let audio = ref();
let lrcDom = ref();

const router = useRouter();
// 变量
let name = ref(store.name);
let auther = ref(store.auther);
let avatar = ref(store.avatar);
let album = ref(store.album);
let lrc = ref(store.lrc);
let music = ref(store.music);
let bgImg = ref(store.bgImg);

let isPlay = ref(false);
let formattedLrc = null;

// 音频变量
let nowTime = ref();
let endTime = ref();

// 格式化音频时长
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

// 获取结束时间
const getEndTime = () => {
  endTime.value = audio.value.duration | 0;
};

// 获取播放进度
const timeUpdate = (e) => {
  // 这里不取整 是因为要保证进度条的精度
  const currentTime = e.target.currentTime;
  nowTime.value = Math.floor(currentTime * 100) / 100; // 播放进度
  scrollLrc(currentTime);
};

// 播放
const play = () => {
  if (isPlay.value) {
    audio.value.pause();
    isPlay.value = false;
  } else {
    audio.value.play();
    isPlay.value = true;
    lrcDom.value.scrollTo({ // 直接滚动到active处
      top:
        lrcDom.value.querySelector(".active").offsetTop -
        lrcDom.value.clientHeight / 2,
    });
  }
};

// 重头开始播放
const restart = () => {
  audio.value.currentTime = 0;
};

// 音频跳转
const turnTo = (tag) => {
  audio.value.currentTime = tag;
  audio.value.play();
  isPlay.value = true;
};

// 歌词滚动部分
const scrollLrc = (currentTime) => {
  for (let i = 0; i < formattedLrc.length; i++) {
    if (currentTime > parseInt(formattedLrc[i].tag)) {
      const active = lrcDom.value.querySelector(".active");
      active.classList.remove("active");
      const newActive = lrcDom.value.querySelectorAll("div")[i];
      newActive.classList.add("active");
      lrcDom.value.scrollTo({
        top: newActive.offsetTop - lrcDom.value.clientHeight / 1.5,
        behavior: "smooth",
      });
    }
  }
};

onMounted(() => {
  const inputs = [
    name.value,
    auther.value,
    avatar.value,
    album.value,
    lrc.value,
    music.value,
  ];

  if (inputs.some((input) => !input || input === "")) {
    ElMessage.error("不要着急嘛，先把信息填完嘛~");
    router.push("/");
    return;
  } // 检查是否填写信息 未填写就跳转回主页面

  ElMessage({
    showClose: true,
    message: '按F11打开全屏',
    type: 'success',
  })
  const menu = document.querySelector("#menu");
  const menuControler = menu.querySelector(".show");
  if (!menu.classList.contains("move")) {
    menu.classList.add("move"); // 隐藏menu
  }
  menuControler.style.display = "none";

  formattedLrc = lrcToArry(store.lrc);

  document.querySelector("audio").addEventListener("timeupdate", timeUpdate);
});

onUnmounted(() => {
  const menu = document.querySelector("#menu");
  const menuControler = menu.querySelector(".show");
  if (menu.classList.contains("move")) {
    menu.classList.remove("move"); // 显示menu
  }
  menuControler.style.display = "block";
});
</script>

<style lang="less" scoped>
@import url("@/styles/player.less");
</style>
