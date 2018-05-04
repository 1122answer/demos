require.config({
	paths:{
		'Loading':'./vueLoading',
	}
})
requirejs([],function () {
    require(['Loading'],function(LoadingComponent){
    	 console.log(LoadingComponent)
		  var app = new Vue({
		      el: '#app',
		      data: {
		          loading : true,
		      },
		      components:{
		        Loading:LoadingComponent
		      },
		      methods:{
		      	loadData: function() {
		      		this.loading = !this.loading;
		      		/*var self =this;
		      		self.$loading({loadingText:'你好'})
		      		setTimeout(function(){
		      			self.$loading.end()
		      		},3000)*/
		      		
		      		
		      	}
		      },
		      mounted:function(){

		        console.log()
		        console.log(this.$options)
		        console.log(this.$data.message = '123')
		        console.log(this.$el)
		      }
		    })
		  console.log(app)
    });
    
});