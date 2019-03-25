<template>
  <div class="home">
    <div class="swiper_wrap">
      <swiper :options="swiperOption" class="awesome_swiper" ref="swiperOption">
        <swiper-slide v-for="(slide, index) in swiperOption.slides" :key="index" v-if="swiperOption.slides.length">
          <img :src="slide.url" alt="">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="swiperOption.slides.length>1"></div>
      </swiper>
    </div>
    <div class="summary">
      <div class="title_wrap">
        <div class="img_wrap">
          <img src="../../common/images/head.png" alt="">
        </div>
        <div class="phone_integral">
          <p class="phone">18801370245</p>
          <p class="integral">我的元积分：<span>452266&nbsp;&nbsp;</span><img src="../../common/images/right.png" alt=""></p>
        </div>
      </div>
      <div>
        <p class="ranking">您现在位列 1200 名</p>
        <p class="percentage">排名超过全国 89% 的维修技师</p>
      </div>
    </div>
    <div class="list_wrap">
      <ul class="clearfix">
        <li class="fl">
          <div>
            <img src="../../common/images/recharge_card.png" alt="">
          </div>
          <p>20积分</p>
        </li>
        <li class="fl">
          <div>
            <img src="../../common/images/jd02.png" alt="">
          </div>
          <p>20积分</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    components: {},
    data() {
      return {
        swiperOption: {//轮播配置
          pagination: {//标记样式
            el: '.swiper-pagination'
          },
          slides: [//轮播图片数据
            {url: require('../../common/images/banner_bg.png')},
          ],
          autoplay: {
            delay: 2000,//轮播时间
            stopOnLastSlide: false,
            disableOnInteraction: false,
            loop: true,//自动轮播
          },
        },
        userId:"",
        token:"",
        page:1,
        limit:10,
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.getProductList();
    },
    watch: {},
    computed: {},
    methods: {
      //获取用户排行
      getUserRankingList(){
        this.$axios({
          method:"GET",
          url:`${this.$baseURL}/v1/marketing/user/ranking/${this.userId}`,
          headers: {
            'Access-Token': `${this.token}`
          }
        }).then((res)=>{
          console.log(res.data.data)
        }).catch((error)=>{
          console.log(error.response.data)
        })
      },
      //获取商品列表
      getProductList(){
        this.$axios({
          method:"GET",
          url:`${this.$baseURL}/v1/marketing/commodity/list?page=${this.page}&limit=${this.limit}`,
        }).then((res)=>{
          console.log(res.data.data)
        }).catch((error)=>{
          console.log(error.response.data)
        })
      },
    },
  }
</script>

<style scoped lang="stylus">
  .home {
    .swiper_wrap {
      width 750px
      height 300px
      margin 0 auto
      
      .awesome_swiper {
        .swiper-wrapper {
          width 750px
          height 300px
          
          img {
            width 750px
            height 300px
          }
        }
      }
    }
    
    .summary {
      width: 680px;
      height: 270px;
      background-color: #ffffff;
      box-shadow: 0px 2px 46px 8px rgba(152, 152, 152, 0.2);
      border-radius: 32px;
      margin 0 auto
      position relative
      top -60px
      z-index 1000
      
      .title_wrap {
        padding 25px 0 0 25px
        font-size 0
        
        .img_wrap {
          display inline-block
          width 80px
          height 80px
          vertical-align top
          margin-right 30px
          
          img {
            max-width 80px
            max-height 80px
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            border-radius 40px
          }
        }
      }
      
      .phone_integral {
        display inline-block
        margin-bottom 16px
        
        .phone {
          font-size: 24px; /*px*/
          color: #222222;
          line-height 30px
        }
        
        .integral {
          font-size: 38px; /*px*/
          color: #222222;
          line-height 48px
          
          span {
            color: #386cff;
          }
          
          img {
            max-width 17px
            max-height 29px
          }
        }
      }
      
      .ranking, .percentage {
        text-align center
        font-size: 34px; /*px*/
        line-height: 60px;
        color: #333333;
      }
    }
    
    .list_wrap {
      width: 680px;
      min-height: 764px;
      background-color: #ffffff;
      box-shadow: 0px 2px 27px 8px rgba(14, 14, 14, 0.08);
      border-radius: 30px
      margin 0 auto
      position relative
      top -28px
      
      ul {
        li {
          margin-left 26px
          margin-top 50px
          
          div {
            width 300px
            height 300px
            background-color: #f4f4f4;
            box-shadow: 2px 1px 12px 1px rgba(119, 119, 119, 0.07);
            text-align center
            
            img {
              max-width 300px
              max-height 300px
              position: relative;
              top: 50%;
              transform: translateY(-50%);
            }
          }
          
          p {
            text-align center
            font-size: 30px; /*px*/
            line-height 78px
            color: #222222;
          }
        }
      }
    }
  }
</style>
