import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/index',
  },
  {
    path: '/index',
    name: 'Index',
    component: () => import('@/pages/index/index'),
    meta: { title: '子应用' },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: window.__POWERED_BY_QIANKUN__
    ? `/${process.env.VUE_APP_NAME}/`
    : process.env.VUE_APP_BASE_URL,
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

// 获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
// 修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
