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
      <button :disabled="disabled">
        确认兑换
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "description",
    components: {},
    data() {
      return {
        disabled: false
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {},
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
        font-size: 48px;/*px*/
        color: #222222;
      }
      
      p {
        margin-top 23px
        padding-left 40px
        font-size: 26px;/*px*/
        color: #222222;
      }
      
      ul {
        margin-top 24px
        padding-left 40px
        
        li {
          margin-top 46px
          font-size: 26px;/*px*/
          color: #222222;
          span{
            font-size: 28px;/*px*/
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
    }
  }
</style>
