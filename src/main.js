/* eslint-disable */
import Vue from 'vue'
import App from './App.vue';
import router from './router'
import Vuex from 'vuex'
import './style.css'
import product_data from './product-info.js';
import 'iview/dist/styles/iview.css';
import {
	Message
} from 'iview'
Vue.prototype.$Message = Message
//减少开启信息
Vue.config.productionTip = false

Vue.use(Vuex);

router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title;
	next(); //beforeEach方法后,才能进入下一个钩子
});
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});

//将productList中的brands或color数据去重复过滤出来
function getFilterArray(array) {
	//const命令只是保证变量名指向的地址不变，并不保证该地址的数据不变
	const res = []; //数组
	const json = {}; //可作为对象数组，键-值
	for (let i = 0; i < array.length; i++) {
		const _self = array[i];
		if (!json[_self]) {
			res.push(_self);
			json[_self] = 1; //json添加属性_self，值1
		}
	}
	return res;
}

const store = new Vuex.Store({
	state: {
		productList: [], //商品列表数据
		cartList: [] //购物车数据
	},
	getters: {
		brands: state => {
			const brands = state.productList.map(item => item.brand);
			return getFilterArray(brands);
		},
		colors: state => {
			const colors = state.productList.map(item => item.color);
			return getFilterArray(colors);
		}
	},
	// mutations vs actions: 存在改变数据用mutations,存在业务逻辑用actions
	mutations: { // store的数据只能读取，不能手动改变，通过this.$store.commit方法执行mutation，修改state的数据
		//添加所有商品到productList
		setProductList(state, data) {
			state.productList = data;
		},
		//添加购物车
		addCart(state, id) {
			// 先判断购物车是否已有，如果有，数量+1，没有则加入购物车
			const isAdded = state.cartList.find(item => item.id === id);
			if (isAdded) {
				isAdded.count++;
			} else {
				state.cartList.push({
					id: id,
					count: 1
				})
			}
		},
		// 修改商品数量
		editCartCount(state, payload) {
			const product = state.cartList.find(item => item.id === payload.id);
			product.count += payload.count;
		},
		// 删除商品
		deleteCart(state, id) {
			const index = state.cartList.findIndex(item => item.id === id); //返回满足条件的第一个索引
			state.cartList.splice(index, 1);
		},
		// 清空购物车
		emptyCart(state) {
			state.cartList = [];
		}
	},
	actions: { //action里面提交mutation
		//真实应该ajax处理，这里异步模拟
		getProductList(context) {
			setTimeout(() => {
				context.commit('setProductList', product_data);
			}, 500);
		},
		buy(context) {
			// 真实环境应通过 ajax 提交购买请求后再清空购物列表
			return new Promise(resolve => {
				setTimeout(() => {
					context.commit('emptyCart');
					resolve();
				}, 500)
			});
		}
	}

});

new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => {
		return h(App)
	}
});