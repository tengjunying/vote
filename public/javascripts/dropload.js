(function(){
    /**
     * [Load description] 下拉加载构造函数
     * @param 
     * obj = {
     *    dropClass(加载模块，即类名，可选),
     *    domRefresh(加载样式，可选),
     *    dropUpdate(加载样式，可选), 
     *    dropLoad(加载样式，可选),
     *    dropComplete(加载样式，可选), 
     *    callback(加载执行的回调函数，必选), 
     * }
     */
    function Load(obj) {
        this.dropClass = obj.dropClass === undefined ? 'body' : obj.dropClass;
        this.domRefresh = obj.domRefresh === undefined ? '<div class="dropload-refresh">↑上拉加载更多</div>' : obj.domRefresh;
        this.dropUpdate = obj.dropUpdate === undefined ? '<div class="dropload-update">↓释放加载</div>' : obj.dropUpdate;
        this.dropLoad = obj.dropLoad === undefined ? '<div class="dropload-load"><span class="loading"></span>加载中...</div>' : obj.dropLoad;
        this.dropComplete = obj.dropComplete === undefined ? '<div class="dropload-complete">内容已全部显示！</div>' : obj.dropComplete;
        this.callback = obj.callback === undefined ? "" : obj.callback;
        this.init();
        this.isLoad();
    }

    Load.prototype.init = function() {
        /*是否加载*/
        this.loadFlag = false;

        /*是否释放进行加载*/
        this.updateFlag = false;

        /*是否正在加载*/
        this.loadingFlag = false;

        /*是否加载完成*/
        this.completeFlag = false;

        this.dropClass = this.dropClass === "body" ? "body" : '.' + this.dropClass;
        this.content = document.querySelector(this.dropClass);
        this.loadBox = document.createElement("div");
        this.loadBox.className = "dropload";
        this.content.appendChild(this.loadBox);
    }

    /**
     * [isLoad description] 执行加载动作
     */
    Load.prototype.isLoad = function() {
        var _this = this;
        window.onscroll = function() {
            var realHeight = (document.documentElement.clientHeight || document.body.clientHeight) + (document.documentElement.scrollTop || document.body.scrollTop);
            var winHeight = (document.documentElement.scrollHeight || document.body.scrollHeight);
            if (realHeight >= winHeight) {
                _this.loadFlag = true;
            }else {
                _this.loadFlag = false;
            }
        }

        this.start = function(e) {
            if(!_this.loadingFlag) 
                _this.loadBox.innerHTML = _this.domRefresh;
            _this.loadFlag === true ? _this.startY = e.touches[0].pageY : _this.startY = undefined;
        }

        this.move = function(e) {
            var moveY = e.touches[0].pageY;
            if(_this.startY && !_this.loadingFlag) {
                if(_this.startY-moveY > 100) {
                    if(!_this.completeFlag) {
                        _this.updateFlag = true;
                        _this.loadBox.innerHTML = _this.dropUpdate;
                    }else {
                        _this.loadBox.innerHTML = _this.dropComplete;
                        setTimeout(function(){
                            _this.reset();
                        }, 1000)
                    }
                }
            }
        }

        this.end = function(e) {
            if(_this.updateFlag) {
                _this.updateFlag = false;
                _this.loadingFlag = true;
                _this.loadBox.innerHTML = _this.dropLoad;
                _this.callback(_this);
            }
        }

        window.addEventListener("touchstart", this.start, false);
        window.addEventListener("touchmove", this.move, false);
        window.addEventListener("touchend", this.end, false);
    }

    /**
     * [reset description] 加载复位，回调函数执行后需要执行此步骤
     */
    Load.prototype.reset = function() {
        this.loadBox.innerHTML = "";
        this.loadingFlag = false;
    }

    /**
     * [complete description] 加载完成，数据全部加载完后调用此函数
     * @return {[type]} [description]
     */
    Load.prototype.complete = function() {
        var _this = this;
        this.loadBox.innerHTML = this.dropComplete;
        if(!this.completeFlag) {
            this.completeFlag = true;
            window.removeEventListener("touchend", this.end, false);
        }
    }

    /**
     * [dropLoad description] 执行该方法即可运行加载功能
     * @param  见Load函数描述
     * @return 加载
     */
    window.loadMore = function(option) {
        return new Load(option);
    } 

})()