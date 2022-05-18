import { constantRoutes } from '@/router'
import { getUserMenuTreeByUserId } from '@/api/system/menu'
import Layout from '@/layout'

export const getRoutesFromMenuTree = (menuTree) => {
  const routes = []
  menuTree.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      menu.children = getRoutesFromMenuTree(menu.children)
    }
    // else {
    //   // 这里需要清理children, 否则右侧会显示下拉图标
    //   delete menu.children
    // }
    routes.push({
      path: menu.path,
      name: menu.name,
      component: loadComponent(menu.component),
      hidden: menu.hidden === 1,
      redirect: menu.redirect,
      alwaysShow: menu.alwaysShow === 1,
      children: menu.children,
      meta: {
        name: menu.name,
        title: menu.title,
        icon: menu.icon,
        noCache: menu.noCache === 1,
        breadcrumb: menu.breadcrumb === 1,
        activeMenu: menu.activeMenu
      }
    })
  })

  return routes
}

export const loadComponent = (component) => {
  if (component === '' || component === 'Layout') {
    // 组件不存在使用默认布局
    return Layout
  }
  // 动态获取组件
  return (resolve) => require([`@/views${component}`], resolve)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, userinfo) {
    return new Promise((resolve, reject) => {
      let accessedRoutes = []
      const {roles}=userinfo
      // 获取菜单树
      getUserMenuTreeByUserId().then(res => {

        const { data } = res
        const menuTree = data
        accessedRoutes = getRoutesFromMenuTree(menuTree)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
