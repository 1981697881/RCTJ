<template>
	<view>
		<loading :loadModal="loadModal"></loading>
		<cu-custom bgColor="bg-gradual-blue" class="customHead" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">领料</block>
		</cu-custom>
		<!-- <uni-fab v-if="!isOrder" :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :popMenu="popMenu" distable :direction="direction" @fabClick="fabClick"></uni-fab> -->
		<view class="box getheight">
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					单号:
					<text>{{ form.finBillNo }}</text>
				</view>
				<view class="action">
					日期:
					<ruiDatePicker fields="day" class="ruidata" start="2010-00-00" end="2030-12-30" :value="form.fdate" @change="bindChange"></ruiDatePicker>
				</view>
				<view class="action">
					行数:
					<text>{{ form.bNum }}</text>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<!-- <view class="action">
					<view style="width: 90px;">部门:</view>
					<ld-select :list="deptList" list-key="FName" value-key="FNumber" placeholder="请选择" clearable v-model="form.fdeptID" @change="deptChange"></ld-select>
				</view> -->
				<view class="action">
					<view style="width: 90px;">部门:</view>
					<input name="input" disabled style="font-size: 13px;text-align: left;" v-model="fdeptName" />
				</view>
				<!-- <view class="action">
					<view style="width: 90px;">仓库:</view>
					<ld-select
						:list="stockList"
						disabled
						list-key="FName"
						value-key="FNumber"
						placeholder="请选择"
						clearable
						v-model="form.fdCStockId"
						@change="stockChange"
					></ld-select>
				</view> -->
				<view class="action">
					<view style="width: 90px;">机台:</view>
					<ld-select
						:list="customItemList"
						list-key="FName"
						value-key="FNumber"
						placeholder="请选择"
						clearable
						v-model="form.fsupplyId"
						@change="custItemChange"
					></ld-select>
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom" style="height: 60upx;">
				<view class="action">
					<view class="title">备注:</view>
					<input name="input" style="font-size: 13px;text-align: left;" v-model="form.fnote" />
				</view>
				<button class="cu-btn round lines-blue line-blue shadow" @tap="showModal" data-target="Modal">详情</button>
			</view>
		</view>
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 350upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">温馨提示</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-sm">
					<view class="cu-item">
						<view class="content">
							<text class="text-grey">用户：{{ form.username }}</text>
						</view>
						<view class="action"><text class="text-grey"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName2 == 'Modal' ? 'show' : ''">
			<view class="cu-dialog" style="height: 460upx;">
				<view class="cu-bar bg-white justify-end" style="height: 60upx;">
					<view class="content">{{ popupForm.headName }}</view>
					<view class="action" @tap="hideModal2"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">数量:</view>
									<input name="input" type="digit" style="border-bottom: 1px solid;" v-model="popupForm.quantity" />
								</view>
							</view>
						</view>
					</view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">批号:</view>
									<input name="input" style="border-bottom: 1px solid;" v-model="popupForm.fbatchNo" />
									<button class="cu-btn round lines-red line-red shadow" @tap="$manyCk(scanBatchNo)">扫码</button>
								</view>
							</view>
						</view>
					</view>
					<view class="cu-item" style="width: 100%;">
						<view class="flex">
							<view class="flex-sub">
								<view class="cu-form-group">
									<view class="title">库位:</view>
									<input name="input" style="border-bottom: 1px solid;" v-model="popupForm.positions" />
									<button class="cu-btn round lines-red line-red shadow" @tap="$manyCk(scanPosition)">扫码</button>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view style="clear: both;" class="cu-bar bg-white justify-end padding-bottom-xl">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal2">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="$manyCk(saveCom)">确定</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page" :style="{ height: pageHeight + 'px' }">
			<view v-for="(item, index) in cuIList" :key="index">
				<view class="cu-list menu-avatar">
					<view
						class="cu-item"
						style="width: 100%;margin-top: 2px;height: 260upx;"
						:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
						@touchstart="ListTouchStart"
						@touchmove="ListTouchMove"
						@touchend="ListTouchEnd"
						:data-target="'move-box-' + index"
					>
						<view style="clear: both;width: 100%;">
							<view style="clear: both;width: 100%;" class="grid text-left col-2" @tap="showModal2(index, item)" data-target="Modal" data-number="item.number">
								<view class="text-grey">序号:{{ (item.index = index + 1) }}</view>
								<view class="text-grey">编码:{{ item.number }}</view>
								<view class="text-grey">名称:{{ item.name }}</view>
								<view class="text-grey">数量:{{ item.quantity }}</view>
								<view class="text-grey">批号:{{ item.fbatchNo }}</view>
								<view class="text-grey">单位:{{ item.unitName }}</view>
								<view class="text-grey">规格:{{ item.model }}</view>
								<view class="text-grey">库位:{{ item.positions }}</view>
								<view class="text-grey">{{ item.stockName }}</view>
							</view>
							<view class="text-grey text-center">
								<picker @change="PickerChange($event, item)" :value="pickerVal" :range-key="'FName'" :range="stockList">
									<view class="picker">
										<button class="cu-btn sm round bg-green shadow">
											<text class="cuIcon-homefill"></text>
											仓库
										</button>
									</view>
								</picker>
							</view>
						</view>
						<view class="move"><view class="bg-red" @tap="del(index, item)">删除</view></view>
					</view>
				</view>
			</view>
			<view class="cu-bar tabbar shadow foot">
				<view class="box text-center">
					<button :disabled="isClick" class="cu-btn bg-green shadow-blur round lg" style="width: 40%;margin-right: 10%;" @tap="$manyCk(saveData)">提交</button>
					<button class="cu-btn bg-blue shadow-blur round lg" style="width: 40%;" @tap="$manyCk(clearList)">清空</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
import ldSelect from '@/components/ld-select/ld-select.vue';
import uniFab from '@/components/uni-fab/uni-fab.vue';
import basic from '@/api/basic';
import production from '@/api/production';
import service from '@/service.js';
import loading from '@/components/loading';
export default {
	components: { ruiDatePicker, ldSelect, uniFab, loading },

	data() {
		return {
			finalList: [],
			menuKey: 1,
			show: false,
			title: '选择库存',
			pageHeight: 0,
			headName: '',
			isOrder: false,
			onoff: true,
			isClick: false,
			loadModal: false,
			pickerVal: null,
			modalName: null,
			fdeptName: '',
			deptNumber: '',
			modalName2: null,
			gridCol: 3,
			form: {
				finBillNo: null,
				fdate: '',
				bNum: 0,
				fnote: '',
				fbillerID: null,
				fdCStockId: '',
				fsupplyId: '',
				fdeptID: ''
			},
			borrowItem: {},
			popupForm: {
				fbatchNo: '',
				positions: '',
				quantity: ''
			},
			skin: false,
			listTouchStart: 0,
			listTouchDirection: null,
			deptList: [],
			customItemList: [],
			chooseList: [],
			stockList: [],
			horizontal: 'right',
			vertical: 'bottom',
			popMenu: false,
			direction: 'horizontal',
			pattern: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			},
			cuIList: [],
			startDate: null,
			endDate: null
		};
	},
	onLoad: function(option) {
		let me = this;
		me.loadModal = true;
		me.fdeptName = service.getUsers()[0].deptName;
		me.deptNumber = service.getUsers()[0].deptNumber;
		me.form.fdeptID = service.getUsers()[0].deptNumber;
		me.initMain();
		if (JSON.stringify(option) != '{}') {
			this.isOrder = true;
			this.startDate = option.startDate;
			this.endDate = option.endDate;
			this.billNo = option.billNo;
			this.source = option.tranType;
			basic
				.getOrderList({
					billNo: option.billNo,
					tranType: option.tranType,
					type: option.type
				})
				.then(res => {
					if (res.success) {
						let data = res.data.list;
						for (let i in data) {
							me.cuIList.push({
								Fdate: data[i].Fdate,
								stockName: data[i].FDCStockName,
								stockId: data[i].FDCStockNumber,
								number: data[i].FItemNumber,
								name: data[i].FItemName,
								model: data[i].FModel,
								checked: false,
								show: false,
								isLoading: false,
								FCounty: 0,
								childrenList: [],
								Fauxprice: data[i].Fauxprice,
								Famount: data[i].Famount,
								FBatchManager: data[i].FBatchManager,
								fsourceBillNo: data[i].FBillNo,
								fsourceEntryID: data[i].FEntryID,
								quantity: data[i].Fauxqty,
								Fauxqty: data[i].Fauxqty,
								fsourceTranType: data[i].FTranType,
								unitID: data[i].FUnitNumber,
								unitName: data[i].FUnitName
							});
						}
						me.form.bNum = data.length;
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
	onReady: function() {
		var me = this;
		if (service.getUsers().length > 0) {
			if (service.getUsers()[0].account != '' && service.getUsers()[0].account != 'undefined') {
				me.form.fbillerID = service.getUsers()[0].userId;
				me.form.username = service.getUsers()[0].username;
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
							me.pageHeight = res.windowHeight - infoHeight - headHeight - 30;
						}, 1000);
					}
				});
			}
		}
	},
	methods: {
		custItemChange(val) {
			this.form.fsupplyId = val;
		},
		setQuty(val, index) {
			let list = this.cuIList[index].childrenList;
			let count = 0;
			list.forEach((item, index) => {
				if (item.checked) {
					if (item.quantity <= item.FQty) {
						if (item.quantity != '' && item.quantity != null) {
							count += Number(item.quantity);
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: '输入数量不能大于库数量'
						});
					}
				}
			});
			this.cuIList[index].FCounty = count;
		},

		deleteItem(item, index) {
			let me = this;
			uni.showModal({
				title: '温馨提示',
				content: '是否删除当前行,删除将无法复原？',
				cancelText: '取消',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						me.cuIList.splice(index, 1);
					}
				}
			});
		},
		clearList() {
			const that = this;
			if (that.cuIList.length > 0) {
				uni.showModal({
					title: '温馨提示',
					content: '是否清空列表，清空之后将无法还原！',
					success: function(res) {
						if (res.confirm) {
							that.cuIList = [];
							that.initMain();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		},
		initMain() {
			const me = this;
			this.form.fdate = this.getDay('', 0).date;
			basic
				.getBillNo({ TranType: 24 })
				.then(res => {
					if (res.success) {
						me.form.finBillNo = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			basic
				.getDeptList({})
				.then(res => {
					if (res.success) {
						me.deptList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
				production
					.customItemCLass({ deptNumber: me.deptNumber, itemClassId: 14 })
					.then(res => {
						if (res.success) {
							me.customItemList = res.data;
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg
						});
					});
			basic
				.getStockList({})
				.then(res => {
					if (res.success) {
						me.stockList = res.data;
					}
				})
				.catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					});
				});
			me.loadModal = false;
			me.isClick = false;
		},
		saveData() {
			this.isClick = true;
			let portData = {};
			let result = [];
			let isBatchNo = false;
			let list = this.cuIList;
			let array = [];
			let me = this;
			let batchMsg = '';
			let cIndex = 0;
			for (let i in list) {
				let obj = {};
				obj.fauxqty = list[i].quantity;
				obj.fentryId = list[i].index;
				obj.finBillNo = list[i].FBillNo;
				if (list[i].FBatchManager) {
					if (list[i].fbatchNo != '' && list[i].fbatchNo != null) {
						obj.fbatchNo = list[i].fbatchNo;
						isBatchNo = true;
					} else {
						isBatchNo = false;
						batchMsg = '批号已启用，不允许为空';
						break;
					}
				} else {
					if (list[i].fbatchNo == '' || list[i].fbatchNo == null) {
						obj.fbatchNo = list[i].fbatchNo;
						isBatchNo = true;
					} else {
						isBatchNo = false;
						batchMsg = '批号未启用，不允许输入';
						break;
					}
				}
				console.log(list[i].stockId)
				obj.fitemId = list[i].number;
				obj.fdCSPId = list[i].positions;
				obj.fauxprice = list[i].Fauxprice != null && typeof list[i].Fauxprice != 'undefined' ? list[i].Fauxprice : 0;
				obj.famount = list[i].Famount != null && typeof list[i].Famount != 'undefined' ? list[i].Famount : 0;
				obj.fsCStockId = list[i].stockId;
				if (list[i].stockId == null || typeof list[i].stockId == 'undefined') {
					result.push(list[i].index);
				}
				obj.fsourceBillNo = list[i].fsourceBillNo == null || list[i].fsourceBillNo == 'undefined' ? '' : list[i].fsourceBillNo;
				obj.fsourceEntryId = list[i].fsourceEntryID == null || list[i].fsourceEntryID == 'undefined' ? '' : list[i].fsourceEntryID;
				obj.fsourceTranType = list[i].fsourceTranType == null || list[i].fsourceTranType == 'undefined' ? '' : list[i].fsourceTranType;
				obj.funitId = list[i].FUnitID;
				array.push(obj);
			}
			if(me.customItemList.length>0){
				if(typeof(me.form.fsupplyId)!="undefined" && me.form.fsupplyId!=''){
					
				}else{
					this.isClick = false;
					return uni.showToast({
					icon: 'none',
					title: '机台不允许为空'
				}); 
				}
			}
			portData.items = array;
			portData.ftranType = 24;
			portData.fsupplyId = this.form.fsupplyId;
			portData.finBillNo = this.form.finBillNo;
			portData.fdate = this.form.fdate;
			portData.fdeptId = this.form.fdeptID;
			portData.fbillerID = this.form.fbillerID;
			if (result.length == 0) {
				if(isBatchNo){
				production
					.pickingStockOut(portData)
					.then(res => {
						if (res.success) {
							this.cuIList = [];
							uni.showToast({
								icon: 'success',
								title: res.msg
							});
							this.form.bNum = 0;
							this.initMain();
							if (this.isOrder) {
								setTimeout(function() {
									uni.$emit('handleBack', { startDate: me.startDate, endDate: me.endDate, source: me.source });
									uni.navigateBack({
										url: '../production/receiveActive'
									});
								}, 1000);
							}
						}
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.msg
						});
						this.isClick = false;
					});
					}else{
						uni.showToast({
							icon: 'none',
							title: batchMsg
						});
						this.isClick = false;
					}
			} else {
				uni.showToast({
					icon: 'none',
					title: '仓库不允许为空'
				});
				this.isClick = false;
			}
		},
		submitCom() {
			var me = this;
			if (me.popupForm.fbatchNo != '' && typeof(me.popupForm.fbatchNo) != 'undefined') {
				if (me.popupForm.positions != '' && me.popupForm.positions != null) {
					/* basic.selectFdCStockIdByFdCSPId({ fdCSPId: me.popupForm.positions }).then(reso => {
						if (reso.data != null && reso.data != '') {
							if (reso.data['FIsStockMgr']) {
								me.borrowItem.stockName = reso.data['stockName'];
								me.borrowItem.stockId = reso.data['stockNumber'];
								me.borrowItem.FIsStockMgr = reso.data['FIsStockMgr'];
								me.borrowItem.positions = me.popupForm.positions;
								me.borrowItem.quantity = me.popupForm.quantity;
								me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
								me.modalName2 = null;
							} else {
								me.borrowItem.stockName = reso.data['stockName'];
								me.borrowItem.stockId = reso.data['stockNumber'];
								me.borrowItem.FIsStockMgr = reso.data['FIsStockMgr'];
								me.borrowItem.positions = '';
								me.borrowItem.quantity = me.popupForm.quantity;
								me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
								me.modalName2 = null;
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: '该库位不存在仓库中！'
							});
						}
					}); */
					me.borrowItem.positions = me.popupForm.positions;
					me.borrowItem.quantity = me.popupForm.quantity;
					me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
					me.modalName2 = null;
				} else {
					if (me.popupForm.FIsStockMgr) {
						return uni.showToast({
							icon: 'none',
							title: '仓位已启用，请输入仓位！'
						});
					} else {
						me.borrowItem.positions = '';
						me.borrowItem.quantity = me.popupForm.quantity;
						me.borrowItem.fbatchNo = me.popupForm.fbatchNo;
						me.modalName2 = null;
					}
				}
			}else{
				uni.showToast({
					icon: 'none',
					title: '批号为必填项！'
				});
			}

		},
		saveCom() {
			var me = this;
			/* if (this.popupForm.quantity > me.borrowItem.Fauxqty) {
				uni.showModal({
					title: '温馨提示',
					content: '领料数量大于单据数量！请确认！',
					success: function(res) {
						if (res.confirm) {
							me.submitCom();
						} else if (res.cancel) {
							return;
						}
					}
				});
			} else { */
				me.submitCom();
			/* } */
		},
		del(index, item) {
			this.cuIList.splice(index, 1);
			this.form.bNum = this.cuIList.length;
		},
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target;
		},
		showModal2(index, item) {
			/* if (item.stockId == null || item.stockId == '') {
				return uni.showToast({
					icon: 'none',
					title: '请先选择仓库！'
				});
			} */
			this.modalName2 = 'Modal';
			if (item.fbatchNo == null || typeof item.fbatchNo == 'undefined') {
				item.fbatchNo = '';
			}
			if (item.positions == null || typeof item.positions == 'undefined') {
				item.positions = '';
			}
			if (item.quantity == null || typeof item.quantity == 'undefined') {
				item.quantity = '';
			}
			this.popupForm = {
				quantity: item.quantity,
				fbatchNo: item.fbatchNo,
				FIsStockMgr: item.FIsStockMgr,
				positions: item.positions
			};
			this.borrowItem = item;
		},
		hideModal(e) {
			this.modalName = null;
		},
		hideModal2(e) {
			this.modalName2 = null;
			this.popupForm = {};
		},
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
		},
		deptChange(val) {
			this.form.fdeptID = val;
		},
		stockChange(val) {
			let sList = this.stockList;
			let list = this.cuIList;
			const me = this;
			for (let i in sList) {
				if (sList[i].FNumber == val) {
					for (let j in list) {
						me.$set(list[j], 'stockName', sList[i].FName);
						me.$set(list[j], 'FIsStockMgr', sList[i].FIsStockMgr);
						me.$set(list[j], 'stockId', val);
						me.$set(list[j], 'positions', '');
					}
				}
			}
		},
		bindChange(e) {
			this.form.fdate = e;
		},
		PickerChange(e, item) {
			this.$set(item, 'stockName', this.stockList[e.detail.value].FName);
			this.$set(item, 'stockId', this.stockList[e.detail.value].FNumber);
			this.$set(item, 'positions', '');
			this.$set(item, 'FIsStockMgr', this.stockList[e.detail.value].FIsStockMgr);
		},
		scanPosition() {
			let me = this;
			uni.scanCode({
				success: function(res) {
					basic.selectFdCStockIdByFdCSPId({ fdCSPId: res.result }).then(reso => {
						if (reso.data != null && reso.data != '') {
							me.popupForm.positions = res.result;
							me.popupForm.stockName = reso.data['stockName'];
							me.popupForm.stockId = reso.data['stockNumber'];
							me.popupForm.FIsStockMgr = reso.data['FIsStockMgr'];
						} else {
							uni.showToast({
								icon: 'none',
								title: '该库位不存在仓库中！'
							});
						}
					});
				}
			});
		},
		fabClick() {
			var that = this;
			uni.scanCode({
				success: function(res) {
					basic
						.inventoryByBarcode({ uuid: res.result })
						.then(reso => {
							if (reso.success) {
								that.chooseList = [];
								for (let i in reso.data) {
									that.chooseList.push(reso.data[i]);
								}
								that.show = true;
							}
						})
						.catch(err => {
							uni.showToast({
								icon: 'none',
								title: err.msg
							});
						});
				}
			});
		}, // ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},

		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},

		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		}
	}
};
</script>

<style>
.cu-item {
	float: left;
	width: 50%;
}
.cu-item .content {
	float: left;
}
.cu-list.menu-avatar > .cu-item .content {
	left: 5px;
}
.cu-list.menu-avatar > .cu-item .action {
}
.input {
	height: 30px;
}
.box {
	width: 100%;
}
.uni-input-placeholder,
.uni-input-input {
	font-size: 13px;
}
.action,
.content {
	font-size: 13px !important;
}
.ruidata {
	font-size: 13px;
	height: 7vw !important;
}
.cu-bar {
	min-height: 30px;
}
/* .page {
		height: calc(100vh - 320upx);
	} */
.nav-title::first-letter {
	font-size: 16px;
	margin-right: 2px;
}
</style>
<style lang="scss" scoped>
/* #ifdef APP-PLUS*/
.selectTrees {
	margin-bottom: 180rpx;
}
/* #endif */

.deleteBtn {
	position: absolute;
	right: 10%;
	background: #f97979;
	padding: 2rpx 16rpx;
	border-radius: 4rpx;
}

.itemT:nth-child(odd) {
	margin-left: 60rpx;
	color: #666666;
	width: 45% !important;
}
.itemT:nth-child(even) {
	color: #666666;
	width: 40% !important;
}
.itemO {
	color: #666666;
	width: 50% !important;
}

.tree-two {
	padding: 20rpx;
	color: #666666;
	border-bottom: 2rpx solid #e2e2e2;
}
.flexIn {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	align-content: center;
	flex-wrap: nowrap;
	width: 100%;
}
</style>
