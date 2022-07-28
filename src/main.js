import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Scroll from '@/components/Scroll/index';
import VueXss from 'vue-xss';
import ElementUI from 'element-ui';
import { fullImgUrl } from '@/lib/utils';
import { VueXssOptions } from '@/lib/common';
import { setCommonData, initGlState } from '@/qiankun';
import './public-path';
import '@/iconfont/font.scss';
import '@/styles/global.scss';
import '@/iconfont/iconfont.css';

Vue.use(ElementUI);
Vue.use(VueXss, VueXssOptions);
Vue.config.productionTip = false;
Vue.prototype._filePrefix = (url, type = '') => {
  if (type === 'user') {
    url = url || 'production/default-avatar.png';
  }
  if (type === 'unit') {
    url = url || 'production/default-unit.png';
  }
  return fullImgUrl(url);
};
Vue.prototype.$ELEMENT = {
  size: 'medium',
  zIndex: 999,
};
const Bus = new Vue();
Vue.use(Bus);
Vue.prototype.$Bus = Bus;

Vue.component('Scroll', Scroll);

let instance = null;

function render() {
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(`#${process.env.VUE_APP_NAME}`);
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props) {
  setCommonData(props);
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  props.container.style.width = '100%';
  props.container.style.height = '100%';
  initGlState(props);
  render();
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  instance.$destroy();
  instance = null;
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
// export async function update(props) {
//   console.log('loadMicroApp', props);
// }
