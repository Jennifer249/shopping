/* eslint-disable */
<!-- 在根实例中挂载路由并设置导航条 -->
<template>
  <div>
    <div class='header'>
      <router-link to='/ProductList' class='header-title'>电商网 </router-link>
      <div class="header-menu">
        <router-link to='/CartList' class="header-menu-cart">购物车
        <!-- 表示购物车里的商品数量 -->
        <span v-if="cartList.length">{{ cartList.length }}</span>
        </router-link>
      </div>
    </div>
    <!-- 路由显示区 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    cartList() {//返回购物车数据
      return this.$store.state.cartList;
    }
  }
}
</script>

<!-- App.vue的样式在style.css中定义 -->
