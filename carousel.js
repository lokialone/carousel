;(function($){

var carousel = function(poster){
	//保存单个carousel对象
	var self = this;
	this.inBase = 99;
	this.poster = poster;
	this.posterItemMain = poster.find("ul.poster-list");
	this.poster_next_btn = poster.find("div.poster-next-btn");
	this.poster_prev_btn = poster.find("div.poster-prev-btn");
	this.posterItemFirst = poster.find("li.poster-item").first();
	this.posterItemLast = poster.find("li.poster-item").last();
	this.posterSize =poster.find("li.poster-item").length;
	this.posterItem = poster.find("li.poster-item");
	this.rotateFlag = true;
	
	/**
	 * default setting
	 */
	this.setting ={

		"width":800,//幻灯片宽度
		"height":270,//幻灯片高度
		"posterWidth":640,//图片宽度
		"posterHeight":270,//图片高度
		"scale":0.8,
		"autoPlay":true,
		"delay":500,
		"speed":300,
		"vericalAlign":"top"
	}
	$.extend(this.setting,this.getSetting());
	this.setSettingValue();
	this.setPosterPos();
	this.poster_next_btn.click(function(){
		
  	if(self.rotateFlag){


		self.carouselRotate("left");
  	}
  	self.rotateFlag = false;

	});
	this.poster_prev_btn.click(function(){

		if(self.rotateFlag){

		self.carouselRotate('right');

		}
		self.rotateFlag = false;
		
	});
	if(this.setting.autoPlay == true){
		this.autoPlay();
		this.poster.hover(function(){

			window.clearInterval(self.timer);

		},function(){
			self.autoPlay();


		})

	}

}
carousel.prototype = {
	
	//设置幻灯片右边的参数
	setPosterPos:function () {
		
		// console.log(_self.setting.posterWidth);
		var _self = this;
		var sliceItems = this.posterItem.slice(1);
		var sliceSize = Math.ceil(sliceItems.length/2);
		var rightSlice = sliceItems.slice(0,sliceSize);//获得右边的幻灯片对象
		var leftSlice = sliceItems.slice(sliceSize,sliceItems.length)//获得左边的幻灯片对象
		var rw = this.setting.posterWidth;
		var rh = this.setting.posterHeight;
		var lw ;
		var lh ;
		var imgw = this.setting.posterWidth;
		var imgH = this.setting.posterHeight;
		var scale  = this.setting.scale;
		var level1 = sliceSize+this.inBase;
		var level2;
		
		var opacity1 = 0.9;
		var opacity2 ;
		var opacity = 0.9;

		var gap = (this.setting.width-this.setting.posterWidth)/2/rightSlice.length;
		var left = this.posterItemFirst[0].offsetLeft + this.setting.posterWidth;
		
		//右边的幻灯片位置及大小，透明度
		rightSlice.each(function(index){

				rw = rw*scale;
				rh = rh*scale;
				
				level1--;
				opacity1 = opacity1 - 0.05;
				left = left+gap;
				$(this).css({
					height:rh,
					width:rw,
					zIndex:level1,
					opacity:opacity1,
					left:left-rw,
					top:_self.setVerticalAlign(rh)
				})

		});
		lh = rh*scale;
		lw = rw*scale;
		opacity2 =opacity1-0.05;
		level2 = level1-1;
		leftSlice.each(function(i){
			lh = lh / scale;
			lw = lw / scale;
			level2++;
			opacity2 =  opacity2+0.05;
			right =gap*i;
			$(this).css({
				height:lh,
				width:lw,
				zIndex:level2,
				opacity:opacity2,
				left:right,
				top:_self.setVerticalAlign(lh)
			})
		});
	},

	//根据参数设置距离
	setVerticalAlign:function(height){
		var verticalType = this.setting.vericalAlign;
		var top = 0;
		if(verticalType ==="middle"){
			top = (this.setting.height-height)/2;
		}
		else if(verticalType === 'top'){
			top = 0;
		}else if(verticalType === "bottom"){
			top = this.setting.height-height;

		}else{
			top = (this.setting.height-height)/2;
		}
		return top;
	},

	//设置配置参数值去控制基本宽度和高度
	setSettingValue:function(){
		this.poster.css({
				width:this.setting.width,
				height:this.setting.height

		});
		this.posterItemMain.css({
				width:this.setting.width,
				height:this.setting.height

		});
		var w = (this.setting.width -this.setting.posterWidth)/2;
		this.poster_next_btn.css({
				width:w,
				zIndex:Math.ceil(this.posterSize/2)+this.inBase

		});
		this.poster_prev_btn.css({
				width:w,
				zIndex:Math.ceil(this.posterSize/2)+this.inBase


		});
		this.posterItemFirst.css({
			left:w,
			zIndex:Math.ceil(this.posterSize/2)+this.inBase
		});

	},


	//获取人工设置
	getSetting:function(){

		var setting = this.poster.attr("data-setting");

		if(setting && setting!=""){
		
		return $.parseJSON(setting);


		}else{
			return {};
		}
 	},
 	//旋转
 	carouselRotate:function(dir){
 		var self =this;
 		var zindexArr =[];
 		if(dir ==="right"){
 			self.posterItem.each(function(){
 			
 				var prev =$(this).prev('li').length!=0 ? $(this).prev():self.posterItemLast;
 				var width = prev.width();
 				var height = prev.height();
 				var opacity = prev.css("opacity");
 				var left = prev.css('left');
 				var zIndex =prev.css('zIndex');
 				zindexArr.push(zIndex);
 				var top =prev.css('top');
 				$(this).animate({
 					width:width,
 					height:height,
 					opacity:opacity,
 					left:left,
 					// zIndex:zIndex,
 					top:top

 				},self.setting.speed,function(){
 				self.rotateFlag=true
 			});


 			});
 			this.posterItem.each(function(i){

 				$(this).css("zIndex",zindexArr[i]);



 			})
 		}
 		else if(dir === "left"){
 			self.posterItem.each(function(){
 				var next = $(this).next().length!=0 ?$(this).next():self.posterItemFirst;
 				var width = next.width();
 				var height = next.height();
 				var opacity = next.css("opacity");
 				var left = next.css('left');
 				var zIndex =next.css('zIndex');
 				zindexArr.push(zIndex);
 				var top =next.css('top');
 				$(this).animate({
 					width:width,
 					height:height,
 					opacity:opacity,
 					left:left,
 					// zIndex:zIndex,
 					top:top

 			},function(){
 				self.rotateFlag=true
 			});



 			});
 			this.posterItem.each(function(i){

 				$(this).css("zIndex",zindexArr[i]);



 			})
 		}
 	},
 	//
 	autoPlay:function(){
 		var _this =this;
 		this.timer = window.setInterval(function(){

 			_this.poster_next_btn.click();

 		},_this.setting.delay);
 	}

}


carousel.init =function(posters){

	//初始化多个对象
	var _this_ = this;
	posters.each(function(){
		new _this_($(this));
	});



}
window["carousel"] = carousel;



})(jQuery);