import Vue from 'vue'
import Router from 'vue-router'
import Notebooks from './views/Notebooks.vue'
import Issues from './views/Issues.vue'
import Plans from './views/Plans.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'notebooks',
      component: Notebooks
    },
    {
      path: '/issues',
      name: 'issues',
      component: Issues
    },
    {
      path: '/plans',
      name: 'plans',
      component: Plans
    }
    // ,
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
