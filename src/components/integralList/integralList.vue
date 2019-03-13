<template>
  <div class="integralList">
    <div class="bg_wrap">
      <div class="head_wrap">
        <div class="num_text">
          <p class="num">45622</p>
          <p class="text">元积分</p>
        </div>
        <div class="btn_wrap">
          <router-link to="">元积分订单</router-link>
        </div>
        <div class="list_title">--- <span>积分明细</span> ---</div>
      </div>
      <div class="list_wrap">
        <div class="bscroll" ref="bscroll">
          <p class="drop_down" v-if="dropDown">刷新中...</p>
          <div class="bscroll_container">
            <!--<p class="drop_down" v-if="dropDown">刷新中...</p>-->
            <ul>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
              <li>1</li>
            </ul>
            <p class="swipe_up" v-if="swipeUp">加载中...</p>
          </div>
          <p class="swipe_up" v-if="swipeUp">加载中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  
  export default {
    name: "integralList",
    components: {},
    data() {
      return {
        dropDown: false,
        swipeUp: false,
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.scrollFn()
    },
    watch: {},
    computed: {},
    methods: {
      scrollFn() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.bscroll, {
              click: true,
              scrollY: true,
              probeType: 1
            });
          } else {
            this.scroll.refresh();
          }
          this.scroll.on('scroll', (pos) => {
            //如果下拉超过50px 就显示刷新中...
            if (pos.y > 50) {
              this.dropDown = true
            } else {
              this.dropDown = false
            }
            if (this.scroll.maxScrollY > pos.y + 50) {
              this.swipeUp = true;
            }else{
              this.swipeUp = false;
            }
          })
          
          //touchEnd（手指离开以后触发） 通过这个方法来监听下拉刷新
          this.scroll.on('touchEnd', (pos) => {
            // 下拉动作
            if (pos.y > 50) {
              console.log("下拉刷新成功")
              this.dropDown = false
            }
            //上拉加载 总高度>下拉的高度+50 触发加载中...
            if (this.scroll.maxScrollY > pos.y + 50) {
              //this.swipeUp = false;
              console.log("加载成功")
              //使用refresh 方法 来更新scroll  解决无法滚动的问题
              this.scroll.refresh()
            }
          })
        });
      }
    },
  }
</script>

<style scoped lang="stylus">
  .integralList {
    .bg_wrap {
      width: 740px;
      height: 1210px;
      margin 0 auto
      padding-top 30px
      background url("../../common/images/list_bg.png") no-repeat center
      background-size: 100% 100%;
      
      .head_wrap {
        padding-top 20px
        text-align center
        position relative
        
        .num_text {
          vertical-align top
          width 200px
          height 200px
          margin 0 auto
          text-align center
          padding-top 43px
          
          .num {
            font-size: 36px; /*px*/
            color: #386cff;
            line-height 60px
            font-weight bold
          }
          
          .text {
            font-size: 30px; /*px*/
            color: #333333;
            line-height 54px
            font-weight bold
          }
        }
        
        .btn_wrap {
          position absolute
          right 70px
          top 103px
          
          a {
            font-size: 26px; /*px*/
            color: #333333;
            font-weight bold
          }
        }
        
        .list_title {
          margin-top 53px
          font-size: 34px; /*px*/
          color: #999999;
          font-weight bold
          
          span {
            color: #333333;
            font-weight bold
          }
        }
      }
      
      .list_wrap {
        width 680px
        height 840px
        margin 0 auto
        overflow hidden
        
        .bscroll {
          margin-top 50px
          width: 100%;
          height: 790px;
          overflow: hidden;
          background: #ff0000;
          
          .drop_down {
            text-align center
            font-size: 30px; /*px*/
            line-height: 100px;
            color: #333333;
          }
          
          .bscroll_container {
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
</style>
