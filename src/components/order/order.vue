<template>
  <div class="order">
    <div class="tabs_wrap">
      <ul>
        <li>
          <label>
            <span :class="{'checked':orderStatus===''}">全部状态</span>
            <input type="radio" value="" name="orderStatus" v-model="orderStatus" checked>
          </label>
        </li>
        <li>
          <label>
            <span :class="{'checked':orderStatus==='2'}">交易成功</span>
            <input type="radio" value="2" name="orderStatus" v-model="orderStatus">
          </label>
        </li>
        <li>
          <label>
            <span :class="{'checked':orderStatus==='0'}">交易失败</span>
            <input type="radio" value="0" name="orderStatus" v-model="orderStatus">
          </label>
        </li>
      </ul>
    </div>
    <div class="list_wrap">
      <scroller class="scroller"
                :on-refresh="refresh"
                :on-infinite="infinite"
                ref="my_scroller">
        <ul>
          <li class="list" v-for="(item,index) of orderList" :key="item.order_id">
            <div class="list_title clearfix">
              <span>订单号：{{item.order_id}}</span>
              <span class="fr">{{item.order_status===2?'交易成功':'交易失败'}}</span>
            </div>
            <ul class="list_content">
              <li class="content_head">
                <span class="img_wrap"><img :src="item.commodity_img" alt=""></span>
                <span>{{item.commodity_name}}</span>
              </li>
              <li class="content_time">订单时间：<span>{{item.updated_at}}</span></li>
              <li class="content_description" v-if="item.order_status===2">共 <span>{{item.count}}</span> 件商品，实付 <span>{{item.price}}</span> 积分</li>
              <li class="content_description" v-if="item.order_status===3">抱歉，兑换商品已抢空；未消耗您的积分</li>
            </ul>
          </li>
        </ul>
      </scroller>
    </div>
  </div>
</template>

<script>
  export default {
    name: "order",
    components: {},
    data() {
      return {
        userId: "",
        token:"",
        phone:"",
        orderStatus:"",
        page:1,
        limit:5,
        total:0,
        orderList:[],
        shareTitle:"@技师朋友们，轻松赚积分，好礼抱回家",
        shareDesc:"积分排行榜火热竞赛中，想要排名前列C位出道？进来比比吧！",
        shareUrl:location.origin+"/order",
        shareImg:location.origin+"/static/images/share01.jpg",
      }
    },
    created() {
      this.$wxShare.wxShare(this,this.shareTitle, this.shareDesc,this.shareUrl,this.shareImg)
    },
    beforeMount() {
      this.$utils.setTitle("订单列表");
      let path = this.$route.path;
      if(this.$utils.getCookie("userId")&&this.$utils.getCookie("token")&&this.$utils.getCookie("userPhone")){
        this.userId=this.$utils.getCookie("userId");
        this.token=this.$utils.getCookie("token");
        this.phone=this.$utils.getCookie("userPhone").substr(3);
        this.getOrderList();
      }else {
        window.localStorage.setItem("redirectUrl", JSON.stringify(path));
        this.$router.push('/login')
      }
    },
    mounted() {
    },
    watch: {
      orderStatus:function () {
        this.orderList=[];
        this.page=1;
        this.$refs.my_scroller.finishInfinite(false);
        this.getOrderList();
      }
    },
    computed: {},
    methods: {
      //获取订单列表
      getOrderList(){
        this.$axios({
          method: "GET",
          url:
            `${this.$baseURL}/v1/marketing/order/list?user_id=${this.userId}&order_status=${this.orderStatus}&page=${this.page}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': `${this.token}`
          }
        }).then((res) => {
          this.total = res.data.data.total_count;
          if(res.data.data.res_list){
            res.data.data.res_list.forEach((item) => {
              item.updated_at = this.$utils.formatDate(new Date(item.updated_at), "yyyy.MM.dd hh:mm:ss")
            });
            this.orderList = res.data.data.res_list;
          }
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
            url: `${this.$baseURL}/v1/marketing/order/list?user_id=${this.userId}&order_status=${this.orderStatus}&page=${this.page}&limit=${this.limit}`,
            headers: {
              'X-Access-Token': `${this.token}`
            }
          }).then(res => {
            this.total = res.data.data.total_count;
            if(res.data.data.res_list){
              res.data.data.res_list.forEach((item) => {
                item.updated_at = this.$utils.formatDate(new Date(item.updated_at), "yyyy.MM.dd hh:mm:ss")
              });
              this.orderList = res.data.data.res_list;
            }
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
            url: `${this.$baseURL}/v1/marketing/order/list?user_id=${this.userId}&order_status=${this.orderStatus}&page=${this.page}&limit=${this.limit}`,
            headers: {
              'X-Access-Token': `${this.token}`
            }
          }).then(res => {
            this.total = res.data.data.total_count;
            if (this.orderList.length >= this.total) {
              this.$refs.my_scroller.finishInfinite(true);
              this.page--;
            } else {
              res.data.data.res_list.forEach((item) => {
                item.updated_at = this.$utils.formatDate(new Date(item.updated_at), "yyyy.MM.dd hh:mm:ss")
              });
              this.orderList = this.orderList.concat(res.data.data.res_list);
              this.$refs.my_scroller.finishInfinite(false);
            }
          }).catch(error => {
            console.log(error)
          })
        }, 1500)
    
      },
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
      height 1090px
      margin 0 auto
      overflow hidden
      margin-top 90px
      position relative
      .scroller{
        ul {
          padding-bottom 10px
          width: 688px;
          min-height 1090px
          margin 0 auto
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
                font-size: 26px;/*px*/
                color: #333333;
                font-weight bold
              }
              span:last-child{
                font-size: 28px;/*px*/
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
                  font-size: 30px;/*px*/
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
      }
    }
  }
</style>
