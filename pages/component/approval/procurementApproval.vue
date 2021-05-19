<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">采购申请待审</block>
		</cu-custom>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIconList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 560upx;">
						<view style="clear: both;width: 100%;">
							<view style="clear: both;width: 100%;" class="grid text-left col-2" data-target="Modal" data-number="item.number" @tap="$manyCk(showList(index, item))">
								<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
								<view class="text-grey">申请日期:{{ item.Fdate }}</view>
								<view class="text-grey">申请部门:{{ item.FdetpName }}</view>
								<view class="text-grey">申请人员:{{ item.Fusername }}</view>
								<view class="text-grey">申请单号:{{ item.Fbillno }}</view>
								<view class="text-grey">预算金额:{{ item.Fallamount }}</view>
								<view class="text-grey" style="width: 100%;">供应商:{{ item.Fsupplyname }}</view>
								<view class="text-grey" style="width: 100%;">备注:{{ item.Fmark }}</view>
								<view class="text-grey" style="width: 100%;">申请人意见:{{ item.FUnitName }}</view>
								<view class="text-grey" style="width: 100%;">车间主任意见:{{ item.FLabelNumber }}</view>
								<view class="text-grey" style="width: 100%;">仓库意见:{{ item.FBUUnitName }}</view>
							</view>
							<view class="text-grey" style="width: 100%;">
								<view class="cu-form-group align-start" style="padding-left: 0;">
									<view class="title" style="margin: 0;">审批意见：</view>
									<textarea style="border: 1px solid;margin: 0;" v-model="item.opinion" placeholder="请输入"></textarea>
								</view>
							</view>
							<view class="text-grey" style="width: 100%;">
								<view class="padding flex flex-wrap justify-between align-center bg-white">
									<button class="cu-btn round bg-blue" @tap="$manyCk(saveData(index, item))">同意</button>
									<button class="cu-btn round bg-red" @tap="$manyCk(cannelList(index, item))">不同意</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<text v-if="isShow" class="loading-text">
			{{ loadingType === 0 ? contentText.contentdown : loadingType === 1 ? contentText.contentrefresh : contentText.contentnomore }}
		</text>
	</view>
</template>

<script>
import procurement from '@/api/procurement';
import service from '@/service.js';
var page = 1;
export default {
	data() {
		return {
			loadingType: 0,
			contentText: {
				contentdown: '上拉显示更多',
				contentrefresh: '正在加载...',
				contentnomore: '没有更多数据了'
			},
			isShow: true,
			keyword: '',
			pageHeight: 0,
			cuIconList: [],
			loadModal: false,
			onoff: true
		};
	},
	onReady: function() {
		var me = this;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let customHead = uni.createSelectorQuery().select('.customHead');
				var headHeight = 0;
				customHead
					.boundingClientRect(function(data) {
						//data - 各种参数
						headHeight = data.height;
					})
					.exec();
				setTimeout(function() {
					me.pageHeight = res.windowHeight - headHeight;
				}, 1000);
			}
		});
	},
	onShow: function (option){
		uni.$on("handleBack", res => {
		    this.getNewsList()
			// 清除监听
		    uni.$off('handleBack')
		})
	},
	onLoad() {
		this.getNewsList();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.getNewsList();
	},
	// 上拉加载
	onReachBottom: function() {
		this.isShow = false;
		page++; //每触底一次 page +1
		// console.log(this.cuIconList.length);
		if (this.loadingType != 0) {
			//loadingType!=0;直接返回
			return false;
		}
		this.loadingType = 1;
		// console.log(page);
		uni.showNavigationBarLoading(); //显示加载动画
		let obj = this.qFilter();
		obj.pageNum = page;
		procurement
			.poorderMqList(obj)
			.then(res => {
				if (res.success) {
					console.log(res);
					if (this.cuIconList.length == res.data.total) {
						//没有数据
						this.loadingType = 2;
						uni.hideNavigationBarLoading(); //关闭加载动画
						return false;
					}
					if (res.data.list.length > 0) {
						let dList = res.data.list;
						dList.forEach((item, index) => {
							this.cuIconList.push(item);
						});
					}
					/* for (var i = this.cuIconList.length; i < res.data.total; i++) {
							this.cuIconList = this.cuIconList.concat(res.data.list[i - 1]); //将数据拼接在一起
						} */
					this.loadingType = 0; //将loadingType归0重置
					uni.hideNavigationBarLoading(); //关闭加载动画
					uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					this.isShow = true;
				}
			})
			.catch(err => {
				uni.showToast({
					icon: 'none',
					title: err.msg
				});
			});
	},
	methods: {
		saveData(index,item){
			const me = this;
			let obj = {
				Fbillno: item.Fbillno,
				Fdept: item.FdetpName,
				Fname: item.Fusername,
				Fyn: 2,
				Fmark: item.opinion,
			}
			procurement
				.poorderUpdate(obj)
				.then(res => {
					if (res.success) {
						uni.showToast({
							icon: 'success',
							title: err.msg
						});
						me.getNewsList()
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		},
		 cannelList(index,item){
			 const me = this;
			 let obj = {
			 	Fbillno: item.Fbillno,
			 	Fdept: item.FdetpName,
			 	Fname: item.Fusername,
			 	Fyn: 1,
			 	Fmark: item.opinion,
			 }
			 procurement
			 	.poorderUpdate(obj)
			 	.then(res => {
			 		if (res.success) {
						uni.showToast({
							icon: 'success',
							title: err.msg
						});
						me.getNewsList()
			 		}
			 	})
			 	.catch(err => {
			 		uni.showToast({
			 			icon: 'none',
			 			title: err.msg
			 		});
			 	});
		 },
		showList(index, item){
			uni.navigateTo({
				url: '../approval/procurementApprovalInfo?Fbillno='+item.Fbillno+'&FdetpName='+item.FdetpName+'&Fdate='+item.Fdate+'&Fusername='+item.Fusername+'&Fsupplyname='+item.Fsupplyname+'&Fmark='+item.Fmark
			});
		},
		// 查询条件过滤
		qFilter() {
			let obj = {};
			this.keyword != null && this.keyword != '' ? (obj.name = this.keyword) : null;
			obj.pageSize = 20;
			obj.pageNum = 1;
			obj.Fname = service.getUsers()[0].account;
			obj.Fdept = service.getUsers()[0].deptName;
			return obj;
		},
		// 产品列表数据
		getNewsList: function() {
			//第一次回去数据
			this.loadingType = 0;
			uni.showNavigationBarLoading();
			const me = this;
			procurement
				.poorderMqList(this.qFilter())
				.then(res => {
					if (res.success) {
						res.data.forEach((item)=>{
							item.opinion = ''
						})
						this.cuIconList = [...res.data];
						uni.hideNavigationBarLoading();
						uni.stopPullDownRefresh(); //得到数据后停止下拉刷新
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		}
	}
};
</script>

<style>
.nav-li {
	width: 60%;
	text-align: center;
	margin-left: 20%;
}
.page {
	height: 100vh;
}
.nav-list {
	margin-top: 5%;
}
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
.loading-text {
	height: 80upx;
	line-height: 80upx;
	font-size: 30upx;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
</style>
