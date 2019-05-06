import Vue from 'vue'
import Router from 'vue-router'
import myShoppingMall from '@/components/shoppingMall/shoppingMall'
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
      redirect: "/shoppingMall"
    },
    {
      path:'/login',
      name:'login',
      component:myLogin
    },
    {
      path:'/shoppingMall',
      name:'shoppingMall',
      component:myShoppingMall
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

