import { createRouter, createWebHistory } from "vue-router";
// 导入组件
import Home from "@/views/index.vue";
import Img from "@/views/img.vue";
import Player from '@/views/player.vue'

// 路由列表
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      title: "主页",
    },
  },
  {
    path: "/img",
    name: "img",
    component: Img,
    meta: {
      title: "生成封面",
    },
  },
  {
    path: "/player",
    name: "player",
    component: Player,
    meta: {
      title: "播放器",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: Home,
    meta: {
      title: "主页",
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用的是历史记录模式 对SEO友善点
  routes,
});

router.beforeEach((to, from, next) => {
  window.document.title = `${to.meta.title} - SomeMusic`;
  next();
});

export default router;
