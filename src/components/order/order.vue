<template>
  <div class="order">
    <div class="tabs_wrap">
      <ul>
        <li>
          <label>
            <span :class="{'checked':status==='full'}">全部状态</span>
            <input type="radio" value="full" name="orderStatus" v-model="status" checked>
          </label>
        </li>
        <li>
          <label>
            <span :class="{'checked':status==='succeed'}">交易成功</span>
            <input type="radio" value="succeed" name="orderStatus" v-model="status">
          </label>
        </li>
        <li>
          <label>
            <span :class="{'checked':status==='failed'}">交易失败</span>
            <input type="radio" value="failed" name="orderStatus" v-model="status">
          </label>
        </li>
      </ul>
    </div>
    <div class="list_wrap">
      <div class="bscroll" ref="bscroll">
        <div class="bscroll_container">
          <div class="drop_down" v-if="dropDown">刷新中...</div>
          <ul>
            <li class="list" v-for="item of 10">
              <div class="list_title clearfix">
                <span>订单号：yz294485553</span>
                <span class="fr">交易成功</span>
              </div>
              <ul class="list_content">
                <li class="content_head">
                  <span class="img_wrap"><img src="../../common/images/jd03.png" alt=""></span>
                  <span>20元话费</span>
                </li>
                <li class="content_time">订单时间：<span>2018.10.03 15:34</span></li>
                <li class="content_description" v-if="a">共 <span>2</span> 件商品，实付 <span>40</span> 积分</li>
                <li class="content_description" v-if="!a">抱歉，兑换商品已抢空；未消耗您的积分</li>
              </ul>
            </li>
          </ul>
          <div class="swipe_up" v-if="swipeUp">加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "order",
    components: {},
    data() {
      return {
        status:"full",
        dropDown: false,
        swipeUp: false,
        a:true,
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.scrollFn()
    },
    watch: {
      status:function () {
        console.log(this.status)
      }
    },
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
  .order {
    .tabs_wrap{
      position: absolute;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      z-index 1000
      ul{
        width 750px
        height 90px
        margin 0 auto
        background-color: #f8f8f8;
        font-size 0
        li{
          width 33.3333%
          display inline-block
          font-size: 28px;/*px*/
          color: #222222;
          text-align center
          span{
            display inline-block
            height 90px
            line-height 90px
          }
          .checked{
            font-size: 30px;/*px*/
            color: #386cff;
            border-bottom 2px solid #386cff;
          }
          input{
            display none
          }
        }
      }
    }
    .list_wrap {
      width 688px
      height 1334px
      margin 0 auto
      overflow hidden
      padding-top 90px
      .bscroll {
        width: 100%;
        max-height: 1198px;
        .bscroll_container {
          min-height: 1199px;
          
          .drop_down {
            text-align center
            font-size: 30px; /*px*/
            line-height: 100px;
            color: #333333;
          }
        
          ul {
            padding-bottom 10px
            .list {
              width: 688px;
              height: 330px;
              background-color: #ffffff;
              box-shadow: 0 0 3px rgba(0, 0, 0, 0.3) inset;
              border-radius: 30px;
              margin-top 46px
              padding 0 25px
              .list_title{
                line-height 86px
                border-bottom 1px solid #eeeeee;/*no*/
                span:first-child{
                  font-size: 28px;/*px*/
                  color: #333333;
                  font-weight bold
                }
                span:last-child{
                  font-size: 32px;/*px*/
                  color: #386cff;
                }
              }
              .list_content{
                .content_head{
                  font-size 0
                  margin-top 22px
                  span:first-child{
                    display inline-block
                    width 70px
                    height 70px
                    text-align center
                    background-color: #f4f4f4;
                    box-shadow: 2px 1px 12px 1px rgba(119, 119, 119, 0.07);
                    vertical-align middle
                    margin-right 25px
                    img{
                      max-width 70px
                      max-height 70px
                      position: relative;
                      top: 50%;
                      transform: translateY(-50%);
                    }
                  }
                  span:last-child{
                    vertical-align middle
                    display inline-block
                    font-size: 32px;/*px*/
                    color: #333333;
                    font-weight bold
                  }
                }
                .content_time{
                  margin-top 36px
                  font-size: 26px;/*px*/
                  color: #666666;
                  span{
                    font-size: 28px;/*px*/
                    color: #333333;
                  }
                }
                .content_description{
                  font-size: 26px;/*px*/
                  color: #666666;
                  margin-top 23px
                  span{
                    font-size: 28px;/*px*/
                    color: #333333;
                    font-weight bold
                  }
                }
              }
            }
            .list:last-child{
              margin-bottom 46px
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
</style>
