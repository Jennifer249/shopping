<!-- 商品小卡片组件 -->
<template>
	<div class="product">
		<!-- router-link跳转到 商品详情页面 -->
		<router-link :to="'/ProductDetail/' + info.id" class='product-main'>
			<img :src="info.image">
			<h4>{{ info.name }}</h4>
			<div class="product-color" :style="{background:colors[info.color]}"></div>
			<div class="product-cost">￥{{  info.cost }}</div>
			<!-- prevent:阻止默认操作，防止点击按钮的同时，也点击到a标签进入详情页面-->
			<div class="product-add-cart" @click.prevent='handleCart'>加入购物车</div>	
		</router-link>
	</div>
</template>
/* eslint-disable */
<script>
	export default {
		props: {
			// 暴露出来，被其他组件使用，传值,从而自身组件内容
			info:Object
		},
		data() {
			return {
				colors:{ //map映射颜色和色值
					'白色': '#ffffff',
					'金色': '#dac272',
					'蓝色': '#233472',
					'红色':'#f2352e'
				}
			}
		},
		methods:{	//加入购物车方法
			handleCart(){
				this.$store.commit('addCart', this.info.id);
			}
		}
	};
</script>
/* eslint-disable */
<style scoped>
	.product{
		width:25%;
		float:left;
	}
	.product-main {
		display: block;
		margin:16px;
		padding:16px;
		border:1px solid #dddee1;
		border-radius:6px;
		/*当内容溢出文本框，其余部分被隐藏*/
		overflow:hidden;
		background: #fff;
		text-align: center;
		position: relative;
	}
	.product-main img{
		width: 100%;
	}
	h4{
		color:#222;
		overflow:hidden;
		/*当文本溢出，多的部分用省略符号替换*/
		text-overflow: ellipsis;
		/*文本不换行*/
		white-space: nowrap;
	}
	.product-main:hover h4{
        color: #0070c9;
    }
	.product-color{
		display: block;
		width: 16px;
		height: 16px;
		border:1px solid #dddee1;
		border-radius:50%;
		margin:6px auto;
	}
	.product-cost{
		color: #de4037;
		margin-top: 6px;
	}
	.product-add-cart{
        display: none;
        padding: 4px 8px;
        background: #2d8cf0;
        color: #fff;
        font-size: 12px;
        border-radius: 3px;
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: 5px;
    }
    .product-main:hover .product-add-cart{
        display: inline-block;
    }
</style>