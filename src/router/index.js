import Vue from 'vue';
import Router from 'vue-router';
import pageView from '@/components/page-view';
import login from '@/views/account/login';
import channels from '@/views/account/channels';
import goodsInfo from '@/views/goods/goods-info';
import bar from '@/components/bar';

import printBuyIn from '@/views/print/printBuyIn';
import printBuyOut from '@/views/print/printBuyOut';
import purchaseIn from '@/views/print/purchaseIn';
import orderOutManage from '@/views/print/orderOutManage';
import stockSearch from '@/views/print/stockSearch';
import afterSale from '@/views/print/afterSale';
import returndeliverymanage from '@/views/print/returndeliverymanage';
import otherOutbound from '@/views/otherManage/otherOutbound/otherOutbound';
import otherOutResult from '@/views/otherManage/otherOutbound/otherOutResult';
import otherWarehouse from '@/views/otherManage/otherWarehouse/otherWarehouse';
import otherWareResult from '@/views/otherManage/otherWarehouse/otherWareResult';
// 库存调整单
import instockorder from '@/views/stockorder/instockorder/instockorder'; // 入库库存调整单
import outstockorder from '@/views/stockorder/outstockorder/outstockorder'; // 出库库存调整单
import stockorderaudit from '@/views/stockorder/stockorderaudit/stockorderaudit'; // 库存调整单审核
import stockorderdetail from '@/views/stockorder/stockorderaudit/stockorderdetail/stockorderdetail'; // 库存调整单审核详情
import stockordermanage from '@/views/stockorder/stockordermanage/stockordermanage'; // 库存调整单管理
import stockorderaddoredit from '@/views/stockorder/stockordermanage/stockorderaddoredit/stockorderaddoredit'; // 库存调整单管理新增编辑

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/channels',
      component: channels
    },
    {
      path: '/goods',
      meta: {
        title: '商品管理',
        vueName: 'goods',
        isLink: false
      },
      component: pageView,
      children: [
        {
          path: 'goods-info/:id',
          meta: {
            title: '商品详情',
            vueName: 'goods-goods-info',
            isLink: true
          },
          component: goodsInfo
        }
      ]
    },
    {
      path: '/bar',
      component: bar,
      children: [
        // {
        //   path: '',
        //   redirect: '/printbuyin'
        // },
        {
          path: '/printbuyin',
          component: printBuyIn,
          meta: {
            name: '调拨入库管理'
          }
        },
        {
          path: '/printbuyout',
          component: printBuyOut,
          meta: {
            name: '调拨出库管理'
          }
        },
        {
          path: '/purchasein',
          component: purchaseIn,
          meta: {
            name: '采购入库管理'
          }
        },
        {
          path: '/orderoutmanage',
          component: orderOutManage,
          meta: {
            name: '订单出库管理'
          }
        },
        {
          path: '/stocksearch',
          component: stockSearch,
          meta: {
            name: '库存查询'
          }
        },
        {
          path: '/afterSale',
          component: afterSale,
          meta: {
            name: '退货入库单'
          }
        },
        {
          path: '/returndeliverymanage',
          component: returndeliverymanage,
          meta: {
            name: '退货出库管理'
          }
        },
        {
            path: '/otherOutbound',
            component: otherOutbound,
            meta: {
              name: '其他出库管理'
            }
          },
        {
            path: '/otherOutResult/:id',
            component: otherOutResult,
            meta: {
              name: '其他出库理货'
            }
        },
        {
            path: '/otherWarehouse',
            component: otherWarehouse,
            meta: {
              name: '其他入库管理'
            }
        },
        {
            path: '/otherWareResult/:id',
            component: otherWareResult,
            meta: {
              name: '其他入库理货'
            }
        },
        {
          path: '/instockorder',
          component: instockorder,
          meta: {
            name: '入库调整单'
          }
        },{
          path: '/outstockorder',
          component: outstockorder,
          meta: {
            name: '出库调整单'
          }
        },{
          path: '/stockorderaudit',
          component: stockorderaudit,
          meta: {
            name: '库存调整单审核'
          }
        },{
          path: '/stockorderaudit/stockorderdetail/:id',
          component: stockorderdetail,
          meta: {
            name: '库存调整单审核详情'
          }
        },{
          path: '/stockordermanage',
          component: stockordermanage,
          meta: {
            name: '库存调整单'
          }
        },{
          path: '/stockordermanage/stockorderaddoredit/:id',
          component: stockorderaddoredit,
          meta: {
            name: '库存调整单新增编辑'
          }
        },
      ]
    }
  ]
});

export default router;
