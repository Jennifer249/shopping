/* eslint-disable */
<!-- 商品列表界面：过滤选项和所有商品显示组件 -->
<template>
	<div v-show="list.length">
		<!-- 过滤选项： -->
		<div class="list-control">
			<!-- 品牌列表 -->
			<div class="list-control-filter">
				<span>品牌：</span>
				<span
				class="list-control-filter-item"
				:class="{on:item === filterBrand}"
				v-for="item in brands"
				@click="handleFilterBrand(item)">{{ item }}</span>
			</div>
			<!-- 颜色列表 -->
			<div class="list-control-filter">
				<span>颜色：</span>
				<span
				class="list-control-filter-item"
				:class="{on:item === filterColor}"
				v-for="item in colors"
				@click="handleFilterColor(item)">{{ item }}</span>
			</div>
			<!-- 排序列表 -->
			<div class="list-control-order">
				<span>排序：</span>
				<!-- class="{on:order === ''}" 为真，则显示on样式 -->
				<span 
					class="list-control-order-item" 
					:class="{on:order === ''}"	
					@click="handleOrderDefault">默认</span>
				<span
					class="list-control-order-item"
					:class="{on:order === 'sales'}"
					@click="handleOrderSales">
					销量
					<template v-if="order === 'sales'">↓</template>
				</span>
				<span
				class="list-control-order-item"
				:class="{on:order.indexOf('cost') > -1}"
				@click="handleOrderCost">
					价格
					<template v-if="order === 'cost-asc'">↑</template>
					<template v-if="order === 'cost-desc'">↓</template>
				</span>
			</div>
			<div class="list-control-search">
				<span>关键字:</span>
				<input type="text" v-model="searchContent">
				<span class="list-control-search-button " @click="handleSearchProduct">查询</span>
			</div>
		</div>
		<!--所有商品显示：
			Product使用来自product.vue定义的商品小卡片组件；
			v-bind:info传值进去；
			v-bind:key 每项都有的且唯一的 id，用来跟踪每一项-->
		<div class="list-show">
			<Product v-for="item in filteredAndOrderedList" :info="item" :key="item.id"></Product>
		</div>
		<div class="product-not-found" v-show="!filteredAndOrderedList.length">暂无相关商品</div>
		<div class="page-show">
			<Page class='paging ivu-icon' v-show="filteredAndOrderedList.length" :current="pageIndex" :total= "dataCount" :page-size="pageSize" show-total @on-change="changePage"></Page>
		</div>
	</div>
</template>
<script>
	// 导入商品缩略图展示组件
	import Product from '../components/ProductItem.vue';
	import { Page } from 'iview';
	export default {
		components:{ Product, Page },
		data(){	// 是函数
			return {
				order:'',	// 排序依据，可选值为：sales(增量)、cost-desc(价格降序)、cost-asc(价格升序)
				filterBrand:'',	//选择的品牌
				filterColor:'',	//选择的商品
				searchContent:'',
				searchList:[],
				search: false,
				dataCount:0,	//初始化信息总条数
				pageSize:8,	//每页条数
				pageIndex:1
			}
		},
	    mounted () {
	        this.$store.dispatch('getProductList');
        },
		methods:{	// 对data里的数据进行赋值
			handleFilterBrand (brand) {
				//再次点击则取消
				if(this.filterBrand === brand) {
					this.filterBrand = ''
				}
				else {
					this.filterBrand = brand;
				}
				this.pageIndex = 1;
				this.search = false;
			},
			handleFilterColor (color) {
				if(this.filterColor == color) {
					this.filterColor = ''
				}
				else {
					this.filterColor = color;
				}
				this.pageIndex = 1;
				this.search = false;
			},
			handleOrderDefault () {
                this.order = '';
                this.pageIndex = 1;
                this.search = false;
            },
            handleOrderSales () {
                this.order = 'sales';
                this.pageIndex = 1;
                this.search = false;
            },
            handleOrderCost () {
                if (this.order === 'cost-desc') {
                    this.order = 'cost-asc';
                } else {
                    this.order = 'cost-desc';
                }
                this.pageIndex = 1;
                this.search = false;
            },
            handleSearchProduct () {
            	if(this.searchContent === ''){
            		this.searchList = [];
            		window.alert("请输入商品名");
            		this.search = false;
            		this.pageIndex = 1;
            		return;
            	}
            	else {
            		let list = [...this.list];	// 数组
            		//用正则表达式匹配搜索项，任意关键词只要存在于商品信息中则匹配
            		let patt = new RegExp(this.searchContent);
            		this.searchList = list.filter(item => 
            			patt.test(item.name)
            			|| patt.test(item.cost)
            			|| patt.test(item.brand));

            		if(this.searchList.length)
            			this.search = true;
            		else {
            			window.alert("没有匹配到的内容");
            			this.search = false;
            		}
            		this.pageIndex = 1;
            	}
            },
            changePage (index) {
            	this.pageIndex = index;
            }
		},
		// computed vs method :computed 是基于它的依赖缓存，只有相关依赖发生改变时才会重新取值。而使用 methods ，在重新渲染的时候，函数总会重新调用执行。
		// vuex的getters vs 组件的computed： 存在其他组件复用用getters，纸盒当前业务组件强关系的数据computed
		computed:{
			list () {
				return this.$store.state.productList;	//获取商品列表数据
			},
			brands () {
				return this.$store.getters.brands;
			},
			colors () {
				return this.$store.getters.colors;
			},
			filteredAndOrderedList(){	// 根据data里的值返回对应商品列表，层层筛选
				// 复制原始数据
				let list = [...this.list];	// 数组

				if(this.search == true) {
					list =  this.searchList;
				}
				else {
						// 按品牌过滤
	                if (this.filterBrand !== '') {
	                    list = list.filter(item => item.brand === this.filterBrand);
	                }
	                // 按颜色过滤
	                if (this.filterColor !== '') {
	                    list = list.filter(item => item.color === this.filterColor);
	                }
	                // 按排序过滤
					if(this.order !== '') {
						if(this.order === 'sales') {	// 按照销售排序
							list = list.sort((a, b) => b.sales - a.sales);	
						}else if(this.order === 'cost-desc') {	// 按照价格排序
							list = list.sort((a, b) => b.cost - a.cost);
						}else if(this.order === 'cost-asc') {
							list = list.sort((a, b) => a.cost - b.cost);
						}
					}
				}
				this.dataCount = list.length;
				if(list.length <= this.pageSize){
					return list;
				}
				else{
					var _start = (this.pageIndex - 1) * this.pageSize;
					var _end = this.pageIndex * this.pageSize;
					return list.slice(_start,_end);
				}
				
			}
		}
	}
</script>
<style scoped>
    .list-control{
        background: #fff;
        border-radius: 6px;
        margin: 16px;
        padding: 16px;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
    }
    .list-control-filter,
    .list-control-order{
        margin-bottom: 16px;
    }
    .list-control-filter-item,
    .list-control-order-item {
        cursor: pointer;
        display: inline-block;
        border: 1px solid #e9eaec;
        border-radius: 4px;
        margin-right: 6px;
        padding: 2px 6px;
    }
    .list-control-filter-item.on,
    .list-control-order-item.on{
        background: #f2352e;
        border: 1px solid #f2352e;
        color: #fff;
    }
    .product-not-found{
        text-align: center;
        padding: 32px;
    }
    .list-control-search-button{
    	padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
        display: inline-block;
        padding: 8px 32px;
        border-radius: 6px;
        background: #2d8cf0;
        color: #fff;
        cursor: pointer;
    }
    .list-show{
    	display: inline-block;
    }
    .page-show{
    	padding-bottom: 18px;
    	text-align: center;
    	font-size: 16px;
    }
</style>