import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'copForm',
      component: () => import('@/views/copForm')
    },
    {
      path: '/copTable',
      name: 'copTable',
      component: () => import('@/views/copTable')
    }
  ]
})
