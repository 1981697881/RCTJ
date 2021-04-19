//引入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({//全局变量定义
    state: {
        forcedLogin: false,//是否需要强制登录
        hasLogin: false,
        account: "",
        password: "",
        userId:'',
        token:'',
        pointId:'',
		empId: '',
		deptName: '',
		deptID: '',
		deptNumber: '',
    },
    mutations: {
        login(state, user) {
            state.account = user.account || '';
            state.password = user.password || '';
            state.hasLogin = true;
            state.userId = user.id || '';
            state.empId = user.empId || '';
            state.deptName = user.deptName || '';
            state.deptID = user.deptID || '';
            state.deptNumber = user.deptNumber || '';
            state.token = user.token || '';
        },
        logout(state) {
           state.account = "";
           state.hasLogin = false;
           state.userId = '';
           state.token = '';
           state.pointId = '';
        },
		setToken(state, user) {
		   state.token = user.token || '';
		}
    }
})
export default store