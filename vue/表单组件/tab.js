
(function(){
	var Tab = {
		template: '#tab-template',
		props:{
			value: {
                type: String,
                default: ''
            },
            options: {
                type: Array,
                default: []
            },
            test:Boolean
		},
		data:function() {
            return {
                currValue: this.value,
                currOptions: []
            }
        },
		mounted:function() {
            this.initOptions();
            console.log(this.test)
        },
        methods: {
            initOptions:function() {
                this.currOptions = this.options.map(item => {
                    return {
                        item:item,
                        active: item.value === this.currValue,
                        disabled: !!item.disabled
                    }
                });
            },
            onTabSelect:function(item) {
                if (item.disabled) return;
                this.currOptions.forEach(obj => obj.active = false);
                item.active = true;
                this.currValue = item.value;
                this.$emit('input', this.currValue);
            }
        },
        filters: {
            tabItemClass:function(item) {
            	debugger;
                let classList = [];
                if (item.active) classList.push('active');
                if (item.disabled) classList.push('disabled');
                return classList.join(' ');
            }
        },
        watch: {
            options:function(value) {
                this.initOptions();
            },
            value:function(value) {
                this.currValue = value;
            }
        }
	}
    window.tab = Tab
	return tab
})()
