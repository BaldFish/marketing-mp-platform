<template>
  <div class="activity">
    <div class="head_wrap">
      <div class="photo_wrap">
        <img class="photo" src="../../common/images/head.png" alt="">
      </div>
      <div class="info_wrap">
        <div class="info_up">
          <p class="phone">18767570875</p>
        </div>
        <div class="info_down">
          <div class="left">我的元积分<span class="num">56562</span></div>
          <div class="right">
            <p class="text">积分明细</p>
            <div class="jiantou" @click="turnIntegralList"><img src="../../common/images/jiantou.png"></div>
          </div>
        </div>
        <div class="info_down" v-if="false">
          <p class="lack">您当前积分不足请参与活动赚取积分</p>
        </div>
      </div>
    </div>
    <div class="swiper_wrap">
      <swiper :options="swiperOption" class="awesome_swiper" ref="swiperOption">
        <swiper-slide v-for="(slide, index) in swiperOption.slides" :key="index" v-if="swiperOption.slides.length">
          <img :src="slide.url" alt="">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="swiperOption.slides.length>1"></div>
      </swiper>
      <my-count-down class="countDown" v-on:startCallback="startCallback()"
                     v-on:endCallback="endCallback()"
                     :currentTime="activity.now"
                     :startTime="activity.start_time"
                     :endTime="activity.end_time"
                     :tipText="'活动开始倒计时'"
                     :tipTextEnd="'本期活动结束倒计时：'"
                     :endText="'活动已结束'"
                     :dayTxt="'天'"
                     :hourTxt="'小时'"
                     :minutesTxt="'分钟'"
                     :secondsTxt="'秒'">
      
      </my-count-down>
    </div>
    <div class="block_wrap">
      <h2 class="title">礼品奖励</h2>
      <div class="list_wrap">
        <ul>
          <li>golo盒子一台</li>
        </ul>
      </div>
    </div>
    <div class="block_wrap">
      <h2 class="title">活动规则</h2>
      <div class="list_wrap">
        <ul>
          <li>1:	活动期间，每周一上午10点准时开启积分夺宝;</li>
          <li>2:	用户选择夺宝商品，即golo设备，参与夺宝;</li>
          <li>3:	参与人数达标后，每周五下午6点开奖公布当期夺宝人;</li>
          <li>4:	平台致电中奖夺宝人确认信息后，将于72小时内将奖品发送给中奖人;</li>
        </ul>
      </div>
    </div>
    <div class="block_wrap">
      <h2 class="title">如何赚取积分</h2>
      <div class="list_wrap">
        <ul>
          <li>1:	关注微信账号 “golo盒子” 一参与社区发帖，<span @click="">点我参与活动</span></li>
          <li>2:	玩游戏赚取积分，<span @click="">点我参与活动</span></li>
        </ul>
      </div>
    </div>
    <div class="block_wrap">
      <h2 class="title">最新赚取积分情况</h2>
      <div class="case_wrap">
        <swiper :options="caseOption" class="case_swiper" ref="caseOption">
          <swiper-slide v-for="(slide, index) in caseOption.slides" :key="index" v-if="caseOption.slides.length">
            <img src="../../common/images/gonggao.png" alt="">{{slide}}
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination" v-if="caseOption.slides.length>1"></div>
        </swiper>
      </div>
    </div>
    <div class="participation" @click="">点击参与夺宝</div>
  </div>
</template>

<script>
  import myCountDown from '../countDown'
  
  export default {
    name: "activity",
    components: {myCountDown},
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          slides: [
            {url: require('../../common/images/jsj01.png')},
          ],
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          loop: true,
          
        },
        activity: {},
        shareTitle: "@技师朋友们，轻松赚积分，好礼抱回家",
        shareDesc: "积分排行榜火热竞赛中，想要排名前列C位出道？进来比比吧！",
        shareUrl: location.origin + "/rankingList",
        shareImg: location.origin + "/static/images/share01.png",
        caseOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          slides: ["王师傅  已累积赚取100元积分","李师傅  已累积赚取2842元积分","高师傅 已累积赚取3843元积分"],
          autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          loop: true,
          direction: 'vertical',
          effect : '',
          slidesPerView : 3,
        },
      }
    },
    created() {
      this.$wxShare.wxShare(this, this.shareTitle, this.shareDesc, this.shareUrl, this.shareImg)
    },
    beforeMount() {
      this.$utils.setTitle("技师节");
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      //获取活动
      getActivity() {
        this.$axios({
          method: "GET",
          url:
            `${this.$baseURL}/v1/marketing/activity`,
        }).then((res) => {
          res.data.data.start_time = new Date(res.data.data.start_time).getTime();
          res.data.data.now = new Date(res.data.data.now).getTime();
          res.data.data.end_time = new Date(res.data.data.end_time).getTime();
          this.activity = res.data.data;
        }).catch((error) => {
          console.log(error.response.data)
        })
      },
      //活动开始回调
      startCallback(x) {
      },
      //活动结束回调
      endCallback(x) {
      },
      //跳转积分列表
      turnIntegralList() {
      }
    },
  }
</script>

<style scoped lang="stylus">
  .activity {
    width 750px
    margin 0 auto
    .head_wrap {
      width: 700px;
      height: 220px;
      background-color: #ffffff;
      box-shadow: 0px 5px 46px 8px rgba(56, 108, 246, 0.1);
      border-radius: 30px;
      margin: 0 auto;
      margin-bottom 28px;
      display: flex;
      align-items: center;
      
      .photo_wrap {
        width: 130px;
        height: 130px;
        margin-left 32px;
        background-color: #1b1b1b;
        border: solid 1px #eeeeee; /*px*/
        border-radius: 50%;
        
        .photo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      
      .info_wrap {
        margin-left: 15px;
        height 96px
        display flex
        flex-direction: column;
        justify-content: space-between;
        
        .info_up {
          .phone {
            font-size: 32px; /*px*/
            color: #222222;
          }
        }
        
        .info_down {
          width 488px
          height 34px
          line-height 34px
          display flex
          justify-content: space-between;
          
          .left {
            font-size: 24px; /*px*/
            color: #999999;
            
            .num {
              font-size: 34px; /*px*/
              color: #386cff;
            }
          }
          
          .right {
            display flex
            align-items: center;
            
            .text {
              font-size: 24px;/*px*/
              color: #999999;
            }
            
            .jiantou {
              width 20px
              height 30px
              line-height 30px
              margin-left 23px
              
              img {
                width 100%
                height 100%
              }
            }
          }
          
          .lack {
            font-size: 24px; /*px*/
            color: #999999;
          }
        }
      }
      
    }
    
    .swiper_wrap {
      width 750px
      height 320px
      margin 0 auto
      position relative
      
      .awesome_swiper {
        .swiper-wrapper {
          width 750px
          height 320px
          
          img {
            width 750px
            height 320px
          }
        }
      }
      
      .countDown {
        width 100%
        text-align center
        position absolute
        bottom 34px
        z-index 1000
        font-size: 30px; /*px*/
        color: #ffffff;
      }
    }
    
    .block_wrap {
      padding 50px 32px
      border-bottom 6px solid #f6f6f6;/*px*/
      .title {
        font-size: 40px;/*px*/
        color: #333333;
      }
      
      .list_wrap {
        ul {
          margin-top 23px
          li {
            font-size: 24px;/*px*/
            line-height: 36px;
            color: #333333;
            span{
              color: #386cff;
            }
          }
        }
      }
      .case_wrap{
        width 750px
        height 126px
        margin 0 auto
        position relative
        margin-top 40px
        .case_swiper {
          height 126px
          .swiper-wrapper {
            width 750px
            height 42px
      
            img {
              //width 750px
              //height 320px
            }
          }
        }
  
      }
    }
    .block_wrap:nth-child(6){
      border-bottom none
    }
    .participation{
      width: 676px;
      height: 100px;
      line-height 100px
      margin 0 auto
      margin-bottom 70px
      background-color: #386cff;
      box-shadow: 0px 0px 35px 0px rgba(56, 108, 255, 0.34);
      border-radius: 50px;
      text-align center
      font-size: 40px;/*px*/
      color: #ffffff;
    }
  }
</style>