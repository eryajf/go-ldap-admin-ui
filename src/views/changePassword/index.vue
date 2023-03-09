<template>
  <div class="reset-pass">
    <el-form ref="form" :model="form" size="medium" class="form-container">
      <el-form-item label="邮箱">
        <div class="input-container">
          <el-input v-model="form.mail" placeholder="请输入个人邮箱"></el-input>
          <el-button type="primary" @click="sendEmailCode">发送验证码</el-button>
        </div>
      </el-form-item>
      <el-form-item label="验证码" class="code-item">
        <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item class="reset-item">
        <el-button type="primary" @click="resetPass">重置密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { emailPass,sendCode } from '@/api/system/user'
import { Message } from 'element-ui'

export default {
  name: 'ChangePass',
  data() {
    return {
      // 查询参数
      form: {
        mail: "",
        code: ""
      }
    }
  },
  methods: {
    // 判断结果
    judgeResult(res){
      if (res.code==0){
          Message({
            showClose: true,
            message: "操作成功",
            type: 'success'
          })
        }
    },

    // 发送邮箱验证码
    async sendEmailCode() {
      console.log('aaaaaaaa',this.form.mail);

      await sendCode({ mail: this.form.mail }).then(res =>{
        this.judgeResult(res)
      })
    },
    // 重置密码
    async resetPass() {
      await emailPass(this.form).then(res =>{
        this.judgeResult(res)
      })
      // 重新登录
      setTimeout(() => {
        this.$router.replace({ path: '/login' })
      }, 1500)
    },
  }
}
</script>

<style scoped lang="scss">
.reset-pass {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  width: 400px;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input-container .el-input {
  flex: 1;
  margin-right: 10px;
}

.code-item .el-form-item__label {
  width: 80px;
}
.code-item .el-input {
  width: 345px;
}

.reset-item {
  text-align: right;
}
</style>
