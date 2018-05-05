
define([],function () {
  var prefixCls = 'gd-collapse' 
  var CollapseComponent = {
    name:'Collapse',
    props:{
      accordion:{
        type:Boolean,
        default:false
      },
      value:{
        type:[Array,String]
      }
    },
    data: function data() {
      return {
        currentValue:this.value
      };
    },
    template: 
    `<div :class="classes">
        <slot></slot>
    </div>`,
    computed: {
      classes(){
        return `${prefixCls}`
      }
    },
    mounted(){
     this.setActive();

    },
    methods:{
      getActiveKey(){
        let activeKey = this.currentValue || [];
        const accordion = this.accordion;
        if (!Array.isArray(activeKey)) {
          activeKey = [activeKey];
        }
        if (accordion && activeKey.length>1) {
          activeKey = [activeKey[0]];
        }
        for (var i = 0; i < activeKey.length; i++) {
          activeKey[i] = activeKey[i].toString();
        }
        return activeKey
      },
      setActive(){
       
        const activeKey = this.getActiveKey();
        this.$children.forEach((child,index)=>{
          const name = child.name || index.toString();
          let isActive= false;
          if (this.accordion) {
            isActive = activeKey.toString() === name;
          }else{
            isActive = activeKey.indexOf(name)>-1;
          }
          child.isActive = isActive;
          child.index = index;
        })
      },
      toggle(data){
        const name = data.name.toString();
        let newActiveKey = [];
        if (this.accordion) {
          if (!data.isActive) {
            newActiveKey.push(name)
          }
        }else{
          let activeKey = this.getActiveKey();
          const nameIndex = activeKey.indexOf(name);
          if (data.isActive) {
            if (nameIndex>-1) activeKey.splice(nameIndex,1)
          }else{
            if(nameIndex < 0 ) activeKey.push(name)
          }
          newActiveKey = activeKey;
        }
        this.currentValue = newActiveKey;
        this.$emit('input', newActiveKey);
        this.$emit('on-change', newActiveKey);
      }
    },
    watch:{
      value(val){
        this.currentValue = val
      },
      currentValue(){
        this.setActive();
      }
    }
  };


  return CollapseComponent
});