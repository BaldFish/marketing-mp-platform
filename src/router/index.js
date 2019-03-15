import Vue from 'vue'
import Router from 'vue-router'
import myHome from '@/components/home/home'
import myLogin from '@/components/login/login'
import myRankingList from '@/components/rankingList/rankingList'
import myDescription from '@/components/description/description'
import myIntegralList from '@/components/integralList/integralList'
import myOrder from '@/components/order/order'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path:'/home',
      name:'home',
      component:myHome
    },
    {
      path:'/login',
      name:'login',
      component:myLogin
    },
    {
      path:'/rankingList',
      name:'rankingList',
      component:myRankingList
    },
    {
      path:'/description',
      name:'description',
      component:myDescription
    },
    {
      path:'/integralList',
      name:'integralList',
      component:myIntegralList
    },
    {
      path:'/order',
      name:'order',
      component:myOrder
    },
  ]
})

