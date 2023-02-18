<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
    <el-footer  class="footer-copyright">
      <div>
        <span>Since 2022 </span>
        <el-divider direction="vertical" />
        <span>Powered by </span>
          <span>
            <a href="https://github.com/eryajf/go-ldap-admin" target="_blank">Go-Ldap-Admin</a>
          </span>
        <el-divider direction="vertical" />
        <span>Copyright </span>
          <span>
            <a href="https://github.com/eryajf" target="_blank">Eryajf</a>
          </span>
      </div>
    </el-footer>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.footer-copyright {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  line-height: 45px;
  text-align: center;
  border-top: 1px dashed #dcdfe6;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
