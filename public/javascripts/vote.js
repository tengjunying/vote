
$(document).ready(function($) {
	var url = window.location.href,
		indexReg = /index/,
		registerReg = /register/,
		searchReg = /search/,
		detailReg = /detail/,
		limit = 10,
		offset = 0;

	var voteFn = {
		/**
		 * [将数据存储在本地]
		 * @param {String} key [键值]
		 * @param {Object} obj [存储内容]
		 */
		setStorage: function(key, obj) {
			localStorage.setItem(key, JSON.stringify(obj));
		},

		/**
		 * [获取本地存储数据]
		 * @param {String} key [键值］
		 * @return {Object}    [存储内容]
		 */
		getStorage: function(key) {
			return JSON.parse(localStorage.getItem(key));
		},

		/**
		 * [拼接首页用户信息字符串]
		 * @param  {Array} objs [用户信息数组]
		 * @return {String}     [用户信息字符串]
		 */
		userStr: function(objs) {
			var str = '';
			for(var i=0; i<objs.length; i++) {
				str += '<li>'        
	                + '<div class="head">'
	                + '<a href="/vote/detail/' + objs[i].id + '">'
	                + '<img src="' + objs[i].head_icon + '" alt="">'
	                + '</a>'
	                + '</div>'
	                + '<div class="up">'
	                + '<div class="vote">'
	                + '<span>' + objs[i].vote + '票</span>'
	                + '</div>'
	                + '<div class="btn" id=' + objs[i].id + '>'
	                + '投TA一票'
	                + '</div>'
	                + '</div>'
	                + '<div class="descr">'
	                + '<a href="/vote/detail/' + objs[i].id + '">'
	                + '<div>'
	                + '<span>' + objs[i].username + '</span>'
	                + '<span>|</span>'
	                + '<span>编号#' + objs[i].id + '</span>'
	                + '</div>'
	                + '<p>' + objs[i].descrption + '</p>'
	                + '</a>'
	                + '</div>'
	               	+ '</li>';
			}
			return str;
		},

		/**
		 * [拼接个人详细页信息字符串]
		 * @param  {Object} obj [个人信息对象]
		 * @return {String}     [个人信息字符串]
		 */
		detailPersonalStr: function(obj) {
			var str ='<div class="pl">'
					+'<div class="head">'
					+'<img src="' + obj.head_icon + '" alt="">'
					+'</div>'
					+'<div class="p_descr">'
					+'<p>' + obj.username + '</p>'
					+'<p>编号#' + obj.id + '</p>'
					+'</div>'
				    +'</div>'
				    +'<div class="pr">'
					+'<div class="p_descr pr_descr">'
					+'<p>' + obj.rank + '名</p>'
					+'<p>' + obj.vote + '票</p>'
					+'</div>'
				    +'</div>'
				    +'<div class="motto">'
					+'' + obj.descrption + ''
					+'</div>';
			return str;
		},

		/**
		 * [拼接个人详细页投票者信息的字符串]
		 * @param  {Array} objs [投票者信息数组]
		 * @return {String}     [投票者信息字符串]
		 */
		detailVoterStr: function(objs) {
			var str = '';
			for(var i=0; i<objs.length; i++) {
				str += '<li>'
				    +'<div class="head">'
				    +'<img src="' + objs[i].head_icon + '" alt="">'
				    +'</div>'
				    +'<div class="up">'
				    +'<div class="vote">'
				    +'<span>投了一票</span>'
				    +'</div>'
				    +'</div>'
				    +'<div class="descr">'
				    +'<h3>' + objs[i].username + '</h3>'
				    +'<p>编号#' + objs[i].id + '</p>'
				    +'</div>'
				    +'</li>'
			}
			return str;
		},

		/**
		 * [发起投票请求]
		 * @param  {String} id      [被投票者id号]
		 * @param  {String} voterId [投票者id号]
		 * @param  {Element} _this  [元素]
		 */
		voteRequest: function(id, voterId, _this) {
			$.ajax({
				url: '/vote/index/poll?id=' + id + '&voterId=' + voterId,
				type: 'GET',
				success: function(data) {
					data = JSON.parse(data);
					if(data.errno === 0) {
						var voteNum = $(_this).siblings('.vote').children('span').html();
						var reg = /(\d*)/;
						voteNum = reg.exec(voteNum)[1];
						$(_this).siblings('.vote').children('span').html(++voteNum + '票');
						$(_this).siblings('.vote').addClass('bounceIn');
					}else {
						alert(data.msg);
					}
				}
			});
		},

		/**
		 * [登入操作]
		 * @return {Boolean} [是否成功登入状态]
		 */
		signIn: function() {
			$('.subbtn').click(function(event) {
				var password = $('.mask .user_password').attr("pword");
				var id = $('.mask .usernum').val();
				if(!/^\d*$/.test(id)) {
					alert('请输入数字的编号');
					return false;
				}
				voteUser = {
					password: password,
					id: id
				}
				$.ajax({
					url: '/vote/index/info',
					type: 'POST',
					data: voteUser,
					success: function(data) {
						data = JSON.parse(data);
						if(data.errno === 0) {
							voteFn.setStorage('voteUser', voteUser);
							window.location = url;
						} else {
							alert(data.msg);
						}
					}
				})
			});
		},

		/**
		 * [投票事件绑定]
		 */
		userPoll: function() {
			$('.btn').off();
			$('.btn').click(function(event) {
				var _this = this;
				var id = $(this).attr('id');
				var voteUser = voteFn.getStorage('voteUser');
				if (voteUser) {
					voteFn.voteRequest(id, voteUser.id, this);
				}else {
					$('.mask').show();
					voteFn.signIn();
				}
				
			});
		},

		/**
		 * [密码显示处理]
		 * @param  {String} className [类名]
		 */
		passwordDiaplay: function(className) {
			var passwordReg = /^\**([A-Za-z0-9])$/;
			var passwordInput = document.querySelector('.' + className);
			passwordInput.oninput = function() {
				if(this.passwordStr === undefined) {
					this.passwordStr = ''
				}
				if(this.starStr === undefined) {
					this.starStr = ''
				}
				if(this.passwordNum === undefined) {
					this.passwordNum = 0;
				}
				if(event.keyCode == 8) {    //删除键的键盘码
					if(this.passwordNum === 0) {
						return false;
					}
					this.passwordNum--;
					this.passwordStr = this.passwordStr.split('');
					this.passwordStr.length--;
					this.passwordStr = this.passwordStr.join('');
					$(this).attr('pword', this.passwordStr);
					this.starStr = '';
					for(var i=0; i<this.passwordNum; i++) {
						this.starStr += '*';
					}
					return false;
				}
				if($(this).val()) {
					this.passwordNum++;
					this.starStr += '*';
					if(passwordReg.test($(this).val())) {
						this.passwordStr += passwordReg.exec($(this).val())[1];
						$(this).attr('pword', this.passwordStr);
						$(this).val(this.starStr);
					}else {
						alert('密码只能是阿拉伯数字数字或者英文字母');
					}				
				}
			}
		},

		/**
		 * [两次输入密码确认]
		 */
		passwordConfirm: function() {
			$('.confirm_password').blur(function(event) {
				if($(this).attr('pword') != $('.initial_password').attr('pword')) {
					alert('两次输入的密码不一致！');
				}
			});
		},

		/**
		 * [获取报名数据]
		 * @return {Boolean} [数据是否合法]
		 */
		getRegisterData: function() {
			var username = $('.username').val();
			var mobile = $('.mobile').val();
			var descrption = $('.descrption').val();
			var password = $('.initial_password').attr('pword');
			var gender = "";
			$('.gender input').each(function(index, el) {
				if($(this).attr('select') === 'yes') {
					gender = index == 0 ? 'boy' : 'girl'
				}
			});
			if(!username) {
				alert("请填写用户名称");
				return false;
			}
			if(!/^\d{11}$/.test(mobile)) {
				alert("请填写正确格式的手机号码");
				return false;
			}
			if(!descrption) {
				alert("请填写自我描述内容");
				return false;
			}
			return {
				username: username,
				mobile: mobile,
				descrption: descrption,
				gender: gender,
				password: password
			}
		}
	};

	if(indexReg.test(url)) {
		/*主页*/
		var voteUser = voteFn.getStorage('voteUser');
		$('.sign_in').click(function(event) {
			$('.mask').show();
			voteFn.signIn();
		});
		if(!voteUser) {
			/**/
		}else {
			$('.register').html('个人主页');
			$('.register').click(function(event) {
				var userDetailUrl = /(.*)index/.exec(url)[1] + 'detail/' + voteUser.id;
				window.location = userDetailUrl;
			});
		}

		$.ajax({
			url: '/vote/index/data?limit=10&offset=0',
			type: 'GET',
			success: function(data) {
				offset += limit;
				data = JSON.parse(data);
				$('.coming').append(voteFn.userStr(data.data.objects));
				voteFn.userPoll();
			}
		});
		dropLoad({       
			callback: function(load){
		        $.ajax({
		            url: '/vote/index/data?limit=' + limit + '&offset=' + offset,
		            type: 'GET',
		            success: function(data) {
		                data = JSON.parse(data);
		                var total = data.data.total;
		                var objs = data.data.objects;
		                if (offset < total) {                    
		                    setTimeout(function(){
		                    	offset += limit;
		                        $('.coming').append(voteFn.userStr(objs));
		                        voteFn.userPoll();
		                        load.reset();  
		                    }, 1000)
		                }else {
		                    load.complete();
		                    setTimeout(function(){
		                        load.reset(); 
		                    }, 1000)
		                }
		            }
		        })
		    }
		});

		$('.mask').click(function(event) {
			voteFn.passwordDiaplay('user_password');
			if(event.target.className === 'mask') {
				$('.mask').hide();
			}
		});

		$('.search span').click(function(event) {
			var searchContent = $('.search input').val();
			voteFn.setStorage('searchContent', searchContent);
			var seaechUrl = /(.*)index/.exec(url)[1] + 'search';
			window.location = seaechUrl;
		});

	} else if(registerReg.test(url)) {
		/*报名页*/
		var rebtnFlag = true;

		voteFn.passwordDiaplay('password');
		voteFn.passwordConfirm('password');

		$('.gender input').click(function(event) {
			$(this).attr('select', 'yes').parent('div').siblings('div').children('input').attr('select', 'no'); 
		});

		$('.rebtn').click(function(event) {
			if(!rebtnFlag) {
				return
			}
			rebtnFlag = false;
			var registerData = voteFn.getRegisterData();
			if(registerData == false) {
				return;
			}
			$.ajax({
				url: '/vote/register/data',
				type: 'POST',
				data: registerData,
				success: function(data) {
					data = JSON.parse(data);
					if(data.errno === 0) {
						var id = data.id;
						var reg = /(.*)register/;
						var voteUser = {
							password: registerData.password,
							id: id
						}
						voteFn.setStorage('voteUser', voteUser);
						alert(data.msg);
						window.location = reg.exec(url)[1] + 'index';
					} else {
						alert('报名失败');
					}
				}
			})
		});

	} else if(searchReg.test(url)) {
		/*搜索页*/
		var searchContent = voteFn.getStorage('searchContent');
		$.ajax({
			url: '/vote/index/search?content=' + searchContent,
			type: 'GET',
			success: function(data) {
				data = JSON.parse(data);
				if(data.data.length) {
					$('.coming').html(voteFn.userStr(data.data));
				}else {
					$('.nodata').show();
				}
			}
		});

	} else if(detailReg.test(url)) {
		/*详情页*/
		var idReg = /.*?(\d*)$/;
		var id = idReg.exec(url)[1];
		$.ajax({
			url: '/vote/all/detail/data?id=' + id,
			type: 'GET',
			success: function(data) {
				data = JSON.parse(data);
				if(data.errno == 0){
					$('.personal').html(voteFn.detailPersonalStr(data.data));
					$('.vflist').html(voteFn.detailVoterStr(data.data.vfriend))
				}else {
					alert(data.msg);
				}
			}
		});
	}
});