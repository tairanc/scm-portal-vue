export default [   //用户权限表
    {
        'parentCode' : 101,
        'name' : '入库管理',
        'router' : '/printbuyin',
        'codeList' : [
            {
                'code' : 10101,
                'name' : '采购入库管理',
                'router' : '/purchasein'
            },
            {
                'code' : 10102,
                'name' : '调拨入库管理',
                'router' : '/printbuyin'
            },
            {
                'code' : 10103,
                'name' : '退货入库管理',
                'router' : '/afterSale'
            },
            {
                'code' : 10104,
                'name' : '其他入库管理',
                'router' : '/otherWarehouse'
            }
        ]
    },
    {
        'parentCode' : 102,
        'name' : '出库管理',
        'router' : '',
        'codeList' : [
            {
                'code' : 10201,
                'name' : '订单出库管理',
                'router' : '/orderoutmanage'
            },
            {
                'code' : 10202,
                'name' : '调拨出库管理',
                'router' : '/printbuyout'
            },
            {
                'code' : 10203,
                'name' : '退货出库管理',
                'router' : '/returndeliverymanage'
            },
            {
                'code' : 10204,
                'name' : '其他出库管理',
                'router' : '/otherOutbound'
            }
        ]
    },
    {
        'parentCode' : 103,
        'name' : '库存管理',
        'router' : '',
        'codeList' : [
            {
                'code' : 10301,
                'name' : '库存查询',
                'router' : '/stocksearch'
            },
            {
                'code' : 10302,
                'name' : '库存调整单',
                'router' : '/stockordermanage'
            },
            {
                'code' : 10303,
                'name' : '库存调整单审核',
                'router' : '/stockorderaudit'
            },
            {
                'code' : 10304,
                'name' : '入库调整单',
                'router' : '/instockorder'
            },
            {
                'code' : 10305,
                'name' : '出库调整单',
                'router' : '/outstockorder'
            }
        ]

    }
]
