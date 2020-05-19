<template>
  <el-container>
    <el-header>
      <header-view></header-view>
    </el-header>
    <el-main>
      <el-tabs v-model="activeIndex" type="card" closable @tab-click="tabClick" @tab-remove="tabRemove">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
        >
        </el-tab-pane>
      </el-tabs>
      <keep-alive :include="cacheList">
        <router-view></router-view>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
  import headerView from './header.vue'

  export default {
    components: {
      headerView
    },
    data () {
      return {}
    },
    computed: {
      activeIndex: {
        get () {
          return this.$store.state.tabs.activeIndex
        },
        set (index) {
          this.$store.commit('setActiveIndex', index)
        }
      },
      tabList: {
        get () {
          return this.$store.state.tabs.tabList
        },
        set (data) {
          this.$store.commit('addTabs', {title: data.meta.title, path: data.path, navPath: data.meta.navPath || data.path, vueName: data.meta.vueName})
        }
      },
      deleteIndex () {
        return this.$store.state.tabs.deleteIndex
      },
      cacheList () {
        return this.$store.state.tabs.cacheList
      }
    },
    methods: {
      tabClick (el) {
        if (this.$route.path === this.activeIndex) {
          return
        }
        this.$router.push({path: this.activeIndex})
      },
      tabRemove (name) {
        this.$store.commit('deleteTab', name)
        let length = this.tabList.length
        let path = this.$route.matched[0].path
        if (length.toString() === this.deleteIndex && length > 0) {
          path = this.tabList[this.deleteIndex - 1].path
        } else if (length > 0) {
          path = this.tabList[this.deleteIndex].path
        }
        this.$router.push({path: path})
        this.activeIndex = path
      }
    },
    mounted () {
      let route = this.$route
      if (route.meta && !route.meta.isLink) {
        return
      }
      this.tabList = route
      this.activeIndex = route.path
    },
    watch: {
      '$route' (to) {
        let flag = false
        let path = to.meta.navPath || to.path
        for (let item of this.tabList) {
          if (item.navPath === path) {
            flag = true
            item.title = to.meta.title
            item.path = to.path
            this.activeIndex = to.path
            break
          }
        }
        if (!flag && to.meta.isLink) {
          this.tabList = to
          this.activeIndex = to.path
        }
      }
    }
  }
</script>
<style lang="less">
  .el-header {
    padding: 0!important;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .el-main{
    padding: 10px;
  }
  .clear-fix:before,
  .clear-fix:after {
    display: table;
    content: " ";
  }
  .clear-fix:after {
    clear: both;
  }
</style>
