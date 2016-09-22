let fs = require('fs');

let dealFn = {
	/**
	 * [通过Promise写入数据]
	 * @param  {String} file [文件名]
	 * @param  {Object} obj  [写入的数据（对象）]
	 * @return {Object}      [Promise对象]
	 */
	writeFileData: (file, obj) => {
	    let promise = new Promise((resolve, reject) => {
	        obj = JSON.stringify(obj);
	        fs.writeFile("./public/database/" + file, obj, function(err){
	            if(err) {
	                reject("fail " + err)
	            }
	            else {
	                resolve("write success!");
	            }
	        });
	    }) 
	    return promise;
	},

	/**
	 * [通过Promise读取存储的数据]
	 * @param  {String} file [文件名]
	 * @return {Object}      [Promise对象]
	 */
	readFileData: (file) => {
	    let promise = new Promise((resolve, reject) => {
	        fs.readFile("./public/database/" + file, "utf-8", (err, data) => {
	            if(err) {
	                console.log(err);
	                reject("read filedata error!");
	            }else {
	                data = JSON.parse(data);
	                resolve(data);
	            }
	        })
	    });
	    return promise;
	},

	/**
	 * [获取某个id号的对象]
	 * @param  {Number} id   [id号]
	 * @param  {Array} objs  [数组]
	 * @return {Object}      [对象]
	 */
	getItem: (id, objs) => {
		for(var i=0; i<objs.length; i++) {
			if(objs[i].id === id) {
				return objs[i];
			}
		}
		return null;
	},

	/**
	 * [判断密码是否有效]
	 * @param  {Number} id       [id号]
	 * @param  {Array} objs      [数组]
	 * @param  {String} password [密码]
	 * @return {Boolean}         [是否有效]
	 */
	matchUser: (id, objs, password) => {
		let userObj = dealFn.getItem(id, objs);
		if(userObj) {
			return userObj.password == password;
		}
		return false;
	},

	/**
	 * [根据票数进行排名]
	 * @param  {Array} objs [数组]
	 * @return {Array}      [排名后的数组]
	 */
	sortRank: (objs) => {
		let rank = 1;
		let sortVoteObjs = objs.sort(function(a, b) {
			return b.vote - a.vote;
		});
		for(let i=0; i<sortVoteObjs.length-1; i++) {
			sortVoteObjs[i].rank = rank;
			if(sortVoteObjs[i].vote != sortVoteObjs[i+1].vote) {
				rank++;
			}	
		}
		sortVoteObjs[sortVoteObjs.length-1].rank = rank
		return sortVoteObjs;
	},

	/**
	 * [搜索某个匹配项]
	 * @param  {String} content [搜索关键字内容]
	 * @param  {Array} objs     [被搜索的数组]
	 * @return {Array}          [搜索到的数组]
	 */
	serchItems: (content, objs) => {
		let searchResult = [];
		let reg = /^\d*$/;
		if(reg.test(content)) {
			let searchUser =  dealFn.getItem(+content, objs);
			if(searchUser) {
				searchResult.push(searchUser);
			}
		}
		for(var i=0; i<objs.length; i++) {
			if(objs[i].username === content) {
				searchResult.push(objs[i]);
			}
		}
		return searchResult;
	},

	cloneUser: (obj) => {
		return {
            "username": obj.username,
            "mobile": obj.mobile,
            "descrption": obj.descrption,
            "gender": obj.gender,
            "password": obj.password,
            "head_icon": obj.head_icon,
            "id": obj.id,
            "vote": obj.vote,
            "rank": obj.rank,
            "vote_times": ++obj.vote_times,
            "vfriend": [],
            "time": Date.parse(new Date())
        }
	}
}

module.exports = dealFn;
