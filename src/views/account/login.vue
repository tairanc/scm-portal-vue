<template>
  <div class="login-page">
    <header-view></header-view>
    <!-- <iframe style="width:100%;height:100vh;" src="http://ucenter.fengdai.org?appId=uc6c7f06e54ac77f87"></iframe> -->
    <div class="login-con">
      <img src="../../assets/logo.png">
      <el-form
        :model="loginByPsw"
        status-icon
        :rules="rules"
        ref="loginByPsw"
      >
        <el-form-item
          label="手机号"
          prop="username"
        >
          <el-input
            v-model="loginByPsw.username"
            placeholder="请输入手机号"
            class="username"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            type="password"
            v-model="loginByPsw.password"
            placeholder="请输入密码"
            auto-complete="off"
            class="password"
            @keyup.enter.native="submitForm('loginByPsw')"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          prop="phoneCode"
        >
          <el-input
            placeholder="请输入短信验证码"
            v-model="loginByPsw.phoneCode"
            @keyup.enter.native="submitForm('loginByPsw')"
          >
            <template slot="append">
              <el-button
                type="text"
                @click="checkPhone"
                :disabled="isSend"
              >{{isSend ? time + '秒后重发' : '获取验证码'}}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="20">
            <el-col
              :span="12"
              :offset="2"
            >
              <el-button
                type="primary"
                :loading="isSubmitting"
                @click.enter="submitForm('loginByPsw')"
              >登录</el-button>
            </el-col>
            <el-col :span="8">
              <el-button
                :disabled="isSubmitting"
                @click="resetForm('loginByPsw')"
              >重置</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import headerView from "@/components/header";
import JSEncrypt from "jsencrypt";
import axios from "axios";

export default {
  components: {
    headerView
  },
  data() {
    const checkUsername = (rule, value, callback) => {
      // TODO: hack code
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else if (!value.match(/1\d{10}/g)) {
        return callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    const checkPassword = (rule, value, callback) => {
      let reg = /[^\u4e00-\u9fa5]/;
      if (!value) {
        return callback(new Error("请输入密码"));
      } else if (!reg.test(value)) {
        return callback(new Error("不能输入中文"));
      } else {
        callback();
      }
    };
     const checkPhoneCode = (rule, value, callback) => {
      let reg = /^[0-9]+$/;
      if (!value) {
        return callback(new Error("请输入验证码"));
      } else if (!reg.test(value)) {
        return callback(new Error("验证码格式不正确"));
      } else {
        callback();
      }
    };
    return {
      loginByPsw: {
        username: "",
        password: "",
        phoneCode: ''
      },
      isLogin: true, // 默认密码登录
      isSend: false, // 点击发送验证码
      time: 0, // 时间倒计时
      timer: null, // 定时器
      rules: {
        username: [
          { validator: checkUsername, trigger: "blur" },
          { max: 11, message: "请输入正确的手机号码", trigger: "blur" }
        ],
        password: [
          { validator: checkPassword, trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        phoneCode: [
          {validator: checkPhoneCode, trigger: 'blur'}
        ]
      },
      isSubmitting: false
    };
  },
  computed: {},
  methods: {
      tooggle() {
        this.loginByPsw.password = '';
        this.loginByPsw.phoneCode = '';
        this.isLogin = !this.isLogin;
      },
      checkPhone() {
        axios({
          method: 'get',
          url: '/gateway' + '/foundation-user/user/phone_' + this.loginByPsw.username + '/exists?appId=uc6c7f06e54ac77f87'
        }).then(res => {
          if (res.data.body) {
            this.isSend = true;
            this.getCode();
          } else {
            this.$message.error('该手机号尚未注册！');
          }
        });
      },
      getCode() {
        let data = {
          appId: 'uc6c7f06e54ac77f87',
          phone: this.loginByPsw.username,
          usage: 'LOGIN'
        };
        axios({
          method: 'post',
          url: '/gateway' + '/foundation-user/mock/send_code',
          data: data
        }).then(res => {
          this.time = 60;
          this.timer = setInterval(() => {
            this.time--;
          }, 1000);
          setTimeout(() => {
            clearInterval(this.timer);
            this.isSend = false;
          }, 60000);
        });
      },
    submitForm(formName) {
      if (!this.loginByPsw.username) {
        this.$message.warning('手机号不能为空！');
        return;
      }
      if (!this.loginByPsw.password) {
        this.$message.warning('密码不能为空！');
        return;
      }
      if (!this.loginByPsw.phoneCode) {
        this.$message.warning('验证码不能为空！');
        return;
      }
      let encrypt = new JSEncrypt.JSEncrypt();
      encrypt.setPublicKey(
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDN5xYYCRJJV7py74srvOs4ODfJJ2cftZY9eNep9qFls4D4v/duR0DZo95VK+5Yp0OekyLbaYi16obz4DBa85Ap/SRcSijWtWC0Z14hAfmpsR2qwve3Jtf72SouNvfXFhOnpcxhHRN9GeND6dlq0Qk40K61CF79wLQbVOEJRXfspwIDAQAB"
      );
      let encryptData = encrypt.encrypt(this.$refs[formName].model.password);
      let data = {
        phone: this.$refs[formName].model.username,
        password: encryptData,
        phoneCode: this.$refs[formName].model.phoneCode,
        appId: "uc6c7f06e54ac77f87",
        encryptFlag: true,
        thirdPartyIdent: ""
      };

      axios({
        method: "post",
        url: "/phone_pwd_code",
        data: data
      }).then(res => {
        if (res.data.code == 200) {
          // 更改自仓库token和主仓库token独立登录页面
          document.cookie = "wmsToken=" + res.data.body.token + ";path=/";
          // document.cookie="token="+ res.data.body.token + ";domain=tairanmall.com;path=/";
          // this.$message.success('登录成功！')
          this.GET("/wmsUserInfo/getWarehouseCode").then(res => {
            if (res.body.length > 1) {
              this.warehouse = res.body;
              this.$router.push({ path: "/channels" });
            } else {
              let code = res.body[0].code;
              this.setWarehouse(code);
            }
            this.$store.commit("needList", res.body);
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    setWarehouse(code) {
      this.POST("/wmsUserInfo/setWarehouseCodeSession/" + code).then(res => {
        this.$message.success({
          showClose: true,
          message: '设置仓库成功'
        });
        this.$router.push({ path: "/bar" });
        localStorage.code = code; //将当前仓库的code存到session里
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {}
};
</script>

<style scoped lang="less">
.login-page {
  .login-con {
    width: 300px;
    margin: 50px auto;
    text-align: center;
    img {
      width: 200px;
      margin-bottom: 30px;
    }
    button {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.login-page {
  .el-input-group__append, .el-input-group__prepend {
      width: 100px !important;
    }
}
</style>
