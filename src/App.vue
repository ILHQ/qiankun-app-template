<template>
  <!--  当前id必须不重名，保持跟项目名一致-->
  <div :id="appId">
    <div
      :class="appId + '-screenshot-container'"
      :style="{ width: screenshot.w, height: screenshot.h }"
    >
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex';
import { getRealUrl } from '@/lib/common';

export default {
  name: 'App',
  data() {
    return {
      getRealUrl,
      appId: process.env.VUE_APP_NAME,
      scale: 1,
      screenshot: {
        w: !window.__POWERED_BY_QIANKUN__ ? '1920px' : '100%',
        h: !window.__POWERED_BY_QIANKUN__ ? '1080px' : '100%',
      },
    };
  },
  mounted() {
    if (!window.__POWERED_BY_QIANKUN__) {
      // 初始化
      this.resize();
      // 改变窗口大小时重新设置 rem
      window.onresize = () => {
        this.resize();
      };
    }
  },
  methods: {
    ...mapMutations({
      setScale: 'index/SET_SCALE',
    }),
    resize() {
      // 当前页面宽度相对于 1920宽和1080高的缩放比例，可根据自己需要修改。
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      const scaleW = clientWidth / 1920;
      const scaleH = clientHeight / 1080;
      if (scaleW < scaleH) {
        this.scale = scaleW;
      } else {
        this.scale = scaleH;
      }
      this.scale = Math.max(0.8, this.scale);
      this.setScale(this.scale);
      this.screenshot = {
        w: 1920 * this.scale + 'px',
        h: 1080 * this.scale + 'px',
      };
      // 设置页面根节点字体大小 指最高放大比例为2，可根据实际业务需求调整
      document.documentElement.style.fontSize = process.env.VUE_APP_BASE_SIZE * this.scale + 'px';
    },
  },
};
</script>
<style scoped lang="scss">
#app {
  position: relative;
  margin: 0;
  width: 100%;
  height: 100%;
}

.app-screenshot-container {
  position: relative;
  margin: 0 auto;
  overflow: hidden;
}
</style>
