import { RouterTransition } from '../../components/Transition'

const routeName = 'error'

export const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  redirect: '/error/404',
  component: () => import('/@/views/404.vue')
}

export const errorRoutes = {
  path: '/error',
  name: routeName,
  redirect: '/error/404',
  component: RouterTransition,
  meta: {
    title: '错误页',
    icon: 'EditOutlined',
    hidden: true
  },
  children: [
    {
      path: '404',
      name: `${routeName}-404`,
      meta: {
        title: '404',
        icon: 'UserOutlined'
      },
      component: () => import('/@/views/404.vue')
    }
  ]
}
