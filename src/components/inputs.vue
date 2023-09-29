<template>
  <div class="inputs">
    <div>
      <el-text class="mx-1" size="large">歌曲名:</el-text>
      <el-input v-model="name" placeholder="歌曲名" clearable />
      <el-text class="mx-1" size="large">作者名:</el-text>
      <el-input v-model="auther" placeholder="作者名" clearable />
      <el-text class="mx-1" size="large">专辑名:</el-text>
      <el-input v-model="album" placeholder="专辑名" clearable />
      <el-text class="mx-1" size="large">文案(可以留空):</el-text>
      <el-input v-model="letter" placeholder="文案(可以留空)" clearable />
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-text class="mx-1" size="large">上传歌曲:</el-text>
          <el-tooltip content="上传歌曲(可拖拽上传)" placement="right">
            <el-upload
              style="height: 120px; width: 120px"
              ref="musicUploader"
              :auto-upload="false"
              :show-file-list="true"
              :on-change="handleMusic"
              :on-exceed="handleMusicExceed"
              :limit="1"
              drag
            >
              <i class="iconfont icon-add">&#xe664;</i>
            </el-upload>
          </el-tooltip>
        </div>
        <div>
          <el-text class="mx-1" size="large">上传歌词(只支持.txt)(可留空):</el-text>
          <el-tooltip content="上传歌词(可拖拽上传)" placement="right">
            <el-upload
              style="
                height: 120px;
                width: 120px;
                margin-left: auto;
                margin-right: 0;
              "
              ref="lrcUploader"
              :auto-upload="false"
              :show-file-list="true"
              :on-change="handleLrc"
              :on-exceed="handleLrcExceed"
              :limit="1"
              drag
            >
              <i class="iconfont icon-add">&#xe664;</i>
            </el-upload>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center">
      <el-text class="mx-1" size="large">歌曲封面:</el-text>
      <el-tooltip content="上传图片(可拖拽上传)" placement="right">
        <el-upload
          ref="avatarUploader"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleAvatar"
          :limit="1"
          :on-exceed="handleAvatarExceed"
          drag
        >
          <img v-if="avatar" :src="avatar" class="avatar" />
          <i v-else class="iconfont icon-add">&#xe664;</i>
        </el-upload>
      </el-tooltip>
      <el-text class="mx-1" size="large">播放器背景:</el-text>
      <el-text class="mx-1" size="small">(留空则为封面图片)</el-text>
      <el-tooltip content="上传图片(可拖拽上传)" placement="right">
        <el-upload
          ref="bgUploader"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleBg"
          :limit="1"
          :on-exceed="handleBgExceed"
          drag
        >
          <img v-if="bgImg" :src="bgImg" class="avatar" />
          <i v-else class="iconfont icon-add">&#xe664;</i>
        </el-upload>
      </el-tooltip>
      <el-button
        @click="saveData"
        type="primary"
        style="margin: 10px 0"
        size="large"
      >
        <i class="iconfont icon-save">&#xe63b;</i>&nbsp;保存
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { genFileId } from "element-plus";
import store from "@/utils/store.js";
import { useRouter } from "vue-router";

const router = useRouter();

// dom
const avatarUploader = ref();
const musicUploader = ref();
const lrcUploader = ref();
const bgUploader = ref();

// variate
let name = ref(store.name);
let auther = ref(store.auther);
let avatar = ref(store.avatar);
let album = ref(store.album);
let lrc = ref(store.lrc);
let music = ref(store.music);
let letter = ref(store.letter);
let bgImg = ref(store.bgImg);

const saveData = () => {
  const inputs = [
    { value: name.value, prop: "name", message: "歌名" },
    { value: auther.value, prop: "auther", message: "作者" },
    { value: avatar.value, prop: "avatar", message: "头像" },
    { value: album.value, prop: "album", message: "专辑" },
    { value: music.value, prop: "music", message: "音乐" },
  ];

  for (let input of inputs) {
    if (!input.value || input.value === "") {
      ElMessage.error(`不要着急嘛，先把${input.message}填完嘛~`);
      return;
    }

    // 将所有变量存入 store 中
    store[input.prop] = input.value;
  }
  // 将歌词、文案、背景图片存入 store 中
  store.lrc = lrc.value;
  store.letter = letter.value;
  store.bgImg = bgImg.value ? bgImg.value : avatar.value; // 判断背景是否上传

  router.push("/img"); // 前往图片页
  ElMessage.success("保存成功啦~(＾－＾)V 不要刷新页面哦 刷新了就没有了");
};

// 上传音乐
const handleMusic = (files) => {
  handleUpload(files, "audio", musicUploader, music);
};

const handleMusicExceed = (files) => {
  handleExceed(files, "audio", musicUploader);
};

// 上传歌词
const handleLrc = (files) => {
  if (files.raw.type.includes("text")) {
    const reader = new FileReader();
    reader.onload = () => {
      lrc.value = reader.result;
    };
    reader.readAsText(files.raw);
  } else {
    ElMessage.error("只能上传txt文件哦~");
    lrcUploader.value.clearFiles();
    return;
  }
};

const handleLrcExceed = (files) => {
  const file = files[0];
  if (file.type.includes("text")) {
    lrcUploader.value.clearFiles(); // 清空上传列表
    file.uid = genFileId(); // 拿到新上传的文件ID
    lrcUploader.value.handleStart(file); // 重新开始上传
    const reader = new FileReader(); // 重新读取文件内容
    reader.onload = () => {
      lrc.value = reader.result;
    };
    reader.readAsText(file);
  } else {
    ElMessage.error("诶怎么是个新东西啊？");
    return;
  }
};

// 上传封面
const handleAvatar = (files) => {
  handleUpload(files, "image", avatarUploader, avatar);
};

const handleAvatarExceed = (files) => {
  handleExceed(files, "image", avatarUploader);
};

// 上传背景

const handleBg = (files) => {
  handleUpload(files, "image", bgUploader, bgImg);
};

const handleBgExceed = (files) => {
  handleExceed(files, "image", bgUploader);
};

// 处理上传文件事件(文件更新也会触发)
const handleUpload = (files, type, dom, variate) => {
  if (files.raw.type.includes(type)) {
    variate.value = URL.createObjectURL(files.raw); // 转换成blob
  } else {
    ElMessage.error("不要上传一些奇怪的东西啊喂！");
    dom.value.clearFiles();
    return;
  }
};

// 处理上传多个文件事件(只能上传单文件)
const handleExceed = (files, type, dom) => {
  const file = files[0];
  if (file.type.includes(type)) {
    dom.value.clearFiles(); // 清空上传列表
    file.uid = genFileId(); // 拿到新上传的文件ID
    dom.value.handleStart(file); // 重新开始上传
    dom.value = URL.createObjectURL(file);
  } else {
    ElMessage.error("诶怎么是个新东西啊？");
    return;
  }
};
</script>

<style lang="less" scoped>
.inputs {
  text-align: start;
  margin: auto;
  width: 500px;
  padding: 3px;
  display: flex;
  .el-input {
    margin: 5px 0;
  }
}
</style>
<!-- el-upload没有唯一标识 所以单独写样式 -->
<style lang="less">
.avatar-uploader {
  width: fit-content;
  background: #fff;
  margin: 0 5px;
  width: 100px;
  height: 100px;
}
.el-upload {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  .el-upload-dragger {
    height: 100%;
    width: 100%;
  }
  .avatar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    border-color: var(--el-color-primary);
  }
}
.inputs {
  .icon-add {
    color: #8c939d;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 25px;
  }
}
</style>
