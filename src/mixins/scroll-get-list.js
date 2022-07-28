export default {
  data() {
    return {
      total: 0,
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      noMore: false,
      isPending: false,
    };
  },
  methods: {
    async getList(isRefresh = false) {
      if (isRefresh) {
        this.page = {
          pageNum: 1,
          pageSize: this.page.pageSize,
        };
        this.total = 0;
        this.noMore = false;
        this.isPending = false;
        this.list = [];
      }
      // 正在加载
      if (this.isPending) {
        return;
      }
      // 没有更多
      if (this.noMore) {
        return;
      }
      this.isPending = true;
      try {
        const res = await this.apiGetList(this.page, isRefresh);
        this.total = res.count;
        this.list = res.data ? [...this.list, ...res.data] : this.list;
        this.isPending = false;
        if (res.data.length < this.page.pageSize) {
          this.noMore = true;
        } else {
          this.page.pageNum++;
        }
      } catch (e) {
        this.isPending = false;
      }
    },
  },
};
