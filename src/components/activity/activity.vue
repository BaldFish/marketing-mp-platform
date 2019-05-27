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
          <p class="left">我的元积分<span class="num">56562</span></p>
          <p class="right">积分明细<img class="jiantou" src="../../common/images/jiantou.png"></p>
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
      <my-count-down  class="countDown" v-on:startCallback="startCallback()"
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
            loop: true,
          },
    
        },
        activity: {},
        shareTitle:"@技师朋友们，轻松赚积分，好礼抱回家",
        shareDesc:"积分排行榜火热竞赛中，想要排名前列C位出道？进来比比吧！",
        shareUrl:location.origin+"/rankingList",
        shareImg:location.origin+"/static/images/share01.png",
      }
    },
    created() {
      this.$wxShare.wxShare(this,this.shareTitle, this.shareDesc,this.shareUrl,this.shareImg)
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
      startCallback (x) {
      },
      //活动结束回调
      endCallback (x) {
      },
    },
  }
</script>

<style scoped lang="stylus">
  .activity {
    .head_wrap{
      width: 700px;
      height: 220px;
      background-color: #ffffff;
      box-shadow: 0px 5px 46px 8px rgba(56, 108, 246, 0.1);
      border-radius: 30px;
      margin: 0 auto;
      margin-bottom 28px;
      display: flex;
      align-items: center;
      //justify-content: center;
      .photo_wrap{
        width: 130px;
        height: 130px;
        margin-left 32px;
        background-color: #1b1b1b;
        border: solid 1px #eeeeee;
        border-radius: 50%;
        .photo{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      
      .info_wrap{
        margin-left: 15rpx;
        .info_up{
          display: flex;
          align-items: center;
          .phone{
            font-size: 16px;
            color: #222222;
          }
        }
        .info_down{
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #999999;
          margin-top: 40rpx;
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
    
  }
</style>