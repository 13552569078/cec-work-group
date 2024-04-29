var sdk = new HY_SDK_WS();
sdk.mac = uuid();
window.onbeforeunload = function (e) {
  if (sdk) {
    try {
      sdk.destory();
    } catch (e) {
      console.error("onbeforeunload:::" + e);
    }
  }
};

/*function destorySdk(){
	alert(33)
	sdk.destory();
}
*/

sdk.notifyUserStatus = function (json) {
  this.log(" 收到推送，用户状态消息： ", json);
  if (json.nOnline == 2 && json.strUserID == this.opts.loginName) {
    this.sie.userStatus = json.nOnline;
    console.error(" 收到推送，用户状态消息： ", json);
    this.userReConnectReq();
  } else {
    if (json.nOnline == 2) {
      setLog("好友消息提示：" + json.strUserName + "离线");
    } else if (json.nOnline == 1) {
      setLog("好友消息提示：" + json.strUserName + "上线");
    }
  }
};
sdk.notifyKickOutEx = function (json) {
  $("#login-btn").show();
  $("#logout-btn").hide();
  bootbox.alert("账号已被踢出");
  setTimeout(function () {
    window.location.reload()
  }, 3000);
  setLog("账号已被踢出");
}

sdk.getBeingAction = function (callBack) {
  var _this = this;
  var json = {};
  var arr = Object.keys(_this.calledMt);
  var len = arr.length;

  var talkarr = Object.keys(_this.calledTk);
  var talklen = talkarr.length;

  var channelarr = Object.keys(_this.calledTC);
  var channellen = channelarr.length;
  if (_this.callMt) {
    if (_this.callMt) {
      json.type = "meet";
      json.okFun = function () {
        _this.callMt.stopMeeting(function () {
          callBack && callBack();
        });
      }
    }
  } else if (len > 0) {
    json.type = "meet";
    json.okFun = function () {
      for (var key in _this.calledMt) {
        len--;
        var currMt = _this.calledMt[key];
        if (currMt.nMeetingID && currMt.strMeetingDomainCode) {
          _this.calledMt[key].quitMeeting(function () {
            if (len == 0) {
              callBack && callBack();
            }
          });
        }
      }
    }
  } else if (_this.callTk) {
    json.type = "talk";
    json.okFun = function () {
      _this.callTk.quitReq(function () {
        callBack && callBack();
      });
    }
  } else if (talklen > 0) {
    json.type = "talk";
    json.okFun = function () {
      for (var key in _this.calledTk) {
        talklen--;
        var currMt = _this.calledTk[key];
        if (currMt.nTalkbackID && currMt.strTalkbackDomainCode) {
          _this.calledTk[key].quitReq(function () {
            if (talklen == 0) {
              callBack && callBack();
            }
          });
        }
      }
    }
  } else if (_this.callTC) {
    json.type = "tchannel";
    json.okFun = function () {
      _this.callTC.leaveReq(function () {
        callBack && callBack();
      });
    }
  } else if (channellen > 0) {
    json.type = "tchannel";
    json.okFun = function () {
      for (var key in _this.calledTC) {
        channellen--;
        var currMt = _this.calledTC[key];
        if (currMt.nTrunkChannelID && currMt.strTrunkChannelDomainCode) {
          _this.calledTC[key].leaveReq(function () {
            if (channellen == 0) {
              callBack && callBack();
            }
          });
        }
      }
    }
  } else {
    json.type = "no";
    json.okFun = function () {
      callBack && callBack();
    }
  }
  //console.error("!!!!!!!!!!!",json);
  if (json.type == 'no') {
    json.okFun();
  } else {
    var message = "是否关闭当前正在进行的" + (json.type == "meet" ? "会议" : json.type == "talk" ? "对讲" : "集群对讲")
    var confrmDialog = bootbox.dialog({
      message: message,
      title: "提示",
      closeButton: false,
      buttons: {
        success: {
          label: "确定",
          className: "btn-success",
          callback: function () {
            json.okFun();
          }
        },
        danger: {
          label: "取消",
          className: "btn-danger",
          callback: function () {

          }
        }
      }
    });
  }

}
var userStatus = {
  "0": "不在线",
  "1": "空闲",
  "2": "采集中",
  "3": "对讲中",
  "4": "会议中"
};

var meetingStauts = {
  1: "正在进行",
  2: "已经结束",
  4: "尚未开始"
};

var trunkStauts = {
  1: "静态频道",
  2: "临时频道（正在进行）",
  4: "历史频道（临时结束）",
  8: "默认频道"
}
// 接收透明通道消息
sdk.notifyMsg = function (body) {
  sdk.log(JSON.stringify(body));

  bootbox.alert("收到新消息! 内容:" + JSON.stringify(body));
  setLog("收到新消息！" + JSON.stringify(body));

}


$(function () {
  $("#login-btn").click();
  $(".left").css({height: $(window).height()});
  $(".left-panel").css({height: $(window).height()});
})
try {
  /* var cvanvas = sdk.getCanvas({
        canvasId: 'canvas-content',
        width: 300,
        height: 200,
        sdk: sdk
    });
    cvanvas.initControlPanel();*/
} catch (e) {
  window.console && window.console.error(e);
}


function findPlayerIsIn(list) {
  if (activeHyVideo) {
    var flag = false;
    list.some(function (ele) {
      if (ele.id == activeHyVideo.id) {
        activeHyVideo.close();
        flag = true;
        return;
      }
    });
    return flag;
  }
}

//
function initTreeLi(json) {
  var li = $("<li/>").addClass("tree-branch");
  var div = $("<div/>").addClass("tree-branch-header");
  var child = $("<ul/>").addClass("tree-branch-children");
  if (json.type == "user") {
    li.css({"cursor": "pointer"})
    var img = $("<img/>").css({
      "float": "left",
      "margin": "2px 6px 0 0 "
    }).data("info", json.info).attr("src", 'data:image/png;base64,' + imgMap["select"]).width(16).height(16);
    li.bind("click", function () {
      if (img.hasClass("user-select")) {
        img.removeClass("user-select");
        img.attr("src", 'data:image/png;base64,' + imgMap["select"]);
      } else {
        img.addClass("user-select");
        img.attr("src", 'data:image/png;base64,' + imgMap["selected"])
      }
    })
    div.empty().append(img).append("  " + json.name)
  } else if (json.type == "group") {
    li.css({"cursor": "pointer"})
    var img = $("<img/>").css({
      "float": "left",
      "margin": "2px 6px 0 0 "
    }).data("info", json.info).attr("src", 'data:image/png;base64,' + imgMap["select"]).width(16).height(16);
    li.bind("click", function () {

      $(".group-select").removeClass("group-select").attr("src", 'data:image/png;base64,' + imgMap["select"]);
      ;

      if (img.hasClass("group-select")) {
        img.removeClass("group-select");
        img.attr("src", 'data:image/png;base64,' + imgMap["select"]);
      } else {
        img.addClass("group-select");
        img.attr("src", 'data:image/png;base64,' + imgMap["selected"])
      }
    })
    div.empty().append(img).append("  " + json.name)
  } else {
    var img = $("<img/>").css({
      "float": "left",
      "margin": "2px 6px 0 0 "
    }).addClass("expend").attr("src", 'data:image/png;base64,' + imgMap["flod"]).width(16).height(16).css({"cursor": "pointer"});
    img.bind("click", function () {
      if (img.hasClass("expend")) {
        img.removeClass("expend");
        img.attr("src", 'data:image/png;base64,' + imgMap["expend"]);
        child.hide();
      } else {
        img.addClass("expend");
        img.attr("src", 'data:image/png;base64,' + imgMap["flod"]);
        child.show();
      }
    })
    div.empty().append(img).append("  " + json.name)
  }
  li.append(div).append(child);
  return {li: li, ul: child}
}

//获取人员
function getUserAction(root) {
  if (sdk.sie.userStatus == 1) {
    var list = [];
    var obj = {};
    root.empty();
    sdk.getDomainReq(function (msg) {
      if (msg.nResultCode == 0) {
        var domainC = msg.domainInfoList ? msg.domainInfoList.length : 0;
        $.each(msg.domainInfoList, function (i, e) {
          obj[e.strDomainCode] = e;
          var opt = {
            strDomainCode: e.strDomainCode,
            "listUser": []
          };
          sdk.queryUserListReq(opt, function (res) {
            domainC--;
            if (res.nResultCode == 0) {
              e.child = res.listUser;
            }

            if (domainC == 0) {
              var newObj = $.extend({}, obj);
              $.each(obj, function (i, e) {
                if (e.strParentDomainCode && e.strParentDomainCode != e.strDomainCode) {
                  if (newObj[e.strParentDomainCode]) {
                    if (newObj[e.strParentDomainCode].domainList) {
                      newObj[e.strParentDomainCode].domainList.push(e);
                    } else {
                      var l = [];
                      l.push(e);
                      newObj[e.strParentDomainCode].domainList = l;
                    }
                    //delete newObj[e.strParentDomainCode]
                  }
                }
              });
              drawOnlineUser(newObj, root);
            }
          });
        });
      }
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//根据查询结果画在线人员
function drawOnlineUser(obj, root) {
  $.each(obj, function (i, e) {
    var obj = initTreeLi({name: e.strDomainName});
    if (e.domainList) {
      drawOnlineUser(e.domainList, obj.ul);
    }
    if (e.child) {
      $.each(e.child, function (ui, ue) {
        ue.domainCode = e.strDomainCode;
        if (!(ue.domainCode == sdk.sie.strUserDomainCode && ue.strUserID == sdk.opts.loginName)) {
          var uobj = initTreeLi({name: ue.strUserName, type: "user", info: ue});
          obj.ul.append(uobj.li);
        }
      });
    }
    root.append(obj.li);
  });
}

//获取选中人员
function getSelectUser(root) {
  var list = [];
  $(".user-select", root).each(function (i, e) {
    var info = $(e).data("info");
    list.push(info);
  });
  return list;
}

/**********************************音视频播放***************************************************/
//设置布局
function setLayout() {
  if (sdk.mainPlay) {
    sdk.mainPlay.stopPlay();
  }
  if (sdk.sie.userStatus == 1) {
    $("#playPlayer").show();
    var pla = {
      layout: $("#layout").val() * 1,
      pnode: "playPlayer"
    };
    sdk.mainPlay = sdk.getPlayer(pla);
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function stopAllPlay() {
  if (sdk.sie.userStatus == 1) {
    if (sdk.mainPlay) {
      sdk.stopPlay(sdk.mainPlay);
    }
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//追加布局
function addLayout() {
  if (sdk.sie.userStatus == 1) {
    if (sdk.mainPlay) {
      sdk.addLayout(sdk.mainPlay);
    }
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//静音
function setMute() {
  if (activeHyVideo) {
    activeHyVideo.setMute();
  }
}

//减少布局
function reduceLayout() {
  if (sdk.sie.userStatus == 1) {
    if (sdk.mainPlay) {
      if (sdk.mainPlay.players.length) {
        //sdk.mainPlay.reduceMeetLayout(sdk.mainPlay.players[0]);
        sdk.reduceLayout({
          "mainPlay": sdk.mainPlay,
          hyVideo: sdk.mainPlay.players[0]
        });
      } else {
        bootbox.alert("仅剩下1布局，不可减少");
      }
    }
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//rtc或socket播放
function playBySocketOrRtc(json) {
  var value = $("input[name='playWay']:checked").val();
  if (value == 0) {//soclket播放
    var pla1 = {
      wsserver: $("#websocketPlatUrl").val(),/*"ws://"+$("#svrIp").val()+":5080" "ws://192.168.2.30:5080",*/
      rtspurl: json.url,
      hyVideo: json.hyVideo,
      videoParam: json.videoParam,
      log: true
    };


    pla1.videoParam.videoControl = {};

    json.mainPlay.playByVideo(pla1);
  } else {//rtc播放
    var map = sdk.playRtc({
      videoNode: json.hyVideo,
      playUrl: json.url,
      videoParam: json.videoParam
    });
  }
}

//播放用户
function playUserCapture() {

  if (sdk.sie.userStatus == 1) {

    if (!sdk.mainPlay) {
      bootbox.alert("请先设置布局");
      return;
    }


    if (activeHyVideo) {
      activeHyVideo.close();
      var opt = {
        strDomainCode: $("#domaincode").val(),
        "listUser": []
      };

      sdk.queryUserListReq(opt, function (res) {
        sdk.log(" =====  ---- " + JSON.stringify(res));
        setLog(JSON.stringify(res));
        var tt = false;
        $.each(res.listUser, function (i, n) {
          if (n.strUserID == $("#playLoginName").val()) {
            tt = true;
            var opt = {strUserTokenID: n.strUserTokenID, domainCode: $("#domaincode").val()};
            sdk.getMobileDynamicUrlReq(opt, function (json) {
              //console.log(" ======================= " ,json);
              if (json.nResultCode === 0) {

                if (json && json.dynamicUrl) {
                  if (findPlayerIsIn(sdk.mainPlay.players)) {
                    playBySocketOrRtc({
                      url: json.dynamicUrl,
                      videoParam: {
                        palyParam: {
                          title: $("#playLoginName").val(),
                          user: {"userCode": $("#playLoginName").val()}
                        },
                        videoControl: {
                          curresFlag: true,
                          bitrateFlag: true,
                          setOtherVideo: true,
                          setOtherAudio: true,
                          definitionFlag: true
                        }
                      },
                      hyVideo: activeHyVideo,
                      mainPlay: sdk.mainPlay
                    });
                  } else {
                    bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
                  }

                } else {
                  bootbox.alert("获取url失败 " + JSON.stringify(json));
                }
              } else {
                bootbox.alert("查询用户视频流地址失败！<br/><red>【" + sdk.getErrorDesc(json.nResultCode) + "】</red>");
              }
              setLog(JSON.stringify(json));
            });
          }
        });

        if (tt === false) {
          bootbox.alert($("#userLoginName").val() + "用户未注册！");
        }
      });
    } else {

      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
      return;
    }
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }

}

//获取设备树
function getDomain(type) {
  var mplayer;
  if (sdk.sie.userStatus == 1) {
    sdk.getDomainReq(function (msg) {
      sdk.log(" function getDomain() ", JSON.stringify(msg));
      if (msg.nResultCode === 0) {
        var ul = $("#devicTree").empty();
        //if (type == "setUserIpc") { ul = $("#devicTree1");}
        $.each(msg.domainInfoList, function (i, n) {
          var li = $("<li/>");
          var ul1 = $("<ul/>");
          li.append($("<span/>").html(n.strDomainName)).append($("<a style='float: right;'/>").html("获取分组").bind("click", function (res) {
            ul1.empty();
            sdk.getDomainGroupReq(n.strDomainCode, function (domainGroupResp) {
              if (domainGroupResp.nResultCode === 0) {
                sdk.log(JSON.stringify(domainGroupResp));
                $.each(domainGroupResp.sDomain.groupList, function (idx, ele) {
                  var li1 = $("<li/>");
                  var ul2 = $("<ul/>");
                  li1.append($("<span/>").html(ele.groupName)).append($("<a style='float: right;'/>").html("展开").bind("click", function (res) {
                    ul2.empty();
                    var op = {
                      domainCode: n.strDomainCode,
                      groupCode: ele.groupCode,
                      nPage: 1,
                      nSize: 100
                    };
                    sdk.getDeviceReq(op, function (deviceRes) {
                      if (deviceRes.nResultCode === 0) {
                        $.each(deviceRes.lstChannel, function (idx1, ele1) {
                          var li3 = $("<li/>");
                          var ul3 = $("<ul/>");
                          li3.append($("<span/>").html(ele1.deviceName));
                          li3.append(ul3);
                          ul2.append(li3);
                          $.each(ele1.lstStream, function (idx2, ele2) {
                            var li4 = $("<li/>").width(300);
                            var ul4 = $("<ul/>");
                            li4.append($("<span/>").html(ele2.streamName)).append($("<a style='float: right; margin-left:10px'/>").html("播放").bind("click", function (res) {
                              var oo = {
                                strDomainCode: ele1.domainCode,
                                strDeviceCode: ele1.deviceCode,
                                strChannelCode: ele1.channelCode,
                                strStreamCode: ele2.streamCode
                              };
                              var codes = ele1.domainCode + "-" + ele1.deviceCode + "-" + ele1.channelCode + "-" + ele2.streamCode;
                              setLog("四原组：" + codes);
                              if (sdk.mainPlay) {
                                sdk.getDeviceUrlReq(oo, function (urlRes) {
                                  if (urlRes.nResultCode === 0) {
                                    if (findPlayerIsIn(sdk.mainPlay.players)) {
                                      playBySocketOrRtc({
                                        url: urlRes.strDynamicUrl,
                                        videoParam: {palyParam: oo, videoControl: {recordBtn: true}},
                                        hyVideo: activeHyVideo,
                                        mainPlay: sdk.mainPlay
                                      });
                                      setLog(urlRes.strDynamicUrl);
                                    } else {
                                      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
                                    }
                                  } else {
                                    bootbox.alert("getDeviceUrlReq:::" + urlRes.strResultDescribe);
                                  }
                                });
                              } else {
                                bootbox.alert("请先设置布局");
                              }
                            }));
                            if (type == "setUserIpc") {
                              li4.append($("<a style='float: right;'/>").html("设置为用户ipc").bind("click", function (res) {
                                var oo = {
                                  strDomainCode: ele1.domainCode,
                                  strDeviceCode: ele1.deviceCode,
                                  strChannelCode: ele1.channelCode,
                                  strStreamCode: ele2.streamCode,
                                  nIsUse: 1
                                };
                                sdk.setUserUseIPC(oo, function (res) {
                                  if (res.nResultCode == 0) {
                                    bootbox.alert("设置成功");
                                  } else {
                                    bootbox.alert("设置失败：" + res.strResultDescribe);
                                  }
                                });
                              }));
                            }

                            li4.append(ul4);
                            ul3.append(li4);
                          });
                        });
                      }
                    });
                  }));
                  li1.append(ul2);
                  ul1.append(li1);
                });
              }
            });
          }));
          li.append(ul1);
          ul.append(li);
        })
      } else {
        $("#devicTree").html("获取域信息失败！");
      }
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录")
    //$("#logs").append($("<div/>").html("账号未登录！"));
  }
}

function playUrlfun() {
  if (sdk.sie.userStatus == 1) {
    if (findPlayerIsIn(sdk.mainPlay.players)) {
      playBySocketOrRtc({
        url: $.trim($("#playUrl").val()),
        videoParam: {palyParam: {"title": "url播放"}},
        hyVideo: activeHyVideo,
        mainPlay: sdk.mainPlay
      })
    } else {
      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
    }
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录")
  }
}

/**********************************音视频播放结束***************************************************/


/********************************音视频采集*********************************************/
//设置布局
function capturesetLayout() {
  if (sdk.capturePlay) {
    sdk.capturePlay.stopPlay();
  }
  if (sdk.sie.userStatus == 1) {
    $("#playPlayer").show();
    var pla = {
      layout: $("#capturelayout").val() * 1,
      pnode: "capturePlayer"
    };
    sdk.capturePlay = sdk.getPlayer(pla);
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//音视频采集
function startCapture() {
  if (sdk.sie.userStatus == 1) {
    if (sdk.capturePlay) {
    } else {
      bootbox.alert("请先设置布局");
      return;
    }
    if (findPlayerIsIn(sdk.capturePlay.players)) {
      if (sdk.isConnected() === true) {
        var media = "";
        /*var device = sdk.getUserUseIPC();
			     if(device && device.usb){
			    	media = device.usb;
			    }*/
        var cl = $("#curresParam").val().split("x")
        var media = {
          "video": {
            "deviceId": {
              "exact": $("#videoParam").val()
            },
            width: cl[0],
            height: cl[1]
          },
          "audio": {
            "deviceId": {
              "exact": $("#audioParam").val()
            }
          },
          bitrate: $("#bitParam").val()
        }

        activeHyVideo.close();
        var map = sdk.startCapture({
          videoNode: activeHyVideo,
          videoParam: {
            palyParam: {title: "采集"},
            videoControl: {setBitFlag: true, setCurresFlag: true, setAudioFlag: true, setVideoFlag: true}
          },
          media: media,
          success: function (res) {
            if (res.code == 0) {
            } else {
              bootbox.alert("采集失败：" + JSON.stringify(res));
              console.error(res);
            }
          }
        });
      } else {
        bootbox.alert("WebRTC服务连接异常:: " + sdk.isConnected());
      }
    } else {
      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
    }
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//保存ipc设置
function setUserIpc() {
  if (sdk.sie.userStatus == 1) {
    sdk.setUserUseIPC(JSON.parse($("#ipcParam").val()), function (res) {
      //bootbox.alert(JSON.stringify(res));
    });
    bootbox.alert("保存成功");
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//保存usb设置
function saveUsbSetting() {
  if (sdk.sie.userStatus == 1) {
    var cl = $("#curresParam").val().split("x")
    var usb = {
      "video": {
        "deviceId": {
          "exact": $("#videoParam").val()
        },
        width: cl[0],
        height: cl[1]
      },
      "audio": {
        "deviceId": {
          "exact": $("#audioParam").val()
        }
      },
      bitrate: $("#bitParam").val()
    }
    sdk.setUserUsb(usb);
    bootbox.alert("保存成功");
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//预览
function captureWatch() {
  if (sdk.capturePlay) {
    if (sdk.capturePlay) {
    } else {
      bootbox.alert("请先设置布局");
      return;
    }
    if (findPlayerIsIn(sdk.capturePlay.players)) {
      activeHyVideo.close();
      var videoElement = activeHyVideo.videoElement;
      activeHyVideo.videoControl = {
        screenchangeBtn: true,
        changeVoiceBtn: true,
        fillBtn: true,
        closeBtn: true,
        recordBtn: false,
        syncRecordStats: false,
        bitrateFlag: false,
        curresFlag: false,
        setBitFlag: false,
        setDevFlag: false
      }
      activeHyVideo.palyParam = {title: "采集预览"};
      activeHyVideo.videoSwitch = true;//视频开关标志位true：打开 false关闭
      activeHyVideo.audioSwitch = true;//音频开关标志位true：打开 false关闭
      activeHyVideo.isLowDef = false;//码流清晰度标志位true：高清 false降码
      activeHyVideo.isFill = true;//画面填充标志位true：填充 false原始
      activeHyVideo.palyParam.afterClose = function () {
        var stream = videoElement.palyStream;
        if (stream) {
          var tracks = stream.getTracks();
          for (var mst of tracks) {
            if (mst) {
              mst.stop();
            }
          }
        }
      }
      activeHyVideo.setAvailableBtn({
        obj: activeHyVideo
      });


      navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .then((stream) => {
          videoElement.palyStream = stream;
          videoElement.srcObject = stream;
          videoElement.style.display = 'block';
          videoElement.onloadedmetadata = function () {
            //resolve(true);
          };
          videoElement.play();
        }).catch((err) => {
        bootbox.alert("采集失败：" + JSON.stringify(err));
        console.error(err);
      });
    } else {
      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
    }
  } else {
    bootbox.alert("请先设置布局");
  }
}

//纯语音采集
function startVoiceCapture() {
  if (sdk.isConnected() === true) {
    if (sdk.capturePlay) {
    } else {
      bootbox.alert("请先设置布局");
      return;
    }
    if (findPlayerIsIn(sdk.capturePlay.players)) {
      var map = sdk.startCapture({
        videoNode: activeHyVideo,
        media: {data: true, video: false, audio: true},
        videoParam: {palyParam: {title: "语音采集"}},
        success: function (res) {
          if (res.code == 0) {
          } else {
            bootbox.alert("采集失败：" + JSON.stringify(err));
            console.error(err);
          }
        }
      });
    } else {
      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
    }
  } else {
    bootbox.alert("WebRTC server isConnected:: " + sdk.isConnected());
  }
}

//屏幕采集
function startScreenCapture() {
  if (sdk.isConnected() === true) {
    if (sdk.capturePlay) {
    } else {
      bootbox.alert("请先设置布局");
      return;
    }
    if (findPlayerIsIn(sdk.capturePlay.players)) {
      activeHyVideo.close();
      var map = sdk.startCapture({
        videoNode: activeHyVideo,
        media: {data: true, video: "screen", audio: false},
        videoParam: {palyParam: {title: "采集"}},
        capture_type: 2,
        success: function () {
          $("#startScreenCapture").hide();
          $("#stopScreenCapture").show();
        }
      });
      sdk.screenCaptureMap = map;
    } else {
      bootbox.alert("请先指定右侧播放器窗口，单击窗口即选中");
    }
  } else {
    bootbox.alert("WebRTC server isConnected:: " + sdk.isConnected());
  }

}

function selectchange() {
  if (!$("#selectbtn").is(":checked")) {
    $("#saveIpcBtn").hide();
    $("#saveUsbBtn").show();
    $("#videoParam").empty();
    $("#audioParam").empty();
    $("#ipcdiv").hide();
    $("#usbdiv").show();
    showSelectParam();
    /*  var s = document.getElementById('ipcdiv');
	    document.getElementById('usbdiv').appendChild(s);*/
  } else {
    $("#saveIpcBtn").show();
    $("#saveUsbBtn").hide();
    $("#ipcdiv").show();
    $("#usbdiv").hide();
  }

}

function showSelectParam() {
  var selecVideo, selectAudio;
  var device = sdk.getUserUseIPC();
  if (device && device.usb) {//选中分辨率
    var selectUsbp = device.usb
    if (selectUsbp.video) {
      if (selectUsbp.video.deviceId) {
        selecVideo = selectUsbp.video.deviceId.exact;
      }
      if (selectUsbp.video.width) {
        $("#curresParam").find("option[value='" + selectUsbp.video.width * 1 + "x" + selectUsbp.video.height * 1 + "']").attr("selected", "selected");
      }
    }

    if (selectUsbp.audio && selectUsbp.audio.deviceId) {
      selectAudio = selectUsbp.audio.deviceId.exact
    }

    if (selectUsbp.bitrate || selectUsbp.bitrate == 0) {
      $("#bitParam").find("option[value='" + selectUsbp.bitrate + "']").attr("selected", "selected");
    }
  }
  //获取设备列表
  sdk.getUsbList({
    callback: function (list) {
      if (list) {
        //console.error("@@@@@@@@",list);
        $.each(list, function (i, info) {
          var opt = $("<option/>");
          opt.attr("value", info.deviceId).html(info.label);
          if (info.kind == "videoinput") {
            if (selecVideo && selecVideo == info.deviceId) {
              opt.attr("selected", "selected");
            }
            $("#videoParam").append(opt);
          } else if (info.kind == "audioinput") {
            if (selectAudio && selectAudio == info.deviceId) {
              opt.attr("selected", "selected");
            }
            $("#audioParam").append(opt);
          }
        });
      }
    }
  });
}


/*********************************音视频采集结束*********************************************/


/********************************音视频对讲*********************************************/


HY_TALK.prototype.notifyStatusInfoAction = function (json) {
  var _this = this;
  var sdk = this.hySdk;
  if (json.nTalkbackStatus == 2) {
    bootbox.alert("对讲已结束");
  }
};

HY_TALK.prototype.notifyPeerUserOptionAction = function (json) {
  var _this = this;
  var uu = _this.userInfo[json.strToUserDomainCode + "_" + json.strToUserID];
  if (json.nIsAgree == 0) {//0：拒绝
    setLog("对讲提示消息：" + json.strToUserName + "拒绝！");
  } else if (json.nIsAgree == 1) {//1：同意

  } else if (json.nIsAgree == 2) {//2：无人接听
    setLog("对讲提示消息：" + json.strToUserName + "未接听！");
  } else if (json.nIsAgree == 3) {//3：对方离线
    setLog("对讲提示消息：" + json.strToUserName + "离线!");
  } else if (json.nIsAgree == 4) {//4：退出
    if (uu.video) {
      uu.video.close();
    }
  } else if (json.nIsAgree == 5) {//5：对方已在本次对讲中，重复邀请
    setLog("对讲提示消息：" + json.strToUserName + "已在本次对讲中，重复邀请！");
  }
}

//重载会议画人员页面
HY_TALK.prototype.draw = function () {
  var _this = this;
  var userPanel = document.getElementById(_this.talk.opt.userPanel);
  userPanel.innerHtml = '';
  var table = $("<table/>").addClass("table table1");
  table.append(
    $("<thead/>").append(
      $("<tr/>").append(
        $("<th/>").html("用户名")
      ).append(
        $("<th/>").html("操作")
      )
    )
  );
  var userListP = table;
  _this.userListP = userListP;
  $(userPanel).append(_this.userListP);
  for (var key in _this.talk.userInfo) {
    (function (user) {
      _this.initUserRow(user);
    })(_this.talk.userInfo[key]);
  }
}


//重载初始化每一个人员
HY_TALK.prototype.initUserRow = function (user) {
  var _this = this;
  var info = user.info;
  var row = $("<tr/>");

  var nameS = $("<td/>");
  nameS.html(substringByPoint(info.strUserName, 8));
  nameS.title = info.strUserName;

  /*var statusNode = $("<td/>");
	var stautsName = info.nPartType == 1? "未入会":"已入会";
	statusNode.html(stautsName );
	statusNode.title = stautsName;
	_this.meet.userInfo[info.strUserDomainCode+"_"+info.strUserID]["stautsNode"] =statusNode;

	var identNode = $("<td/>");
	var identName = _this.meet.meetingRole ==1 && info.strUserDomainCode == sdk.sie.strUserDomainCode&& info.strUserID  == sdk.opts.loginName? "主持人":"参会者";
	//var identName = info.nUserRole == 1? "主持人":"参会者";

	identNode.html(identName );
	identNode.title = identName;
	_this.meet.userInfo[info.strUserDomainCode+"_"+info.strUserID]["identNode"] =identNode;*/

  row.append(nameS)/*.append(statusNode).append(identNode)*/;
  _this.userListP.append(row);
  _this.meet.userInfo[info.strUserDomainCode + "_" + info.strUserID]["li"] = row;

  var opreateNode = $("<td/>");
  row.append(opreateNode);
  var hostBtnList = [
    {"name": "呼叫中", "funcName": '', "id": 'callStatus', "display": 'none'},
    {"name": "禁言", "funcName": 'speekChangeNo', "id": 'speakBtnToNo', "display": 'none'},
    {"name": "解禁", "funcName": 'speekChangeOk', "id": 'speakBtnToOK', "display": 'none'},
    {"name": "请出", "funcName": 'kitOutUserAction', "id": 'kitOutBtn', "display": 'none'},
    {"name": "邀请", "funcName": 'inviteUserAction', "id": 'inviteBtn', "display": 'none'},
    {"name": "禁言中", "funcName": '', "id": 'speakTip', "display": 'none'},
    {"name": "发起人", "funcName": '', "id": 'hostLabel', "display": 'none'}
  ];
  for (var i = 0; i < hostBtnList.length; i++) {
    (function (i) {
      var btnInfo = hostBtnList[i];
      var btn = document.createElement('a');

      if (btnInfo.type && btnInfo.type == 'tip') {
        btn = document.createElement('span');
      }
      btn.style.display = btnInfo.display;
      btn.innerHTML = btnInfo.name;
      btn.style.marginLeft = '10px';
      btn.style.float = 'left';
      btn.onclick = function () {
        btnInfo.funcName && _this.meet[btnInfo.funcName](info);
      }
      opreateNode.get(0).appendChild(btn);
      _this.meet.userInfo[info.strUserDomainCode + "_" + info.strUserID][btnInfo.id] = btn;
    })(i);
  }

};

sdk.drawTalkCalledPanel = function (calledTk) {
  var _this = this;
  $("#talkModelbtn").click();
  $("#meetCreateMenubtn").click();
  $("#talk-left-operate").hide();
  $("#talkUserWarp").show();
  $("#createTalkLeft").hide();
  $("#talkUser").hide();
  calledTk.opt.pnode = 'talkPlayer';
  calledTk.opt.userPanel = 'talkUser';
  calledTk.playPanel = $("#talkPlayer").empty();
  calledTk.playPanel.show();
  calledTk.stopVoiceBtn = $("#stopVoiceBtn").show();
  calledTk.startVoiceBtn = $("#startVoiceBtn");
  calledTk.talkControl = $("#talkControl").show();
  if (calledTk && calledTk.opt && calledTk.opt.talkInfo) {
    if (calledTk.opt.talkInfo.nVoiceIntercom == 1) {
      calledTk.playPanel.hide();
    }
  }


  calledTk.calledStart();
  calledTk.createTalkBtn = $("#createTalkBtn");
  calledTk.quitTalkBtn = $("#quitTalkBtn");
  calledTk.createTalkBtn.hide();
  //$('#'+calledTk.opt.userPanel).show();

  calledTk.quitTalkAction = function () {
    $("#createTalkLeft").show();
    calledTk.createTalkBtn.show();
    calledTk.quitTalkBtn.hide();
    calledTk.playPanel.hide();
    $('#' + calledTk.opt.userPanel).hide().empty();
    $("#talk-left-operate").show();
    $("#talkUserWarp").hide();
    calledTk.talkControl.hide();
    calledTk.startVoiceBtn.hide();
    calledTk.stopVoiceBtn.hide();
  }
  //$('#'+calledTk.opt.userPanel).show();
  calledTk.quitTalkBtn.show().unbind().bind("click", function () {
    calledTk.quitReq();
  });

  calledTk.stopVoiceBtn.show().unbind().bind("click", function () {
    var key = sdk.sie.strUserDomainCode + "_" + sdk.opts.loginName;
    var video = calledTk.userInfo[key].video;
    video.switchSelfAudio(1);
    calledTk.stopVoiceBtn.hide();
    calledTk.startVoiceBtn.show();
  });
  calledTk.startVoiceBtn.unbind().bind("click", function () {
    var key = sdk.sie.strUserDomainCode + "_" + sdk.opts.loginName;
    var video = calledTk.userInfo[key].video;
    video.switchSelfAudio(0);
    calledTk.stopVoiceBtn.show();
    calledTk.startVoiceBtn.hide();
  });

}

//会议控制
function initTalkControl() {
  var dialog = bootbox.dialog({
    title: '对讲控制',
    message: "<div id='talkControlPanel'></div>",
    size: 'large',
    buttons: {
      cancel: {
        label: "取消",
        className: 'btn-danger',
        callback: function () {
          $("#talkModel").append($("#talkUser").hide());
        }
      }
    },
    onEscape: function () {
      $("#talkModel").append($("#talkUser").hide());
    }
  });

  $("#talkControlPanel").append($("#talkUser").show())
}

//创建对讲
function createTalk(talkOption) {
  if (sdk.sie.userStatus == 1) {
    sdk.getBeingAction(function () {
      var talk = sdk.callTalk({
        "pnode": 'talkPlayer',
        "userPanel": 'talkUser',
        talkInfo: talkOption,
        talkRole: 1
      });
      talk.playPanel = $("#talkPlayer");

      if (talkOption.nVoiceIntercom != 1) {
        talk.playPanel.show();
      } else {
        talk.playPanel.hide();
      }
      $("#talk-left-operate").hide();
      $("#createTalkLeft").hide();
      $("#talkUser").hide();
      talk.createTalkBtn = $("#createTalkBtn");
      talk.quitTalkBtn = $("#quitTalkBtn");
      talk.stopVoiceBtn = $("#stopVoiceBtn");
      talk.startVoiceBtn = $("#startVoiceBtn");
      talk.talkControl = $("#talkControl");
      talk.quitTalkAction = function () {
        $("#createTalkLeft").show();
        talk.createTalkBtn.show();
        talk.quitTalkBtn.hide();
        talk.playPanel.hide();
        $('#' + talk.opt.userPanel).empty().hide();
        $("#talk-left-operate").show();
        $("#talkUserWarp").hide();
        talk.talkControl.hide();
        talk.startVoiceBtn.hide();
        talk.stopVoiceBtn.hide();
      }
      talk.start(function (res, backTalk) {
        if (res.code == 0) {
          $("#talk-left-operate").hide();
          $("#talkUserWarp").show();
          //$('#'+talk.opt.userPanel).show();
          talk.quitTalkBtn.show();
          //talk.startRecordBtn.show();
          talk.createTalkBtn.hide();
          talk.talkControl.show();
          talk.quitTalkBtn.show().unbind().bind("click", function () {
            talk.quitReq();
          });

          talk.stopVoiceBtn.show().unbind().bind("click", function () {
            var key = sdk.sie.strUserDomainCode + "_" + sdk.opts.loginName;
            var video = talk.userInfo[key].video;
            video.switchSelfAudio(1);
            talk.stopVoiceBtn.hide();
            talk.startVoiceBtn.show();
          });
          talk.startVoiceBtn.unbind().bind("click", function () {
            var key = sdk.sie.strUserDomainCode + "_" + sdk.opts.loginName;
            var video = talk.userInfo[key].video;
            video.switchSelfAudio(0);
            talk.stopVoiceBtn.show();
            talk.startVoiceBtn.hide();
          });
        } else {
          $("#talk-left-operate").show();
          talk.playPanel.hide();
          bootbox.alert(res.desc);
        }
      });
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//音视频对讲
function audioAndVideoTalk() {
  var list = getSelectUser($("#talkSelect"));
  if (list.length) {
    var ls = [];
    $.each(list, function (i, e) {
      ls.push({
        "strToUserDomainCode": e.domainCode,
        "strToUserID": e.strUserID,
        "strToUserName": e.strUserName
      });
    });
    var opt = {
      "strTalkbackName": $("#strTalkbackName").val(),
      "strTalkbackDesc": $("#strTalkbackDesc").val(),
      "nRecord": $("#talk-nRecord").is(":checked") ? 1 : 0
    }
    opt.listToUser = ls;
    createTalk(opt);
  } else {
    bootbox.alert("请选择人员进行对讲！");
  }
}

//纯语音对讲
function audioTalk() {
  var list = getSelectUser($("#talkSelect"));

  if (list.length) {
    var ls = [];
    $.each(list, function (i, e) {
      ls.push({
        "strToUserDomainCode": e.domainCode,
        "strToUserID": e.strUserID,
        "strToUserName": e.strUserName
      });
    });
//		var opt =JSON.parse($("#talkparam").val());
    var opt = {
      "strTalkbackName": $("#strTalkbackName").val(),
      "strTalkbackDesc": $("#strTalkbackDesc").val(),
      "nRecord": $("#talk-nRecord").is(":checked") ? 1 : 0
    }
    opt.nVoiceIntercom = 1;
    opt.listToUser = ls;
    createTalk(opt);
  } else {
    bootbox.alert("请选择人员进行对讲！");
  }
}


//空闲对讲
function freeTalk() {
  var list = getSelectUser();
  if (list.length) {
    var ls = [];
    $.each(list, function (i, e) {
      ls.push({
        "strToUserDomainCode": e.domainCode,
        "strToUserID": e.strUserID,
        "strToUserName": e.strUserName
      });
    });
    var opt = {
      "strTalkbackName": $("#strTalkbackName").val(),
      "strTalkbackDesc": $("#strTalkbackDesc").val(),
      "nRecord": $("#talk-nRecord").is(":checked") ? 1 : 0
    }
    opt.nTalkbackMode = 2;
    opt.listToUser = ls;
    createTalk(opt);
  } else {
    bootbox.alert("请选择人员进行对讲！");
  }
}

//获取对讲列表
function getTalkList() {
  if (sdk.sie.userStatus == 1) {
    var opt = {
      strDomainCode: sdk.sie.strUserDomainCode,
      strQueryStartTime: $("#strQueryStartTime").val(),
      strQueryEndTime: $("#strQueryEndTime").val()
    };

    if ($("#talkStatus").val()) {
      opt.nStatus = $("#talkStatus").val() * 1
    }

    sdk.getTalkbackListReq(opt, function (res) {
      //console.error(res);
      setLog(JSON.stringify(res));
      var tab = $("#talkInfoTable").empty();
      tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名称")).append($("<th/>").html("开始时间")).append($("<th/>").html("对讲ID")).append($("<th/>").html("对讲时长（单位：秒）")).append($("<th/>").html("状态")).append($("<th/>").html("操作"))));
      var recordTr = $("<tr/>").height(160)
      $.each(res.lstTalkbackInfo, function (i, n) {
        var trRow = $("<tr/>").append($("<td/>").html(n.strTalkbackName)).append($("<td/>").html(n.strStartTime)).append($("<td/>").html(n.nTalkbackID)).append($("<td/>").html(n.nTimeDuration)).append($("<td/>").html(meetingStauts[n.nStatus])).append($("<td/>").append(function () {
            var del = $("<a class='a-btn'/>").html("删除").bind("click", function () {
              var oo = {
                strDomainCode: res.strDomainCode,
                nTalkbackID: n.nTalkbackID
              };
              sdk.delTalkbackInfoReq(oo, function (res) {
                if (res.nResultCode == 0) {
                  trRow.remove();
                  bootbox.alert("删除成功！");
                } else {
                  bootbox.alert("删除失败：" + JSON.stringify(res));
                }
              });
            });
            if (n.nStatus != 2) {
              del = '';
            }
            return del;
          }).append($("<a class='a-btn'/>").html("录像查询").bind("click", function () {
              recordTr.empty();
              var table1 = $("<table/>").addClass("table table1");
              var div = $("<div/>").css({
                "margin-left": "20px",
                "overflow-y": "auto"
              }).height("100%").width("100%").append(table1)
              getTalkrecordList({
                "strDomainCode": res.strDomainCode,
                "nTalkbackID": n.nTalkbackID
              }, table1);
              recordTr.append(div)
              trRow.after(recordTr);
            })
          )
        );
        tab.append(trRow);
      });
      bootbox.alert("查询成功！");
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//获取录像列表
function getTalkrecordList(da, root) {
  sdk.getTalkbackRecordInfoReq(da, function (res) {
    var tab = root.empty();
    tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名称")).append($("<th/>").html("录像id")).append($("<th/>").html("开始时间")).append($("<th/>").html("录像持续时间")).append($("<th/>").html("操作"))));
    $.each(res.listRecordInfo, function (i, n) {
      var trRow = $("<tr/>").append($("<td/>").html(res.strTalkbackName)).append($("<td/>").html(n.nRecordID)).append($("<td/>").html(n.strRecordStartTime)).append($("<td/>").html(n.nTimeDuration)).append($("<td/>").append($("<a class='a-btn'/>").html("观看录像").bind("click", function () {
        sdk.playbackCTSReq({
          strDomainCode: res.strDomainCode,
          unRecordId: n.nRecordID
        }, function (res) {
          sdk.log("playbackCTSReq::" + JSON.stringify(res));
          if (res.nResultCode == 0) {
            if (res.playbackUrlInfo && res.playbackUrlInfo.strPlaybackUrl) {
              if (!sdk.talkrecordPlayer) {
                $("#talkrecordPlayer").show();
                var pla = {
                  layout: 1,
                  pnode: "talkrecordPlayer",
                  log: true
                };
                sdk.talkrecordPlayer = sdk.getPlayer(pla);
              }

              if (sdk.talkrecordPlayer) {
                sdk.talkrecordPlayer.stopPlay();
              }
              var pla = {
                wsserver: $("#websocketPlatUrl").val(),
                rtspurl: res.playbackUrlInfo.strPlaybackUrl,
                hyVideo: sdk.talkrecordPlayer.players[0],
                videoParam: {palyParam: {title: res.playbackUrlInfo.strStreamCode}},
                log: true
              };
              sdk.talkrecordPlayer.playByVideo(pla);
            }

          } else {
            bootbox.alert("录像查询失败！");
          }

        });

      })));
      tab.append(trRow);
    });
    bootbox.alert("查询成功！");
  });
}

/********************************音视频对讲结束*********************************************/

/********************************音视频会议*********************************************/
HY_MEETING.prototype.notifyStatusInfoAction = function (json) {
  var _this = this;
  var sdk = _this.hySdk;
  if (json.lstMeetingUser) {
    $.each(json.lstMeetingUser, function (i, e) {
      var userObj = _this.userInfo[e.strUserDomainCode + "_" + e.strUserID];
      var stautsName = e.nPartType == 1 ? "未入会" : "已入会";
      userObj.stautsNode.html(stautsName);

      if (json.strMainUserID == e.strUserID && json.strMainUserDomainCode == e.strUserDomainCode) {
        userObj.identNode.html("主持人");
      }

    });
  }


}

//重载会议画人员页面
HY_MEETING_CTR.prototype.draw = function () {
  var _this = this;
  var userPanel = document.getElementById(_this.meet.opt.userPanel);
  userPanel.innerHtml = '';
  var table = $("<table/>").addClass("table table1");
  table.append(
    $("<thead/>").append(
      $("<tr/>").append(
        $("<th/>").html("用户名")
      ).append(
        $("<th/>").html("状态")
      ).append(
        $("<th/>").html("身份")
      ).append(
        $("<th/>").html("操作")
      )
    )
  );
  var userListP = table;
  _this.userListP = userListP;
  $(userPanel).append(_this.userListP);
  for (var key in _this.meet.userInfo) {
    (function (user) {
      _this.initUserRow(user);
    })(_this.meet.userInfo[key]);
  }
}


//重载初始化每一个人员
HY_MEETING_CTR.prototype.initUserRow = function (user) {
  var _this = this;
  var info = user.info;
  var row = $("<tr/>");

  var nameS = $("<td/>");
  nameS.html(substringByPoint(info.strUserName, 8));
  nameS.title = info.strUserName;

  var statusNode = $("<td/>");
  var stautsName = info.nPartType == 1 ? "未入会" : "已入会";
  statusNode.html(stautsName);
  statusNode.title = stautsName;
  _this.meet.userInfo[info.strUserDomainCode + "_" + info.strUserID]["stautsNode"] = statusNode;

  var identNode = $("<td/>");
  var identName = _this.meet.meetingRole == 1 && info.strUserDomainCode == sdk.sie.strUserDomainCode && info.strUserID == sdk.opts.loginName ? "主持人" : (_this.meet.opt.meetingInfo.strMainUserDomainCode == info.strUserDomainCode && info.strUserID == _this.meet.opt.meetingInfo.strMainUserID ? "主持人" : "参会者");
  //var identName = info.nUserRole == 1? "主持人":"参会者";

  identNode.html(identName);
  identNode.title = identName;
  _this.meet.userInfo[info.strUserDomainCode + "_" + info.strUserID]["identNode"] = identNode;

  row.append(nameS).append(statusNode).append(identNode);
  _this.userListP.append(row);
  _this.meet.userInfo[info.strUserDomainCode + "_" + info.strUserID]["li"] = row;

  var opreateNode = $("<td/>");
  row.append(opreateNode);
  var hostBtnList = [
    {"name": "呼叫中", "funcName": '', "id": 'callStatus', "display": 'none'},
    {"name": "邀请", "funcName": 'inviteUserAction', "id": 'inviteBtn', "display": 'none'},
    {"name": "请出", "funcName": 'kitOurUserAction', "id": 'kitOutBtn', "display": 'none'},
    {"name": "挂断", "funcName": 'cancelAction', "id": 'cancelBtn', "display": 'none'},
    {"name": "禁言", "funcName": 'speekChangeNo', "id": 'speakBtnToNo', "display": 'none'},
    {"name": "解禁", "funcName": 'speekChangeOk', "id": 'speakBtnToOK', "display": 'none'},
    {"name": "禁言中", "funcName": '', "id": 'speakTip', "display": 'none'},
    {"name": "开视频", "funcName": 'videoChangeOk', "id": 'videoBtnToOk', "display": 'none'},
    {"name": "关视频", "funcName": 'videoChangeNo', "id": 'videoBtnToNo', "display": 'none'},
    {"name": "举手", "funcName": 'raiseHandAction', "id": 'raiseHand', "display": 'none'},
    {"name": "屏幕分享", "funcName": 'shareDesktopAction', "id": 'shareDesktop', "display": 'none'},
    {"name": "取消分享", "funcName": 'cancelShareAction', "id": 'cancelShare', "display": 'none'},
    {"name": "设为主讲人", "funcName": 'setSpeakerAction', "id": 'setSpeaker', "display": 'none'},
    {"name": "取消主讲人", "funcName": 'cancelSpeakerAction', "id": 'cancelSpeaker', "display": 'none'},
    {"name": "主讲人", "funcName": '', "id": 'speakLabel', "display": 'none'},
    {"name": "主持人", "funcName": '', "id": 'hostLabel', "display": 'none'}
  ];
  for (var i = 0; i < hostBtnList.length; i++) {
    (function (i) {
      var btnInfo = hostBtnList[i];
      var btn = document.createElement('a');

      if (btnInfo.type && btnInfo.type == 'tip') {
        btn = document.createElement('span');
      }
      btn.style.display = btnInfo.display;
      btn.innerHTML = btnInfo.name;
      btn.style.marginLeft = '10px';
      btn.style.float = 'left';
      btn.onclick = function () {
        btnInfo.funcName && _this.meet[btnInfo.funcName](info);
      }
      opreateNode.get(0).appendChild(btn);
      _this.meet.userInfo[info.strUserDomainCode + "_" + info.strUserID][btnInfo.id] = btn;
    })(i);
  }

};

sdk.drawObserverPanel = function (calledMt, meetingInfo) {
  var _this = this;

  $("#meetingModelbtn").click();
  $("#meetCreateMenubtn").click();
  calledMt.opt.pnode = 'meetingPlayer';
  calledMt.opt.userPanel = 'meetingUser';
  $("#" + calledMt.opt.userPanel).empty();
  calledMt.playPanel = $("#meetingPlayer").show().empty();
  //$("#meetUserWarp").show();
  $("#createMeetingLeft").hide();
  $("#meet-left-operate").hide();
  $("#meetingUser").hide();

  calledMt.observerStart();
  calledMt.createMeetBtn = $("#createMeetBtn");
  calledMt.meetControlBtn = $("#meetControl");
  calledMt.quitMeetBtn = $("#quitMeetBtn");
  calledMt.stopMeetBtn = $("#stopMeetBtn");
  calledMt.meetControlBtn.show();
  calledMt.quitMeetAction = function () {
    //calledMt.createMeetBtn.show();
    calledMt.meetControlBtn.hide();
    calledMt.quitMeetBtn.hide();
    calledMt.stopMeetBtn.hide();
    calledMt.playPanel.hide();
    $("#" + calledMt.opt.userPanel).empty();
    //$("#meetUserWarp").hide();
    $("#meet-left-operate").show();
    $("#createMeetingLeft").show();
  }
  calledMt.createMeetBtn.hide();
  calledMt.quitMeetBtn.show().unbind().bind("click", function () {
    calledMt.quitObserver(function () {
      calledMt.createMeetBtn.show();
      calledMt.meetControlBtn.hide();
      calledMt.quitMeetBtn.hide();
      calledMt.stopMeetBtn.hide();
      calledMt.playPanel.hide();
      //$("#meetUserWarp").hide();
      $("#meet-left-operate").show();
      $("#createMeetingLeft").show();
    });
  });
}

//被叫进入会议回调
sdk.drawCalledPanel = function (calledMt, meetingInfo) {
  var _this = this;

  if (meetingInfo.strMainUserDomainCode == _this.sie.strUserDomainCode && meetingInfo.strMainUserID == _this.opts.loginName) {//主叫进入
    _this.callMt = calledMt;
    _this.callMt.meetingRole = 1;
    var key = meetingInfo.nMeetingID + "_" + meetingInfo.strMeetingDomainCode;
    delete _this.calledMt[key];
    $("#meetingModelbtn").click();
    $("#meetCreateMenubtn").click();
    $("#createMeetingLeft").hide();
    $("#meet-left-operate").hide();
    _this.callMt.opt.pnode = 'meetingPlayer';
    $("#meetingPlayer").show().empty();
    _this.callMt.opt.userPanel = 'meetingUser';
    _this.callMt.start(function (resss, backMt) {
      meetStartAction(resss, _this.callMt);
    });
    return;
  }

  $("#meetingModelbtn").click();
  $("#meetCreateMenubtn").click();
  calledMt.opt.pnode = 'meetingPlayer';
  calledMt.opt.userPanel = 'meetingUser';
  $("#" + calledMt.opt.userPanel).empty();
  calledMt.playPanel = $("#meetingPlayer").show().empty();
  //$("#meetUserWarp").show();
  $("#createMeetingLeft").hide();
  $("#meet-left-operate").hide();
  $("#meetingUser").hide();

  calledMt.calledStart();
  calledMt.createMeetBtn = $("#createMeetBtn");
  calledMt.meetControlBtn = $("#meetControl");
  calledMt.quitMeetBtn = $("#quitMeetBtn");
  calledMt.stopMeetBtn = $("#stopMeetBtn");
  calledMt.meetControlBtn.show();
  calledMt.quitMeetAction = function () {
    //calledMt.createMeetBtn.show();
    calledMt.meetControlBtn.hide();
    calledMt.quitMeetBtn.hide();
    calledMt.stopMeetBtn.hide();
    calledMt.playPanel.hide();
    $("#" + calledMt.opt.userPanel).empty();
    //$("#meetUserWarp").hide();
    $("#meet-left-operate").show();
    $("#createMeetingLeft").show();
  }
  calledMt.createMeetBtn.hide();
  calledMt.quitMeetBtn.show().unbind().bind("click", function () {
    calledMt.quitMeeting(function () {
      calledMt.createMeetBtn.show();
      calledMt.meetControlBtn.hide();
      calledMt.quitMeetBtn.hide();
      calledMt.stopMeetBtn.hide();
      calledMt.playPanel.hide();
      //$("#meetUserWarp").hide();
      $("#meet-left-operate").show();
      $("#createMeetingLeft").show();
    });
  });
}

sdk.notifybookMeeting = function (json) {
  setLog("会议提示：" + json.strInviteUserName + "创建了 预约会议： " + json.strMeetingName + " 开始时间：" + json.strMeetingStartTime);
}

//会议控制
function initMeetControl() {
  var dialog = bootbox.dialog({
    title: '会议控制',
    message: "<div id='meetControlPanel'></div>",
    size: 'large',
    buttons: {
      cancel: {
        label: "取消",
        className: 'btn-danger',
        callback: function () {
          $("#meetingModel").append($("#meetingUser").hide());
        }
      }
    },
    onEscape: function () {
      $("#meetingModel").append($("#meetingUser").hide());
    }
  });

  $("#meetControlPanel").append($("#meetingUser").show())
}

//创建会议
function createMeeting(meetingOption) {
  if (sdk.sie.userStatus == 1) {
    sdk.getBeingAction(function () {
      $("#meetingPlayer").show();
      var meet = sdk.callMeeting({
        "pnode": 'meetingPlayer',
        "userPanel": 'meetingUser',
        meetingInfo: meetingOption
      });
      meet.start(function (resss, backMt) {
        if (resss.code == 1) {
          sdk.callMt = null;
          bootbox.alert("会议创建失败:::" + resss.desc);
          return;
        }
        meetStartAction(resss, meet);
      });

    });

    // sdk.HYCurrentMeeting.getUserDynamicUrl({});
    //sdk.HYCurrentMeeting.startMeetingReq(meetingOption);
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function meetStartAction(resss, meet) {
  if (resss.code == 1) {
    bootbox.alert("会议创建失败:::" + resss.desc);
    sdk.callMt = null;
    return;
  }
  $("#meetingUser").hide();
  meet.notifyPeerUserMeetingInfo = function (json) {
    var _this = this;
    var userobj = _this.userInfo[json.strToUserDomainCode + "_" + json.strUserID];
    userobj.status = json.nIsAgree;
    //userobj.status = 1;
    _this.ctr.updateStatus(userobj);

    if (json.nIsAgree == 3) {
      setLog("会议提示：" + json.strToUserName + "离线！");
    } else if (json.nIsAgree == 0) {
      setLog("会议提示：" + json.strToUserName + "拒绝！");
    }
  }
  meet.createMeetBtn = $("#createMeetBtn");
  meet.quitMeetBtn = $("#quitMeetBtn");
  meet.stopMeetBtn = $("#stopMeetBtn");
  meet.playPanel = $("#meetingPlayer");
  meet.inviteBtn = $("#inviteBtn");
  meet.startRecordBtn = $("#startRecordBtn");
  meet.stopRecordBtn = $("#stopRecordBtn");
  meet.meetControlBtn = $("#meetControl");
  meet.lockBtn = $("#lockBtn");
  meet.createMeetBtn.hide();


  $("#createMeetingLeft").hide();
  //$("#meetUserWarp").show();
  $("#meet-left-operate").hide();
  meet.meetControlBtn.show();
  meet.inviteBtn.show();
  meet.lockBtn.show();
  meet.startRecordBtn.show().unbind().bind("click", function () {
    meet.beginRecord(function (res) {
      if (res.nResultCode == 0) {
        meet.startRecordBtn.hide();
        meet.stopRecordBtn.show();
      } else {
        bootbox.alert(sdk.errorCode[res.nResultCode] + JSON.stringify(res));
      }
    });
  });
  meet.lockBtn.unbind().bind("click", function () {
    meet.lockToggle();
  });
  meet.stopRecordBtn.unbind().bind("click", function () {
    meet.stopRecord(function (json) {
      if (json.nResultCode == 0) {
        meet.stopRecordBtn.hide();
        meet.startRecordBtn.show();
      } else {
        bootbox.alert("停止录像失败:::" + JSON.stringify(json));
      }
    });
  });
  meet.stopMeetAction = function () {
    meet.playPanel.hide();
    meet.stopMeetBtn.hide();
    meet.createMeetBtn.show();
    meet.inviteBtn.hide();
    meet.lockBtn.hide();
    meet.startRecordBtn.hide();
    meet.stopRecordBtn.hide();
    meet.stopMeetBtn.hide();
    meet.meetControlBtn.hide();
    $("#" + meet.opt.userPanel).empty();
    //$("#meetUserWarp").hide();
    $("#meet-left-operate").show();
    $("#createMeetingLeft").show();

  }
  meet.stopMeetBtn.show().unbind().bind("click", function () {
    meet.stopMeeting();
  });

  /*meet.quitMeetAction = function(){
		meet.createMeetBtn.show();
		meet.meetControlBtn.hide();
		meet.quitMeetBtn.hide();
		meet.stopMeetBtn.hide();
		meet.playPanel.hide();
    	$("#"+meet.opt.userPanel).empty();
    	//$("#meetUserWarp").hide();
    	$("#meet-left-operate").show();
    	$("#createMeetingLeft").show();
	}
	meet.quitMeetBtn.show().unbind().bind("click", function(){
		meet.quitMeeting(function(){
			meet.createMeetBtn.show();
			meet.meetControlBtn.hide();
			meet.quitMeetBtn.hide();
			meet.stopMeetBtn.hide();
			meet.playPanel.hide();
			//$("#meetUserWarp").hide();
    		$("#meet-left-operate").show();
    		$("#createMeetingLeft").show();
		});
	});*/

}

//创建会议
function createMeet() {
  var list = getSelectUser($("#meetSelect"));
  var ls = [];
  $.each(list, function (i, e) {
    ls.push({
      "strUserDomainCode": e.domainCode,
      "strUserID": e.strUserID,
      "strUserName": e.strUserName,
      "nDevType": 1
    });
  });

  var opt = {
    "strMeetingName": $("#strMeetingName").val(),
    "strMeetingDesc": $("#strMeetingDesc").val(),
    "nVoiceIntercom": $("#nVoiceIntercom").is(":checked") ? 1 : 0
  }
  opt.lstMeetingUserInfo = ls;
  createMeeting(opt);
}

function curentTime() {
  var now = new Date();

  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日

  var hh = now.getHours();            //时
  var mm = now.getMinutes();          //分
  var ss = now.getSeconds();          //分

  var clock = year + "-";

  if (month < 10)
    clock += "0";

  clock += month + "-";

  if (day < 10)
    clock += "0";

  clock += day + " ";

  if (hh < 10)
    clock += "0";

  clock += hh + ":";
  if (mm < 10)
    clock += '0';
  clock += mm + ":";

  if (ss < 10)
    clock += '0';
  clock += ss;
  return clock;
}

//创建预约会议
function setMeeting() {
  var s = curentTime();
  if (sdk.sie.userStatus == 1) {
    var list = getSelectUser($("#meetSelect"));
    var ls = [];
    $.each(list, function (i, e) {
      ls.push({
        "strUserDomainCode": e.domainCode,
        "strUserID": e.strUserID,
        "strUserName": e.strUserName,
        "nDevType": 1
      });
    });


    var opt = {
      "strMeetingName": $("#strMeetingName").val(),
      "strMeetingDesc": $("#strMeetingDesc").val(),
      "nVoiceIntercom": $("#nVoiceIntercom").is(":checked") ? 1 : 0
    }
    //var opt =JSON.parse($("#meetingparam").val());
    opt.lstMeetingUserInfo = ls;

    opt.startTime = $("#meetingStartTime").val();
    opt.duration = $("#nMeetingDuration").val() * 1000 * 60

    var s = curentTime();
    if (s > $("#meetingStartTime").val()) {
      bootbox.alert("预约时间不能是过去的时间！");
      return;
    }


    var a = $.extend([], opt.lstMeetingUserInfo);

    /*  a.unshift({
	        "strUserDomainCode": sdk.sie.strUserDomainCode,
	        "strUserID": sdk.opts.loginName,
	        "strUserName": sdk.opts.userName,
	        "nDevType": 1
	    });
	    opt.strTrunkPara = {
	        lstMeetingUserInfo: a
	    }*/

    sdk.setPredetermineMeetingReq(opt, function (res) {
      sdk.log(" =====  ---- " + JSON.stringify(res));
      setLog(JSON.stringify(res));
      if (res.nResultCode == 0) {
        bootbox.alert("创建成功！");
      } else {
        bootbox.alert("创建失败！");
      }

    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//会议邀请人员
function initSelectPanel() {
  var dialog = bootbox.dialog({
    title: '选择邀请人员',
    message: "<div id='selectPanel'></div>",
    size: 'large',
    buttons: {
      cancel: {
        label: "取消",
        className: 'btn-danger',
        callback: function () {
        }
      }
    }
  });

  var tab = '<div class="col-sm-12">'
    + '<div class="tabbable">'
    + '<ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4">'
    + '<li class="active">'
    + '<a data-toggle="tab" href="#home4">用户</a>'
    + '</li>'
    + '<li>'
    + '<a data-toggle="tab" href="#profile4">设备</a>'
    + '</li>'
    + '</ul>'
    + '<div class="tab-content">'
    + '<div id="home4" class="tab-pane in active"><table id="userLis" class="table table1"></table>'
    + '</div>'
    + '<div id="profile4" class="tab-pane"> <table id="devLis" class="table table1"></table>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';
  var root = $("#selectPanel").css({"height": "400px", "overflow-y": "auto"}).append(tab);

  var opt = {
    strDomainCode: sdk.sie.strUserDomainCode,
    "listUser": []
  };
  sdk.queryUserListReq(opt,
    function (res) {
      var tab = $("#userLis").css({width: "100%!important"}).empty();
      tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名称")).append($("<th/>").html("账号")).append($("<th/>").html("状态")).append($("<th/>").html("用户tokenId")).append($("<th/>").html("操作"))));
      $.each(res.listUser, function (i, n) {
        var key = sdk.sie.strUserDomainCode + "_" + n.strUserID
        if (!sdk.callMt.userInfo[key]) {
          var userTr = $("<tr/>").append($("<td/>").html(n.strUserID)).append($("<td/>").html(n.strUserName)).append($("<td/>").html(n.nState)).append($("<td/>").html(n.strUserTokenID)).append($("<td/>").append($("<a/>").html("邀请").bind("click", function () {
            userTr.remove();
            var user = {
              "strUserDomainCode": sdk.sie.strUserDomainCode,
              "strUserID": n.strUserID,
              "strUserName": n.strUserName,
              "nDevType": 1
            };
            sdk.callMt.inviteNewUser(user);
            //sdk.callMt.inviteUserAction(user);

          })));

          tab.append(userTr);
        }
      });
    });

  getDevicetableList();
}

function getDevicetableList() {
  var tab = $("#devLis").css({width: "100%!important"}).empty();
  tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("域")).append($("<th/>").html("设备")).append($("<th/>").html("通道")).append($("<th/>").html("码流")).append($("<th/>").html("操作"))));
  sdk.getDomainReq(function (msg) {
    if (msg.nResultCode === 0) {
      $.each(msg.domainInfoList, function (i, n) {
        var op = {
          domainCode: n.strDomainCode,
          nPage: 1,
          nSize: 100
        };
        sdk.getDeviceByDomainReq(op, function (res) {
          if (res.nResultCode === 0) {
            $.each(res.deviceList, function (idx, ele) {
              $.each(ele.channelList, function (idx1, ele1) {
                $.each(ele1.streamList, function (idx2, ele2) {
                  var key = n.strDomainCode + "_" + n.strDomainCode + "-" + ele.strDeviceCode + "-" + ele1.strChannelCode + "-" + ele2.strStreamCode;
                  if (!sdk.callMt.userInfo[key]) {
                    var devTr = $("<tr/>").append($("<td/>").html(n.strDomainName)).append($("<td/>").html(ele.strDeviceName)).append($("<td/>").html(ele1.strChannelName)).append($("<td/>").html(ele2.strStreamName)).append($("<td/>").append($("<a/>").html("邀请").bind("click", function () {
                      devTr.remove();
                      var user = {
                        "strUserDomainCode": n.strDomainCode,
                        "strUserID": n.strDomainCode + "-" + ele.strDeviceCode + "-" + ele1.strChannelCode + "-" + ele2.strStreamCode,
                        "strUserName": ele2.strStreamName,
                        "nDevType": 2
                      };
                      sdk.callMt.inviteNewUser(user);
                      //sdk.callMt.inviteUserAction(user);
                    })));
                    tab.append(devTr);
                  }
                });
              });
            });
          }
        });
      });
    }
  });
}

//查询会议列表
function getMeetingInfo() {

  if (sdk.sie.userStatus == 1) {
    var opt = {
      strDomainCode: sdk.sie.strUserDomainCode,
      startTime: $("#recordStartTime").val(),
      endTime: $("#recordEndTime").val(),
      nStatus: $("#meetingStatus").val() * 1,
      keywords: ""
    };
    sdk.getMeetingListReq(opt, function (res) {
      //console.error(res);
      setLog(JSON.stringify(res));
      var tab = $("#meetingInfoTable").empty();
      tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名称")).append($("<th/>").html("预约开始时间")).append($("<th/>").html("编号")).append($("<th/>").html("发起人")).append($("<th/>").html("状态")).append($("<th/>").html("操作"))));
      $.each(res.lstMeetingInfo, function (i, n) {
        var trRow = $("<tr/>").append($("<td/>").html(n.strMeetingName)).append($("<td/>").html(n.strStartTime)).append($("<td/>").html(n.nMeetingID)).append($("<td/>").html(n.strMainUserName)).append($("<td/>").html(meetingStauts[n.nStatus])).append($("<td/>").append(function () {
          var join = $("<a/>").html("加入").bind("click", function () {
            var ab = {
              strDomainCode: res.strDomainCode,
              nMeetingID: n.nMeetingID
            };
            sdk.getMeetingInfoReq(ab, function (res1) {
              var f = false;
              if (res1.nStatus == 1) {//正在开始
                var opp = {
                  nMeetingID: n.nMeetingID,
                  strMeetingDomainCode: res.strDomainCode,
                  strMeetingName: n.strMeetingName,
                  "strMeetingDesc": "会议测试",
                  "strInviteUserId": res1.strMainUserID,
                  "strInviteUserName": res1.strMainUserName,
                  defaultJoin: true,
                  nMeetingStatus: 1
                };
                sdk.notifyInviteUserJoinMeeting(opp);
              } else if (n.nStatus == 4) {//预约会议
                if (res1.nMeetingType == 1) {
                  if (res1.strMainUserID == sdk.opts.loginName && res1.strMainUserDomainCode == sdk.sie.strUserDomainCode) {
                    var dialog = bootbox.dialog({
                      title: '提示',
                      message: "该预约会议还未开始，是否现在开始？",
                      size: 'big',
                      buttons: {
                        cancel: {
                          label: "取消",
                          className: 'btn-danger',
                          callback: function () {
                          }
                        },
                        "success":
                          {
                            "label": "<i class='icon-ok'></i> 确定",
                            "className": "btn-success",
                            "callback": function () {

                              var list = [];
                              $.each(res1.listUser, function (i, eee) {
                                list.push({
                                  "strUserDomainCode": eee.strUserDomainCode,
                                  "strUserID": eee.strUserID,
                                  "strUserName": eee.strUserName,
                                  "nDevType": 0
                                });
                              });
                              var opt = {
                                "nMeetingID": res1.nMeetingID,
                                "nStartImmediately": 1,
                                "duration": res1.nTimeDuration,
                                "startTime": res1.strStartTime,
                                lstMeetingUserInfo: list,
                                nVoiceIntercom: res1.nVoiceIntercom,
                                nInviteStyle: res1.nInviteStyle,
                                nRecord: res1.nRecord,
                                strMeetingName: res1.strMeetingName,
                                strMeetingDesc: res1.strMeetingDesc,
                                strTrunkPara: res1.strTrunkPara
                              }

                              sdk.setPredetermineMeetingReq(opt, function (res) {
                                console.error("!!~~~~", res);

                              });
                            }
                          }
                      }
                    });

                  } else {
                    bootbox.alert("会议还未开始,等待主持人开会");
                  }
                }
              }
            });
          })
          if (n.nStatus == 2) {
            join = ''
          }
          return join
        }).append(function () {
          var observer = $("<a class='a-btn'/>").html("观摩").bind("click", function () {
            var opp = {
              nMeetingID: n.nMeetingID,
              strMeetingDomainCode: res.strDomainCode,
              strMeetingName: n.strMeetingName,
              "strMeetingDesc": "会议测试",
              "strInviteUserId": "",
              "strInviteUserName": "",
              isObserver: true,
              nMeetingStatus: 1,
              playType: "websocket"
            };
            sdk.notifyInviteUserJoinMeeting(opp);
          });
          if (n.nStatus == 2) {
            observer = '';
          }
          return observer;
        }).append(function () {
          var del = $("<a class='a-btn'/>").html("删除").bind("click", function () {
            var oo = {
              strDomainCode: res.strDomainCode,
              nMeetingID: n.nMeetingID
            };
            sdk.delMeetingInfoReq(oo, function (resp) {
              if (resp.nResultCode == 0) {
                trRow.remove();
                bootbox.alert("会议删除成功！");
              } else {
                bootbox.alert("会议删除失败！");
              }
            });
          });
          if (n.nStatus == 1) {
            del = '';
          }
          return del;
        }).append($("<a class='a-btn'/>").html("观看录像").bind("click", function () {
          var ab = {
            strDomainCode: res.strDomainCode,
            nMeetingID: n.nMeetingID
          };
          sdk.getMeetingInfoReq(ab, function (res1) {
            var f = false;
            if (res1 && res1.nRecordID > 0) {
              f = true;
            }
            if (f === true) {
              sdk.playbackCTSReq({
                strDomainCode: res1.strDomainCode,
                unRecordId: res1.nRecordID
              }, function (res) {
                sdk.log("playbackCTSReq::" + JSON.stringify(res));
                if (res.nResultCode == 0) {
                  if (res.playbackUrlInfo && res.playbackUrlInfo.strPlaybackUrl) {
                    if (!sdk.recordPlay) {
                      $("#recordPlayer").show();
                      var pla = {
                        layout: 1,
                        pnode: "recordPlayer",
                        log: true
                      };
                      sdk.recordPlay = sdk.getPlayer(pla);
                    }

                    if (sdk.recordPlay) {
                      sdk.recordPlay.stopPlay();
                    }
                    //playmainPlay.players[0]

                    /*var map =  sdk.playRtc({
												videoNode: sdk.recordPlay.players[0],
												playUrl:res.playbackUrlInfo.strPlaybackUrl,
												videoParam:{palyParam:{title:res1.strMeetingName},videoControl:{curresFlag:true,bitrateFlag:true}}
											});*/
                    //socket模式播放
                    var pla = {
                      wsserver: $("#websocketPlatUrl").val(),
                      rtspurl: res.playbackUrlInfo.strPlaybackUrl,
                      hyVideo: sdk.recordPlay.players[0],
                      videoParam: {palyParam: {title: res1.strMeetingName}},
                      log: true
                    };
                    sdk.recordPlay.playByVideo(pla);
                  }

                } else {
                  bootbox.alert("录像查询失败！");
                }

              });
            } else {
              bootbox.alert("当前会议没有录像观看！");
            }
          });

        })));
        tab.append(trRow);
      });
      bootbox.alert("查询成功！");
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

/********************************音视频会议结束*********************************************/

/********************************集群对讲开始*********************************************/

//重载会议画人员页面
HY_TChannel_CTR.prototype.draw = function () {
  var _this = this;
  var userPanel = document.getElementById(_this.tChannel.opt.userPanel);
  userPanel.innerHtml = '';
  var table = $("<table/>").addClass("table table1");
  table.append(
    $("<thead/>").append(
      $("<tr/>").append(
        $("<th/>").html("群组用户")
      ).append(
        $("<th/>").html("操作")
      )
    )
  );
  var userListP = table;
  _this.userListP = userListP;
  $(userPanel).append(_this.userListP);
  for (var key in _this.tChannel.userInfo) {
    (function (user) {
      _this.initUserRow(user);
    })(_this.tChannel.userInfo[key]);
  }
}

//重写初始化每一个人员
HY_TChannel_CTR.prototype.initUserRow = function (user) {
  var _this = this;
  var info = user.info;
  var row = $("<tr/>");

  var nameS = $("<td/>");
  nameS.html(substringByPoint(info.strTcUserName, 8));
  nameS.title = info.strTcUserName;

  row.append(nameS);
  _this.userListP.append(row);
  _this.tChannel.userInfo[info.strTcUserDomainCode + "_" + info.strTcUserID]["li"] = row;
  var opreateNode = $("<td/>");
  row.append(opreateNode);
  var hostBtnList = [
    {"name": "呼叫中", "funcName": '', "id": 'callStatus', "display": 'none'},
    {"name": "请出", "funcName": 'kitOutUserAction', "id": 'kitOutBtn', "display": 'none'},
    {"name": "未进入", "funcName": '', "id": 'inviteBtn', "display": 'none'},
    {"name": "发言中", "funcName": '', "id": 'speakLabel', "display": 'none'},
    {"name": "自己", "funcName": '', "id": 'hostLabel', "display": 'none'}
  ];
  for (var i = 0; i < hostBtnList.length; i++) {
    (function (i) {
      var btnInfo = hostBtnList[i];
      var btn = document.createElement('a');

      if (btnInfo.type && btnInfo.type == 'tip') {
        btn = document.createElement('span');
      }
      btn.style.display = btnInfo.display;
      btn.innerHTML = btnInfo.name;
      btn.style.marginLeft = '10px';
      btn.style.float = 'left';
      btn.onclick = function () {
        btnInfo.funcName && _this.tChannel[btnInfo.funcName](info);
      }
      opreateNode.append(btn);
      _this.tChannel.userInfo[info.strTcUserDomainCode + "_" + info.strTcUserID][btnInfo.id] = btn;
    })(i);
  }
};

HY_TChannel.prototype.notifyStatusInfoAction = function (json) {
  var _this = this;
  var sdk = this.hySdk;
  if (json.nChangeType == 2) {
    $("#getMygroup").click();
    bootbox.alert("集群对讲已结束");
  } else {
    setChannelInfo(json);
  }
};

function setChannelInfo(info) {
  var ab = {
    strTrunkChannelDomainCode: info.strTrunkChannelDomainCode,
    nTrunkChannelID: info.nTrunkChannelID
  };
  sdk.getTrunkChannelInfoReq(ab, function (resss) {
    if (resss.nResultCode == 0) {
      var status = resss.nRecordStatus == 0 ? "未录音" : "录音中";
      var flag = false;
      if (resss.lstTrunkChannelObserve) {
        resss.lstTrunkChannelObserve.some(function (ele) {
          if (ele.strTcUserDomainCode == sdk.sie.strUserDomainCode && ele.strTcUserID == sdk.opts.loginName) {
            flag = true;
          }
        })
      }

      if (flag) {
        $("#observerBtn").hide();
        $("#cancelObserverBtn").show();
        status += "、监听中"
      } else {
        status += "、未监听"
        $("#observerBtn").show();
        $("#cancelObserverBtn").hide();
      }

      $("#strTrunkChannelName").html(resss.strTrunkChannelName);
      $("#nTrunkChannelID").html(resss.nTrunkChannelID);
      $("#nSpeakTimeout").html(resss.nSpeakTimeout);
      $("#nTrunkChannelStatus").html(status);
    }
  });

}

//被叫进入集群对讲
sdk.drawTChannelCalledPanel = function (calledTC) {
  var _this = this;
  $("#tChannelModelbtn").click();
  $("#tchannelMyListMenubtn").click();
  $("#tchannelRight").show();
  calledTC.opt.userPanel = 'tchannelUser';
  calledTC.opt.pnode = 'tchannelPlayer';
  calledTC.playPanel = $("#tchannelPlayer").empty();
  calledTC.playPanel.hide();
  $("#tchannelUser").css({"overflow-y": "auto"}).empty().show();
  setChannelInfo(calledTC.opt.tChannelInfo);
  calledTC.calledStart();
  calledTC.createBtn = $("#createTrunkBtn");
  calledTC.quitBtn = $("#tcquitBtn");
  calledTC.startSpeak = $("#startSpeak");
  calledTC.stopSpeak = $("#stopSpeak");
  calledTC.startVRecord = $("#startVRecord");
  calledTC.stopVRecord = $("#stopVRecord");
  calledTC.observerBtn = $("#observerBtn");
  calledTC.cancelObserverBtn = $("#cancelObserverBtn");
  //calledTC.createBtn.hide();

  calledTC.inviteBtn = $("#tcinviteBtn").show();
  calledTC.delChannelBtn = $("#delChannel").show();
  calledTC.observerBtn.unbind().bind("click", function () {
    var ab = {
      strTrunkChannelDomainCode: calledTC.strTrunkChannelDomainCode,
      nTrunkChannelID: calledTC.nTrunkChannelID,
      nEnable: 1
    };
    sdk.observerTrunkChannelReq(ab, function (resss) {
      if (resss.nResultCode == 0) {
        bootbox.alert("监听成功！");
      }
    });
  });

  calledTC.cancelObserverBtn.unbind().bind("click", function () {
    var ab = {
      strTrunkChannelDomainCode: calledTC.strTrunkChannelDomainCode,
      nTrunkChannelID: calledTC.nTrunkChannelID,
      nEnable: 0
    };
    sdk.observerTrunkChannelReq(ab, function (resss) {
      if (resss.nResultCode == 0) {
        bootbox.alert("取消监听成功！");
      }
    });
  });

  calledTC.quitTChannelAction = function () {
    //calledTC.createBtn.show();
    calledTC.quitBtn.hide();
    calledTC.playPanel.hide();
    calledTC.startSpeak.hide();
    calledTC.stopSpeak.hide();
    calledTC.startVRecord.hide();
    calledTC.stopVRecord.hide();
    calledTC.inviteBtn = $("#tcinviteBtn").hide();
    calledTC.delChannelBtn = $("#delChannel").hide();
    $("#tchannelRight").hide();
    calledTC.observerBtn.hide();
    calledTC.cancelObserverBtn.hide();
  }

  enterChannelAction(calledTC);
  if (calledTC.opt.tChannelInfo.nRecordStatus == 1) {
    $("#startVRecord").hide();
    $("#stopVRecord").show();
  }

}

//创建对讲
function createTrunkChannel(tChannelOption) {
  if (sdk.sie.userStatus == 1) {

    sdk.getBeingAction(function () {
      $("#tchannelUser").empty().show();
      var tChannel = sdk.callTChannel({
        "pnode": 'tchannelPlayer',
        "userPanel": 'tchannelUser',
        tChannelInfo: tChannelOption
      });

      tChannel.start(function (resss) {
        if (resss.code != 0) {
          bootbox.alert(JSON.stringify(resss));
          return;
        }


        $("#tchannelPlayer").empty();

        tChannel.createBtn = $("#createTrunkBtn");
        tChannel.inviteBtn = $("#tcinviteBtn");
        tChannel.quitBtn = $("#tcquitBtn");
        tChannel.playPanel = $("#tchannelPlayer");
        tChannel.delChannelBtn = $("#delChannel");
        tChannel.startSpeak = $("#startSpeak");
        tChannel.stopSpeak = $("#stopSpeak");
        tChannel.startVRecord = $("#startVRecord");
        tChannel.stopVRecord = $("#stopVRecord");
        tChannel.observerBtn = $("#observerBtn");
        tChannel.cancelObserverBtn = $("#cancelObserverBtn");

        tChannel.observerBtn.unbind().bind("click", function () {
          var ab = {
            strTrunkChannelDomainCode: tChannel.strTrunkChannelDomainCode,
            nTrunkChannelID: tChannel.nTrunkChannelID,
            nEnable: 1
          };
          sdk.observerTrunkChannelReq(ab, function (resss) {
            if (resss.nResultCode == 0) {
              bootbox.alert("监听成功！");
            }
          });
        });

        tChannel.cancelObserverBtn.unbind().bind("click", function () {
          var ab = {
            strTrunkChannelDomainCode: tChannel.strTrunkChannelDomainCode,
            nTrunkChannelID: tChannel.nTrunkChannelID,
            nEnable: 0
          };
          sdk.observerTrunkChannelReq(ab, function (resss) {
            if (resss.nResultCode == 0) {
              bootbox.alert("取消监听成功！");
            }
          });
        });

        tChannel.quitTChannelAction = function () {
          //tChannel.createBtn.show();
          tChannel.inviteBtn.hide();
          tChannel.quitBtn.hide();
          tChannel.playPanel.hide();
          tChannel.delChannelBtn.hide();
          tChannel.startSpeak.hide();
          tChannel.stopSpeak.hide();
          tChannel.startVRecord.hide();
          tChannel.stopVRecord.hide();
          $("#tchannelRight").hide();
          $("#tchannelUser").empty().hide();
          tChannel.observerBtn.hide();
          tChannel.cancelObserverBtn.hide();
        }

        setChannelInfo(tChannel.opt.tChannelInfo);
        $("#tchannelPlayer").hide();
        $("#tchannelRight").show();
        $("#tchannelUser").css({"overflow-y": "auto"}).show();
        //tChannel.createBtn.hide();
        tChannel.quitBtn.show();

        enterChannelAction(tChannel);
      });

    });


  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function enterChannelAction(tChannel) {
  tChannel.delChannelBtn.show().unbind().bind("click", function () {
    tChannel.deleteReq();
    return;
  });
  tChannel.inviteBtn.show();
  tChannel.quitBtn.show().unbind().bind("click", function () {
    tChannel.leaveReq();
    return;
  });

  tChannel.startSpeak.show().unbind().bind("click", function () {
    tChannel.startSpeakAction(function (spres) {
      if (spres.nResultCode == 0) {
        clearTimeout(tChannel.startSpeak.timer);
        tChannel.startSpeak.hide();
        tChannel.stopSpeak.show();
      } else {
        bootbox.alert("开启采集失败！");
      }
    }, function () {
      tChannel.startSpeak.show();
      tChannel.stopSpeak.hide();
    });
    return;
  });
  tChannel.stopSpeak.unbind().bind("click", function () {
    tChannel.stopSpeakAction(function (res) {
      if (res.nResultCode == 0) {
        tChannel.stopSpeak.hide();
        tChannel.startSpeak.show();
      }
    });
    return;
  });

  tChannel.startVRecord.show().unbind().bind("click", function () {
    tChannel.recordControl({nRecordStatus: 1}, function (res) {
      if (res.nResultCode == 0) {
        tChannel.startVRecord.hide();
        tChannel.stopVRecord.show();
      } else {
        bootbox.alert("开始录音失败！");
      }
    });
    return;
  });

  tChannel.stopVRecord.unbind().bind("click", function () {
    tChannel.recordControl({nRecordStatus: 0}, function (res) {
      if (res.nResultCode == 0) {
        tChannel.startVRecord.show();
        tChannel.stopVRecord.hide();
      } else {
        bootbox.alert("停止录音失败！");
      }
    });
    return;
  });
}

//创建集群对讲按钮
function createTrunkFunc() {
  if (sdk.sie.userStatus == 1) {
    var dialog = bootbox.dialog({
      title: '创建频道',
      message: "<div id='createTunckPanel'></div>",
      size: 'big',
      buttons: {
        cancel: {
          label: "取消",
          className: 'btn-danger',
          callback: function () {
          }
        },
        "success":
          {
            "label": "<i class='icon-ok'></i> 确定",
            "className": "btn-success",
            "callback": function () {
              var list = getSelectUser($("#tChannelSelect"));
              var ls = [];
              $.each(list, function (i, e) {
                ls.push({
                  "strTcUserDomainCode": e.domainCode,
                  "strTcUserID": e.strUserID,
                  "strTcUserName": e.strUserName,
                  "nPriority": i + 1,
                  "nEnforce": 1
                });
              });
              var opt = {
                "strTrunkChannelName": $("#c-strTrunkChannelName").val(),
                "nTrunkChannelType": $("#c-nTrunkChannelType").val() * 1,
                "nRecordStatus": $("#c-nRecordStatus").is(":checked") ? 1 : 0,
                "nSpeakTimeout": $("#c-nSpeakTimeout").val() * 1
              }
              console.error("!!!!!!!", opt);
              opt.lstTrunkChannelUser = ls;
              createTrunkChannel(opt);
            }
          }
      }
    });

    var root = $("#createTunckPanel").css({"height": "400px", "width": "400px"});
    root.append(
      $("<div/>").attr("id", "createTrunkparam").append(
        $("<div/>").append($("<label/>").html("集群名称：")).append(
          $("<input/>").attr("id", "c-strTrunkChannelName").width("300").val("集群对讲测试")
        )
      ).append(
        $("<div/>").append($("<label/>").html("集群类型：")).append(
          $("<select/>").attr("id", "c-nTrunkChannelType").width("300").append(
            $("<option/>").attr({"value": 1}).html("静态频道")
          ).append(
            $("<option/>").attr({"value": 2}).html("临时频道")
          )
        )
      ).append(
        $("<div/>").height("50").append($("<label/>").html("是否录音：").css({
          "float": "left",
          "margin-top": "10px"
        })).append(
          $("<input/>").attr({"id": "c-nRecordStatus", type: "checkbox"}).width(16).height(16).css({
            "float": "left",
            "margin-top": "12px",
            "cursor": "pointer"
          })
        )
      ).append(
        $("<div/>").append($("<label/>").html("发言时长：")).append(
          $("<input/>").attr("id", "c-nSpeakTimeout").width("300").val(60)
        )
      )
    )
    var userContent = $("<div/>").attr("id", "tChannelSelect").css({width: "100%", "overflow-y": "auto"}).height(100)
    root.append(userContent);
    getUserAction(userContent);
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}


//查询集群对讲列表
function getTrunkList() {
  if (sdk.sie.userStatus == 1) {
    var opt = {
      strTrunkChannelDomainCode: sdk.sie.strUserDomainCode,
      strBeginCreateTime: $("#strBeginCreateTime").val(),
      strEndCreateTime: $("#strEndCreateTime").val(),
      nRecordStatus: $("#nRecordStatus").val() * 1

    };
    if ($("#strTrunkChannelKey").val()) {
      opt.strTrunkChannelKey = $("#strTrunkChannelKey").val();
    }

    if ($("#nTrunkChannelType").val()) {
      opt.nTrunkChannelType = $("#nTrunkChannelType").val() * 1;
    }


    var tab = $("#trunkInfoTable").empty();
    tab.append(
      $("<thead/>").append(
        $("<tr/>").append(
          $("<th/>").html("名称")
        ).append(
          $("<th/>").html("频道ID")
        ).append(
          $("<th/>").html("创建时间")
        ).append(
          $("<th/>").html("状态")
        ).append(
          $("<th/>").html("操作")
        )
      )
    );
    sdk.queryTrunkChannelListReq(opt, function (res) {
      //console.error(res);
      setLog(JSON.stringify(res));
      var recordTr = $("<tr/>").height(160)
      $.each(res.lstTrunkChannelInfo, function (i, n) {
        var trunName = $("<td/>").html(n.strTrunkChannelName);
        var trRow = $("<tr/>").append(trunName).append($("<td/>").html(n.nTrunkChannelID)).append($("<td/>").html(n.strCreateTime)).append($("<td/>").html(trunkStauts[n.nTrunkChannelType])).append($("<td/>").append(function () {
          var del = $("<a class='a-btn'/>").html("删除").bind("click", function () {
            var oo = {
              strTrunkChannelDomainCode: n.strTrunkChannelDomainCode,
              nTrunkChannelID: n.nTrunkChannelID
            };
            sdk.deleteTrunkChannelReq(oo, function (resp) {
              if (resp.nResultCode == 0) {
                trRow.remove();
                bootbox.alert("删除成功！");
              } else {
                bootbox.alert("删除失败！");
              }
            });
          });
          if (n.nTrunkChannelType == 4) {
            del = "";
          }
          return del;
        }).append(function () {
          var a = $("<a class='a-btn'/>").html("修改").bind("click", function () {

            var ab = {
              strTrunkChannelDomainCode: n.strTrunkChannelDomainCode,
              nTrunkChannelID: n.nTrunkChannelID
            };
            sdk.getTrunkChannelInfoReq(ab, function (resss) {
              if (resss.nResultCode == 0) {
                modifyInfo(resss, trunName);
              }
            });

          });
          if (n.nTrunkChannelType == 4) {
            a = "";
          }
          return a;
        }).append(function () {
          var a = $("<a class='a-btn'/>").html("详情").bind("click", function () {
            var ab = {
              strTrunkChannelDomainCode: n.strTrunkChannelDomainCode,
              nTrunkChannelID: n.nTrunkChannelID
            };
            sdk.getTrunkChannelInfoReq(ab, function (resss) {
              if (resss.nResultCode == 0) {
                showTrunkInfo(resss);
              }
            });

          });
          if (n.nTrunkChannelType == 4) {
            a = "";
          }
          return a;
        }).append(function () {
          var a = $("<a class='a-btn'/>").html("加入").bind("click", function () {
            var ab = {
              strTrunkChannelDomainCode: n.strTrunkChannelDomainCode,
              nTrunkChannelID: n.nTrunkChannelID,
              strInviterDomainCode: "",
              strInviterUserID: "",
              strInviterName: "主动加入",
              strTrunkChannelName: n.strTrunkChannelName,
              nEnforce: 1
            };
            sdk.notifyUserInviteTrunkChanne(ab);

          })
          if (n.nTrunkChannelType == 4) {
            a = "";
          }
          return a;
        }).append($("<a class='a-btn'/>").html("获取录音").bind("click", function () {
            recordTr.empty();
            var table1 = $("<table/>").addClass("table table1");
            var div = $("<div/>").css({
              "margin-left": "20px",
              "overflow-y": "auto"
            }).height("100%").width("100%").append(table1)
            getTcRecordList({
              strTrunkChannelDomainCode: n.strTrunkChannelDomainCode,
              nTrunkChannelID: n.nTrunkChannelID
            }, table1)
            recordTr.append(div)
            trRow.after(recordTr);
          })
        ));
        tab.append(trRow);
      });
      bootbox.alert("查询成功！");
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

//获取录音列表
function getTcRecordList(da, root) {
  sdk.queryTrunkChannelVoiceReq(da, function (res111) {
    var tab = root.empty();
    tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名陈")).append($("<th/>").html("录音id")).append($("<th/>").html("录音开始时间")).append($("<th/>").html("录音时长")).append($("<th/>").html("操作"))));
    $.each(res111.lstTrunkChannelVoice, function (i, n) {
      var trRow = $("<tr/>").append($("<td/>").html(n.strSpeakerName)).append($("<td/>").html(n.nRecordID)).append($("<td/>").html(n.strVoiceStartTime)).append($("<td/>").html(n.nVoiceDuration)).append($("<td/>").append($("<a class='a-btn'/>").html("播放").bind("click", function () {
        sdk.playbackCTSReq({
          strDomainCode: n.strSpeakerDomainCode,
          unRecordId: n.nRecordID
        }, function (res) {
          sdk.log("playbackCTSReq::" + JSON.stringify(res));
          if (res.nResultCode == 0) {
            if (res.playbackUrlInfo && res.playbackUrlInfo.strPlaybackUrl) {
              if (!sdk.tcRecordPlayer) {
                $("#tcRecordPlayer").show();
                var pla = {
                  layout: 1,
                  pnode: "tcRecordPlayer",
                  log: true
                };
                sdk.tcRecordPlayer = sdk.getPlayer(pla);
              }

              if (sdk.tcRecordPlayer) {
                sdk.tcRecordPlayer.stopPlay();
              }
              var pla = {
                wsserver: $("#websocketPlatUrl").val(),
                rtspurl: res.playbackUrlInfo.strPlaybackUrl,
                hyVideo: sdk.tcRecordPlayer.players[0],
                videoParam: {palyParam: {title: n.strSpeakerName}},
                log: true
              };
              sdk.tcRecordPlayer.playByVideo(pla);
            }

          } else {
            bootbox.alert("录像查询失败！");
          }

        });

      })));
      tab.append(trRow);
    });
    bootbox.alert("查询成功！");
  });
}

//获取我的群组
function getGroupAction(root) {
  if (sdk.sie.userStatus == 1) {
    var list = [];
    var obj = {};
    root.empty();
    sdk.getDomainReq(function (msg) {
      if (msg.nResultCode == 0) {
        var domainC = msg.domainInfoList ? msg.domainInfoList.length : 0;
        $.each(msg.domainInfoList, function (i, e) {
          obj[e.strDomainCode] = e;
          var opt = {
            strTrunkChannelDomainCode: e.strDomainCode,
            strTcUserDomainCode: sdk.sie.strUserDomainCode,
            strTcUserID: sdk.opts.loginName

          };

          sdk.queryTrunkChannelListReq(opt, function (res) {
            domainC--;
            if (res.nResultCode == 0) {
              e.child = res.lstTrunkChannelInfo;
            }

            if (domainC == 0) {
              var newObj = $.extend({}, obj);
              $.each(obj, function (i, e) {
                if (e.strParentDomainCode && e.strParentDomainCode != e.strDomainCode) {
                  if (newObj[e.strParentDomainCode]) {
                    if (newObj[e.strParentDomainCode].domainList) {
                      newObj[e.strParentDomainCode].domainList.push(e);
                    } else {
                      var l = [];
                      l.push(e);
                      newObj[e.strParentDomainCode].domainList = l;
                    }
                    //delete newObj[e.strParentDomainCode]
                  }
                }
              });
              drawMyGroup(newObj, root);
            }
          });
        });
      }
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function drawMyGroup(obj, root) {

  $.each(obj, function (i, e) {
    var obj = initTreeLi({name: e.strDomainName});
    if (e.domainList) {
      drawMyGroup(e.domainList, obj.ul);
    }
    if (e.child) {
      $.each(e.child, function (ui, ue) {
        var uobj = initTreeLi({name: ue.strTrunkChannelName, type: "group", info: ue});
        obj.ul.append(uobj.li);
      });
    }
    root.append(obj.li);
  });

}

//进入群组
function enterGroupAction() {
  var node = $(".group-select", $("#groupSelect"));
  if (node.length) {
    var info = node.data("info");
    var ab = {
      strTrunkChannelDomainCode: info.strTrunkChannelDomainCode,
      nTrunkChannelID: info.nTrunkChannelID,
      strInviterName: "主动加入",
      strTrunkChannelName: info.strTrunkChannelName,
      nEnforce: 1
    };
    sdk.notifyUserInviteTrunkChanne(ab);
  } else {
    bootbox.alert("请选择要加入的群组");
  }
}

//群组邀请
function inittcinvitePanel() {
  var dialog = bootbox.dialog({
    title: '选择邀请人员',
    message: "<div id='selectPanel'></div>",
    size: 'large',
    buttons: {
      cancel: {
        label: "取消",
        className: 'btn-danger',
        callback: function () {
        }
      }
    }
  });

  var tab = '<div class="col-sm-12">'
    + '<div class="tabbable">'
    + '<ul class="nav nav-tabs padding-12 tab-color-blue background-blue" id="myTab4">'
    + '<li class="active">'
    + '<a data-toggle="tab" href="#home4">用户</a>'
    + '</li>'
    + '</ul>'
    + '<div class="tab-content">'
    + '<div id="home4" class="tab-pane in active"><table id="userLis" class="table table1"></table>'
    + '</div>'
    + '</div>'
    + '</div>'
    + '</div>';
  var root = $("#selectPanel").css({"height": "400px", "overflow-y": "auto"}).append(tab);

  var opt = {
    strDomainCode: sdk.sie.strUserDomainCode,
    "listUser": []
  };
  sdk.queryUserListReq(opt,
    function (res) {
      var tab = $("#userLis").css({width: "100%!important"}).empty();
      tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名称")).append($("<th/>").html("账号")).append($("<th/>").html("状态")).append($("<th/>").html("用户tokenId")).append($("<th/>").html("操作"))));
      $.each(res.listUser, function (i, n) {
        var key = sdk.sie.strUserDomainCode + "_" + n.strUserID
        var obj = sdk.nowTChannel;
        if (!(obj && obj.userInfo[key])) {
          var userTr = $("<tr/>").append($("<td/>").html(n.strUserID)).append($("<td/>").html(n.strUserName)).append($("<td/>").html(n.nState)).append($("<td/>").html(n.strUserTokenID)).append($("<td/>").append($("<a/>").html("邀请").bind("click", function () {
            userTr.remove();
            var user = {
              "strTcUserDomainCode": sdk.sie.strUserDomainCode,
              "strTcUserID": n.strUserID,
              "strTcUserName": n.strUserName,
              "nPriority": 0,
              "nEnforce": 0
            };
            sdk.nowTChannel.inviteNewUser(user);
            //sdk.callMt.inviteUserAction(user);

          })));

          tab.append(userTr);
        }
      });
    });

}

//集群频道详情
function showTrunkInfo(info) {

  var dialog = bootbox.dialog({
    title: '频道详情',
    message: "<div id='selectPanel'></div>",
    size: 'big',
    buttons: {
      cancel: {
        label: "取消",
        className: 'btn-danger',
        callback: function () {
        }
      }

    }
  });
  var root = $("#selectPanel").css({"height": "300px", "overflow-y": "auto"});
  var list = [
    {name: "域编码:", value: info.strTrunkChannelDomainCode},
    {name: "频道会话ID号:", value: info.nTrunkChannelID},
    {name: "频道类型:", value: trunkStauts[info.nTrunkChannelType]},
    {name: "创建时间:", value: info.strCreateTime},
    {name: "频道名:", value: info.strTrunkChannelName},
    {name: "频道状态:", value: info.nTrunkChannelStatus == 0 ? "空闲" : "抢占发言中"},
    {name: "发言超时:", value: info.nSpeakTimeout},
    {name: "是否录音:", value: info.nRecordStatus == 0 ? "不录" : "录"}
  ];
  $.each(list, function (i, e) {
    var row = $("<div/>").append(
      $("<span/>").css({"font-weight": "bold", "margin-right": "10px"}).html(e.name)
    ).append(
      $("<span/>").html(e.value)
    );
    root.append(row);
  });

}

//修改频道信息
function modifyInfo(info, trunName) {
  var dialog = bootbox.dialog({
    title: '修改频道信息',
    message: "<div id='selectPanel'></div>",
    size: 'big',
    buttons: {
      cancel: {
        label: "取消",
        className: 'btn-danger',
        callback: function () {
        }
      },
      "success":
        {
          "label": "<i class='icon-ok'></i> 确定",
          "className": "btn-success",
          "callback": function () {
            var ab = {
              strTrunkChannelDomainCode: info.strTrunkChannelDomainCode,
              nTrunkChannelID: info.nTrunkChannelID,
              nSpeakTimeout: $("#trunkspeakTime").val() * 1,
              strTrunkChannelName: $("#modifystrTrunkChannelName").val()
            };
            sdk.modifyTrunkChannelReq(ab, function (res1) {
              dialog.modal('hide');
              if (res1.nResultCode == 0) {
                bootbox.alert("修改成功！");
                trunName.html($("#modifystrTrunkChannelName").val());
              } else {
                bootbox.alert("修改失败：" + JSON.stringify(res1));
              }
            });

          }
        }
    }
  });

  var root = $("#selectPanel").css({"height": "100px", "overflow-y": "auto"});
  root.append(
    $("<div/>").append(
      $("<label/>").html("发言超时:")
    ).append(
      $("<input/>").attr("id", "trunkspeakTime").val(info.nSpeakTimeout)
    )
  ).append(
    $("<div/>").append(
      $("<label/>").html("集群频道名:")
    ).append(
      $("<input/>").attr("id", "modifystrTrunkChannelName").val(info.strTrunkChannelName)
    )
  )

}

/********************************集群对讲结束*********************************************/

/********************************用户管理*********************************************/
//获取人员
function getUInfo() {

  if (sdk.sie.userStatus == 1) {
    var opt = {
      strDomainCode: sdk.sie.strUserDomainCode,
      "listUser": []
    };
    sdk.queryUserListReq(opt,
      function (res) {
        sdk.log(" =====  ---- " + JSON.stringify(res));
        // setLog(JSON.stringify(res));
        var tab = $("#uInfoTable").addClass("table1").empty();
        tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("账号")).append($("<th/>").html("用户名称")).append($("<th/>").html("状态")).append($("<th/>").html("用户tokenId")).append($("<th/>").html("操作"))));
        $.each(res.listUser, function (i, n) {
          var row = $("<tr/>");
          tab.append(
            row.append(
              $("<td/>").html(n.strUserID)
            ).append(
              $("<td/>").html(n.strUserName)
            ).append(
              $("<td/>").html(userStatus[n.nState])
            ).append(
              $("<td/>").html(n.strUserTokenID)
            ).append(
              $("<td/>").append(function () {
                var btn = $("<a class='a-btn'/>").html("踢出").bind("click", function () {
                  sdk.kickUserOut({
                    strUserTokenID: n.strUserTokenID
                  }, function (json) {
                    if (json.nResultCode == 0) {
                      row.remove();
                    }
                  });
                })
                if (n.strUserID == sdk.opts.loginName) {
                  btn = "";
                }
                return btn;
              }).append(function () {
                var btn = $("<a class='a-btn'/>").html("关注").bind("click", function () {
                  setFriend({
                    "strUserDomainCode": sdk.sie.strUserDomainCode,
                    "strUserID": n.strUserID
                  });
                })

                if (n.strUserID == sdk.opts.loginName) {
                  btn = "";
                }
                return btn;
              }).append(
                $("<a class='a-btn'/>").html("获取播放地址").bind("click", function () {
                  getUURl(n.strUserTokenID);
                })
              )
            )
          )
        });
        bootbox.alert("查询成功！");
      });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }

}

//设置好友关注
function setFriend(json) {
  if (sdk.sie.userStatus == 1) {
    var opt = {
      strUserTokenID: sdk.sie.strUserTokenID,
      strUserDomainCode: sdk.sie.strUserDomainCode,
      strUserID: $("#loginName").val(),
      listUser: [{
        "strUserDomainCode": json.strUserDomainCode,
        "strUserID": json.strUserID
      }]
    };
    sdk.setUserFriendReq(opt,
      function (json) {
        sdk.log("setUserFriendResp : " + JSON.stringify(json));
        if (json.nResultCode === 0) {
          bootbox.alert("设置好友成功！");
        } else {
          bootbox.alert("设置好友失败！<br/><red>【" + sdk.getErrorDesc(json.nResultCode) + "】</red>");
        }
        setLog(JSON.stringify(json));
      });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}


//获取用户播放地址
function getUURl(tokenID) {
  if (sdk.sie.userStatus == 1) {
    if (!tokenID) {
      bootbox.alert("该人员未登录，请先登录！");
    }
    $("#getUURResp").empty();
    var opt1 = {strUserTokenID: tokenID, "domainCode": sdk.sie.strUserDomainCode};
    sdk.log(" ======================= ", opt1);
    sdk.getMobileDynamicUrlReq(opt1, function (json) {
      if (json.nResultCode === 0) {

        $("#getUURResp").html($("<div/>").html("采集流：" + json.dynamicUrl));
        if (json.desktopDynamicUrl) {
          $("#getUURResp").append($("<div/>").html("屏幕分享流：" + json.desktopDynamicUrl))
        }
      } else {
        bootbox.alert("查询用户视频流地址失败！<br/><red>【" + sdk.getErrorDesc(json.nResultCode) + "】</red>");
      }
      setLog(JSON.stringify(json));
    });

  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

/********************************用户管理结束*********************************************/

function lougout() {
  sdk.log(sdk.sie.userStatus);
  if (sdk.sie.userStatus == 1) {
    sdk.destory(function () {
      setLog("退出成功！");
      $("#login-btn").show();
      $("#logout-btn").hide();

      bootbox.alert("退出成功！");

    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
  window.location.reload()
}

function reload() {
  console.log($("#loginName").val(), 11111);
  console.log($("#userName").val(), 22222);
  window.localStorage.setItem('loginName', $("#loginName").val())
  window.localStorage.setItem('userName', $("#userName").val())
  sdk.init(getUserInfo());
}


function getUserInfo() {
  var opt = {
    url: $("#url").val(),
    svrIp: $("#svrIp").val(),
    userName: $("#userName").val(),
    sieStreamUrl: $("#websocketPlatUrl").val(),
    svrPort: $("#svrPort").val() * 1,
    webrtcUrl: $("#webRtcUrl").val(),//"wss://192.168.2.176:8989",//"ws://192.168.2.176:8188" ,//"wss://192.168.2.176:8989",
    loginName: $("#loginName").val(),
    iceServers: JSON.parse($("#iceServers").val()),
    loginSuccess: function (msg) {
      // console.log("11111" , msg)

      setLog(JSON.stringify(msg));
      if (msg.nResultCode === 0) {
//	            bootbox.alert("登录成功！");
        $("#login-btn").hide();
        $("#logout-btn").show();
        $("#domaincode").val(sdk.sie.strUserDomainCode);
        $("#playLoginName").val(opt.loginName)
        var device = sdk.getUserUseIPC();
        if (device && device.deviceType && device.deviceType == 1) {
          if (device.ipc && device.ipc.nIsUse == 1) {
            sdk.setUserUseIPCReq(device.ipc);
          }
        }
      } else {
        sdk.kickOut({
          strUserTokenID: msg.strUserTokenID
        });
      }
      // 登录成功后设置用户ipcL156

      /*
			 * var ipc = sdk.getUserUseIPC(); if(ipc && ipc.nIsUse == 1){
			 * sdk.setUserUseIPCReq(ipc); }
			 */

      // sendCustomMsg();

      sdk.initWebRtc();

    },
    connectFailed: function () {
      alert("sie连接失败")
    },
    log: true
  };
  sdk.log(JSON.stringify(opt));
  return opt;
}

function player() {
  // SENT:
  // {"id":2,"url":"rtsp://192.168.2.198:554/2268/rtsp://192.168.2.230:554/Streaming/Channels/1?transportmode=unicast&profile=Profile_1?BitRate=2048;FrameRate=25;IFrame=25;DmgType=2258"}
  /*
	 * var play = sdk.getPlayer(pla);
	 */


  var pla = {
    wsserver: $("#websocketPlatUrl").val(),
    rtspurl: "rtsp://192.168.2.30:554/2268/rtsp://192.168.2.219:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1?BitRate=1024;FrameRate=25;IFrame=100",
    log: true
  };
  console.log(sdk);
  sdk.mainPlay.play(pla);
  // document.getElementById("playPanel").webkitRequestFullScreen();
}

function playerx() {
  if (sdk.mainPlay) {

    sdk.mainPlay.stopPlay();

    $.each(sdk.mainPlay.players,
      function (i, n) {
        var pla = {
          wsserver: $("#websocketPlatUrl").val(),
          rtspurl: $("#rtsp_url").val(),//"rtsp://192.168.2.30:554/2268/rtsp://192.168.2.219:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1?BitRate=1024;FrameRate=25;IFrame=100",
          hyVideo: n,
          log: true
        };
        sdk.log(sdk);
        sdk.mainPlay.playByVideo(pla);
      })
  }
}

function playerx1() {
  if (sdk.mainPlay) {
    sdk.mainPlay.stopPlay();
  }
  if (activeHyVideo) {
    activeHyVideo.close();
    var pla = {
      wsserver: $("#websocketPlatUrl").val(),
      rtspurl: $("#rtsp_url").val(),//"rtsp://192.168.2.30:554/2268/rtsp://192.168.2.219:554/Streaming/Channels/101?transportmode=unicast&profile=Profile_1?BitRate=1024;FrameRate=25;IFrame=100",
      hyVideo: activeHyVideo,
      log: true
    };
    sdk.mainPlay.playByVideo(pla);
  }
}

function playerxRtc() {
  if (sdk.mainPlay) {
    sdk.mainPlay.stopPlay();

    $.each(sdk.mainPlay.players,
      function (i, n) {
        var map = sdk.playRtc({
          videoNode: n,
          playUrl: $("#rtsp_url").val(),
          videoParam: {palyParam: {title: "播放"}, videoControl: {curresFlag: true, bitrateFlag: true}}
        });

      })
  }
}

function stopPlay() {
  if (sdk.mainPlay) {
    sdk.stopPlay(sdk.mainPlay);
  }
}

function stopMeeting() {
  sdk.HYCurrentMeeting.stopMeetingReq();
}

function quitMeeting() {
  sdk.HYCurrentMeeting.quitMeeting();
}

function queryUserList() {
  var opt = {
    strDomainCode: sdk.sie.strUserDomainCode,
    "listUser": []
  };
  sdk.queryUserListReq(opt,
    function (res) {
      console.log(" =====  ---- " + JSON.stringify(res));
      setLog(JSON.stringify(res));
    });
}

function getUserURl() {
  var opt = {};
  sdk.getMobileDynamicUrlReq(opt,
    function (json) {
      console.log(json);
    });
}

function fullScreen() {
  sdk.mainPlay.fullScreen();
}


function serRecordURl() {
  var opt = {
    strUserTokenID: sdk.sie.strUserTokenID,
    strNotifyUrl: "http://192.168.2.110:8380/platWeb/test.action",
    strNotifyDomainCode: sdk.sie.strUserDomainCode
  };
  sdk.setUseNotifyUrlReq(opt,
    function (json) {
      console.log(" serRecordURl : " + JSON.stringify(json));
    });
}

function getRecord() {
  sdk.getRecordUrlListCTSReq({
      serviceUrl: {
        strDomainCode: 'a4bf014bb884',
        strDeviceCode: 'a4bf014bb8841130000009',
        strChannelCode: 'a4bf014bb8841310000025',
        strStreamCode: 'a4bf014bb8840000057'
      },
      strRecordLocation: "1",
      nRecordDomain: 1,
      unRecordType: 2,
      strStartTime: '2020-08-31 00:00:00',
      strEndTime: '2020-08-31 23:59:59',
      nPage: 0
    },
    function (res) {
      alert(JSON.stringify(res))
    });
}

function turn(nCommand) {

  sdk.PTZControlReq({
      serviceUrl: {
        strDomainCode: 'a4bf014bb884',
        strDeviceCode: 'a4bf014bb8841130000009',
        strChannelCode: 'a4bf014bb8841310000025',
        strStreamCode: 'a4bf014bb8840000057'
      },
      nCommand: nCommand,
      nStop: 0
    },
    function (msg) {
      console.log("###" + JSON.stringify(msg));
    });
}

function stopTurn() {
  sdk.PTZControlReq({
      serviceUrl: {
        strDomainCode: 'a4bf014bb884',
        strDeviceCode: 'a4bf014bb8841130000009',
        strChannelCode: 'a4bf014bb8841310000025',
        strStreamCode: 'a4bf014bb8840000057'
      },
      nCommand: 3,
      nStop: 1
    },
    function () {

    });
}

function sendCustomMsg() {
  if (sdk.sie.userStatus == 1) {
    var opts = {
      strMsg: "!!!!!出了事测试!!!!",
      nImportant: 0,
      listUser: [{
        "strUserDomainCode": sdk.sie.strUserDomainCode,
        "strUserID": sdk.opts.loginName
      }]
    };
    sdk.sendMsgToMultiUserReq(opts,
      function (res) {
        sdk.log(" //// " + JSON.stringify(res));
        if (res.nResultCode === 0) {
          bootbox.alert("发送成功！");
        } else {
          bootbox.alert("发送失败！<br/><red>【" + sdk.getErrorDesc(res.nResultCode) + "】</red>");
        }
        setLog(JSON.stringify(res));
      });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function getUsbDevice() {
  $("#usb-device").empty();
  $("#usb-device-voice").empty();
  //
  sdk.getUsbList({
    callback: function (list) {
      if (list) {
        $.each(list,
          function (i, e) {
            var option = $("<option/>").attr({
              "value": e.groupId
            }).html(e.label ? e.label : e.groupId);
            option.bind("click",
              function () {

              });
            if (e.kind == "videoinput") {
              $("#usb-device").append(option);
            } else if (e.kind == "audioinput") {
              $("#usb-device-voice").append(option);
            }

          });
      }
    }
  });
}

//getUsbDevice();
function selectdeviceType(type) {
  $("#devicTree1").empty();
  if (type == 1) {

    $("#usbWarp").hide();
    $("#usb-save").hide();
    getDomain("setUserIpc");
  } else {
    $("#usbWarp").show();
    $("#usb-save").show();
    getUsbDevice();
  }
}

function setUserUsb() {
  sdk.setUserUsb(JSON.parse($("#setUsbParam").val()));
  bootbox.alert("usb设置成功！");
}


function stopStartCapture() {
  if (sdk.captureMainplay) {
    sdk.captureMainplay.stopPlay();
  }

  $("#startCapture").show();
  $("#stopStartCapture").hide();
}


function stopCaptureWatch() {
  if (sdk.watchCapture) {
    sdk.watchCapture.stopPlay();
  }
  $("#captureWatch").show();
  $("#stopCaptureWatch").hide();
}

function stopVoiceCapture() {
  if (sdk.voiceCapture) {
    sdk.voiceCapture.stopPlay();
  }
  $("#startVoiceCapture").show();
  $("#stopVoiceCapture").hide();
}


function stopSetDeviceCapture() {
  if (sdk.deviceCapture) {
    sdk.deviceCapture.stopPlay();
  }
  $("#setDeviceCapture").show();
  $("#stopSetDeviceCapture").hide();
}

function setDeviceCapture() {
  if (sdk.isConnected() === true) {
    if (sdk.deviceCapture) {
      sdk.deviceCapture.stopPlay();
    }
    $("#setDeviceCapture").hide();
    $("#setDevicePanel").show();
    var pla = {
      layout: 1,
      pnode: "setDevicePanel",
      log: true
    };
    var playmainPlay = sdk.getPlayer(pla);
    sdk.deviceCapture = playmainPlay;
    sdk.setUserUsb(JSON.parse($("#setDeviceParam").val()));

    var map = sdk.startCapture({
      videoNode: playmainPlay.players[0],
      media: JSON.parse($("#setDeviceParam").val()),
      videoParam: {
        palyParam: {title: "自定义采集"},
        videoControl: {setBitFlag: true, setCurresFlag: true, setAudioFlag: true, setVideoFlag: true}
      },
      success: function (res) {
        if (res.code == 0) {
          $("#setDeviceCapture").hide();
          $("#stopSetDeviceCapture").show();
        } else {
          $("#setDeviceCapture").show();
        }
      }
    });
  } else {
    bootbox.alert("WebRTC server isConnected:: " + sdk.isConnected());
  }
}

function stopScreenCapture() {
  if (sdk.screencapturePlay) {
    sdk.screencapturePlay.players[0].close();
  }
  $("#startScreenCapture").show();
  $("#stopScreenCapture").hide();
}

function playWebRtc() {
  if (sdk.isConnected() === true) {
    var map = sdk.playRtc({
      videoNode: activeHyVideo,
      playUrl: "rtsp://192.168.2.198:554/2337/rtsp://10000079_1:554?BitRate=512;FrameRate=25;IFrame=100;DmgType=2337",
      videoParam: {palyParam: {title: "播放"}, videoControl: {curresFlag: true, bitrateFlag: true}}
    });
  } else {
    bootbox.alert("WebRTC server isConnected:: " + sdk.isConnected());
  }
}

function stopPlayUserCapture() {
  if (sdk.playUser) {
    sdk.playUser.stopPlay();
  }
  $("#playUserCapturebtn").show();
  $("#stopPlayUserCapture").hide();
}


function cleanLog() {
  $("#logs").empty();
}

function setLog(msg) {
  $("#logs").append($("<div style='text-indent:2em;'/>").html(msg));
  var div = document.getElementById("logs");
  if (!$("#logs").is(":visible")) {
    var count = $("#msgCount").attr("count") * 1;
    count += 1;
    $("#msgCount").attr("count", count).html(count)
  }

  $("#logs").scrollTop(99999);
  div.scrollTop = 99999;
}


function playUrl() {
  if (sdk.sie.userStatus == 1) {
    if (sdk.socketMainPlay) {
      sdk.socketMainPlay.stopPlay();
    }
    $("#playUrlPanel").show();
    var pla = {
      layout: 1,
      pnode: "playUrlPanel",
      log: true
    };
    var playmainPlay = sdk.getPlayer(pla);
    sdk.socketMainPlay = playmainPlay;

    var pla = {
      wsserver: $("#websocketPlatUrl").val(),
      rtspurl: $("#playUrlcont").val(),
      hyVideo: playmainPlay.players[0],
      log: true
    };
    playmainPlay.playByVideo(pla);
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function playRtcUrl() {
  if (sdk.sie.userStatus == 1) {
    if (sdk.rtcMainPlay) {
      sdk.rtcMainPlay.stopPlay();
    }
    $("#playRtcPanel").show();
    var pla = {
      layout: 1,
      pnode: "playRtcPanel",
      log: true
    };
    var playmainPlay = sdk.getPlayer(pla);
    sdk.rtcMainPlay = playmainPlay;
    //playmainPlay.players[0]

    var map = sdk.playRtc({
      videoNode: playmainPlay.players[0],
      playUrl: $("#playRtccont").val(),
      videoParam: {palyParam: {title: "播放"}, videoControl: {curresFlag: true, bitrateFlag: true}}
    });


  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }
}

function queryUsb() {
  sdk.getUsbList({
    callback: function (list) {
      if (list) {
        var tab = $("#usb-table").empty();
        tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("名称")).append($("<th/>").html("类型")).append($("<th/>").html("设备id"))));
        $.each(list, function (i, n) {
          if (n.kind == "videoinput" || n.kind == "audioinput")
            tab.append($("<tr/>").append($("<td/>").html(n.label)).append($("<td/>").html(n.kind)).append($("<td/>").html(n.deviceId)))
        });
        bootbox.alert("查询成功！");
      }
    }
  });
}


function initDevices(devices) {
  devices.forEach(function (device) {
    var label = device.label;
    if (!label || label === "")
      label = device.deviceId;
    var option = $('<option value="' + device.deviceId + '">' + label + '</option>');
    if (device.kind === 'audioinput') {
      $('#audio-device').append(option);
    } else if (device.kind === 'videoinput') {
      $('#video-device').append(option);
    } else if (device.kind === 'audiooutput') {
      // Apparently only available from Chrome 49 on?
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/setSinkId
      // Definitely missing in Safari at the moment: https://bugs.webkit.org/show_bug.cgi?id=179415
      $('#output-devices').removeClass('hide');
      $('#audiooutput').append('<li><a href="#" id="' + device.deviceId + '">' + label + '</a></li>');
      $('#audiooutput a').unbind('click')
        .click(function () {
          var deviceId = $(this).attr("id");
          var label = $(this).text();
          Janus.log("Trying to set device " + deviceId + " (" + label + ") as sink for the output");
          if ($('#peervideo').length === 0) {
            Janus.error("No remote video element available");
            bootbox.alert("No remote video element available");
            return false;
          }
          if (!$('#peervideo').get(0).setSinkId) {
            Janus.error("SetSinkId not supported");
            bootbox.warn("SetSinkId not supported");
            return false;
          }
          $('#peervideo').get(0).setSinkId(deviceId)
            .then(function () {
              Janus.log('Audio output device attached:', deviceId);
              $('#outputdeviceset').html(label + '<span class="caret"></span>').parent().removeClass('open');
            }).catch(function (error) {
            Janus.error(error);
            bootbox.alert(error);
          });
          return false;
        });
    }
  });

  $('#audio-device').val(audio);
  $('#video-device').val(video);

  $('#change-devices').click(function () {
    // A different device has been selected: hangup the session, and set it up again
    $('#audio-device, #video-device').attr('disabled', true);
    $('#change-devices').attr('disabled', true);
    if (firstTime) {
      firstTime = false;
      restartCapture();
      return;
    }
    restartCapture();
  });
}


function unlockSie() {
  setTimeout(function () {
    window.open($("#url").val().replaceAll("wss", "https"));
  }, 100);
  setTimeout(function () {
    window.open($("#websocketPlatUrl").val().replaceAll("wss", "https"));
  }, 100);
  setTimeout(function () {
    window.open($("#webRtcUrl").val().replaceAll("wss", "https"));
  }, 100);

}


function showLog() {
  $("#logs").toggle();
}


function setSizeScreen() {
  sdk.mainPlay.setSizeScreenLayout({
    mainVideo: activeHyVideo,
    showNum: Math.ceil(sdk.mainPlay.players.length / 2)
  });
}

function backToOrg() {
  sdk.mainPlay.restoreLayout();
}

function getDevRecord() {
  sdk.getRecordUrlListCTSReq(JSON.parse($("#getrecordparam").val()), function (res) {
    var tab = $("#devRecordTable").empty();
    tab.append($("<thead/>").append($("<tr/>").append($("<th/>").html("录像id")).append($("<th/>").html("录像url")).append($("<th/>").html("操作"))));
    if (res.nResultCode == 0) {
      bootbox.alert("查询成功");
      $.each(res.recordUrlInfo.playbackUrlInfoList, function (i, n) {
        tab.append(
          $("<tr/>").append(
            $("<td/>").html(n.nRecordID)
          ).append(
            $("<td/>").html(n.strPlaybackUrl)
          ).append($("<td/>").append($("<a/>").html("播放").bind("click", function () {
            if (!sdk.devRecordPlay) {
              $("#devRecordPlayer").show();
              var pla = {
                layout: 1,
                pnode: "devRecordPlayer",
                log: true
              };
              sdk.devRecordPlay = sdk.getPlayer(pla);
            }
            if (sdk.devRecordPlay) {
              sdk.devRecordPlay.stopPlay();
            }

            var pla = {
              wsserver: $("#websocketPlatUrl").val(),
              rtspurl: n.strPlaybackUrl,
              hyVideo: sdk.devRecordPlay.players[0],
              videoParam: {palyParam: {title: "录像" + n.nRecordID + "回放"}},
              log: true
            };
            sdk.devRecordPlay.playByVideo(pla);
          }))))
      });
    } else {
      bootbox.alert("查询失败：：：" + JSON.stringify(res));
    }
  });
}


function delRecord() {
  if (sdk.sie.userStatus == 1) {
    var data = JSON.parse($("#delTalpParam").val());
    if (!data.nTalkbackID) {
      bootbox.alert("输入需要删除的对讲id！");
      return;
    }
    sdk.delTalkbackInfoReq(data, function (res) {
      if (res.nResultCode == 0) {
        bootbox.alert("删除成功！");
      } else {
        bootbox.alert("删除失败：" + JSON.stringify(res));
      }
    });
  } else {
    bootbox.alert("账号未登录，请先登录！");
    setLog("账号未登录！");
  }

}

function hlsPlay() {
  var hp = new HLS_PLAY({
    "videoNode": "hls-video",
    "playUrl": $("#hls-textarea").val()//"http://192.168.2.48:8081/live/livestream.m3u8"
  });
  hp.play();
}
