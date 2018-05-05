require.config({
	paths:{
		'Collapse':'./vueCollapse',
		'Panel':'./vuePanel',
	}
})
requirejs([],function () {
    require(['Collapse','Panel'],function(CollapseComponent,PanelComponent){
    	 console.log(CollapseComponent,PanelComponent)
		  var app = new Vue({
		      el: '#app',
		      data: {
		          value1 : 'a',
		      },
		      components:{
		        Collapse:CollapseComponent,
		        Panel:PanelComponent
		      },
		      methods:{
		      	change(data){
		      		console.log(data)
		      	}
		      },
		      mounted:function(){

		      }
		    })
		  console.log(app)
    });
    
});