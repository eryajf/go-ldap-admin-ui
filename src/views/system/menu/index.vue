<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">批量删除</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="ID" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip prop="title" label="菜单标题" width="150" />
        <el-table-column show-overflow-tooltip prop="name" label="名称" />
        <el-table-column show-overflow-tooltip prop="icon" label="图标" />
        <el-table-column show-overflow-tooltip prop="path" label="路由地址" />
        <el-table-column show-overflow-tooltip prop="component" label="组件路径" />
        <el-table-column show-overflow-tooltip prop="redirect" label="重定向" />
        <el-table-column show-overflow-tooltip prop="sort" label="排序" align="center" width="80" />
        <el-table-column show-overflow-tooltip prop="status" label="禁用" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success':'danger'">{{ scope.row.status === 1 ? '否':'是' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="hidden" label="隐藏" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.hidden === 1 ? 'danger':'success'">{{ scope.row.hidden === 1 ? '是':'否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="noCache" label="缓存" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.noCache === 1 ? 'danger':'success'">{{ scope.row.noCache === 1 ? '否':'是' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="activeMenu" label="高亮菜单" />
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template slot-scope="scope">
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

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="580px">
        <el-form ref="dialogForm" :inline="true" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="80px">
          <el-form-item label="菜单标题" prop="title">
            <el-input v-model.trim="dialogFormData.title" placeholder="菜单标题(title)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="名称(name)" style="width: 220px" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model.number="dialogFormData.sort" controls-position="right" :min="1" :max="999" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="450"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="dialogFormData.icon" style="width: 440px;" placeholder="点击选择图标" readonly>
                <svg-icon v-if="dialogFormData.icon" slot="prefix" :icon-class="dialogFormData.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="路由地址" prop="path">
            <el-input v-model.trim="dialogFormData.path" placeholder="路由地址(path)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="组件路径" prop="component">
            <el-input v-model.trim="dialogFormData.component" placeholder="组件路径(component)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="重定向" prop="redirect">
            <el-input v-model.trim="dialogFormData.redirect" placeholder="重定向(redirect)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="禁用" prop="status">
            <el-radio-group v-model="dialogFormData.status">
              <el-radio-button label="是" />
              <el-radio-button label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="隐藏" prop="hidden">
            <el-radio-group v-model="dialogFormData.hidden">
              <el-radio-button label="是" />
              <el-radio-button label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="缓存" prop="noCache">
            <el-radio-group v-model="dialogFormData.noCache">
              <el-radio-button label="是" />
              <el-radio-button label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="高亮菜单" prop="activeMenu">
            <el-input v-model.trim="dialogFormData.activeMenu" placeholder="高亮菜单(activeMenu)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="上级目录" prop="parentId">
            <!-- <el-cascader
              v-model="dialogFormData.parentId"
              :show-all-levels="false"
              :options="treeselectData"
              :props="{ checkStrictly: true, label:'title', value:'ID', emitPath:false}"
              clearable
              filterable
            /> -->
            <treeselect
              v-model="dialogFormData.parentId"
              :options="treeselectData"
              :normalizer="normalizer"
              style="width:440px"
              @input="treeselectInput"
            />
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
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMenuTree, createMenu, updateMenuById, batchDeleteMenuByIds } from '@/api/system/menu'

export default {
  name: 'Menu',
  components: {
    IconSelect,
    Treeselect
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      loading: false,

      // 上级目录数据
      treeselectData: [],
      treeselectValue: 0,

      // dialog对话框
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        title: '',
        name: '',
        icon: '',
        path: '',
        component: 'Layout',
        redirect: '',
        sort: 999,
        status: '否',
        hidden: '否',
        noCache: '是',
        alwaysShow: 2,
        breadcrumb: 1,
        activeMenu: '',
        parentId: 0
      },
      dialogFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入访问路径', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        component: [
          { required: false, message: '请输入组件路径', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        redirect: [
          { required: false, message: '请输入重定向', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        activeMenu: [
          { required: false, message: '请输入高亮菜单', trigger: 'blur' },
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级目录', trigger: 'change' }
        ]

      },

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
    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getMenuTree()
       
        this.tableData = data
        this.treeselectData = [{ ID: 0, title: '顶级类目', children: data.menuTree }]
      } finally {
        this.loading = false
      }
    },

    // 新增
    create() {
      this.dialogFormTitle = '新增菜单'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // 修改
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.title = row.title
      this.dialogFormData.name = row.name
      this.dialogFormData.icon = row.icon
      this.dialogFormData.path = row.path
      this.dialogFormData.component = row.component
      this.dialogFormData.redirect = row.redirect
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status === 1 ? '否' : '是'
      this.dialogFormData.hidden = row.hidden === 1 ? '是' : '否'
      this.dialogFormData.noCache = row.noCache === 1 ? '否' : '是'
      this.dialogFormData.activeMenu = row.activeMenu
      this.dialogFormData.parentId = row.parentId

      this.dialogFormTitle = '修改菜单'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // 提交表单
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.submitLoading = true

          if (this.dialogFormData.ID === this.dialogFormData.parentId) {
            return this.$message({
              showClose: true,
              message: '不能选择自身作为自己的上级目录',
              type: 'error'
            })
          }

          if (this.dialogFormData.component === '') {
            this.dialogFormData.component = 'Layout'
          }

          this.dialogFormData.status = this.dialogFormData.status === '是' ? 2 : 1
          this.dialogFormData.hidden = this.dialogFormData.hidden === '是' ? 1 : 2
          this.dialogFormData.noCache = this.dialogFormData.noCache === '是' ? 2 : 1

          const dialogFormDataCopy = { ...this.dialogFormData, parentId: this.treeselectValue }
          let message = ''
          try {
            if (this.dialogType === 'create') {
              const { msg } = await createMenu(dialogFormDataCopy)
               message= msg
            } else {
              const { msg } = await updateMenuById(dialogFormDataCopy)
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
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        title: '',
        name: '',
        icon: '',
        path: '',
        component: 'Layout',
        redirect: '',
        sort: 999,
        status: '否',
        hidden: '否',
        noCache: '是',
        alwaysShow: 2,
        breadcrumb: 1,
        activeMenu: '',
        parentId: 0
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
        const menuIds = []
        this.multipleSelection.forEach(x => {
          menuIds.push(x.ID)
        })
        let  message= ''
        try {
          const { msg } = await batchDeleteMenuByIds({ menuIds: menuIds })
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
        const { msg } = await batchDeleteMenuByIds({ menuIds: [Id] })
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

    // 选中图标
    selected(name) {
      this.dialogFormData.icon = name
    },

    // treeselect
    normalizer(node) {
      return {
        id: node.ID,
        label: node.title,
        children: node.children
      }
    },
    treeselectInput(value) {
      this.treeselectValue = value
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
