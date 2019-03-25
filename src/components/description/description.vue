<template>
  <div class="description">
    <div class="image_wrap">
      <img src="../../common/images/jd01.png" alt="">
    </div>
    <div class="details_wrap">
      <h3>20元京东卡</h3>
      <p>20积分</p>
      <ul>
        <li>商品介绍：<span>20元面值京东卡</span></li>
        <li>适用范围：<span>人人道公众号</span></li>
        <li>注意事项：<span>每个ID兑换一次</span></li>
        <li>重要说明：<span>一切解释权归人人道所有</span></li>
      </ul>
      <button v-if="disabled" @click="centerDialogVisible = true">确认兑换</button>
      <button class="disabled" v-if="!disabled">确认兑换</button>
    </div>
    <el-dialog title="验证手机号" :visible.sync="centerDialogVisible" center :close-on-click-modal='false' class="phone_dialog">
      <div class="title_close">
        <p>验证手机号</p>
        <span class="el-icon-close"></span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "description",
    components: {},
    data() {
      return {
        centerDialogVisible: false,
        disabled: true,
        productDetails:{}
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
      this.getProductDetails();
    },
    watch: {},
    computed: {},
    methods: {
      //获取商品详情
      getProductDetails(){
        let id=window.sessionStorage.getItem("productId");
        this.$axios({
          method:"GET",
          url:`${this.$baseURL}/v1/marketing/commodity/details/${id}`,
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
      
      ul {
        margin-top 24px
        padding-left 40px
        
        li {
          margin-top 46px
          font-size: 26px; /*px*/
          color: #222222;
          
          span {
            font-size: 28px; /*px*/
            color: #222222;
            font-weight bold
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
        margin-top 102px
      }
      
      .disabled {
        background-color: #999999;
      }
    }
    .phone_dialog {
      .title_close{
        position relative
        p{
          height 106px
          line-height 105px
          font-size: 32px;/*px*/
          color: #333333;
          text-align center
          font-weight bold
          border-bottom: solid 1px #eeeeee;/*no*/
        }
        span{
          position absolute
          top 33px
          right 43px
          font-size 32px;/*px*/
        }
      }
    }
  }
</style>
<style lang="stylus">
  .description{
    .phone_dialog {
      .el-dialog{
        width 560px
        height 340px
        border-radius: 32px;
        margin-top 240px!important
        .el-dialog__header{
          display none
      }
        .el-dialog__body{
          padding 0
          margin 0
          width 100% !important
          height 100% !important
        }
      }
    }
  }
</style>
