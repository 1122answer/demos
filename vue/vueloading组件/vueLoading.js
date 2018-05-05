
define([],function () {
  var prefixCls = 'gd-loading' 
  var LoadingComponent = {
    name:'Loading',
    props:{
      fix:{
        type:Boolean,
        default:true
      },
      fullscreen:{
        type:Boolean,
        default:false
      },
      loadingText:{
        type:String,
        default:''
      }
    },
    data: function data() {
      return {
        showText:false,
        //使用在Vue全局方法$loading
        visible:false
      };
    },
    template: 
    `<transition name="fade">
        <div :class='classes' v-if='fullscreenVisble'>
          <div :class='mainClasses'>
            <span :class='dotClasses'></span>
            <div :class='textClasses'>{{loadingText}}</div>
          </div>
        </div>
    </transition>`,
    computed: {
      classes(){
        return[
        `${prefixCls}`,
        {
          [`${prefixCls}-fix`]:this.fix,
          [`${prefixCls}-showText`]:this.showText
        }
        ]
      },
      mainClasses(){
        return `${prefixCls}-main`
      },
      dotClasses(){
        return `${prefixCls}-dot`
      },
      textClasses(){
        return `${prefixCls}-text`
      },
      fullscreenVisble(){
          if (this.fullscreen) {
              return this.visible;
          } else {
              return true;
          }
      }
    },
    mounted(){
      console.log(this.classes)

      //this.showText = this.$slots.default !==undefined
    }
  };

  /**
   * 每个插件都有的install方法，用于安装插件
   * @param {Object} Vue - Vue类
   * @param {Object} [pluginOptions] - 插件安装配置
   */
  const LoadingPlugin = {};
  LoadingPlugin.install=function(Vue, pluginOptions = {}) {
    // 创建"子类"方便挂载
    const VueLoading = Vue.extend(LoadingComponent)
    let loading = null
    /**
     * 初始化并显示loading
     */
    function $loading(options) {
    
        // 第一次调用
        if (!loading) {
          loading = new VueLoading()

          // 手动创建一个未挂载的实例
          loading.$mount()
          // 挂载
          document.querySelector(pluginOptions.container || 'body').appendChild(loading.$el)
        }
         if (typeof options === 'string') {
          loading.loadingText = options
        } else if (typeof options === 'object') {
          for (let i in options) {
            loading[i] = options[i]
          }
        }
        loading.fullscreen = true
        // 显示loading
        loading.visible= true;
    }
    // 定义关闭loading方法
    $loading.end = function() {
        loading.visible=false;
    }

    Vue.loading = Vue.prototype.$loading = $loading
  }
    if(typeof window !== 'undefined' && Vue) {
        Vue.use(LoadingPlugin)
    };

  return LoadingComponent
});