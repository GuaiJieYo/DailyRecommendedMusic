import { reactive } from "vue";

// 储存变量的地方XD
const store = reactive({
  avatar: null, // blob
  name: null, // string
  auther: null, // string
  album: null, // string
  lrc: null, // string
  music: null, // blob
  letter: null, // blob
  bgImg: null, // blob
});

export default store;
