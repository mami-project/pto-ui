angular.module("ptoApp.userStorage", [])
	
	.service("userStorage", function() {
		return {
			load: function(name) {
				if (!localStorage[name]) {
					return;
				}
				return JSON.parse(localStorage.getItem(name));
			},
			save: function(name, data) {
				return localStorage.setItem(name, JSON.stringify(data));
			}
		}
	})