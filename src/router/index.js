import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/base',
    component: Layout,
    name: 'order',
    meta: { title: '基础管理', icon: 'warehouse' },
    children: [
      {
        path: 'index',
        name: 'newOrder',
        component: () => import('@/views/supplier/index'),
        meta: { title: '供应商管理', icon: 'form' }
      }
      // {
      //   path: 'historyOrder',
      //   name: 'historyOrder',
      //   component: () => import('@/views/supplier/index'),
      //   meta: { title: '客户管理', icon: 'form' }
      // }
    ]
  },
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/index',
    name: 'warehouse',
    meta: { title: '仓库管理', icon: 'warehouse' },
    children: [
      {
        path: 'shelves',
        name: 'Shelves',
        component: () => import('@/views/warehouse/shelves'),
        meta: { title: '货架管理', icon: 'frame' }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/tree/index'),
        meta: { title: '商品管理', icon: 'goods' }
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('@/views/tree/index'),
        meta: { title: '出库详情', icon: 'goods' }
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/views/tree/index'),
        meta: { title: '入库详情', icon: 'goods' }
      },
      {
        path: 'stock',
        name: 'Stock',
        component: () => import('@/views/tree/index'),
        meta: { title: '库存详情', icon: 'goods' }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'order',
    meta: { title: '订单管理', icon: 'warehouse' },
    children: [
      {
        path: 'index',
        name: 'newOrder',
        component: () => import('@/views/supplier/index'),
        meta: { title: '新增订单', icon: 'form' }
      },
      {
        path: 'historyOrder',
        name: 'historyOrder',
        component: () => import('@/views/supplier/index'),
        meta: { title: '历史订单', icon: 'form' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'userManage' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    name: 'Setting',
    meta: { title: '系统管理', icon: 'warehouse' },
    children: [
      {
        path: 'index',
        name: 'newOrder',
        component: () => import('@/views/supplier/index'),
        meta: { title: '新增订单', icon: 'form' }
      },
      {
        path: 'historyOrder',
        name: 'historyOrder',
        component: () => import('@/views/supplier/index'),
        meta: { title: '历史订单', icon: 'form' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
