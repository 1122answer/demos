
(function(){
	var ToastComponent = {
		    template: '#toast-template',
         data() {
            return {
              show: false,
              message: ""
            };
          }
	}

  /**
   * 每个插件都有的install方法，用于安装插件
   * @param {Object} Vue - Vue类
   * @param {Object} [pluginOptions] - 插件安装配置
   */
  var Toast = {};
  Toast.install=function(Vue, pluginOptions = {}) {
      // 生成一个Vue的子类
      // 同时这个子类也就是组件
      const ToastConstructor = Vue.extend(ToastComponent)
      console.log(ToastConstructor)
      // 生成一个该子类的实例
      const instance = new ToastConstructor();
        console.log(instance)
      // 将这个实例挂载在我创建的div上
      // 并将此div加入全局挂载点内部
      instance.$mount()
      document.body.appendChild(instance.$el)

      // 通过Vue的原型注册一个方法
      // 让所有实例共享这个方法 
      Vue.prototype.$toast = (msg, duration = 2000) => {
          instance.message = msg;
          instance.show = true;

          setTimeout(() => {

              instance.show = false;
          }, duration);
      }
  }
    if(typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(Toast)
    };
})()
