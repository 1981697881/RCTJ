import Request from '@/plugins/request/js/index';

export default {
    purchaseStockIn(params) {
        return Request().post('/api/stockBill/purchaseStockIn', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
	//采购待审列表
	poorderMqList(params) {
        return Request().post('/productWork/poorderMqList', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },//采购待审明细
	poorderDqList(params) {
        return Request().post('/productWork/poorderDqList', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },//采购待审审核
	poorderUpdate(params) {
        return Request().post('/productWork/poorderUpdate', {
            header: {
				contentType: 'application/json',
				accept: '*/*'
            },
			data: params
        });
    },
};
