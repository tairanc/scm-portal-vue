<template>
  <div class="channel-page">
    <div class="channel-con">
      <p class="tip">系统检测到您从属多个仓库，请先选择数据权限</p>
      <ul class="list">
        <li v-for="(item,index) in warehouse" :key="'channel'+index" @click="setWarehouse(item.code)">
          <span>{{item.warehouseName}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
         warehouse : this.$store.state.warehouseList
      }
    },
    computed: {

    },
    methods: {
        setWarehouse (code) {
          this.POST('/wmsUserInfo/setWarehouseCodeSession/'+code).then( res => {
              this.$message.success({
                showClose: true,
                message: '设置仓库成功'
              })
              this.$router.push({path: '/bar'})
              localStorage.code = code  //将当前仓库的code存到session里
          })
        }
    },
    created () {
        this.GET('/wmsUserInfo/getWarehouseCode').then( res => {
              res.body.length ? localStorage.warehouse = JSON.stringify(res.body) : ''
              if(res.body.length > 1){
                  this.warehouse = res.body
                  this.$router.push({path: '/channels'})
              }else{
                  let code = res.body[0].code
                  this.setWarehouse(code)
              }
              this.$store.commit('needList', res.body)
        })
    }
  }
</script>

<style lang="less" scoped="">
  .channel-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: 16px;
    background-color: #3e3e56;
    .channel-con {
      width: 1100px;
      margin: 250px auto 0;
      .tip {
        color: #fff;
        font-weight: bold;
        text-align: center;
      }
      ul {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        li {
          width: 250px;
          height: 150px;
          align-items: center;
          display: flex;
          justify-content: center;
          // line-height: 150px;
          background: #fff;
          text-align: center;
          border-radius: 5px;
          margin-top: 32px;
          cursor: pointer;
        }
        li:hover{
          color: #f60
        }
      }
    }
  }
</style>
