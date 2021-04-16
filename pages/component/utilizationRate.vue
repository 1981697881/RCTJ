<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" url="/pages/procurement" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">数据报表</block>
		</cu-custom>
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					开始时间:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="start" @change="bindChange1"></ruiDatePicker>
				</view>
				<view class="action">
					结束时间:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="end" @change="bindChange2"></ruiDatePicker>
				</view>
			</view>
			<view class="cu-bar search bg-white" style="height: 60upx;">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" type="text" :value="keyword" @input="inputChange" placeholder="搜索" confirm-type="search" />
				</view>
				<view class="action"><button class="cu-btn bg-green shadow-blur round" @tap="$manyCk(search)">搜索</button></view>
			</view>
		</view>
		<view>
			<view class="text-xl bg-cyan text-bold text-center padding-sm">出材率</view>
			<z-table :tableData="tableData" :columns="columns" :tableHeight="tableHeight" :stickSide="stickSide" :showBottomSum="showBottomSum"></z-table>
		</view>
	</view>
</template>

<script>
import zTable from '@/components/z-table/z-table.vue';
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
export default {
	components: { zTable, ruiDatePicker },
	data() {
		return {
			start: '',
			end: '',
			keyword: '',
			stickSide: true,
			tableHeight: 0,
			showBottomSum: true,
			tableData: [
				{
					name: 'a',
					cs: 2,
					cs1: 2,
					cs2: 2
				},
				{
					name: 'a',
					cs: 1,
					cs1: 1,
					cs2: 1
				}
			],
			columns: [{ key: 'name', title: '111' }, { key: 'cs', title: '试试', noSum: true }, { key: 'cs1', title: '试试1', noSum: true }, { key: 'cs2', title: '试试2' }],
			pageHeight: 0
		};
	},
	onLoad: function(option) {
		// 列表数据默认加载
		this.start = this.getDay('', -3).date;
		this.end = this.getDay('', 0).date;
	},
	onReady: function() {
		var me = this;
		uni.getSystemInfo({
			success: function(res) {
				// res - 各种参数
				let info = uni.createSelectorQuery().select('.getheight');
				let customHead = uni.createSelectorQuery().select('.customHead');
				var infoHeight = 0;
				var headHeight = 0;
				info.boundingClientRect(function(data) {
					//data - 各种参数
					infoHeight = data.height;
				}).exec();
				customHead
					.boundingClientRect(function(data) {
						//data - 各种参数
						headHeight = data.height;
					})
					.exec();
				setTimeout(function() {
					me.tableHeight = (res.windowHeight - infoHeight - headHeight)*2.1;
				}, 1000);
			}
		});
	},
	methods: {
		// 查询前后三天日期
		getDay(date, day) {
			var today = new Date();
			var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
			today.setTime(targetday_milliseconds); //注意，这行是关键代码
			var tYear = today.getFullYear();
			var tMonth = today.getMonth();
			var tDate = today.getDate();
			var getDay = today.getDay();
			tMonth = this.doHandleMonth(tMonth + 1);
			tDate = this.doHandleMonth(tDate);
			var weeks = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
			var week = weeks[getDay];
			return {
				day: tDate,
				week: week,
				date: tYear + '-' + tMonth + '-' + tDate
			};
		},
		doHandleMonth(month) {
			var m = month;
			if (month.toString().length == 1) {
				m = '0' + month;
			}
			return m;
		}
	}
};
</script>

<style>
.ruidata {
	font-size: 13px;
	height: 7vw !important;
}
.box {
	width: 100%;
}
.cu-bar {
	min-height: 30px;
}
</style>
