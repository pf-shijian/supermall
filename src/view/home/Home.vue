<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-vew></feature-vew>
      <tab-control
        class="tab-control"
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childrenComps/HomeSwiper";
import FeatureVew from "./childrenComps/FeatureVew";
import RecommendView from "./childrenComps/recommendView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "../../components/content/scroll/Scroll";
import BackTop from "../../components/content/backTop/BackTop";

import {getHomeMultidata, getHomeGoods} from "network/home";
import {debounce} from "../../common/utils";

export default {
  name: "Home",
  components: {
    FeatureVew,
    HomeSwiper,
    RecommendView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      isShowBackTop: false,
      firstRun: 1
    }
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh)
    this.$bus.$on('itemImageLoad', () => {
      this.$refs.scroll && refresh()
    })

  },
  methods: {
    /**
     * 事件监听的相关方法
     */

    tabClick(index) {
      switch (index) {
        case 0 :
          this.currentType = 'pop'
          break
        case 1 :
          this.currentType = 'new'
          break
        case 2 :
          this.currentType = 'sell'
          break
      }
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 800)
    },
    contentScroll(position) {
      // console.log(position);
      this.isShowBackTop = (-position.y) > 1000
    },


    /**
     * 网络请求的相关方法
     */
    getHomeMultidata() {
      getHomeMultidata().then(({data}) => {
        this.banners = data.banner.list;
        this.recommends = data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(({data}) => {
        this.goods[type].list.push(...data.list);
        this.goods[type].page += 1;
      })
    }
  },

}
</script>

<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
}

.home-nav {
  background: var(--color-tint);
  color: #ffffff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  background: #ffffff;
  position: sticky;
  top: 44px;
  z-index: 9;
}

.content {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 49px;
}


/*.content{
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px;

}*/
</style>
