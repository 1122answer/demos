
(function(){
  const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };
	var MessageComponent = {
		    template: '#message-template',
         data() {
            return {
              visible: false,
              message: "",
              duration:3000,
              type:'info',
              iconClass:'',
              customClass:'',
              onClose:null,
              timer:null,
              showClose:false,
              closed:false,
              center:false
            };
          },
          computed:{
            iconWrapClass(){
              const classes =['gd-message__icon'];
              if (this.type && !this.iconClass) {
                classes.push(`gd-message__icon--${this.type}`);
              }
              return classes;
            },
            typeClass(){
              return this.type && !this.iconClass
              ? `gd-message__icon el-icon-${ typeMap[this.type] }`
               : '';
            }
          },
          watch:{
            closed(newVal){
              
              if(newVal){
                this.visible = false;
                this.$el.addEventListener('transitionend',this.destroyElement)
              }
            }
          },
          methods:{
            destroyElement(){
              this.$el.removeEventListener('transitionend',this.destroyElement);
              this.$destroy(true);
              this.$el.parentNode.removeChild(this.$el)
            },
            close(){
              this.closed = true;
              if (typeof this.onClose === 'function') {

                this.onClose(this)
              }
            },
            clearTimer(){
              clearTimer(this.timer);
            },
            startTimer(){
              if(this.duration>0){
                this.timer = setTimeout(()=>{
                  if(!this.closed) this.close();
                }, this.duration)
              }
            },
            keydown(e){
              if (e.keyCode === 27) {
                if (!this.closed) {
                  this.close();
                }
              }
            }
          },
          mounted(){
            this.startTimer();
            document.addEventListener('keydown', this.keydown);
          },
          beforeDestroy(){
            document.removeEventListener('keydown',this.keydown)
          }

	}

  /**
   * 每个插件都有的install方法，用于安装插件
   * @param {Object} Vue - Vue类
   * @param {Object} [pluginOptions] - 插件安装配置
   */
  var message = {};
  var seed =1;
  let instance;
  let instances = [];
  message.install=function(Vue, pluginOptions = {}) {
      // 生成一个Vue的子类
      // 同时这个子类也就是组件
      const MessageConstructor = Vue.extend(MessageComponent)
      console.log(MessageComponent)
      // 生成一个该子类的实例
      
      // 通过Vue的原型注册一个方法
      // 让所有实例共享这个方法 
      const Message = (options) => {
          options = options || {};
          if (typeof options === 'string') {
            options = {
              message:options
            };
          }
          let userOnClose = options.onClose;
          let id = 'message_' + seed++;

          options.onClose = function(){
            Message.close(id,userOnClose)
          }
          instance =new MessageConstructor({
            data:options
          }); 
          instance.id = id;
          // 将这个实例挂载在空节点上
          instance.vm = instance.$mount();
          // 并将此div加入全局挂载点内部
          document.body.appendChild( instance.vm.$el);
          instance.vm.visible = true;
          instances.push(instance);
          return instance.vm;
      }
      ['success','warning','info','error'].forEach(type => {
        Message[type] = options =>{
          if (typeof options === 'string') {
            options = {
              message: options
            }
          }
          options.type = type;
          return Message(options)
        }
      })
      Message.close=function (id, userOnClose) {
        for (var i = 0, len=instances.length; i < len; i++) {
           if (id === instances[i].id) {
              if (typeof userOnClose === 'function') {
                userOnClose(instances[i])
              }
              instances.splice(i,1);
              break;
           }
        }
      }
      Message.closeAll = function () {
        for (var i = instances.length -1; i > 0; i--) {
          instances[i].close();
        }
      }
      Vue.prototype.$message = Message;
      
  }
    if(typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(message)
    };

  
})()
