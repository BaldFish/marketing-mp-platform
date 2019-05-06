<template>
  <div class="description">
    <div class="image_wrap">
      <img :src="productDetails.url" alt="">
    </div>
    <div class="details_wrap">
      <h3>{{productDetails.name}}</h3>
      <p>{{productDetails.price}}积分</p>
      <ul class="ul_outer">
        <li class="li_outer">
          <span>商品介绍：</span>
          <ul class="ul_inner">
            <li class="li_inner" v-for="(item,index) of productDetails.introduction" :key="index">{{item}}</li>
          </ul>
        </li>
        <li class="li_outer">
          <span>适用范围：</span>
          <ul class="ul_inner">
            <li class="li_inner" v-for="(item,index) of productDetails.scope" :key="index">{{item}}</li>
          </ul>
        </li>
        <li class="li_outer">
          <span>注意事项：</span>
          <ul class="ul_inner">
            <li class="li_inner" v-for="(item,index) of productDetails.item" :key="index">{{item}}</li>
          </ul>
        </li>
        <li class="li_outer">
          <span>重要说明：</span>
          <ul class="ul_inner">
            <li class="li_inner" v-for="(item,index) of productDetails.directions" :key="index">{{item}}</li>
          </ul>
        </li>
      </ul>
      <button v-if="lastCount&&balance>=productDetails.price" @click="createOrder">确认兑换</button>
      <button class="lastCount" v-if="!lastCount||balance<productDetails.price" @click="callTips('您的积分不足，请您关注元征产品服务；')">积分不足</button>
    </div>
    <el-dialog title="验证手机号" :visible.sync="phoneDialogVisible" center class="phone_dialog">
      <div class="title_close">
        <p class="title">验证手机号</p>
        <span class="close el-icon-close" @click="cancelOrder"></span>
        <p class="tips">输入手机尾号{{phone.substr(-4)}}接收到的短信验证码</p>
      </div>
      <div class="input_wrap">
        <input type="text" placeholder="短信验证码" :disabled="disabled" v-model="code">
        <span v-if="codeValue" @click="getPhoneCode">发送</span>
        <span v-else style="background-color: #7d7d7d;color: #ffffff;">倒计时（{{second}}）</span>
      </div>
    </el-dialog>
    <el-dialog title="请输入6位交易密码" :visible.sync="passWordDialogVisible" center class="passWord_dialog">
      <div class="title_close">
        <p class="title">请输入6位交易密码</p>
        <span class="close el-icon-close" @click="cancelOrder"></span>
      </div>
      <div class="input_wrap">
        <input type="text" placeholder="6位交易密码" :disabled="disabled" v-model="passWord">
      </div>
    </el-dialog>
    <el-dialog title="兑换成功" :visible.sync="successDialogVisible" center class="success_dialog">
      <div class="title_close">
        <div class="img_wrap">
          <img src="../../common/images/Success.png" alt="成功">
        </div>
        <p>对换成功</p>
        <span class="close el-icon-close" @click="successDialogVisible = false"></span>
      </div>
      <div class="input_wrap">
        <span @click="turnOrder">查看订单</span>
        <span @click="share">分享一下</span>
      </div>
    </el-dialog>
    <el-dialog title="分享提示" :visible.sync="shareDialogVisible" center class="share_dialog" :fullscreen="true" :lock-scroll="true">
      <div class="content_wrap">
        <div class="img_jiantou">
          <img src="../../common/images/fenxiang.png" alt="">
        </div>
        <p>点击右上角 <img src="../../common/images/more_light.png" alt=""> 按钮 即可分享</p>
        <div class="btn" @click="shareDisappear">知道了</div>
      </div>
    </el-dialog>
    <div class="errorTip_wrap" >
      <div class="errorTip" v-if="tips">{{tipsMessage}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "description",
    components: {},
    data() {
      return {
        phoneDialogVisible: false,
        passWordDialogVisible: false,
        successDialogVisible: false,
        shareDialogVisible: false,
        userId: "",
        token: "",
        phone: "",
        lastCount: 1,
        balance: "",
        productDetails: {},
        codeValue: true,
        passWord: "",
        code: "",
        second: 60,
        disabled: false,
        commodityId: "",
        openId: "",
        orderId: "",
        phraseStatus: 0,
        shareTitle: "@技师朋友们，轻松赚积分，好礼抱回家",
        shareDesc: "积分排行榜火热竞赛中，想要排名前列C位出道？进来比比吧！",
        shareUrl: location.origin + "/description",
        shareImg: location.origin + "/static/images/share01.png",
        tipsMessage:"",//提示信息
        tips:false,
      }
    },
    created() {
      this.$wxShare.wxShare(this, this.shareTitle, this.shareDesc, this.shareUrl, this.shareImg)
    },
    beforeMount() {
      this.$utils.setTitle("商品详情");
      let path = this.$route.path;
      if (this.$utils.getCookie("userId") && this.$utils.getCookie("token") && this.$utils.getCookie("userPhone")) {
        this.userId = this.$utils.getCookie("userId");
        this.token = this.$utils.getCookie("token");
        this.phone = this.$utils.getCookie("userPhone").substr(3);
        this.openId = this.$utils.getCookie("openId");
        this.getUserRankingList();
        this.getProductDetails();
      } else {
        window.localStorage.setItem("redirectUrl", JSON.stringify(path));
        this.$router.push('/login')
      }
    },
    mounted() {
    },
    watch: {
      passWord: function () {
        if (this.passWord.length === 6) {
          this.payOrder();
        }
      },
      code: function () {
        if (this.code.length === 4) {
          this.payOrder();
        }
      },
    },
    computed: {},
    methods: {
      //获取用户排行
      getUserRankingList() {
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/marketing/user/ranking/${this.userId}`,
            headers: {
            'X-Access-Token': `${this.token}`
          }
        }).then((res) => {
          this.balance = Number(res.data.data.balance);
        }).catch((error) => {
          console.log(error.response.data)
        })
      },
      //获取商品详情
      getProductDetails() {
        let id = window.sessionStorage.getItem("productId");
        this.$axios({
          method: "GET",
          url: `${this.$baseURL}/v1/marketing/commodity/details/${id}`,
        }).then((res) => {
          this.productDetails = res.data.data;
          this.lastCount = res.data.data.last_count;
          this.commodityId = res.data.data.id
        }).catch((error) => {
          console.log(error.response.data)
        })
      },
      //获取短信验证码
      getPhoneCode() {
        if (this.phone) {
          //倒计时
          this.codeValue = false;
          let interval = window.setInterval(() => {
            if ((this.second--) <= 0) {
              this.codeValue = true;
              this.second = 60;
              window.clearInterval(interval);
            }
          }, 1000);
          //请求后端接口获取验证码
          this.$axios({
            method: 'post',
            url: `${this.$baseURL}/v1/sms/code`,
            data: this.$querystring.stringify({
              phone: '+86' + this.phone, //手机号
              type: 6 //1-注册，2-修改密码, 3-登录, 5-发起鉴宝, 6-支付
            })
          }).then(res => {
          }).catch(error => {
            console.log(error);
          })
          
        }
      },
      //创建订单
      createOrder() {
        let data = {
          user_id: this.userId,
          commodity_id: this.commodityId,
          count: 1,
          openid: this.openId
        };
        this.$axios({
          method: 'POST',
          url: `${this.$baseURL}/v1/marketing/order`,
          data: this.$querystring.stringify(data),
          headers: {
            'X-Access-Token': this.token,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          this.orderId = res.data.data.order_id;
          this.phraseStatus = res.data.data.phrase_status;
          if (res.data.data.phrase_status === 0) {
            this.phoneDialogVisible = false;
            this.passWordDialogVisible = true;
          } else if (res.data.data.phrase_status === 1) {
            this.passWordDialogVisible = false;
            this.phoneDialogVisible = true;
          }
        }).catch(error => {
          console.log(error.response.data.message)
        })
      },
      //支付订单
      payOrder() {
        let data = {
          order_id: this.orderId,
          phrase_status: this.phraseStatus,
          phrase: this.passWord,
          code: this.code
        };
        this.$axios({
          method: 'POST',
          url: `${this.$baseURL}/v1/marketing/order/pay`,
          data: this.$querystring.stringify(data),
          headers: {
            'X-Access-Token': this.token,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(res => {
          this.successDialogVisible = true;
        }).catch(error => {
          this.callTips('对换失败，请重新对换！')
          console.log(error)
        });
        this.phoneDialogVisible = false;
        this.passWordDialogVisible = false;
        this.code = "";
        this.passWord = "";
      },
      //取消订单
      cancelOrder() {
        let data = {
          order_id: this.orderId
        };
        this.$axios({
          method: "PATCH",
          url: `${this.$baseURL}/v1/marketing/order/cancel`,
          data: this.$querystring.stringify(data),
          headers: {
            'X-Access-Token': `${this.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          this.phoneDialogVisible = false;
          this.passWordDialogVisible = false;
        }).catch((error) => {
          console.log(error.response.data)
        })
      },
      //查看订单
      turnOrder() {
        this.successDialogVisible = false;
        this.$router.push('/order');
      },
      //分享一下
      share() {
        this.successDialogVisible = false;
        this.shareDialogVisible = true
      },
      //分享提示蒙层消失
      shareDisappear() {
        this.shareDialogVisible = false
      },
      //提示信息调用
      callTips(tipsMessage) {
        this.tipsMessage = tipsMessage;
        this.tips = true;
        window.setTimeout(() => {
          this.tips = false;
        }, 2000);
      },
    },
  }
</script>

<style scoped lang="stylus">
  .description {
    .image_wrap {
      width 480px
      height 480px
      margin 0 auto
      margin-top 30px
      text-align center
      background-color: #f4f4f4;
      box-shadow: 2px 1px 12px 1px rgba(119, 119, 119, 0.07);
      
      img {
        max-width 480px
        max-height 480px
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    
    .details_wrap {
      box-sizing border-box
      width 750px
      margin 0 auto
      
      h3 {
        margin-top 53px
        padding-left 40px
        font-size: 48px; /*px*/
        color: #222222;
      }
      
      p {
        margin-top 23px
        padding-left 40px
        font-size: 26px; /*px*/
        color: #222222;
      }
      
      .ul_outer {
        margin-top 24px
        padding-left 40px
        
        .li_outer {
          margin-top 46px
          font-size 0
          
          span {
            font-size: 26px; /*px*/
            line-height 32px; /*px*/
            color: #222222;
            vertical-align top
          }
          
          .ul_inner {
            display inline-block
            width 77%
            vertical-align top
            
            .li_inner {
              font-size: 28px; /*px*/
              font-weight bold
              color: #222222;
              line-height 32px; /*px*/
            }
          }
        }
      }
      
      button {
        display block
        width: 500px;
        height: 70px;
        background-color: #386cff;
        border-radius: 32px;
        font-size: 34px; /*px*/
        color: #ffffff;
        margin 0 auto
        margin-top 100px
        margin-bottom 100px
      }
      
      .lastCount {
        background-color: #999999;
      }
    }
    
    .phone_dialog {
      .title_close {
        position relative
        
        .title {
          height 106px
          line-height 105px
          font-size: 32px; /*px*/
          color: #333333;
          text-align center
          font-weight bold
          border-bottom: solid 1px #eeeeee; /*no*/
        }
        
        .close {
          position absolute
          top 33px
          right 43px
          font-size 32px; /*px*/
        }
        
        .tips {
          font-size: 22px; /*px*/
          color: #666666;
          text-align center
          margin-top 20px
        }
        
      }
      
      .input_wrap {
        text-align center
        padding-top 45px
        font-size 0
        
        input {
          width 270px
          height 81px
          border-radius: 32px 0px 0px 32px;
          border: 2px solid #386cff; /*no*/
          margin-right 20px
          font-size: 30px; /*px*/
          color: #999999;
          text-align center
          padding 5px
        }
        
        /*input::-webkit-input-placeholder {
                color: #999999;
                font-size: 24px;!*px*!
              }*/
        
        span {
          display inline-block
          width 220px
          height 81px
          line-height 81px
          background-color: #386cff;
          border-radius: 0px 32px 32px 0px;
          font-size: 30px; /*px*/
          color: #ffffff;
          vertical-align top
        }
      }
    }
    
    .passWord_dialog {
      .title_close {
        position relative
        
        .title {
          height 106px
          line-height 105px
          font-size: 32px; /*px*/
          color: #333333;
          text-align center
          font-weight bold
          border-bottom: solid 1px #eeeeee; /*no*/
        }
        
        .close {
          position absolute
          top 33px
          right 43px
          font-size 32px; /*px*/
        }
        
        .tips {
          font-size: 22px; /*px*/
          color: #666666;
          text-align center
          margin-top 20px
        }
        
      }
      
      .input_wrap {
        text-align center
        padding-top 45px
        font-size 0
        
        input {
          width 270px
          height 81px
          border-bottom: 1px solid #386cff; /*no*/
          font-size: 30px; /*px*/
          color: #999999;
          text-align center
          padding 5px
        }
        
        input[disabled] {
          background-color #ffffff
        }
      }
    }
    
    .success_dialog {
      .title_close {
        position relative
        text-align center
        padding-top 47px
        
        .img_wrap {
          width 70px
          height 70px
          margin 0 auto
          
          img {
            width 100%
            height 100%
          }
        }
        
        p {
          text-align center
          font-size: 36px; /*px*/
          color: #333333;
          font-weight bold
          margin-top 28px
        }
        
        .close {
          position absolute
          top 33px
          right 43px
          font-size 32px; /*px*/
        }
        
        .tips {
          font-size: 22px; /*px*/
          color: #666666;
          text-align center
          margin-top 20px
        }
        
      }
      
      .input_wrap {
        text-align center
        font-size 0
        box-shadow: 0px 3px 46px 8px rgba(152, 152, 152, 0.14);
        position absolute
        bottom 0
        width 100%
        
        span {
          display inline-block
          font-size: 30px; /*px*/
          width 50%
          height 80px
          line-height 80px
        }
        
        span:first-child {
          background-color: #ffffff;
          border-radius: 0px 0px 0px 32px;
          color: #333333;
        }
        
        span:last-child {
          background-color: #386cff;
          border-radius: 0px 0px 32px 0px;
          color: #ffffff;
        }
      }
    }
    
    .share_dialog {
      .content_wrap {
        width 100%
        height 100%
        position relative
        
        .img_jiantou {
          width 80px
          height 101px
          position absolute
          top 25px
          right 68px
          
          img {
            width 100%
            height 100%
          }
        }
        
        p {
          text-align center
          padding-top 265px
          font-size: 40px; /*px*/
          line-height 40px
          color: #ffffff;
          
          img {
            vertical-align middle
          }
        }
        
        .btn {
          text-align center
          position absolute
          bottom 280px
          left: 0;
          right: 0;
          margin-left: auto;
          margin-right: auto;
          margin-top 560px
          width: 260px;
          height: 80px;
          line-height 80px
          border-radius: 32px;
          border: 2px solid #ffffff; /*no*/
          font-size: 36px; /*px*/
          color: #ffffff;
        }
      }
    }
    .errorTip_wrap{
      width 100%
      text-align center
      font-size 0
      position fixed
      top 50%
      .errorTip{
        display inline-block
        box-sizing border-box
        line-height 1.6
        max-width 520px;
        padding 20px 30px
        background-color #000000
        opacity 0.7
        font-size 26px;/*px*/
        color #ffffff
        border-radius 30px
      }
    }
  
  }
</style>
<style lang="stylus">
  .description {
    .phone_dialog {
      .el-dialog {
        width 560px
        height 340px
        border-radius: 32px;
        margin-top 240px !important
        
        .el-dialog__header {
          display none
        }
        
        .el-dialog__body {
          padding 0
          margin 0
          width 100% !important
          height 100% !important
        }
      }
    }
    
    .passWord_dialog {
      .el-dialog {
        width 560px
        height 340px
        border-radius: 32px;
        margin-top 240px !important
        
        .el-dialog__header {
          display none
        }
        
        .el-dialog__body {
          padding 0
          margin 0
          width 100% !important
          height 100% !important
        }
      }
    }
    
    .success_dialog {
      .el-dialog {
        width 560px
        height 340px
        border-radius: 32px;
        margin-top 240px !important
        
        .el-dialog__header {
          display none
        }
        
        .el-dialog__body {
          padding 0
          margin 0
          width 100% !important
          height 100% !important
        }
      }
    }
    
    .share_dialog {
      .el-dialog {
        background-color rgba(0, 0, 0, 0.3) !important
        
        .el-dialog__header {
          display none
        }
        
        .el-dialog__body {
          padding 0
          margin 0
          width 100%
          height 100%
        }
      }
    }
  }
</style>
