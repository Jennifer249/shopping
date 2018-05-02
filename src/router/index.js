/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//路由索引
const Routers = [{
	path: '/CartList',
	meta: {
		title: '购物车'
	},
	component: (resolve) => require(['../components/CartList.vue'], resolve)
}, {
	path: '/ProductDetail/:id',
	meta: {
		title: '商品详情'
	},
	component: (resolve) => require(['../components/ProductDetail.vue'], resolve)
}, {
	path: '/ProductList',
	meta: {
		title: '商品列表',
	},
	component: (resolve) => require(['../components/ProductList.vue'], resolve)
}, {
	path: '*', //其他路径指向
	redirect: '/ProductList'
}];

//配置路由为history，路径用/标记
export default new VueRouter({
	mode: 'history',
	routes: Routers
})