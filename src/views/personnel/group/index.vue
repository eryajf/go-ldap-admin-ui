<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model.trim="params.groupName" clearable placeholder="名称" @clear="search" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model.trim="params.remark" clearable placeholder="描述" @clear="search" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="groupName" label="创建人" />
        <el-table-column show-overflow-tooltip sortable prop="remark" label="描述" />
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-tooltip content="添加" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-setting" circle type="info" @click="addUp(scope.row)" />
            </el-tooltip>
            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="删除" effect="dark" placement="top">
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
      <!-- 新增 -->
      <el-dialog :title="dialogFormTitle" :visible.sync="updateLoading">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="名称" prop="groupName">
            <el-input v-model.trim="dialogFormData.groupName"  placeholder="名称" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model.trim="dialogFormData.remark" type="textarea" placeholder="描述" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="名称" prop="groupName">
            <el-input v-model.trim="dialogFormData.groupName"  :disabled="true" placeholder="名称" />
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model.trim="dialogFormData.remark" type="textarea" placeholder="描述" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { groupList, groupAdd,groupUpdate, groupDel,useGroupList,useGroupRole, groupInfo, delGroup} from '@/api/personnel/group'

export default {
  name: 'Group',
  filters: {
    methodTagFilter(val) {
      if (val === 'GET') {
        return ''
      } else if (val === 'POST') {
        return 'success'
      }else {
        return 'info'
      }
    }
  },
  data() {
    return {
      // 查询参数
      params: {
        groupName: '',
        remark:'',
        pageNum: 1,
        pageSize: 10
      },
      // 表格数据
      tableData: [],
      total: 0,
      loading: false,
      updateLoading:false,//新增
      // dialog对话框
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        groupName: '',
        remark: ''
      },
      dialogFormRules: {

        groupName: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      
        remark: [
          { required: false, message: '说明', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ]
      },

      // 删除按钮弹出框
      popoverVisible: false,
      // 表格多选
      multipleSelection: [],
      dialogTransfer:'',//穿梭框头部
      dialogTransferVisible: false,
     
      transParams:{
        groupId:'',
        nickname:''
      },
      renderFunc(h, option) {
      return <span>{option.key} - {option.label}</span>;
      },
      userArrInfo: [],//初始人员列表数据
      data: [],//转化后人员列表数据
      value3:[],//右侧默认人员列表数据
      userId:[],//送到后台 -> 勾选的数据code数组
      ui: {
        submitLoading: false
      },
      statusTrans:'',
    }
  },
  created() {
    this.getTableData()
    
  },
  methods: {
    // 查询
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const { data } = await groupList(this.params)
        this.tableData = data.groups
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    // 新增
    create() {
      this.dialogFormTitle = '新增分组'
      this.updateLoading=true //新增的展示
      this.dialogType = 'create'
    }, 
    // 修改
    update(row) {
   
      this.dialogFormData.ID = row.ID
      this.dialogFormData.groupName = row.groupName
      this.dialogFormData.remark = row.remark

      this.dialogFormTitle = '修改分组'
      this.dialogType = 'update'
      this.dialogFormVisible = true

      
    },
    //穿梭框
    addUp(row){
    
      this.dialogTransfer='用户管理'
      this.dialogTransferVisible=true
      this.transParams.groupId=row.ID
      this.transParams.nickname=row.remark
      this.$router.push({ path:'/userList', query:row })
    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          let message = ''
          this.submitLoading = true
          try {
            if (this.dialogType === 'create') {
              const { msg } = await groupAdd(this.dialogFormData)
              message = msg
            } else {
              const { msg } = await groupUpdate( this.dialogFormData)
              message = msg
            }
          } finally {
            this.submitLoading = false
          }

          this.resetForm()
          this.getTableData()
          this.$message({
            showClose: true,
            message: message,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '表单校验失败',
            type: 'error'
          })
          return false
        }
      })
    },

    // 提交表单
    cancelForm() {
      this.resetForm()
    },

    resetForm() {
      this.dialogFormVisible = false
      this.updateLoading=false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {

        groupName: '',
        remark: ''
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
        const groupIds = []
        this.multipleSelection.forEach(x => {
          groupIds.push(x.ID)
        })
        let  message= ''
        try {
          const { msg } = await groupDel({ groupIds: groupIds })
          message =msg 
        } finally {
          this.loading = false
        }

        this.getTableData()
        this.$message({
          showClose: true,
          message: message,
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
      let  message= ''
      try {
        const { msg } = await groupDel({ groupIds: [Id] })
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
   .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>
