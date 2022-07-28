import Vue from 'vue';
import store from '@/store/index';

/**
 * 接受主应用的传参
 * @param props 主应用传的公共数据
 */
// eslint-disable-next-line no-unused-vars
export function setCommonData(props) {}

/**
 * 设置微应用全局状态
 * @param props 主应用穿的公共数据
 */
export function initGlState(props) {
  const { onGlobalStateChange, setGlobalState } = props;
  // 将方法挂载到原型上 子应用只可以设置主应用上设置过的属性
  Vue.prototype.$setGlobalState = setGlobalState;
  // 监听全局状态的改变
  onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log('app_schedule:', state, prev);
    store.commit('qiankun/SET_GLOBAL', state);
  }, true);
}
