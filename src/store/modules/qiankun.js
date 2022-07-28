// init state
const state = {
  globalState: {}, // 全局数据
};

// getters
const getters = {};

// actions
const actions = {};

// mutations
const mutations = {
  SET_GLOBAL(state, val) {
    state.globalState = val;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
