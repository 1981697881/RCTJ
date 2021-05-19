<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">采购申请待审明细</block>
		</cu-custom>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="min-height: 40upx;">
				<view class="action">
					申请部门:
					<text>{{ form.FdetpName }}</text>
				</view>
				<view class="action">
					申请日期:
					<text>{{ form.Fdate }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="min-height: 40upx;">
				<view class="action">
					申请人员:
					<text>{{ form.Fusername }}</text>
				</view>
				<view class="action">
					申请单号:
					<text>{{ form.Fbillno }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="min-height: 40upx;">
				<view class="action">
					供应商:
					<text>{{ form.Fsupplyname }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="min-height: 40upx;">
				<view class="action">
					备注:
					<text>{{ form.Fmark }}</text>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIconList" :key="index">
				<view class="cu-list menu-avatar">
					<view class="cu-item" style="width: 100%;margin-top: 2px;height: 200upx;">
						<view style="clear: both;width: 100%;" class="grid text-left col-2" data-target="Modal" data-number="item.number">
							<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
							<view class="text-grey">物料:{{ item.Fitemname }}</view>
							<view class="text-grey">单位:{{ item.Funitname }}</view>
							<view class="text-grey">数量:{{ item.Fqty }}</view>
							<view class="text-grey">单价:{{ item.Fprice }}</view>
							<view class="text-grey">金额:{{ item.Famount }}</view>
							<view class="text-grey" style="width: 100%;">备注:{{ item.Fdmark }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot flex-wrap">
				<view class="cu-bar bg-white solid-bottom" style="min-height: 40upx;background-color: inherit;width: 100%;">
						<view class="title padding-left" style="margin: 0;">合计预算金额：￥{{countMoney}}</view>
						<text>{{ form.finBillNo }}</text>
				</view>
				<view class="cu-form-group align-start margin" style="background-color: inherit; padding-left: 0;width: 100%;">
					<view class="title" style="margin: 0;">审批意见：</view>
					<textarea maxlength="-1" style="border: 1px solid;margin: 0;" v-model="form.opinion" placeholder="请输入"></textarea>
				</view>
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;margin-right: 10%;" @tap="$manyCk(saveData)">同意</button>
					<button class="cu-btn bg-red shadow-blur round lg" style="width: 40%;" @tap="$manyCk(cannelList)">不同意</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import procurement from '@/api/procurement';
export default {
	data() {
		return {
			loadingType: 0,
			form: {},
			isShow: true,
			isClick: false,
			keyword: '',
			pageHeight: 0,
			cuIconList: [],
			loadModal: false,
			onoff: true
		};
	},
	computed: {
		countMoney(){
			let number = 0
			this.cuIconList.forEach((item)=>{
				number = (number*100+parseFloat(item.Famount)*100) /100
			})
			return number
		}
	},
	onReady: function() {
		var me = this;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let info = uni.createSelectorQuery().select('.getheight');
				let foot = uni.createSelectorQuery().select('.foot');
				let customHead = uni.createSelectorQuery().select('.customHead');
				var infoHeight = 0;
				var footHeight = 0;
				var headHeight = 0;
				info.boundingClientRect(function(data) {
					//data - 各种参数
					infoHeight = data.height;
				}).exec();
				foot.boundingClientRect(function(data) {
					//data - 各种参数
					footHeight = data.height;
				}).exec();
				customHead
					.boundingClientRect(function(data) {
						//data - 各种参数
						headHeight = data.height;
					})
					.exec();
				setTimeout(function() {
					me.pageHeight = res.windowHeight - infoHeight- footHeight - headHeight;
				}, 1000);
			}
		});
	},
	onLoad(option) {
		const me = this;
		if (JSON.stringify(option) != '{}') {
			this.form.Fbillno = option.Fbillno;
			this.form.FdetpName = option.FdetpName;
			this.form.Fdate = option.Fdate;
			this.form.Fusername = option.Fusername;
			this.form.Fsupplyname = option.Fsupplyname;
			this.form.Fmark = option.Fmark;
			procurement
				.poorderDqList(me.qFilter())
				.then(res => {
					if (res.success) {
						me.cuIconList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
		}
	},
	methods: {
		// 查询条件过滤
		qFilter() {
			let obj = {};
			this.keyword != null && this.keyword != '' ? (obj.name = this.keyword) : null;
			obj.pageSize = 20;
			obj.Fbillno = this.form.Fbillno
			obj.pageNum = 1;
			return obj;
		},
		saveData(){
			let me = this
			let obj = {
				Fbillno: me.form.Fbillno,
				Fdept: me.form.FdetpName,
				Fname: me.form.Fusername,
				Fyn: 2,
				Fmark: me.form.opinion,
			}
			procurement
				.poorderUpdate(obj)
				.then(res => {
					if (res.success) {
						uni.showToast({
							icon: 'success',
							title: err.msg
						});
						setTimeout(function() {
							uni.$emit('handleBack', { Fbillno: me.form.Fbillno});
							uni.navigateBack({
								url: '../approval/procurementApprovalInfo'
							});
						}, 1000);
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			
		},
		 cannelList(){
			 let me = this
			 let obj = {
			 	Fbillno: me.form.Fbillno,
			 	Fdept: me.form.FdetpName,
			 	Fname: me.form.Fusername,
			 	Fyn: 1,
			 	Fmark: me.form.opinion,
			 }
			 procurement
			 	.poorderUpdate(obj)
			 	.then(res => {
			 		if (res.success) {
			 			uni.showToast({
			 				icon: 'success',
			 				title: err.msg
			 			});
			 			setTimeout(function() {
			 				uni.$emit('handleBack', { Fbillno: me.form.Fbillno});
			 				uni.navigateBack({
			 					url: '../approval/procurementApprovalInfo'
			 				});
			 			}, 1000);
			 		}
			 	})
			 	.catch(err => {
			 		uni.showToast({
			 			icon: 'none',
			 			title: err.msg
			 		});
			 	});
		 },
	}
};
</script>

<style>
.action{
	margin-left: 0 !important;
}
.box {
	width: 100%;
}
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
