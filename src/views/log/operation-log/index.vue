<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="请求人">
          <el-input v-model.trim="params.username" clearable placeholder="请求人" @clear="search" />
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model.trim="params.ip" clearable placeholder="IP地址" @clear="search" />
        </el-form-item>
        <el-form-item label="请求路径">
          <el-input v-model.trim="params.path" clearable placeholder="请求路径" @clear="search" />
        </el-form-item>
        <el-form-item label="请求状态">
          <el-input v-model.trim="params.status" clearable placeholder="请求状态" @clear="search" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="username" label="请求人" />
        <el-table-column show-overflow-tooltip sortable prop="ip" label="IP地址" />
        <el-table-column show-overflow-tooltip sortable prop="path" label="请求路径" />
        <el-table-column show-overflow-tooltip sortable prop="status" label="请求状态" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status | statusTagFilter" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="startTime" label="发起时间">
          <template slot-scope="scope">
            {{ parseGoTime(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="timeCost" label="请求耗时(ms)" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.timeCost | timeCostTagFilter" disable-transitions>{{ scope.row.timeCost }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="desc" label="说明" />
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip content="删除" effect="dark" placement="top">
              <el-popconfirm title="确定删除吗？" @onConfirm="singleDelete(scope.row.ID)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[1, 5, 10, 30]"
        layout="total, prev, pager, next, sizes"
        background
        style="margin-top: 10px;float:right;margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getOperationLogs, batchDeleteOperationLogByIds } from '@/api/log/operationLog'
import { parseGoTime } from '@/utils/index'

export default {
  name: 'OperationLog',
  filters: {
    statusTagFilter(val) {
      if (val === 200) {
        return 'success'
      } else if (val === 400) {
        return 'warning'
      } else if (val === 401) {
        return 'danger'
      } else if (val === 403) {
        return 'danger'
      } else if (val === 500) {
        return 'danger'
      } else {
        return 'info'
      }
    },
    timeCostTagFilter(val) {
      if (val <= 200) {
        return 'success'
      } else if (val > 200 && val <= 1000) {
        return ''
      } else if (val > 1000 && val <= 2000) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      // 查询参数
      params: {
        username: '',
        ip: '',
        path: '',
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,

      // 删除按钮弹出框
      popoverVisible: false,
      // 表格多选
      multipleSelection: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    parseGoTime,
    // 查询
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getOperationLogs(this.params)
  
        this.tableData = data.logs
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    // 批量删除
    batchDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const operationLogIds = []
        this.multipleSelection.forEach(x => {
          operationLogIds.push(x.ID)
        })
        let msg = ''
        try {
          const { message } = await batchDeleteOperationLogByIds({ operationLogIds: operationLogIds })
          msg = message
        } finally {
          this.loading = false
        }

        this.getTableData()
        this.$message({
          showClose: true,
          message: msg,
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 单个删除
    async singleDelete(Id) {
      this.loading = true
      let message = ''
      try {
        const {  msg} = await batchDeleteOperationLogByIds({ operationLogIds: [Id] })
        message = msg
      } finally {
        this.loading = false
      }

      this.getTableData()
      this.$message({
        showClose: true,
        message: message,
        type: 'success'
      })
    },

    // 分页
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
  .container-card{
    margin: 10px;
  }

  .delete-popover{
    margin-left: 10px;
  }
</style>
