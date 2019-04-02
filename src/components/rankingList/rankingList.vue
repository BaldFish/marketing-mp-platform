<template>
  <div class="rankingList">
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
    <div class="list_title">
      <div class="title">*中奖名单*</div>
      <div class="list_wrap">
        <scroller class="scroller"
                  :on-refresh="refresh"
                  :on-infinite="infinite"
                  ref="my_scroller">
          <table>
            <tr>
              <th>排名</th>
              <th>手机号</th>
              <th>积分总额</th>
            </tr>
            <tr v-for="(item,index) of rankingList" :key="item.id" @click="turnIntegralList">
              <td>{{index+1}}</td>
              <td>{{item.phone}}</td>
              <td>{{item.balance}}</td>
            </tr>
          </table>
        </scroller>
      </div>
    </div>
    <div class="rules_wrap">
      <div class="rules_title">*活动规则*</div>
      <ul class="rules">
        <li class="rule">1.<span>活动时间：2019年3月4日-2019年7月15日 （为期20周）；</span></li>
        <li class="rule">2.<span>活动将设20个竞争周期，每个周期结束，排名第一的用户将直接领走现金1000元；</span></li>
        <li class="rule">3.<span>每个竞争周期为周一0点至周日24点，积分排名第一（且大于100积分）的用户即为该周积分周冠军；</span></li>
        <li class="rule">4.<span>冠军产生后，将有工作人员在24小时内通过电话、短信等方式联系中奖者进行千元大礼发放事宜；</span></li>
        <li class="rule">5.<span>活动期间，每个账号、每个人仅有一次参赛机会；</span></li>
        <li class="rule">6.<span>活动期间务必保持通话畅通，无法取得联系的中奖者视为自动放弃领奖；</span></li>
        <li class="rule">7.<span>严禁放水、作弊等操作，周排名出示后，后台将对用户积分进行二次审核，如存在不规范行为，有权对其积分进行减分、清零等操作。</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import myCountDown from './countDown'
  export default {
    name: "rankingList",
    components: {myCountDown},
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          slides: [
            {url: require('../../common/images/banner_bg.png')},
          ],
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
            loop: true,
          },
          
        },
        userId: "",
        token: "",
        phone:"",
        page: 1,
        limit: 10,
        total: 0,
        activity: {},
        rankingList: [],
        shareTitle:"@技师朋友们，轻松赚积分，好礼抱回家",
        shareDesc:"积分排行榜火热竞赛中，想要排名前列C位出道？进来比比吧！",
        shareUrl:location.origin+"/rankingList",
        shareImg:location.origin+"/static/images/share01.jpg",
      }
    },
    created() {
      this.$wxShare.wxShare(this,this.shareTitle, this.shareDesc,this.shareUrl,this.shareImg)
    },
    beforeMount() {
      this.$utils.setTitle("排行榜");
      if(this.$utils.getCookie("userId")&&this.$utils.getCookie("token")&&this.$utils.getCookie("userPhone")){
        this.userId=this.$utils.getCookie("userId");
        this.token=this.$utils.getCookie("token");
        this.phone=this.$utils.getCookie("userPhone").substr(3);
      }
      this.getActivity();
      this.getRankingList();
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
      //获取排行榜列表
      getRankingList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/marketing/rank?page=${this.page}&limit=${this.limit}`,
        }).then((res) => {
          this.total=res.data.data.count;
          this.rankingList=res.data.data.ranks;
        }).catch((error) => {
          console.log(error.response.data)
        })
      },
      //下拉刷新
      refresh(done) {
        setTimeout(() => {
          this.page = 1;
          this.$axios({
            method: 'GET',
            url: `${this.$baseURL}/v1/marketing/rank?page=${this.page}&limit=${this.limit}`,
          }).then(res => {
            this.total=res.data.data.count;
            this.rankingList=res.data.data.ranks;
            this.$refs.my_scroller.finishPullToRefresh()
          }).catch(error => {
            console.log(error)
          })
        }, 1500)
        
      },
      //上拉加载
      infinite(done) {
        setTimeout(() => {
          this.page++;
          this.$axios({
            method: 'GET',
            url: `${this.$baseURL}/v1/marketing/rank?page=${this.page}&limit=${this.limit}`,
          }).then(res => {
            this.total=res.data.data.count;
            if (this.rankingList.length >= this.total) {
              this.$refs.my_scroller.finishInfinite(true);
              this.page--;
            } else {
              this.rankingList = this.rankingList.concat(res.data.data.ranks);
              this.$refs.my_scroller.finishInfinite(false);
            }
          }).catch(error => {
            console.log(error)
          })
        }, 1500)
        
      },
      //跳转积分列表页
      turnIntegralList(){
        this.$router.push('/integralList')
      },
    },
  }
</script>

<style scoped lang="stylus">
  .rankingList {
    .swiper_wrap {
      width 750px
      height 300px
      margin 0 auto
      position relative
      
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
    
    .list_title {
      width: 680px;
      height: 820px;
      box-shadow: 0px 2px 27px 8px rgba(14, 14, 14, 0.08);
      border-radius: 30px;
      margin 0 auto
      margin-top 40px
      
      .title {
        font-size: 34px; /*px*/
        line-height: 100px;
        color: #386cff;
        text-align center
      }
      
      .list_wrap {
        width 680px
        height 720px
        margin 0 auto
        overflow hidden
        position relative
        
        .scroller {
          table {
            width 100%
            
            tr {
              line-height 66px
              font-size: 26px; /*px*/
              
              th {
                color: #000000;
              }
              
              td {
                text-align center
                color: #222222;
              }
            }
          }
          
        }
      }
    }
    
    .rules_wrap {
      width: 680px;
      //height: 726px;
      box-shadow: 0px 2px 27px 8px rgba(14, 14, 14, 0.08);
      border-radius: 30px;
      margin 0 auto
      margin-top 40px
      margin-bottom 100px
      
      .rules_title {
        font-size: 34px; /*px*/
        line-height: 100px;
        color: #386cff;
        text-align center
      }
      
      .rules {
        width 610px
        margin 0 auto
        padding-bottom 50px
        
        .rule {
          line-height 36px
          font-size: 24px; /*px*/
          color: #333333;
          
          span {
            padding-left 20px
          }
        }
      }
    }
  }
</style>
