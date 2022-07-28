<template>
  <div class="main-table">
    <el-table
      v-loading="isPending"
      ref="table"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      :data="list"
      :border="tableConfig.border"
      :stripe="tableConfig.stripe"
      :height="pxToRem(tableConfig.height || 690) + 'rem'"
      @row-click="rowClick"
      @selection-change="$emit('selection-change', $event)"
    >
      <el-table-column v-if="tableConfig && tableConfig.selection" type="selection" width="55">
      </el-table-column>
      <el-table-column
        v-if="tableConfig && tableConfig.index"
        type="index"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-for="(item, index) in handlerTableList"
        :key="index"
        :prop="item.prop"
        :align="item.align || 'center'"
        :show-overflow-tooltip="item['show-overflow-tooltip']"
        :label="item.label || ''"
        :width="item.width || ''"
      >
        <template slot-scope="scope">
          <scope :render="item.render" :scope="scope"></scope>
        </template>
      </el-table-column>
    </el-table>

    <div class="page-wrapper">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes, jumper"
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        :total="count"
        :page-sizes="size"
        @current-change="pageChange"
        @size-change="sizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import getList from '@/mixins/get-list';
import { pxToRem } from '@/lib/utils';

const scope = Vue.extend({
  props: ['render', 'scope'],
  render(h) {
    if (this.render) {
      return this.render(h, this.scope);
    }
    return h('span', {
      domProps: {
        innerHTML: this.scope.row[this.scope.column.property],
      },
    });
  },
});

export default {
  mixins: [getList],
  props: {
    /**
     * table 的配置
     * selection 是否多选（默认false）
     * */
    tableConfig: {
      type: Object,
      default: () => ({
        border: true,
        selection: false,
        index: false,
        stripe: false,
      }),
    },
    /**
     * table列表
     * prop       对应列内容的字段名
     * label      显示的标题
     * width      对应列的宽度
     * render     对该项进行vue render操作 默认参数为（h: createElement函数 , scope table每行的参数与element相同）
     *            详见https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
     * */
    tableList: {
      type: Array,
      default: () => [],
    },
    /**
     * 每页数量
     * */
    pageSize: {
      type: Number,
      default: 10,
    },
    /**
     * 分页组
     * */
    size: {
      type: Array,
      default: () => [10, 30, 50, 100],
    },
    /**
     * 请求table的函数
     * */
    action: {
      type: Function,
      default: null,
    },
  },
  components: {
    scope,
  },
  computed: {
    handlerTableList() {
      return this.tableList.filter((item) => !item.hiddenItem);
    },
  },
  data() {
    return {
      pxToRem,
      page: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.page.pageSize = this.pageSize;
  },
  methods: {
    apiGetList(page) {
      return this.action(page);
    },
    rowClick(row, column, cell, event) {
      this.$emit('row-click', row, column, cell, event);
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep.el-table {
  background-color: transparent;

  tr {
    background-color: transparent;
  }

  &::before {
    border-bottom: none;
  }
}

::v-deep {
  .el-table tr {
    &:hover {
      background-color: rgba(159, 190, 251, 0.3);
    }
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: rgba(159, 190, 251, 0.1);
  }
}

::v-deep .el-table th {
  background-color: transparent;
}

::v-deep .btn-prev {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::v-deep .btn-next {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::v-deep.page-wrapper {
  @include flexCenter;
  justify-content: center;
  padding: 20px;

  .el-pagination {
    display: flex !important;
    align-items: center !important;

    .el-pagination__jump {
      display: flex !important;
      align-items: center !important;
      margin-left: 0 !important;
    }
  }
}

.tag {
  @include tag;
}
</style>
