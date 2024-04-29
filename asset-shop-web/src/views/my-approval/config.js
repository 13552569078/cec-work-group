import store from '@/store'
let routeObj = store.getters.routes.find(r => r.path === '/myApproval')
if (!routeObj) {
  store.getters.routes.find(r => {
    if (r.path === '/mine') {
      routeObj = r.children.find(r => r.path === '/myApproval')
    }
    return r.path === '/mine'
  })
}
// 左侧导航展示信息
const LEFT_NAV = {
  title: routeObj.meta.title,
  list: []
}
LEFT_NAV.list = routeObj.children.filter(d => !d.hidden).map(d => ({
  ...d,
  path: d.path ? `/myApproval/${d.path}` : '/myApproval',
  title: d.meta.title,
  key: d.meta.key
}))

export { LEFT_NAV }
