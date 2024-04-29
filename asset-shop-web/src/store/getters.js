const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  userId: state => state.user.userId,
  userName: state => state.user.userName,
  avatar: state => state.user.avatar,
  routes: state => state.route.routes,
  routesLoaded: state => state.route.routesLoaded,
  unreadNum: state => state.message.unreadNum,
  newMsgList: state => state.message.newMsgList,
  msgSettings: state => state.message.msgSettings
}
export default getters
