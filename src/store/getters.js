const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  company: state => state.user.company,
  companyId: state => state.user.companyId,
  userInfo: state => state.user.userInfo,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  menu: state => state.menu.menu,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  storeList: state => state.app.storeList,
  gysList: state => state.app.gysData,
  isallow: state => {
    return state.user.roles.includes('service_business_verify') || state.user.roles.includes('service_admin')
  },
  isallownew: state => {
    return state.user.roles.includes('service_business_verify') || state.user.roles.includes('service_business') || state.user.roles.includes('service_admin')
  }
}
export default getters
