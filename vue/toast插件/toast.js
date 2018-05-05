
(function(){
	var Toast = {}
    Toast.install = function(Vue, options){
    	var opt = {
    		defoultType:'bottom',
    		duration:'2500'
    	}
    	for (var property in options){
    		opt[property] = options[property]
    	}
    	Vue.prototype.$toast = function(tips ,type){
    		if(type){
    			opt.defoultType = type
    		}
    		if(document.getElementsByClassName('vue-toast').length){
    			return;
    		}
	    	var toastTpl = Vue.extend({
	    		template:'<div class = "lx-toast toast-'+ type +'">' + tips + '</div>'
	    	})
	    	var tpl = new toastTpl().$mount().$el;
	    	document.body.appendChild(tpl);
	    	setTimeout(function(){
	    		document.body.removeChild(tpl)
	    	},opt.duration)
    	}
    	var arr = ['bottom','center','top']
        arr.forEach(function(type){
        	Vue.prototype.$toast[type] = function(tips){
        		return Vue.prototype.$toast(tips, type)
        	}
        })
        //Vue.prototype.$msg = "hello world";
    }

    
    window.Toast = Toast
	return Toast
})()
