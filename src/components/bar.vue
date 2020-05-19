<template>
  <div class="wrap">
    <div v-show="isShowTab" class="head">
      <h2 class="title">泰然集团SCM</h2>
      <el-menu :default-active="activeIndex" class="bar" mode="horizontal" @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-submenu :index="index+item" v-for="(item,index) in menuList" :key="index">
          <template slot="title">{{ item.name }}</template>
          <el-menu-item @click="selectMeun(childItem)" :index="childItem.router" v-for="(childItem,childIndex) in item.codeList" :key="childIndex">{{ childItem.name }}</el-menu-item>
        </el-submenu>
      </el-menu>
      <h2 class="loginOut" @click="loginOut">退出</h2>
      <div class="warehouseList">
        <span>当前仓库 ：</span>
        <el-select @change="selectChange" v-model="defaultValue" size="mini" placeholder="请选择">
          <el-option v-for="item in CwarehouseList" :key="item.value" :label="item.warehouseName" :value="item.code"> </el-option>
        </el-select>
      </div>
    </div>
    <div v-show="isShowTab" style="height:60px;"></div>

    <el-tabs class="tabBar" v-show="isShowTab" @tab-click="tabClick" v-model="editableTabsValue2" type="card" :closable="tags.length > 1" @tab-remove="removeTab">
      <el-tab-pane v-for="(item, index) in tags" :key="index" :label="item.name" :name="item.router">
      </el-tab-pane>
    </el-tabs>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import permission from '../api/permission'; //获取权限表
export default {
  data() {
    return {
      activeIndex: '/purchasein', //默认高亮的组件
      activeText: '自营仓管理',
      warehouseList: this.$store.state.warehouseList,
      defaultValue: '',
      menuList: [],
      tags: [], //面包屑导航
      editableTabs2: [
        {
          title: 'Tab 1',
          name: '1'
        },
        {
          title: 'Tab 2',
          name: '2'
        }
      ],
      editableTabsValue2: '/purchasein'
    };
  },
  components: {},
  watch: {
    $route(to, old) {
      // console.log(to)
    }
  },
  computed: {
    CwarehouseList() {
      return this.$store.state.warehouseList;
    },
    isShowTab() {
      return this.$store.state.isShowTab;
    }
  },
  methods: {
    removeTab(targetName) {
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].router == targetName) {
          this.tags.splice(i, 1);
          this.editableTabsValue2 = this.activeIndex = this.tags[this.tags.length - 1].router;
          this.$router.push({ path: this.tags[this.tags.length - 1].router });
          break;
        }
      }
    },
    tabClick(tag) {
      this.$router.push({ path: tag.name });
      this.editableTabsValue2 = this.activeIndex = tag.name;
    },
    selectChange(str) {
      this.POST('/wmsUserInfo/setWarehouseCodeSession/' + str).then(res => {
        console.log(res);
        localStorage.code = str; //将code保存在session里
        this.$router.go(0);
      });
    },
    handleSelect(key, keyPath) {
      this.$router.push(key);
    },
    selectMeun(a) {
      //删除的时候设置面包屑数组
      let flag = true;
      this.tags.forEach((item, index) => {
        if (a.name == item.name) {
          flag = false;
        }
      });
      if (flag) {
        let arr = {
          name: a.name,
          router: a.router
        };
        this.tags.push(arr);
      }

      this.editableTabsValue2 = this.activeIndex = a.router;
    },
    loginOut() {
      //退出登录
      function deleteCookie(name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + '=v; expires=' + date.toGMTString();
      }
      this.GET('/wmsUserInfo/cleanSession').then(res => {
        //要先清除session
        deleteCookie('wmsToken');
        this.$router.push({ path: '/login' });
      });
    }
  },
  created: function() {
    let firstRouter = this.$router.currentRoute.path;

    this.GET('/wmsUserInfo/getWarehouseCode').then(res => {
      this.GET('/wmsUserInfo/getHtmlJurisdiction').then(res => {
        let bigArr = [];
        /**
         * 这里根据后台返回过来的权限码在跟我设置的权限json作对比，如果相等我就把对应的name,router取出来放到一个新数组里
         */
        for (let i = 0; i < res.body.length; i++) {
          for (let j = 0; j < permission.length; j++) {
            if (res.body[i].parentCode == permission[j].parentCode) {
              let parent = permission[j];
              let pr = {
                parentCode: parent.parentCode,
                name: parent.name,
                router: parent.router
              };
              let sm = [];
              let codeArr = res.body[i].codeList;
              codeArr.sort();
              if (codeArr.length > 0) {
                for (let a = 0; a < codeArr.length; a++) {
                  for (let b = 0; b < parent.codeList.length; b++) {
                    if (codeArr[a] == parent.codeList[b].code) {
                      sm.push(parent.codeList[b]);
                    }
                  }
                }
              }
              pr.codeList = sm;
              bigArr.push(pr);
            }
          }
        }
        // // // 临时增加
        // bigArr.push({
        //     'parentCode' : 104,
        //     'name' : '库存调整单',
        //     'router' : '',
        //     'codeList' : [
        //         {
        //             'code' : 10401,
        //             'name' : '库存调整单',
        //             'router' : '/stockordermanage'
        //         },
        //         {
        //             'code' : 10402,
        //             'name' : '库存调整单审核',
        //             'router' : '/stockorderaudit'
        //         },{
        //             'code' : 10403,
        //             'name' : '入库调整单',
        //             'router' : '/instockorder'
        //         },{
        //             'code' : 10404,
        //             'name' : '出库调整单',
        //             'router' : '/outstockorder'
        //         }
        //     ]
        // });
        this.menuList = bigArr; //用户最终所拥有的权限菜单
        if (firstRouter == '/bar') {
          //只是防止选仓库刷新时重复刷新页面
          this.$router.push({ path: this.menuList[0].codeList[0].router }); //取二级菜单的第一个router 然后默认高亮
        }
        let router = this.$router.currentRoute; //防止页面刷新高亮失效
        this.editableTabsValue2 = this.activeIndex = router.fullPath; //让菜单的高亮等于当前router
        this.defaultValue = localStorage.code; //这是所选当前子仓库的

        let tag = {
          name: router.meta.name,
          router: router.fullPath
        };
        this.tags.push(tag);
      });

      this.$store.commit('needList', res.body);
    });
  },
  updated: function(a) {}
};
</script>

<style scoped lang="less">
.wrap {
  .head {
    font-size: 14px;
    background-color: rgb(84, 92, 100);
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    line-height: 60px;
    height: 60px;
    h2 {
      // font-size: 20px;
      padding: 0 30px;
      color: #fff;
      letter-spacing: 2px;
    }
    .warehouseList {
      float: right;
      color: #fff;
    }
    .title {
      font-size: 18px;
      float: left;
    }
    .bar {
      float: left;
    }
    .loginOut {
      float: right;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .main {
    padding: 5px 20px;
    box-sizing: border-box;
  }
  .tabBar {
    padding-top: 5px;
  }
}
</style>

