<template>
  <div class="integralList">
    <div class="bg_wrap">
      <div class="head_wrap">
        <div class="num_text">
          <p class="num">{{balance}}</p>
          <p class="text">元积分</p>
        </div>
        <div class="btn_wrap">
          <router-link to="/order">元积分订单</router-link>
        </div>
        <div class="list_title">--- <span>积分明细</span> ---</div>
      </div>
      <div class="list_wrap">
        <scroller class="scroller"
                  :on-refresh="refresh"
                  :on-infinite="infinite"
                  ref="my_scroller">
          <ul>
            <li class="list clearfix" v-for="(item,index) of integralList" :key="index">
              <div class="title_time fl">
                <div class="title">{{item.rule}}</div>
                <div class="time">{{item.updated_at}}</div>
              </div>
              <div class="record fr">{{item.value}}</div>
            </li>
          </ul>
        </scroller>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "integralList",
    components: {},
    data() {
      return {
        userId: "",
        token: "",
        phone: "",
        balance:"",
        page: 1,
        limit: 10,
        integralList: [],
        total: 0,
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.userId = this.$utils.getCookie("userId");
      this.token = this.$utils.getCookie("token");
      if(this.$utils.getCookie("userPhone")){
        this.phone=this.$utils.getCookie("userPhone").substr(3);
      }
      this.getUserRankingList();
      this.getIntegralList();
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
            'X-Access-Token': `${this.token}`
          }
        }).then((res)=>{
          this.balance=Number(res.data.data.balance);
        }).catch((error)=>{
          console.log(error.response.data)
        })
      },
      //获取用户积分明细
      getIntegralList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/marketing/user/points/details/${this.userId}?page=${this.page}&limit=${this.limit}`,
          headers: {
            'X-Access-Token': `${this.token}`
          }
        }).then((res) => {
          this.total = res.data.data.total_count;
          if(res.data.data.res_list){
            res.data.data.res_list.forEach((item) => {
              item.updated_at = this.$utils.formatDate(new Date(item.updated_at), "yyyy.MM.dd hh:mm:ss")
            });
            this.integralList = res.data.data.res_list;
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
            url: `${this.$baseURL}/v1/marketing/user/points/details/${this.userId}?page=${this.page}&limit=${this.limit}`,
            headers: {
              'X-Access-Token': `${this.token}`
            }
          }).then(res => {
            this.total = res.data.data.total_count;
            if(res.data.data.res_list){
              res.data.data.res_list.forEach((item) => {
                item.updated_at = this.$utils.formatDate(new Date(item.updated_at), "yyyy.MM.dd hh:mm:ss")
              });
              this.integralList = res.data.data.res_list;
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
            url: `${this.$baseURL}/v1/marketing/user/points/details/${this.userId}?page=${this.page}&limit=${this.limit}`,
            headers: {
              'X-Access-Token': `${this.token}`
            }
          }).then(res => {
            this.total = res.data.data.total_count;
            if (this.integralList.length >= this.total) {
              this.$refs.my_scroller.finishInfinite(true);
              this.page--;
            } else {
              res.data.data.res_list.forEach((item) => {
                item.updated_at = this.$utils.formatDate(new Date(item.updated_at), "yyyy.MM.dd hh:mm:ss")
              });
              this.integralList = this.integralList.concat(res.data.data.res_list);
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
  .integralList {
    .bg_wrap {
      width: 738px;
      height: 1210px;
      margin 0 auto
      margin-top 30px
      background url("../../common/images/list_bg.png") no-repeat center
      background-size: 100% 100%;
      
      .head_wrap {
        padding-top 50px
        text-align center
        position relative
        padding-bottom 30px
        
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
          top 133px
          
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
        height 810px
        margin 0 auto
        overflow hidden
        position relative
        .scroller{
          ul {
            padding 0 30px
            min-height 810px
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
        }
      }
    }
  }
</style>
