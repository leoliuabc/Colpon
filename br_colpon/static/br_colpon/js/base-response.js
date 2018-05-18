
var conf=window.conf||{};
var CP = window.CP||{}; 
conf.appid="colpon";
conf.uid = $.cookie('uuid')||'';
conf.userId = $.cookie('user_id')||'';
conf.nation = $.cookie('nation')||'';
conf.utmSource = $.cookie('utm_source')||'colpon';
conf.isLogin = $('.header-login-btn').attr('data-isLogin');
conf.from = "colpon";
conf.locationSearch = {};
conf.locationSearchIn = window.location.search;
conf.locationPathName = window.location.pathname;
conf.locationHash = null;
conf.locationHref = window.location.href;
conf.locationHost = window.location.host;
conf.ua=window.navigator.userAgent;
conf.isIE8=$('body').hasClass('ie8');
conf.personalInfo=null;

CP.category='';
CP.getPathName=function(url){
  var url = url || window.location.pathname;
  var filename = url.split('/');
  return filename;
};
CP.pathNameArr = CP.getPathName('');  
if(!CP.pathNameArr[1]||CP.pathNameArr[1]=='index.html'){
  CP.category = 'index_html';
} else{
  CP.category = CP.pathNameArr[1]+'_html';
}

;(function(){
    var search = window.location.search.substring(1),
        arr = search.split('&');
    for(var i=0,len=arr.length;i<len;i++){
        var arr1 = arr[i].split('=');
        conf.locationSearch[arr1[0]] = arr1[1];
    }
    conf.locationHash = window.location.hash.substring(1);
})();

/*search*/
conf.search={
  _input:null,
  returnSubmit:function(form){
    var that = this;
    form.submit(function(){
      var val=that._input.val();
      if(val=="") {
        return false;
      };
    });
  },
  search:function(obj){
    var _input = this._input;
    _input.devbridgeAutocomplete({
         serviceUrl:"/suggest?",
         dataType:'jsonp',
         paramName:'q',
         deferRequestBy:10,
         triggerSelectOnValidInput:false,
         noCache: false,
          transformResult:function(data){
            var arr=$.map(data['data'],function(v,i){
            var value = v['name'],
              img = v['icon'],
              type = v['type'];
              return {
                img:img,
                value:value,
                data:{category:type}
                };
            });
          var alist ={
            query: "Unit",
            suggestions:arr
          };
        return alist; 
          },
          onSelect: function (a) {      
            obj.trigger("submit");
          },
          groupBy: 'category'
      });
  },
  init:function(obj){
    this._input = obj.find('.q');
    this.search(obj);
    this.returnSubmit(obj);
  }
};
conf.search.init($('#searchForm'));   

 /*dropDown*/
conf.dropdown={
  setStyle:function(me,bool,itop,obj,offsetparent){
    var me=$(me),
      _this = this,
      h=parseInt(me.height())-1,
      flag = obj.data('flag'),
      child=me.find(".dropdownList"),
      topHeight;

    if(flag&&bool){ 
      topHeight = offsetparent.innerHeight();
      child.css('top',topHeight+'px');
      child.removeClass("hidden");
      me.addClass("current");           
    } else if(flag&&bool||!_this.flag){
      child.addClass("hidden");
      me.removeClass("current");
    }         
  },
  getAttr:function(obj,offsetparent){
    var $me=$(obj),
      _this=this,
      eventType=$me.attr("data-event-type"),
      itop=$me.attr("data-boolean"),
      itop=itop?itop:true;
    switch (eventType){
      case "hover":
        $me.on("mouseenter",".dropdownMenu",function(){
          var that = this;
          $me.data('flag',true);
          setTimeout(function(){
            _this.setStyle(that,true,itop,$me,offsetparent);
          },100);
        }).on("mouseleave",".dropdownMenu",function(){
          var that = this;
          $me.data('flag',false);
          setTimeout(function(){
            _this.setStyle(that,false,itop,$me,offsetparent);
          },110);
        })
        break;
      case "click":
        $me.on("click",".dropdownMenu",function(event){
          var e=event.target||event.srcElement;
          $('.dropdownMenu').not(obj).find('.dropdownList').addClass("hidden");
          _this.setStyle(this,true,itop);
          if(e.tagName.toLowerCase()!="a"){
            event.preventDefault();
            return false;
          }
        });
        $(document).on("click",function(){
          $me.find('.dropdownList').addClass("hidden");
        });
        break;
    } 
  }
};

conf.dropdown.getAttr($('.E-dropdown'),$('.header-container'));
conf.dropdown.getAttr($('.E-Account-info'),$('.btn-group')); 

/*scrollPicture*/
conf.scrollPicture = {
  main : function(obj,opt){
    var next = opt.next,
        prev = opt.prev,
        page = opt.page,
        nav = opt.nav,
        item = opt.item,
        showMethod = opt.showMethod || 'move',
        ulWidth = opt.width,
        cur = 0,left,
        timer = null,
        clickTimer = null,
        move;
    var move = function(){
      if(showMethod=='move'){
        left = -cur * ulWidth;
        obj.animate({left:left+'px'},'slow');
      } else if(showMethod=="opacity"){
        item.removeClass('select');
        item.eq(cur).addClass('select');
      }
      nav.find('a').removeClass('select');
      nav.find('a').eq(cur).addClass('select');
      
    };
    if(showMethod=='move'){
      move = function(){
        left = -cur * ulWidth;
        obj.animate({left:left+'px'},'slow');
        nav.find('a').removeClass('select');
        nav.find('a').eq(cur).addClass('select');
      };
    } else if(showMethod=="opacity"){
      move = function(){
        item.removeClass('select');
        item.eq(cur).addClass('select');
        nav.find('a').removeClass('select');
        nav.find('a').eq(cur).addClass('select');
      };
    }

    var autoPlay=function(){
      clearInterval(timer);
      clearInterval(clickTimer);
      timer=setInterval(function(){
        cur++;
        if(cur>=page){
          cur = 0;
        }
        move();
      },8000);
    };
    autoPlay();
    obj.hover(function(){
      clearInterval(timer);
      clearInterval(clickTimer);
    },function(){
      clickTimer=setTimeout(function(){
        autoPlay();
      },3000);
    });
    nav.delegate('a','click',function(){
      var index = $(this).index();
      cur = index;
      clearInterval(timer);
      clearInterval(clickTimer);
      move();
      clickTimer=setTimeout(function(){
        autoPlay();
      },3000);
    });
    prev.click(function(){
      cur--;
      if(cur<0){
        cur = page-1;
      }
      clearInterval(timer);
      clearInterval(clickTimer);
      move();
      clickTimer=setTimeout(function(){
        autoPlay();
      },3000);
    });
    next.click(function(){
      cur++;
      if(cur>=page){
        cur = 0;
      }
      clearInterval(timer);
      clearInterval(clickTimer);
      move();
      clickTimer=setTimeout(function(){
        autoPlay();
      },3000);
    });
  },
  init : function(obj,opt){
    this.main(obj,opt);
  }
};  

/*popup*/
conf.popup={
  offerPopup : function(obj){
    var  title = obj.attr("data-title"),
      _id = obj.attr('data-id');
      type = obj.attr("data-type"),
      code = $.trim(obj.attr("data-code")),
      img = obj.attr("data-img"),
      alink = obj.attr("data-link")+'?utm_source='+conf.from+'&utm_medium=referral',
      name = obj.attr("data-name"),
      rule = obj.attr("data-rule"),
      popup = $('#offerPopup'),
      des = obj.attr('data-des'),
      verify = obj.attr('data-time-verify'),
      expire = obj.attr('data-time-expire'),
      likePercent = obj.attr('data-like-percent'),
      pathHash=conf.locationPathName+_id,
      vote = '2', saved = '0',
      favOffer = null, offerVote = null;

    if(conf.personalInfo){
      favOffer = conf.personalInfo['favorite_offers'];
      offerVote = conf.personalInfo['polls'];

      for(var i=0,l=favOffer.length;i<l;i++){
        if(favOffer[i]===_id){
          saved = '1';
          break;
        }
      }  

      for(var i=0,l=offerVote.length;i<l;i++){
        if(offerVote[i][_id]===0){
          vote = '0';
          break;
        } else if(offerVote[i][_id]===1){
          vote = '1';
          break;
        }
      }
    }  

    popup.find('.code .merchant-link').html('na '+name);
    popup.find('.nocode .merchant-link').html('na '+name);
    popup.find('.merchant-link').attr('href',alink);
    
    if(!code){
      popup.find('.nocode').css('display','block');
      popup.find('.code').css('display','none');
    } else if(!!code){
      popup.find('.code-text').html(code);
      popup.find('.nocode').css('display','none');
      popup.find('.code').css('display','block');
    }

    popup.find('.offer-favorite').attr('data-id',_id);
    popup.find('.click-wrap .glyphicon').attr('data-id',_id);

    if(saved=='1'){
      popup.find('.click-wrap .glyphicon').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
    }

    if(vote=='0'){
      popup.find('.offer-favorite').attr('data-vote','0');
      popup.find('.glyphicon-thumbs-down').addClass('vote');
    } else if(vote=='1'){
      popup.find('.offer-favorite').attr('data-vote','1');
      popup.find('.glyphicon-thumbs-up').addClass('vote');
    }

    if(!verify||verify.match(/^\s+$/)){
      popup.find('.verify').hide();
    } else{
      popup.find('.verify').html('Verificado: '+verify).show();
    }

    if(!expire||expire.match(/^\s+$/)){
      popup.find('.expire').hide();
    } else{
      popup.find('.expire').html('Validade: '+expire).show();
    }   

    if(!!likePercent){
      popup.find('.like-percent').html(likePercent+'% Sucesso').show();
    } else{
      popup.find('.like-percent').hide();
    }

    popup.find('.mer_logo img').attr('src',img).attr('alt',name);
    popup.find('.offer-title .con').html(title);
    popup.find('.offer-title i').attr('data-id',_id);
    if(saved==1){
      popup.find('.offer-title i').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
    } else{
      popup.find('.offer-title i').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
    }
    
    if(!rule||rule.match(/^\s+$/)){
      popup.find('.rule').hide();
    } else{
      popup.find('.rule strong span').html(rule);
      popup.find('.rule').show();
    }

    if(!conf.isIE8&&$('.code-btn').length){
      var client = new ZeroClipboard( $('.code-btn') );
      $('.code-btn').click(function(){
        $(this).html('<i class="glyphicon glyphicon-ok"></i>');
        $(this).addClass('copied');
      });
    }
    
  },
  openSite:function(obj,monkey){
    var link = obj.attr('data-link');
    setTimeout(function(){
      window.location = link;
    },100);
  },
  init:function(obj,monkey){
    this.openSite(obj,monkey);
  },
  showRegist:function(obj){
    var popup=$('.regist-popup'),
      img = obj.attr('data-img'),
      name = obj.attr('data-name'),
      rate = obj.attr('data-link'),
      fbUrl='/connect/facebook?next='+conf.locationPathName;
      
    $('.popup-con').css('marginLeft','-300px'); 
    $('.popup').addClass('hidden');
    $('.regist-popup').removeClass('hidden');
    $('.des-popup').addClass('hidden'); 
    $('.login-full-popup').addClass('hidden');
    popup.find('.title img').attr('src',img);
    popup.find('.title img').attr('alt',name);
    popup.find('.title p span').html(rate+'%');
    popup.find('input[name="next"]').val(conf.locationPathName);
    popup.find('.fb-login a').attr("href", fbUrl);
    conf.dialog.show($('.popup-wrap')); 
  },
  showLoginFull:function(){
    var status=$.cookie('loginbox');
    var isLogin=$('.header-login-btn').attr('data-isLogin');

    if(isLogin=='login'){
      return false;
    }
    
    if(!status){
      $.cookie('loginbox','hide',{"expires":1,"path":'/'});
    } else{
      return false;
    }
    
    this.showLoginFull_noJudge();
  },
  showLoginFull_noJudge:function(){    
    setTimeout(function(){
      $('#header-login').modal('show'); 
    },3000);
  }
};

/*offer vote*/
conf.offerVote = {
  vote:function(me){
    var _type = me.attr('data-type'),
        obj = me.parents('.offer-favorite'),
        status = obj.attr('data-vote'),
        wrap = me.parents('.stack-item'),
        popup = me.parents('#offerPopup'),
        _wrap,_obj,
        offer_id = obj.attr('data-id');

    if(status=='0'||status=='1'){
      return false;
    }
    if(wrap.length){
      wrap.attr('data-vote',_type);
    }
    if(popup.length){
      _wrap = $('.stack-item[data-id='+offer_id+']');
      if(_wrap.length){
        _wrap.attr('data-vote',_type);
        _obj = _wrap.find('.offer-favorite');
        if(_obj.length){
          _obj.attr('data-vote',_type);
          _wrap.find('.offer-favorite .glyphicon[data-type='+_type+']').addClass('vote');
        }
      }
    }
    
    obj.attr('data-vote',_type);
    me.addClass('vote');
    obj.find('.vote-popup').show();
    
    $.ajax({
      url: '/poll',
      method: 'POST',
      data: {
        'ajax':1,
        'type': Number(_type),
        'offer_id': offer_id
      }
    });
  },
  init:function(me){
    this.vote(me);
  }
};

$('.offer-favorite .thumb .glyphicon').click(function(){
  var me = $(this);
  conf.offerVote.init(me);
});

$('.vote-popup .close').click(function(){
  var obj = $(this).parents('.vote-popup');
  obj.hide('fast');
});

/*comment*/
conf.getComment={
  getMore:function(obj){
    var wrap = obj.parents('.stack-item'),
        _id = obj.attr('data-id'),
        numEle = obj.find('.show-tip span'),
        curNum = Number(numEle.html()),
        _url = '/more-comments/?ajax=1&offer_id='+_id+'&start=0',
        showBtn = obj.find('.show-more');

    obj.data('show','false');
    $.ajax({
      url: _url,
      type: 'GET',
      dataType: 'json',
      jsonp:'jsonp',
      success: function(oData) {
        var data = oData.data,
            html = [],
            commentList = obj.find('.comment-list ul');

        for(var i=0,l=data.length;i<l;i++){
          html.push("<li class='clearfix'>"); 
          html.push("<span class='glyphicon glyphicon-comment'></span>"); 
          html.push("<div class='con'>"); 
          html.push( data[i]['message']+" ("+data[i]['time_create']+")"); 
          html.push("<p class='text-small'>"+data[i]['time_ago']+" por "+data[i]['username']+"</p>"); 
          html.push("</div>");
          html.push("</li>");
        }    
        commentList.append(html.join(''));
        numEle.html(oData['total']);
        showBtn.addClass('hidden');
      },
      error: function() {
        var tip = obj.find('.result-tip-more');
        tip.html('Algum erro aconteceu, tente novamente mais tarde.');
        setTimeout(function(){
          tip.html('');
        },5000);
      }
    });
   ga('send','event',CP.category,'click','view_more_comment',1);
  },
  init:function(obj){
    var _this = this;
    _this.getMore(obj);
  }
};


$('.comment-module form').submit(function(event) {
  var me = $(this),
      text = me.find('textarea'),
      tip = me.find('.result-tip-send'),
      isEmpty;
  isEmpty = conf.emptyJudge(text,tip);
  
  if(!isEmpty){
    setTimeout(function(){
      tip.html('');
    },5000);
    return false;
  }

  $.ajax({
    url: '/comment',
    type: 'POST',
    data: me.serialize(),
    success:function(oData){
      var html = [],
          data = oData.comment,
          wrap = me.parents('.stack-item'),
          comment = me.parents('.comment-detail').find('.comment-list-wrap'),
          numEle = comment.find('.show-tip span'),
          curNum = Number(numEle.html()),
          oNumEle = wrap.find('.comment em'),
          oCurNum = Number(oNumEle.html());

      if(oData['error']==0){
        html.push('<li class="clearfix">');
        html.push('<span class="glyphicon glyphicon-comment"></span>');
        html.push('<div class="con">');
        html.push(data['message']+' ('+data['time_create']+')');
        html.push('<p>Segundos atrás por '+data['username']+'</p>');
        html.push('</div>');
        html.push('</li>');
        comment.find('ul').prepend(html.join(''));
        comment.find('.comment-list').scrollTop('0');
        numEle.html(curNum+1);
        oNumEle.html(oCurNum+1);
        comment.removeClass('hidden');
        text.val('');
        tip.html(oData['message']).removeClass('text-danger').addClass('text-success');
      } else{
        tip.html(oData['message']).removeClass('text-success').addClass('text-danger');
      }

      tip.slideDown('fast', function() {
        setTimeout(function(){
          tip.html('').slideUp('fast');
        },10000);
      });
      ga('send','event',CP.category,'click','send_comment',1);
    },
    error:function(errorThrown){
      if(errorThrown.responseText){
        tip.html('Algum erro aconteceu, tente novamente mais tarde.').removeClass('text-success').addClass('text-danger');
        tip.slideDown('fast', function() {
          setTimeout(function(){
            tip.html('');
            tip.slideUp('fast');
          },10000);
        });
      }
    }
  });
  
  event.preventDefault();
  return false;

});

/*mail Judge*/
conf.mailJudge=function(obj,tip){
  var val = obj.val(),isMail;
    isMail = val.match(/^[\w\.-]+@[a-z0-9-]+(\.[a-zA-Z0-9]{2,6})+$/);
    if(!isMail){
      tip.html('E-mail inválido. Confira se cometeu algum engano ao digitá-lo.');
      tip.slideDown('fast');
      return false;
    }
    return true;
}
conf.emptyJudge=function(obj,tip){
  var val = obj.val();
  if(!val||val.match(/^\s+$/)){
    tip.html("Não pode ser vazio.");
    tip.slideDown('fast');
    return false;
  }
  return true;
}

conf.favoriteCookie=function(cookieName,subName,newItem,maxLen,method){
  var _cookie= $.cookie(cookieName),
    str, 
    local_data,
    newJson={"shop":"","offer":""},
    oData , arr=[] , newArr=[] , cookie_str='';
  if(_cookie){
    str=$.parseJSON(_cookie);
  }
  
  if(!!str&&(!!str['shop']||!!str['offer'])){
    local_data=str;
    newJson=str;
  } 
  if(method!='delete'){
    newArr.push(newItem);
  }
  
  if(local_data){
    oData=local_data[subName];
    if(oData){
      arr = oData.split(',');
      for(var i=0,len=arr.length;i<Math.min(len,maxLen);i++){
        if(newItem!=arr[i]){
          newArr.push(arr[i]);
        }
      }
    }
  }
  newJson[subName]=newArr.join(',');
  
  cookie_str=JSON.stringify(newJson);
  
  $.cookie(cookieName,cookie_str,{'path':'/','expires':365});

};

;;(function(){
  var obj=$('#view-flag');
  if(!obj.length){
    return false;
  }
    
  var shopData=obj.attr('data-id');

  conf.favoriteCookie('view_shop','shop',shopData,11);

})();

conf.favoriteSuccess=function(obj,sendMethod,className,_type,_id){
  var fav = $('.header .favorite'),
      offerNum = Number(fav.attr("data-offernum")),
      storeNum = Number(fav.attr("data-storenum")),
      wrap = obj.parents('.stack-item'),
      popup = obj.parents('#offerPopup'),
      bg = obj.siblings('.click-bg'),
      _wrap,_obj;


  if(sendMethod=="POST"){
    if(_type=='shop'){
      if(storeNum==0){
        fav.find('.shop').removeClass('glyphicon-heart-empty').addClass('glyphicon-heart');
      }
      
      storeNum ++;
      fav.attr('data-storeNum',storeNum);

      bg.removeClass('bg-heart-gray').addClass('bg-heart-color click');
      setTimeout(function(){
        bg.removeClass('bg-heart-gray bg-heart-color click');
        obj.removeClass('glyphicon-heart-empty').addClass('glyphicon-heart');
      },250);

    } else if(_type=='offer'){

      if(wrap.length){
        wrap.attr('data-saved','1');
      } 
      if(popup.length){
        _wrap = $('.stack-item[data-id='+_id+']');
        _obj = _wrap.find('.glyphicon-star-empty');

        _wrap.attr('data-saved','1');
        _obj.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      }

      offerNum ++;
      fav.attr('data-offerNum',offerNum);
      fav.find('.offer').removeClass('glyphicon-star-empty').addClass('glyphicon-star');

      bg.removeClass('bg-star-gray').addClass('bg-star-color click');
      setTimeout(function(){
        bg.removeClass('bg-star-gray bg-star-color click');
        obj.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
      },250);
    }

    obj.removeClass(className+'-empty');
    obj.addClass(className);
  } else if(sendMethod=="DELETE"){
    if(_type=='shop'){
      storeNum --;
      storeNum = storeNum<=0 ? 0:storeNum;
      fav.attr('data-storeNum',storeNum);
      if(storeNum==0){
        fav.find('.shop').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
      }

      bg.removeClass('bg-heart-color').addClass('bg-heart-gray click');
      setTimeout(function(){
        bg.removeClass('bg-heart-gray bg-heart-color click');
        obj.removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
      },250);

    } else if(_type=='offer'){
      if(wrap.length){
        wrap.attr('data-saved','0');

      } 
      if(popup.length){
        _wrap = $('.stack-item[data-id='+_id+']');
        _obj = _wrap.find('.glyphicon-star');
        _wrap.attr('data-saved','0');
        _obj.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
      }

      offerNum --;
      offerNum = offerNum<=0 ? 0:offerNum;
      fav.attr('data-offerNum',offerNum);
      if(offerNum==0){
        fav.find('.offer').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
      }
      bg.removeClass('bg-star-color').addClass('bg-star-gray click');
      setTimeout(function(){
        bg.removeClass('bg-star-gray bg-star-color click');
        obj.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
      },250);
    }
  }  
};

conf.favoritePost=function(obj,sendMethod,className,_id){
  var _uid=$.cookie('user_id')||'',
      _type=obj.attr('data-type');
   
  $.ajax({
    url: '/favorite',
    method: sendMethod,
    data: {
      type: _type,
      id:_id
    },
    success:function(){
      conf.favoriteSuccess(obj,sendMethod,className,_type,_id);
      
    },
    error:function(){
      console.log('Algum erro aconteceu, tente novamente mais tarde.');
    }
  })
};

conf.favPost=function(obj,className){
  var _id=obj.attr('data-id'),
      _type = obj.attr('data-type'),
      noEvent = obj.attr('data-event'),
      isLogin=conf.isLogin;

  if(noEvent=='0'){
    return false;
  }   

  if(isLogin=='login'){
    conf.favoritePost(obj,'POST',className,_id);
  } else if(isLogin=='noLogin'){

    conf.favoriteSuccess(obj,'POST',className,_type,_id);
    conf.favoriteCookie('favorite',_type,_id,17);
  }
};
conf.favDelete=function(obj,className){
  var _id=obj.attr('data-id'),
      _type=obj.attr('data-type'),
      noEvent = obj.attr('data-event'),
      isLogin=conf.isLogin;

  if(noEvent=='0'){
    return false;
  }   
  if(isLogin=='login'){
    conf.favoritePost(obj,'DELETE',className,_id);
  } else if(isLogin=='noLogin'){
    conf.favoriteSuccess(obj,'DELETE',className,_type,_id);
    conf.favoriteCookie('favorite',_type,_id,17,'delete');
  }
}

$(document).delegate('.glyphicon-heart-empty', 'click', function(event) {
  var me = $(this);
  conf.favPost(me,'glyphicon-heart');

});
$(document).delegate('.glyphicon-heart', 'click', function(event) {
  var me=$(this);
  conf.favDelete(me,'glyphicon-heart');

});
$(document).delegate('.glyphicon-star-empty', 'click', function(event) {
  var me=$(this);
  conf.favPost(me,'glyphicon-star');
  
});
$(document).delegate('.glyphicon-star', 'click', function(event) {
  var me=$(this);
  conf.favDelete(me,'glyphicon-star');

});


/*行云统计组件*/
;;(function () {
  if (!window.XA) {
    XA = {
      /*自适应http,https*/
      _url: '//xa.xingcloud.com/v4/',
      /* action队列*/
      _actions: [],
      /*update队列*/
      _updates: [],
      /*运行中状态*/
      _sending: false,
      init: function (option) {
        if (!option.app) {
          throw new Error('App is required.');
        }
        XA._app = option.app;
        XA._uid = option.uid || "random";
      },
      setUid: function (uid) {
        XA._uid = uid;
      },
      action: function () {
        for (var i = 0, l = arguments.length; i < l; i++) {
          XA._actions.push(arguments[i]);
        }
        XA._asyncSend();
      },
      update: function () {
        for (var i = 0, l = arguments.length; i < l; i++) {
          XA._updates.push(arguments[i]);
        }
        XA._asyncSend();
      },
      /**
       异步执行,会自动合并相邻请求，节约带宽  */
      _asyncSend: function () {
        setTimeout(function () {
          var rest = XA._url + XA._app + '/' + XA._uid + '?',
            item = null,
            strItem = '',
            index = 0,
            length = XA._updates.length + XA._actions.length;
          if (length == 0 || XA._sending) {
            return;
          }
          XA._sending = true;
          while (item = XA._updates.shift()) {
            strItem = 'update' + index+++'=' + encodeURIComponent(item) + '&';
            if (rest.length + strItem.length >= 1980) {
              XA._updates.unshift(item);
              break;
            }
            else {
              rest = rest + strItem;
            }
          }
          index = 0;
          while (item = XA._actions.shift()) {
            strItem = 'action' + index+++'=' + encodeURIComponent(item) + '&';
            if (rest.length + strItem.length >= 1980) {
              XA._actions.unshift(item);
              break;
            }
            else {
              rest = rest + strItem;
            }
          }
          (new Image()).src = rest + '_ts=' + new Date().getTime();
          if (XA._updates.length + XA._actions.length > 0) {
            XA._asyncSend();
          }
          XA._sending = false;
        }, 0);
      }
    }
  }
}
)();

(function(){
  var browser = "other";
  var browserVersion = "unknown";
  var os = "other";
  var osVersion = "unknown";
  var ua = window.navigator.userAgent;
  var ver = window.navigator.appVersion;
  var matches = null;
  if(matches = ua.match(/chrome\/([0-9.]+)/i)){
    browser = "chrome";
    browserVersion = matches[1];
  }else if(matches = ua.match(/firefox\/([0-9.]+)/i)){
    browser = "firefox";
    browserVersion = matches[1];
  }else if(matches = ua.match(/opera\/([0-9.]+)/i)){
    browser = "opera";
    browserVersion = matches[1];        
  }else if(ua.match(/\s+safari\/[0-9.]+/i) && (matches = ua.match(/\s+version\/([0-9.]+)/i))){
    browser = "safari";
    browserVersion = matches[1];        
  }else if(ua.match(/trident/i) && (matches = ua.match(/[^\w]msie\s+([0-9.]+)/i))){
    browser = "ie";
    browserVersion = matches[1];
  }else if(ua.match(/trident/i) && (matches = ua.match(/[^\w]rv:([0-9.]+)/i))){
    browser = "ie";
    browserVersion = matches[1];
  };
  var clientStrings = [
    {s:'Windows 3.11', r:/Win16/},
    {s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
    {s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
    {s:'Windows 98', r:/(Windows 98|Win98)/},
    {s:'Windows CE', r:/Windows CE/},
    {s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
    {s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
    {s:'Windows Server 2003', r:/Windows NT 5.2/},
    {s:'Windows Vista', r:/Windows NT 6.0/},
    {s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
    {s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
    {s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
    {s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s:'Windows ME', r:/Windows ME/},
    {s:'Android', r:/Android/},
    {s:'Open BSD', r:/OpenBSD/},
    {s:'Sun OS', r:/SunOS/},
    {s:'Linux', r:/(Linux|X11)/},
    {s:'iOS', r:/(iPhone|iPad|iPod)/},
    {s:'Mac OS X', r:/Mac OS X/},
    {s:'Mac OS', r:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s:'QNX', r:/QNX/},
    {s:'UNIX', r:/UNIX/},
    {s:'BeOS', r:/BeOS/},
    {s:'OS/2', r:/OS\/2/},
    {s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
  ];
  for(var id in clientStrings){
    var cs = clientStrings[id];
    if (cs.r.test(ua)) {
      os = cs.s;
      break;
    }
  };
  if(/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)[1];
    os = 'Windows';
  };
  switch(os){
    case 'Mac OS X':
      osVersion = /Mac OS X (10[\.\_\d]+)/.exec(ua)[1];
      break;
    case 'Android':
      osVersion = /Android ([\.\_\d]+)/.exec(ua)[1];
      break;
    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(ver);
      osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
      break;
  }; 
  window.loginfo = window.loginfo || {};
  window.loginfo.browser = browser;
  window.loginfo.browserVersion = browserVersion;
  window.loginfo.os = os;
  window.loginfo.osVersion = osVersion;
})();

/*初始化行云统计*/
;;(function(){
  /**ga Param**/
    CP.label = '';
  CP.sendGAself=function(){
    $("#searchForm").on('submit', function(){
      var category = CP.category||'other',
        action = 'search',
        label = CP.label;
      ga('send','event',category,action,label,1);
    });
    $(document).on('click', function(e){
      var me = $(e.target);
        if(me.prop('tagName').toUpperCase() != 'A' && me.parents('a').length <=0 ){
          return ;
        }
        /*get monkey*/
      var monkey = me.parents("[monkey]").attr('monkey') || 'other';
      var category = CP.category||'other',
         action = 'click',
         label = monkey.replace('.', '_');
      ga('send','event',category,action,label,1);
    });   
  };
  
  if(!CP.pathNameArr[2]&&!CP.pathNameArr[1]||CP.pathNameArr[1]=='index.html'){
    CP.label = 'index';
  } else if(!CP.pathNameArr[2]&&CP.pathNameArr[1]!='index.html'){
    CP.label = CP.pathNameArr[1];
  } else{
    CP.label = CP.pathNameArr[2];
  }
  /**end ga Param**/
  
  
  /*从url中获取文件名*/
  function getFileName(url){
    var url = url || window.location.pathname,
      fileName = '',
      arr = url.split('/');
    if(!arr[1]||arr[1]=='index.html'){
      fileName = 'index_html';
    } else{
      fileName = arr[1]+'_html';  
    }
    return fileName;
  }
  /*解析domain作为appid*/
  function getAppId(){
    var matches = window.location.hostname.match(/([^\.]+).(com|net|me|org)$/);
    if(matches!=null){
      return matches[1];
    }
    else{
      return null;
    }
  }
  
  /*如果获取不到uid，只执行GA统计*/
  if(!$.cookie('uuid') || !XA  ) {
    CP.sendGAself();
    return;
  }
  /*get appid */
  var appid = null;
  if(window.conf && conf.appid){
    appid = conf.appid;
  }
  else{
    appid = getAppId();
  }
  /*如果无法从配置文件或者domain中获取appid，则只发送GA统计，并退出行云初始化*/
  if(!appid)  {
    CP.sendGAself();
    return;
  }
  $(document).ready(function(){   
    XA.init({
      app: appid, uid: $.cookie('uuid')}
    );
    var matches = window.location.href.match(/[&?]type=([^&]+)/);
    if(matches && matches[1]){
      XA.action('visit.'+ matches[1]);
    }else{
      XA.action('visit.colpon');
    }
    if(window.conf && conf.pageName){
      XA.update('platform,' + conf.pageName);
    }else{
      XA.update('platform,default_index');
    }
    if($.cookie('from')){
      XA.update('ref0,' + $.cookie('from'));
    }
    if($.cookie('nation')){
      XA.update('nation,' + $.cookie('nation'));
    }
    XA.update('browser,' + window.loginfo.browser);
    XA.update('browserVersion,' + window.loginfo.browserVersion);
    XA.update('os,' + window.loginfo.os);
    XA.update('osVersion,' + window.loginfo.osVersion);
    XA.update();
  });
  /*搜索统计*/
  $("#searchForm").on('submit', function(e){
    var me = $(this);
    var type = me.attr('search-type') || 'normal';
    var value = me.attr('search-val') || '0';
    window.XA && XA.action('colpon.search.colpon.' + type + ',' + value);
    /*ga*/
    var category = CP.category||'other',
        action = 'search',
      label = CP.label;
    ga('send','event',category,action,label,1);
    /*end ga*/
  }
        );
  /*点击统计*/
  $(document).on('click', function(e){
    var me = $(e.target);
    if(me.prop('tagName').toUpperCase() != 'A' && me.parents('a').length <=0 ){
      return ;
    }
    var base = ['colpon', 'click'];
    /*获取页面名称*/
    if(window.conf && conf.pageName ){
      base.push(conf.pageName.replace('.', '_'));
    }
    else{
      var filename = getFileName('')||  'index_html';
      base.push(filename.replace('.', '_' ));
    }
    /*get monkey*/
    var monkey = me.parents("[monkey]").attr('monkey') || 'other';
    base.push(monkey.replace('.', '_'));
    /*get click type*/
    var link = me.prop('tagName').toUpperCase() == 'A' ? me : $(me.parents('a')[0]);
    var tp = link.attr('ad-type') || 'normal';
    base.push(tp.replace('.', '_'));
    var value = link.attr('ad-val') || '0';
    window.XA && XA.action(base.join('.') + ',' + value );
  });
})();
