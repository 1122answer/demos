require.config({
	paths:{
		'Message':'./message'
	}
})
requirejs([],function () {
    requirejs(['Message']);
    
});