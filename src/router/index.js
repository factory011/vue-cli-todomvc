import Vue from 'vue'
import Router from 'vue-router'
import todomvc from '@/components/todomvc'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'todomvc',
    component: todomvc
  }]
})
