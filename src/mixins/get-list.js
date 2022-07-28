export default {
  data() {
    return {
      count: 0,
      list: [],
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      filter: {},
      isPending: false,
    };
  },
  methods: {
    async getList(isRefresh = 1) {
      if (isRefresh) {
        this.isPending = false;
        this.list = [];
        this.page = {
          pageNum: 1,
          pageSize: this.page.pageSize,
        };
      }
      this.isPending = true;
      try {
        const res = await this.apiGetList(this.page);
        this.count = res.count;
        this.list = res.data;
        this.isPending = false;
      } catch (e) {
        this.isPending = false;
      }
    },
    pageChange(page) {
      this.page.pageNum = page;
      this.getList(0);
    },
    sizeChange(size) {
      this.page.pageSize = size;
      this.getList(1);
    },
    toSearch(filter) {
      this.page.pageNum = 1;
      this.filter = filter;
      this.getList(0);
    },
  },
};
