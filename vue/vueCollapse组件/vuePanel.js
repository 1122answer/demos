
define([],function () {
  var prefixCls = 'gd-collapse' 
  var PanelComponent = {
    name:'Panel',
    props:{
      name:{
        type:String
      }
    },
    data:function data() {
      return {
        index:0,
        isActive:false
      };
    },
    template: 
    `<div :class="itemClasses">
        <div :class="headerClasses" @click="toggle">
            <slot></slot>
        </div>
        <transition name="fade">
          <div :class="contentClasses" v-show="isActive">
              <div :class="boxClasses"><slot name="content"></slot></div>
          </div>
        </transition>
    </div>`,
    computed: {
      itemClasses(){
        return [`${prefixCls}-item`,{
          [`${prefixCls}-item`]:this.isActive
        }]
      },
      headerClasses(){
        return `${prefixCls}-header`;
      },
      contentClasses(){
        return `${prefixCls}-content`;
      },
      boxClasses(){
        return `${prefixCls}-content-box`
      }
    },
    methods:{  
      toggle(){
        this.$parent.toggle({
          name:this.name || this.index,
          isActive:this.isActive
        })
      }
    }
  };


  return PanelComponent
});