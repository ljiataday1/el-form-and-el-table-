<template>
  <div class="app-table">
    <div class="tabel-set" v-if="filterConfig">
      <!-- 表头配置 -->
      <span class="el-icon-setting" @click="handleClick"></span>
      <ul v-show="panelShow">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <el-checkbox-group v-model="checkedColcumn">
          <el-checkbox
            v-for="column in tableColumns"
            :label="column.prop"
            :disabled="column.disabled"
            :key="column.prop"
            >{{ column.label }}</el-checkbox
          >
        </el-checkbox-group>
        <div class="footer">
          <el-button size="mini" type="primary" @click="confirm"
            >确定</el-button
          >
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
      </ul>
    </div>
    <!-- 表格 -->
    <el-table
      ref="elTable"
      :data="renderTableData"
      :row-key="rowKey"
      class="app-table"
      border
      v-loading="loading"
      v-on="$listeners"
      v-bind="$attrs"
    >
      <!-- 序号 -->
      <el-table-column type="index" v-if="hasIndex"></el-table-column>
      <!-- 多选按钮 -->
      <el-table-column type="selection" v-if="hasSelection"></el-table-column>

      <!-- 列表 -->
      <el-table-column
        v-for="column in showColumns"
        :label="column.label"
        :prop="column.prop"
        :key="column.prop"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :resizable="column.resizable"
        :align="column.align"
        :selectable="column.selectable"
        :reserve-selection="column.reserveSelection"
        :show-overflow-tooltip="column.showOverflowTooltip"
      >
        <!-- 插槽 -->
        <template slot-scope="scope">
          <slot
            v-if="column.type === 'slot'"
            :name="column.slotName || column.prop"
            v-bind="scope"
          >
          </slot>
          <!-- 普通数据 -->
          <span v-else>
            {{ getValue(column, scope.row) }}
          </span>
        </template>
             <!-- 自定义表头 -->
        <template #header v-if="$slots[column.prop+ 'Header']">
          <slot :name="column.prop + 'Header'"></slot>
        </template>
        <!-- 多级表头 -->
        <template v-if="column.children">
          <el-table-column
            :label="child.label"
            :prop="child.prop"
            v-for="child in column.children"
            :key="child.prop"
            :fixed="child.fixed"
            :sortable="child.sortable"
            :resizable="child.resizable"
            :align="child.align"
            :selectable="child.selectable"
            :reserve-selection="child.reserveSelection"
            :show-overflow-tooltip="child.showOverflowTooltip"
          >
            <template slot-scope="{ row }">
              {{ getValue(child, row) }}
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="pageChange"
        @current-change="currentChange"
        :layout="layout"
        background
        :total="total"
        :page-size="pageSize"
        :pagerCount="7"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { Service } from '@/utils/http'

export default {
  props: {
    // 自定义请求
    httpRequest: {
      type: Function,
      default: function () {}
    },
    // 是否显示序号
    hasIndex: {
      type: Boolean,
      default: true
    },
    // 是否显示多选
    hasSelection: {
      type: Boolean,
      default: true
    },
    // 表格配置
    tableColumns: {
      type: Array,
      require: true
    },
    // 表格key
    rowKey: {
      type: String,
      default: 'id'
    },
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 表格配置
    filterConfig: {
      type: Boolean,
      default: true
    },
    // 是否进来马上请求
    delay: {
      type: Boolean,
      default: true
    },
    // 分页
    layout: {
      type: String,
      default: ' prev, pager, next, sizes, jumper, total'
    },
    // 静态数据
    tableData: {
      type: Array,
      default: () => []
    },
    // 异步请求地址
    action: {
      type: String,
      default: ''
    },
    // action 方式传入的请求参数
    params: {
      type: Object,
      default: () => {}
    },
    // 是否全部设置超出一行显示tooltip
    showOverflowTooltip: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checkAll: false,
      checkedColcumn: [],
      panelShow: false,
      isIndeterminate: true,
      renderTableData: [],
      showColumns: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      loading: false
    }
  },
  watch: {
    // 监听表头发生变化
    tableColumns: {
      handler (val) {
        val.forEach((column, index) => {
          this.setMinwidth(column, index)
          if (this.showOverflowTooltip) {
            column.showOverflowTooltip === undefined && (column.showOverflowTooltip = this.showOverflowTooltip)
          }
        })
        this.showColumns = val.filter(column => column.visible !== false)
      },
      immediate: true
    },
    // 监听选中发生变化
    checkedColcumn: {
      handler (val) {
        let checkedCount = val.length
        this.checkAll = checkedCount === this.tableColumns.length
        this.isIndeterminate =
          checkedCount > 0 && checkedCount < this.tableColumns.length
      },
      immediate: true
    }
  },
  created () {
    this.delay && this.getTableData()
  },
  methods: {
    // 分页大小发生变化
    pageChange (val) {
      this.pageSize = val
      this.getTableData()
    },
    // 当前页发生变化
    currentChange (val) {
      this.pageNum = val
      this.getTableData()
    },
    // 自定义请求数据
    async getTableData () {
      this.loading = true
      if (this.action) {
        Service({
          url: this.action,
          method: 'get',
          params: { ...this.params, limit: this.pageSize, offset: this.pageNum }
        }).then(res => {
          this.$emit('getTabelData', res)
          this.renderTableData = res.songs
          this.total = res.total || 90000
        })
      } else if (this.tableData.length) {
        const data = this.deepClone(this.tableData)
        const pageNum = this.pageNum === 1 ? 0 : this.pageNum * this.pageSize - this.pageSize
        this.renderTableData = data.slice(pageNum, this.pageNum * this.pageSize)
        this.total = this.tableData.length
      } else {
        const { data, total } = await this.httpRequest(
          this.pageSize,
          this.pageNum
        )
        this.renderTableData = data
        this.total = total
      }
      this.loading = false
    },
    // 确定表头配置
    confirm () {
      this.tableColumns.forEach(item => {
        if (!this.checkedColcumn.includes(item.prop)) {
          this.$set(item, 'visible', false)
        } else {
          this.$set(item, 'visible', true)
        }
      })
      this.showColumns = this.tableColumns.filter(
        column => column.visible !== false
      )
      this.panelShow = false
    },
    // 取消表头配置
    cancel () {
      this.panelShow = false
    },
    // 点击设置显示隐藏
    handleClick () {
      if (!this.panelShow) {
        this.checkedColcumn = this.tableColumns
          .filter(item => item.visible !== false)
          .map(item => item.prop)
      }
      this.panelShow = !this.panelShow
    },
    // 全部选中变化
    handleCheckAllChange (val) {
      const defaultArr = []
      const checkAll = []
      this.tableColumns.forEach(item => {
        checkAll.push(item.prop)
        item.disabled && defaultArr.push(item.prop)
      })
      this.checkedColcumn = val ? checkAll : defaultArr
      this.isIndeterminate = false
    },
    // 不同类型的数据可以进行不同处理
    getValue (column, row) {
      console.log('column', column)
      console.log('row', row)
      switch (column.type) {
        case 'date':
          return row[column.prop] && row[column.prop].toLocaleDateString()
        default:
          return row[column.prop]
      }
    },
    // 设置最小宽度
    setMinwidth (column, index) {
      if (column.width) {
        return
      }
      const text = column.label
      const p = document.createElement('span')
      p.innerText = text
      document.body.append(p)
      column.minWidth = p.offsetWidth + 20 // 左右padding 10像素
      // 有排序时
      if (column.sortable) {
        column.minWidth += 12
      }
      // 有设置按钮时
      if (this.filterConfig && this.tableColumns.length - 1 === index) {
        column.minWidth += 40
      }
      p.remove()
    },
    // 清空选择
    clearSelection () {
      this.$refs.elTable.clearSelection()
    },
    // 用于切换多选选中
    toggleRowSelection (row, selected) {
      this.$refs.elTable.toggleRowSelection(row, selected)
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection () {
      this.$refs.elTable.toggleAllSelection()
    },
    // 用于可展开表格与树形表格
    toggleRowExpansion (row, expanded) {
      this.$refs.elTable.toggleRowExpansion(row, expanded)
    },
    // 用于单选表格，设定某一行为选中行
    setCurrentRow (row) {
      this.$refs.elTable.setCurrentRow(row)
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort () {
      this.$refs.elTable.clearSort()
    },
    // 不传入参数时用于清空所有过滤条件
    clearFilter (columnKey) {
      this.$refs.elTable.clearFilter(columnKey)
    },
    // 对table进行重新布局
    doLayout () {
      this.$refs.elTable.doLayout()
    },
    // 排序
    sort (prop, order) {
      this.$refs.elTable.sort(prop, order)
    },
    // 深度克隆
    deepClone (value) {
      return JSON.parse(JSON.stringify(value))
    }
  }
}
</script>

<style lang="css">
.app-table.el-table .cell {
  line-height: 1;
  font-size: 14px;
  padding: 0 12px;
}
.app-table.el-table .el-table__cell {
  padding: 11px 0;
}
.app-table.el-table th.el-table__cell {
  background-color: #f9f9f9;
}
.app-table.el-table.el-table--border .el-table__cell {
  border-right: 0;
}
.app-table.el-table .el-table__header-wrapper .el-table__cel {
  position: relative;
}
.app-table.el-table .el-table__header-wrapper:hover .el-table__cell::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 70%;
  background-color: #ccccd8;
}
.app-table {
  position: relative;
}
.tabel-set {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 1px;
  right: 0;
  z-index: 10;
  text-align: center;
  line-height: 40px;
  background-color: #f9f9f9;
  border-left: 1px solid #ebeef5;
  cursor: pointer;
}
.tabel-set ul {
  position: absolute;
  right: 0;
  border: 1px solid #ebeef5;
  padding: 0;
  background-color: #fff;
  margin: 0;
}
.tabel-set ul .el-checkbox-group {
  line-height: 0;
  max-height: 230px;
  overflow-y: auto;
}
.tabel-set ul .el-checkbox {
  width: 100%;
  border-bottom: 1px solid #ebeef5;
  padding: 0 12px;
  margin: 0;
  text-align: left;
  line-height: 40px;
}

.footer {
  white-space: nowrap;
  padding: 0 12px;
  text-align: right;
}
.footer .el-button--mini {
  padding: 5px 13px;
}
.footer .el-button + .el-button {
  margin-left: 6px;
}
.pagination {
  text-align: right;
  margin: 12px 0;
}
.pagination .el-pagination__jump {
  margin-left: 0;
}
</style>
