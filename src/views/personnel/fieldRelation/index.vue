<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form
        size="mini"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="字段标识">
          <el-input
            v-model.trim="params.remark"
            clearable
            placeholder="描述"
            @clear="search"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            icon="el-icon-search"
            type="primary"
            @click="search"
          >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            icon="el-icon-plus"
            type="warning"
            @click="create"
          >新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="multipleSelection.length === 0"
            :loading="loading"
            icon="el-icon-delete"
            type="danger"
            @click="batchDelete"
          >批量删除</el-button>
        </el-form-item>
        <br>
      </el-form>

      <el-table
        v-loading="loading"
        :default-expand-all="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="ID"
        :data="infoTableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          show-overflow-tooltip
          width="52"
          sortable
          prop="ID"
          label="序号"
        />
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="CreatedAt"
          label="创建时间"
        />
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="Flag"
          label="字段标识"
        />
        <el-table-column show-overflow-tooltip sortable label="字段属性">
          <template slot-scope="props">
            <el-form>
              <el-form-item>
                <span>{{ props.row.Attributes }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template #default="scope">
            <el-tooltip content="编辑" effect="dark" placement="top">
              <el-button
                size="mini"
                icon="el-icon-edit"
                circle
                type="primary"
                @click="update(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              class="delete-popover"
              content="删除"
              effect="dark"
              placement="top"
            >
              <el-popconfirm
                title="确定删除吗？"
                @onConfirm="singleDelete(scope.row.ID)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  type="danger"
                />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增 -->
      <el-dialog :title="dialogFormTitle" :visible.sync="updateLoading">
        <el-link
          class="link-title"
          href="http://ldapdoc.eryajf.net/pages/84953d/"
          target="_blank"
          type="primary"
        >新增说明文档</el-link>
        <el-form
          ref="dialogForm"
          size="small"
          :model="dialogFormData"
          :rules="dialogFormRules"
          label-width="120px"
        >
          <el-form-item label="类型">
            <el-checkbox-group v-model="checked">
              <el-checkbox-button
                v-for="city in cities"
                :key="city"
                :label="city"
                @change="checkbox(city)"
              >
                {{ city }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>

          <template v-if="checked == '创建用户动态'">
            <el-form-item label="创建类型">
              <el-select
                v-model="userVal"
                placeholder="请选择"
                @change="changeUser(userVal)"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model.trim="dialogFormData.username"
                placeholder="用户名（拼音）"
              />
            </el-form-item>
            <el-form-item label="中文名字" prop="nickname">
              <el-input
                v-model.trim="dialogFormData.nickname"
                placeholder="中文名字"
              />
            </el-form-item>
            <el-form-item label="花名" prop="givenName">
              <el-input
                v-model.trim="dialogFormData.givenName"
                placeholder="花名"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model.trim="dialogFormData.mail" placeholder="邮箱" />
            </el-form-item>
            <el-form-item label="工号" prop="jobNumber">
              <el-input
                v-model.trim="dialogFormData.jobNumber"
                placeholder="工号"
              />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model.trim="dialogFormData.mobile"
                placeholder="手机号"
              />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <el-input
                v-model.trim="dialogFormData.avatar"
                placeholder="头像"
              />
            </el-form-item>
            <el-form-item label="地址" prop="postalAddress">
              <el-input
                v-model.trim="dialogFormData.postalAddress"
                placeholder="地址"
              />
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input
                v-model.trim="dialogFormData.position"
                placeholder="职位"
              />
            </el-form-item>
            <el-form-item label="源用户ID" prop="sourceUserId">
              <el-input
                v-model.trim="dialogFormData.sourceUserId"
                placeholder="源用户ID"
              />
            </el-form-item>
            <el-form-item label="源用户唯一ID" prop="sourceUnionId">
              <el-input
                v-model.trim="dialogFormData.sourceUnionId"
                placeholder="源用户唯一ID"
              />
            </el-form-item>
            <el-form-item label="说明" prop="introduction">
              <el-input
                v-model.trim="dialogFormData.introduction"
                type="textarea"
                placeholder="说明"
                :autosize="{ minRows: 3, maxRows: 6 }"
                show-word-limit
                maxlength="100"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="创建类型">
              <el-select
                v-model="groupVal"
                placeholder="请选择"
                @change="changeGroup(groupVal)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分组名称" prop="groupName">
              <el-input
                v-model.trim="dialogFormData.groupName"
                placeholder="分组名称"
              />
            </el-form-item>
            <el-form-item label="父部门ID" prop="sourceDeptParentId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptParentId"
                placeholder="父部门ID"
              />
            </el-form-item>
            <el-form-item label="部门ID" prop="sourceDeptId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptId"
                placeholder="部门ID"
              />
            </el-form-item>
            <el-form-item label="分组描述" prop="remark">
              <el-input
                v-model.trim="dialogFormData.remark"
                type="textarea"
                placeholder="分组描述"
                :autosize="{ minRows: 3, maxRows: 6 }"
                show-word-limit
                maxlength="100"
              />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button
            size="mini"
            :loading="submitLoading"
            type="primary"
            @click="submitForm('A')"
          >确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑 -->
      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-link
          class="link-title"
          href="http://ldapdoc.eryajf.net/pages/84953d/"
          target="_blank"
          type="primary"
        >修改说明文档</el-link>
        <el-form
          ref="dialogForm"
          size="small"
          :model="dialogFormData"
          :rules="dialogFormRules"
          label-width="120px"
        >
          <template v-if="checked == '创建用户动态'">
            <el-form-item label="类型">
              <el-button type="primary">创建用户动态</el-button>
            </el-form-item>

            <el-form-item label="创建类型">
              <el-select
                v-model="userVal"
                placeholder="请选择"
                @change="changeUser(userVal)"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model.trim="dialogFormData.username"
                placeholder="用户名"
              />
            </el-form-item>
            <el-form-item label="中文名字" prop="nickname">
              <el-input
                v-model.trim="dialogFormData.nickname"
                placeholder="中文名字"
              />
            </el-form-item>
            <el-form-item label="花名" prop="givenName">
              <el-input
                v-model.trim="dialogFormData.givenName"
                placeholder="花名"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model.trim="dialogFormData.mail" placeholder="邮箱" />
            </el-form-item>
            <el-form-item label="工号" prop="jobNumber">
              <el-input
                v-model.trim="dialogFormData.jobNumber"
                placeholder="工号"
              />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model.trim="dialogFormData.mobile"
                placeholder="手机号"
              />
            </el-form-item>
            <el-form-item label="头像" prop="avatar">
              <el-input
                v-model.trim="dialogFormData.avatar"
                placeholder="头像"
              />
            </el-form-item>
            <el-form-item label="地址" prop="postalAddress">
              <el-input
                v-model.trim="dialogFormData.postalAddress"
                placeholder="地址"
              />
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input
                v-model.trim="dialogFormData.position"
                placeholder="职位"
              />
            </el-form-item>
            <el-form-item label="源用户ID" prop="sourceUserId">
              <el-input
                v-model.trim="dialogFormData.sourceUserId"
                placeholder="源用户ID"
              />
            </el-form-item>
            <el-form-item label="源用户唯一ID" prop="sourceUnionId">
              <el-input
                v-model.trim="dialogFormData.sourceUnionId"
                placeholder="源用户唯一ID"
              />
            </el-form-item>
            <el-form-item label="说明" prop="introduction">
              <el-input
                v-model.trim="dialogFormData.introduction"
                type="textarea"
                placeholder="说明"
                :autosize="{ minRows: 3, maxRows: 6 }"
                show-word-limit
                maxlength="100"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="类型">
              <el-button type="primary">创建分组动态</el-button>
            </el-form-item>
            <el-form-item label="创建类型">
              <el-select
                v-model="groupVal"
                placeholder="请选择"
                @change="changeGroup(groupVal)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="分组名称" prop="groupName">
              <el-input
                v-model.trim="dialogFormData.groupName"
                placeholder="分组名称"
              />
            </el-form-item>
            <el-form-item label="父部门ID" prop="sourceDeptParentId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptParentId"
                placeholder="父部门ID"
              />
            </el-form-item>
            <el-form-item label="部门ID" prop="sourceDeptId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptId"
                placeholder="部门ID"
              />
            </el-form-item>
            <el-form-item label="分组描述" prop="remark">
              <el-input
                v-model.trim="dialogFormData.remark"
                type="textarea"
                placeholder="分组描述"
                :autosize="{ minRows: 3, maxRows: 6 }"
                show-word-limit
                maxlength="100"
              />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button
            size="mini"
            :loading="submitLoading"
            type="primary"
            @click="submitForm('B')"
          >确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  relationList,
  relationAdd,
  relationUp,
  relationDel
} from '@/api/personnel/fieldRelation'
const cityOptions = ['创建用户动态', '创建分组动态']
export default {
  name: 'FieldRelation',
  components: {
    // Treeselect
  },
  filters: {
    methodTagFilter(val) {
      if (val === 'GET') {
        return ''
      } else if (val === 'POST') {
        return 'success'
      } else {
        return 'info'
      }
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      options: [
        { label: '飞书', value: 'feishu_group' },
        { label: '钉钉', value: 'dingtalk_group' },
        { label: '企业微信', value: 'wecom_group' }
      ],
      userOptions: [
        { label: '飞书', value: 'feishu_user' },
        { label: '钉钉', value: 'dingtalk_user' },
        { label: '企业微信', value: 'wecom_user' }
      ],
      userVal: '',
      groupVal: '',
      updateId: '',
      checked: ['创建用户动态'], // 新增数据默认选中
      cities: cityOptions, // 新增默认选中
      // 查询参数
      params: {
        flag: '',
        pageNum: 1,
        pageSize: 1000 // 平常百姓人家应该不会有这么多数据吧,后台限制最大单次获取1000条
      },
      // 表格数据
      tableData: [],
      infoTableData: [],
      total: 0,
      loading: false,
      // 上级目录数据
      // treeselectData: [],
      // treeselectValue: 0,
      updateLoading: false, // 新增
      // dialog对话框
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        username: '', // 用户名(通常为用户名拼音) name_pinyin
        nickname: '', // 中文名字 name
        givenName: '', // 花名 name
        mail: '', // 邮箱 email
        jobNumber: '', // 工号 job_number
        mobile: '', // 手机号 mobile
        avatar: '', // 头像 avatar
        postalAddress: '', // 地址 work_place
        position: '', // 职位 title
        introduction: '', // 说明 remark
        sourceUserId: '', // 源用户ID  userid
        sourceUnionId: '', // 源用户唯一ID   unionid
        groupName: '', // 分组名称（通常为分组名的拼音）
        remark: '', // 分组描述
        sourceDeptId: '', // 部门ID
        sourceDeptParentId: '' // 父部门ID
      },
      //   dialogFromGroup: {

      //   },
      dialogFormRules: {
        sourceDeptParentId: [
          { required: true, message: '请输入父部门ID', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        sourceDeptId: [
          { required: true, message: '请输入部门ID', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入创建类型', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        givenName: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        postalAddress: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        sourceUserId: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: ['blur', 'change'] }
        ],
        sourceUnionId: [
          { required: true, message: '请输入所属类别', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: ['blur', 'change'] }
        ],
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符',
            trigger: 'blur'
          }
        ],
        mail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        jobNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          {
            min: 0,
            max: 20,
            message: '长度在 0 到 20 个字符',
            trigger: 'blur'
          }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        introduction: [
          { required: true, message: '说明', trigger: 'blur' },
          {
            min: 0,
            max: 100,
            message: '长度在 0 到 100 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 表格多选
      multipleSelection: []
      // typeFlag:
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    checkbox(city) {
      this.checked = this.checked.includes(city) ? [city] : []
      this.value = this.city
    },
    changeUser(e) {
      console.log(e, 87)
      this.userVal = e
    },
    changeGroup(e) {
      console.log(e, 88)
      this.groupVal = e
    },
    // 查询
    search() {
      // 初始化表格数据
      this.infoTableData = JSON.parse(JSON.stringify(this.tableData))
      this.infoTableData = this.deal(this.infoTableData, (node) =>
        // console.log(node,997)
        node.Flag.includes(this.params.flag)
      )
    },
    resetData() {
      this.infoTableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // 页面数据过滤
    deal(nodes, predicate) {
      // 如果已经没有节点了，结束递归
      if (!(nodes && nodes.length)) {
        return []
      }
      const newChildren = []
      for (const node of nodes) {
        if (predicate(node)) {
          // 如果节点符合条件，直接加入新的节点集
          newChildren.push(node)
          node.children = this.deal(node.children, predicate)
        } else {
          // 如果当前节点不符合条件，递归过滤子节点，
          // 把符合条件的子节点提升上来，并入新节点集
          newChildren.push(...this.deal(node.children, predicate))
        }
      }
      return newChildren
    },
    // 获取表格数据
    async getTableData() {
      this.loading = true
      try {
        const { data } = await relationList(this.params)
        this.tableData = data

        this.infoTableData = JSON.parse(JSON.stringify(data))
      } finally {
        this.loading = false
      }
    },

    // 新增
    create() {
      this.checked = ['创建用户动态'];
      (this.userVal = ''),
      (this.groupVal = ''),
      (this.dialogFormData = {}),
      (this.dialogFromGroup = {}),
      (this.dialogFormTitle = '新增')
      this.updateLoading = true // 新增的展示
      this.dialogType = 'create'
    },
    // 修改
    update(row) {
      const typeDialog = row.Flag.split('_')[1]
      const {
        avatar,
        givenName,
        introduction,
        jobNumber,
        mail,
        mobile,
        nickname,
        position,
        postalAddress,
        sourceUnionId,
        sourceUserId,
        username,
        groupName,
        remark,
        sourceDeptId,
        sourceDeptParentId
      } = row.Attributes
      if (typeDialog === 'user') {
        this.updateId = row.ID
        this.checked = ['创建用户动态'];
        (this.userVal = row.Flag)(this.dialogFormData.username = username), // 用户名(通常为用户名拼音) name_pinyin
        (this.dialogFormData.nickname = nickname), // 中文名字 name
        (this.dialogFormData.givenName = givenName), // 花名 name
        (this.dialogFormData.mail = mail), // 邮箱 email
        (this.dialogFormData.jobNumber = jobNumber), // 工号 job_number
        (this.dialogFormData.mobile = mobile), // 手机号 mobile
        (this.dialogFormData.avatar = avatar), // 头像 avatar
        (this.dialogFormData.postalAddress = postalAddress), // 地址 work_place
        (this.dialogFormData.position = position), // 职位 title
        (this.dialogFormData.introduction = introduction), // 说明 remark
        (this.dialogFormData.sourceUserId = sourceUserId), // 源用户ID  userid
        (this.dialogFormData.sourceUnionId = sourceUnionId) // 源用户唯一ID   unionid
      } else {
        this.updateId = row.ID
        this.checked = ['创建分组动态'];
        (this.groupVal = row.Flag)(this.dialogFormData.groupName = groupName), // 分组名称（通常为分组名的拼音）
        (this.dialogFormData.remark = remark), // 分组描述
        (this.dialogFormData.sourceDeptId = sourceDeptId), // 部门ID
        (this.dialogFormData.sourceDeptParentId = sourceDeptParentId) // 父部门ID
      }

      this.dialogFormTitle = '修改'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // 提交表单
    submitForm(e) {
      // console.log(e,765)
      let flag, attributes
      if (this.checked[0] === '创建用户动态') {
        if (this.userVal === '') {
          this.$message({

            message: '请选择创建类型',
            type: 'success'
          })
          return false
        }
        flag = this.userVal
        attributes = this.dialogFormData
      } else {
        if (this.groupVal === '') {
          this.$message({

            message: '请选择创建类型',
            type: 'success'
          })
          return false
        }
        flag = this.groupVal
        attributes = this.dialogFormData
      }
      this.$refs['dialogForm'].validate(async(valid) => {
        if (valid) {
          let message = ''
          this.submitLoading = true
          try {
            if (this.dialogType === 'create') {
              const { msg } = await relationAdd({
                flag: flag,
                attributes: attributes
              })
              message = msg
            } else {
              const { msg } = await relationUp({
                id: this.updateId,
                flag: flag,
                attributes: attributes
              })
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
      this.updateLoading = false
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
      })
        .then(async(res) => {
          this.loading = true
          const groupIds = []
          this.multipleSelection.forEach((x) => {
            groupIds.push(x.ID)
          })
          let message = ''
          try {
            const { msg } = await relationDel({ fieldRelationIds: groupIds })
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
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 单个删除
    async singleDelete(Id) {
      this.loading = true
      let message = ''
      try {
        const { msg } = await relationDel({ fieldRelationIds: [Id] })
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

    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val
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
.container-card {
  margin: 10px;
}

.delete-popover {
  margin-left: 10px;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  text-align: left !important;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.link-title {
  margin-left: 30px;
  margin-bottom: 10px;
}

/* .el-form-item /deep/ label{
    label{

    }

} */
</style>
