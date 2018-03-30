
(function(){
	var Loading = {
		template: '#laoding-template',
        data() {
          return {
            isShow: false,
            hasAnimate: true,
          }
        },
        computed: {
          /**
           * 动画效果样式，没有返回空
           * @return {String} 样式
           */
          animateName() {
            return this.hasAnimate ? 'opacity' : ''
          },
        },
        methods: {
          /**
           * 开启动画效果
           */
          opemAnimate() {
            this.hasAnimate = true
          },
          /**
           * 去除动画效果
           * @return {Promise} 返回promise
           */
          removeAnimate() {
            return new Promise((resolve) => {
              this.hasAnimate = false
              resolve()
            })
          },
          /**
           * 显示动画loading
           */
          show() {
            this.isShow = true
          },
          /**
           * 隐藏动画loading
           */
          hide() {
            this.isShow = false
          },
        },
	}

  /**
   * 每个插件都有的install方法，用于安装插件
   * @param {Object} Vue - Vue类
   * @param {Object} [pluginOptions] - 插件安装配置
   */
  var LoadingPlugin = {};
  LoadingPlugin.install=function(Vue, pluginOptions = {}) {
    // 创建"子类"方便挂载
    const VueLoading = Vue.extend(Loading)
    let loading = null

    /**
     * 初始化并显示loading
     * @returns {Promise} Promise实例
     */
    function $loading() {
      return new Promise((resolve) => {
        // 第一次调用
        if (!loading) {
          loading = new VueLoading()
          // 手动创建一个未挂载的实例
          loading.$mount()
          // 挂载
          document.querySelector(pluginOptions.container || 'body').appendChild(loading.$el)
        }
        // 显示loading
        loading.show()
        resolve()
      })
    }
    // 定义关闭loading方法
    $loading.end = function(noAnimate = false) {
      return new Promise(function(resolve) {
        if (!loading || !loading.isShow) {
          resolve()
          return
        }
        // 首页判断是否在关闭时需要动画
        if (noAnimate) {
          // 默认只在此次行为下移除动画,之后的行为仍有动画
          loading.removeAnimate().then(function() {
            loading.opemAnimate()
          })
        }

        loading.hide()
      })
    }

    Vue.loading = Vue.prototype.$loading = $loading
  }
    if(typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(LoadingPlugin)
    };
    return LoadingPlugin
})()
