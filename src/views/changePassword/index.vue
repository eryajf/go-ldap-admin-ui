<template>
  <div class="pass-page">
    <div class='pass-mian'>
      <input placeholder="请输入邮箱" v-model.trim="mail" class='pass-input' @change="changeInput($event)"/>
      <div @click='submit' class='pass-btn'>确定</div>
    </div>
  </div>
</template>

<script>
import {emailPass} from '@/api/system/user'
import store from '@/store'
export default {
  name: 'changePass',
  data() {
    return {
      // 查询参数
      mail:''
    }
  },
  methods: {
    // 查询
    changeInput(e) {
      this.mail=e.target.value
     
    },
    async submit(){
      try {
        const { msg,code } = await emailPass({mail:this.mail})
       
        if(code==0){
           this.$message({
            showClose: true,
            message: msg,
            type: 'success'
          })
          // 重新登录
          setTimeout(() => {
            
            this.$router.replace({path:'/login'})
          }, 1500)
        }else{
          this.$message({
              showClose: true,
              message: msg,
              type: 'error'
          })
          return false
        }
        
      } finally {
    
      }
    }
 
    
  }
}
</script>

<style scoped lang="scss">
.pass-page{
  .pass-mian{
    padding-top:25%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin:0 20%;
    .pass-input{
      flex: 2;
      height: 45px;
      line-height: 45px;
      font-size: 18px;
    }
    .pass-btn{
      margin-left: 20px;
      width: 15%;
      height: 48px;
      background: #1990FF;
      color:#fff;
      font-size: 18px;
      line-height: 48px;
      text-align: center;
      border-radius: 20px;
    }
  }
  // .container-card{
    
  //   padding-top:25%;
  //   border: 0px solid #fff;
  //   box-shadow:0 0px 0px;
  //   border-bottom: 0;
  //   .demo-form-inline{
  //     display: flex;
  //     .from-items{
  //       text-align: center;
  //     }
  //   }
   
  // }
}
</style>
