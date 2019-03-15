<template>
  <div class="rankingList">
    <div class="swiper_wrap">
      <swiper :options="swiperOption" class="awesome_swiper" ref="swiperOption">
        <swiper-slide v-for="(slide, index) in slides" :key="index" v-if="slides.length">
          <img :src="slide.url" alt="">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination" v-if="slides.length>1"></div>
      </swiper>
      <div class="countDown">本期活动倒计时：3天12时54分44秒</div>
    </div>
    <div class="list_title">
      <div class="title">*中奖名单*</div>
      <div class="list_wrap">
        <div class="bscroll" ref="bscroll">
          <div class="bscroll_container">
            <div class="drop_down" v-if="dropDown">刷新中...</div>
            <table>
              <tr>
                <th>排名</th>
                <th>手机号</th>
                <th>积分总额</th>
              </tr>
              <tr v-for="(item,index) of 30">
                <td>{{index+1}}</td>
                <td>12345678901</td>
                <td>2300</td>
              </tr>
            </table>
            <div class="swipe_up" v-if="swipeUp">加载中...</div>
          </div>
        </div>
      </div>
    </div>
    <div class="rules_wrap">
      <div class="rules_title">*活动规则*</div>
      <ul class="rules">
        <li class="rule">1-<span>活动时间：2019年3月4日-2019年7月15日（为期20周）；</span></li>
        <li class="rule">1-<span>活动时间：2019年3月4日-2019年7月15日（为期20周）；</span></li>
        <li class="rule">1-<span>活动时间：2019年3月4日-2019年7月15日（为期20周）；</span></li>
        <li class="rule">1-<span>活动时间：2019年3月4日-2019年7月15日（为期20周）；</span></li>
        <li class="rule">1-<span>活动时间：2019年3月4日-2019年7月15日（为期20周）；</span></li>
        <li class="rule">1-<span>活动时间：2019年3月4日-2019年7月15日（为期20周）；</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  
  export default {
    name: "rankingList",
    components: {},
    data() {
      return {
        slides: [
          {url: require('../../common/images/banner_bg.png')},
        ],
        swiperOption: {
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
            loop: true,
          },
          pagination: {
            el: '.swiper-pagination'
          },
        },
        dropDown: false,
        swipeUp: false,
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.scrollFn();
    },
    watch: {},
    computed: {},
    methods: {
      scrollFn() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.bscroll, {
              click: false,
              scrollY: true,
              probeType: 3,
              refreshDelay: 20,
            });
          } else {
            this.scroll.refresh();
          }
          this.scroll.on('scroll', (pos) => {
            //如果下拉超过50px 就显示刷新中...
            if (pos.y > 100) {
              this.dropDown = true
            } /*else {
              this.dropDown = false
            }*/
            if (this.scroll.maxScrollY > pos.y + 100) {
              this.swipeUp = true;
            }/*else {
              this.swipeUp = false
            }*/
          })
          
          //touchEnd（手指离开以后触发） 通过这个方法来监听下拉刷新
          this.scroll.on('touchEnd', (pos) => {
            // 下拉动作
            if (pos.y > 100) {
              let that = this
              window.setTimeout(function () {
                that.dropDown = false;
                that.scroll.refresh()
                console.log("下拉刷新成功")
              }, 5000)
            }
            //上拉加载 总高度>下拉的高度+50 触发加载中...
            if (this.scroll.maxScrollY > pos.y + 100) {
              this.swipeUp = true;
              let that = this
              window.setTimeout(function () {
                that.swipeUp = false;
                that.scroll.refresh()//使用refresh 方法 来更新scroll  解决无法滚动的问题
                console.log("加载成功")
              }, 5000)
            }
          })
        });
      }
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
      height: 726px;
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
        height 626px
        margin 0 auto
        overflow hidden
        
        .bscroll {
          width: 100%;
          max-height: 626px;
          
          .bscroll_container {
            min-height: 627px;
            
            .drop_down {
              text-align center
              font-size: 30px; /*px*/
              line-height: 100px;
              color: #333333;
            }
            
            ul {
              padding 0 30px
              
              .list {
                border-bottom 1px solid #e5e5e5; /*no*/
                line-height 146px
                
                .title_time {
                  margin-top 25px
                  
                  .title {
                    font-size: 30px; /*px*/
                    color: #222222;
                    line-height 54px
                    vertical-align middle
                  }
                  
                  .time {
                    font-size: 24px; /*px*/
                    color: #999999;
                    line-height 48px
                    vertical-align middle
                  }
                }
                
                .record {
                  line-height 146px
                  font-size: 34px; /*px*/
                  color: #d90024;
                }
              }
              
              .list:last-child {
                border-bottom none
              }
            }
            
            table {
              width 100%
              
              tr {
                line-height 66px
                font-size: 26px;/*px*/
                th{
                  //font-size: 26px;/*px*/
                  color: #000000;
                }
                td{
                  text-align center
                  //font-size: 26px;/*px*/
                  color: #222222;
                }
              }
            }
            
            .swipe_up {
              text-align center
              font-size: 30px; /*px*/
              line-height: 100px;
              color: #333333;
            }
          }
          
        }
      }
    }
    .rules_wrap{
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
      .rules{
        width 610px
        margin 0 auto
        padding-bottom 50px
        .rule{
          line-height 36px
          font-size: 24px;/*px*/
          color: #333333;
          span{
            padding-left 40px
          }
        }
      }
    }
  }
</style>
