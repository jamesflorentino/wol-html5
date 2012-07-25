/**
* SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 gskinner.com, inc.
* 
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
**/
(function(h){function b(){throw"SoundJS cannot be instantiated";}function g(a,b){this.init(a,b)}function d(){}b.DELIMITER="|";b.AUDIO_TIMEOUT=8E3;b.INTERRUPT_ANY="any";b.INTERRUPT_EARLY="early";b.INTERRUPT_LATE="late";b.INTERRUPT_NONE="none";b.PLAY_INITED="playInited";b.PLAY_SUCCEEDED="playSucceeded";b.PLAY_INTERRUPTED="playInterrupted";b.PLAY_FINISHED="playFinished";b.PLAY_FAILED="playFailed";b.activePlugin=null;b.pluginsRegistered=false;b.masterVolume=1;b.muted=false;b.instances=[];b.instanceHash=
{};b.idHash=null;b.getPreloadHandlers=function(){return{callback:b.proxy(b.initLoad,b),types:["sound"],extensions:["mp3","ogg","wav"]}};b.registerPlugins=function(a){b.pluginsRegistered=true;for(var f=0,c=a.length;f<c;f++){var e=a[f];if(e!=null&&e.isSupported())return b.activePlugin=new e,true}return false};b.registerPlugin=function(a){b.pluginsRegistered=true;return a.isSupported()?(b.activePlugin=new a,true):false};b.isReady=function(){return b.activePlugin!=null};b.getCapabilities=function(){return b.activePlugin?
b.activePlugin.capabilities:null};b.getCapability=function(a){return b.activePlugin==null?null:b.activePlugin.capabilities[a]};b.initLoad=function(a,f,c,e){if(!b.checkPlugin(true))return false;a=b.parsePath(a,f,c,e);if(a==null)return false;if(c!=null){if(b.idHash==null)b.idHash={};b.idHash[c]=a.src}g.create(a.src,e);c=b.activePlugin.register(a.src,e);if(c!=null){if(c.tag!=null)a.tag=c.tag;else if(c.src)a.src=c.src;if(c.completeHandler!=null)a.handler=c.completeHandler}return a};b.parsePath=function(a,
f,c,e){for(var a=a.split(b.DELIMITER),f={type:f||"sound",id:c,data:e,handler:b.handleSoundReady},c=false,e=b.getCapabilities(),i=0,d=a.length;i<d;i++){var g=a[i],h=g.lastIndexOf("."),j=g.substr(h+1).toLowerCase(),h=g.substr(0,h).split("/").pop();switch(j){case "mp3":e.mp3&&(c=true);break;case "ogg":e.ogg&&(c=true);break;case "wav":e.wav&&(c=true)}if(c)return f.name=h,f.src=g,f.extension=j,f}return null};b.play=function(a,f,c,e,i,g,d){if(!b.checkPlugin(true))return null;a=b.getSrcFromId(a);a=b.activePlugin.create(a);
return b.playInstance(a,f,c,e,i,g,d)};b.playInstance=function(a,f,c,e,i,g,d){f=f||b.INTERRUPT_NONE;c==null&&(c=0);e==null&&(e=0);i==null&&(i=0);g==null&&(g=1);d==null&&(d=0);if(c==0){if(!b.beginPlaying(a,f,e,i,g,d))return null}else setTimeout(function(){b.beginPlaying(a,f,e,i,g,d)},c);this.instances.push(a);return this.instanceHash[a.uniqueId]=a};b.beginPlaying=function(a,b,c,e,d,h){if(!g.add(a,b))return false;return a.beginPlaying(c,e,d,h)==-1?(this.instances.splice(this.instances.indexOf(a),1),
delete this.instanceHash[a.uniqueId],false):true};b.checkPlugin=function(a){return b.activePlugin==null&&(a&&!b.pluginsRegistered&&b.registerPlugin(b.HTMLAudioPlugin),b.activePlugin==null)?false:true};b.getSrcFromId=function(a){return b.idHash==null||b.idHash[a]==null?a:b.idHash[a]};b.setVolume=function(a,f){if(Number(a)==null)return false;a=Math.max(0,Math.min(1,a));return b.tellAllInstances("setVolume",f,a)};b.getMasterVolume=function(){return b.masterVolume};b.setMasterVolume=function(a){b.masterVolume=
a;return b.tellAllInstances("setMasterVolume",null,a)};b.setMute=function(a,f){return b.tellAllInstances("mute",f,a)};b.pause=function(a){return b.tellAllInstances("pause",a)};b.resume=function(a){return b.tellAllInstances("resume",a)};b.stop=function(a){return b.tellAllInstances("stop",a)};b.getInstanceById=function(a){return this.instanceHash[a]};b.playFinished=function(a){g.remove(a);this.instances.splice(this.instances.indexOf(a),1)};b.tellAllInstances=function(a,b,c){if(this.activePlugin==null)return false;
for(var b=this.getSrcFromId(b),e=this.instances.length-1;e>=0;e--){var d=this.instances[e];if(!(b!=null&&d.src!=b))switch(a){case "pause":d.pause();break;case "resume":d.resume();break;case "setVolume":d.setVolume(c);break;case "setMasterVolume":d.setMasterVolume(c);break;case "mute":d.mute(c);break;case "stop":d.stop();break;case "setPan":d.setPan(c)}}return true};b.proxy=function(a,b){return function(){return a.apply(b,arguments)}};h.SoundJS=b;g.channels={};g.create=function(a,b){var c=g.get(a);
c==null?g.channels[a]=new g(a,b):c.max+=b};g.add=function(a,b){var c=g.get(a.src);return c==null?false:c.add(a,b)};g.remove=function(a){var b=g.get(a.src);if(b==null)return false;b.remove(a);return true};g.get=function(a){return g.channels[a]};g.prototype={src:null,max:null,length:0,init:function(a,b){this.src=a;this.max=b||1;this.instances=[]},get:function(a){return this.instances[a]},add:function(a,b){if(!this.getSlot(b,a))return false;this.instances.push(a);this.length++;return true},remove:function(a){a=
this.instances.indexOf(a);if(a==-1)return false;this.instances.splice(a,1);this.length--;return true},getSlot:function(a){for(var f,c,e=0,d=this.max||100;e<d;e++){f=this.get(e);if(f==null)return true;else if(a==b.INTERRUPT_NONE)continue;if(e==0)c=f;else if(f.playState==b.PLAY_FINISHED||f==b.PLAY_INTERRUPTED||f==b.PLAY_FAILED)c=f;else if(a==b.INTERRUPT_EARLY&&f.getPosition()<c.getPosition()||a==b.INTERRUPT_LATE&&f.getPosition()>c.getPosition())c=f}return c!=null?(c.interrupt(),this.remove(c),true):
false},toString:function(){return"[SoundJS SoundChannel]"}};d.init=function(){var a=navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1;d.isOpera=h.opera!=null;d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1};d.init();b.BrowserDetect=d})(window);(function(h){function b(){this.init()}function g(a){this.init(a)}function d(a){this.init(a)}b.MAX_INSTANCES=30;b.capabilities=null;b.lastId=0;b.AUDIO_READY="canplaythrough";b.AUDIO_ENDED="ended";b.AUDIO_ERROR="error";b.AUDIO_STALLED="stalled";b.fillChannels=false;b.isSupported=function(){if(SoundJS.BrowserDetect.isIOS)return false;b.generateCapabilities();var a=b.tag;return a==null||a.canPlayType==null?false:true};b.generateCapabilities=function(){if(b.capabilities==null){var a=b.tag=document.createElement("audio");
b.capabilities={panning:false,volume:true,mp3:a.canPlayType("audio/mp3")!="no"&&a.canPlayType("audio/mp3")!="",ogg:a.canPlayType("audio/ogg")!="no"&&a.canPlayType("audio/ogg")!="",mpeg:a.canPlayType("audio/mpeg")!="no"&&a.canPlayType("audio/mpeg")!="",channels:b.MAX_INSTANCES}}};b.prototype={capabilities:null,FT:0.0010,channels:null,init:function(){this.capabilities=b.capabilities;this.channels={}},register:function(a,b){for(var c=d.get(a),e,g=0,h=b||1;g<h;g++)e=this.createTag(a),c.add(e);return{tag:e}},
createTag:function(a){var b=document.createElement("audio");b.preload=false;b.src=a;return b},create:function(a){a=new g(a);a.owner=this;return a},toString:function(){return"[HTMLAudioPlugin]"}};h.SoundJS.HTMLAudioPlugin=b;g.prototype={src:null,uniqueId:-1,playState:null,owner:null,loaded:false,paused:false,lastInterrupt:SoundJS.INTERRUPT_NONE,offset:0,delay:0,volume:1,pan:0,muted:false,remainingLoops:0,delayTimeout:-1,tag:null,onComplete:null,onLoop:null,onReady:null,onPlayFailed:null,onPlayInterrupted:null,
endedHandler:null,readyHandler:null,stalledHandler:null,init:function(a){this.uniqueId=b.lastId++;this.src=a;this.endedHandler=SoundJS.proxy(this.handleSoundComplete,this);this.readyHandler=SoundJS.proxy(this.handleSoundReady,this);this.stalledHandler=SoundJS.proxy(this.handleSoundStalled,this)},cleanUp:function(){var a=this.tag;if(a!=null){a.pause();try{a.currentTime=0}catch(f){}a.removeEventListener(b.AUDIO_ENDED,this.endedHandler,false);a.removeEventListener(b.AUDIO_READY,this.readyHandler,false);
d.setInstance(this.src,a);this.tag=null}SoundJS.playFinished(this)},interrupt:function(){if(this.tag!=null){this.playState=SoundJS.PLAY_INTERRUPTED;if(this.onPlayInterrupted)this.onPlayInterrupted(this);this.cleanUp();this.paused=false}},play:function(a,b,c,e,d,g){this.cleanUp();SoundJS.playInstance(this,a,b,c,e,d,g)},beginPlaying:function(a,f,c){var e=this.tag=d.getInstance(this.src);if(e==null)return this.playFailed(),-1;e.addEventListener(b.AUDIO_ENDED,this.endedHandler,false);this.offset=a;this.volume=
c;this.updateVolume();this.remainingLoops=f;e.readyState!==4?(e.addEventListener(b.AUDIO_READY,this.readyHandler,false),e.addEventListener(b.AUDIO_STALLED,this.stalledHandler,false),e.load()):this.handleSoundReady(null);return 1},handleSoundStalled:function(){if(this.onPlayFailed!=null)this.onPlayFailed(this);this.cleanUp()},handleSoundReady:function(){this.playState=SoundJS.PLAY_SUCCEEDED;this.paused=false;this.tag.removeEventListener(b.AUDIO_READY,this.readyHandler,false);this.offset>=this.getDuration()?
this.playFailed():(this.tag.currentTime=this.offset*0.0010,this.tag.play())},pause:function(){this.paused=true;return this.tag!=null?(this.tag.pause(),false):true},resume:function(){this.paused=false;return this.tag!=null?(this.tag.play(),false):true},stop:function(){this.pause();this.playState=SoundJS.PLAY_FINISHED;this.cleanUp();return true},setMasterVolume:function(){this.updateVolume();return true},setVolume:function(a){this.volume=a;this.updateVolume();return true},updateVolume:function(){return this.tag!=
null?(this.tag.volume=this.muted?0:this.volume*SoundJS.masterVolume,true):false},getVolume:function(){return this.volume},mute:function(a){this.muted=a;this.updateVolume();return true},setPan:function(){return false},getPan:function(){return 0},getPosition:function(){return this.tag==null?0:this.tag.currentTime*1E3},setPosition:function(a){if(this.tag==null)return false;try{this.tag.currentTime=a*0.0010}catch(b){return false}return true},getDuration:function(){return this.tag==null?0:this.tag.duration*
1E3},handleSoundComplete:function(){if(this.remainingLoops!=0){this.remainingLoops--;try{this.tag.currentTime=0}catch(a){}this.tag.play();if(this.onLoop!=null)this.onLoop(this)}else{this.playState=SoundJS.PLAY_FINISHED;if(this.onComplete!=null)this.onComplete(this);this.cleanUp()}},playFailed:function(){this.playState=SoundJS.PLAY_FAILED;if(this.onPlayFailed!=null)this.onPlayFailed(this);this.cleanUp()},toString:function(){return"[HTMLAudio SoundInstance]"}};d.channels={};d.get=function(a){var b=
d.channels[a];b==null&&(b=d.channels[a]=new d(a));return b};d.getInstance=function(a){a=d.channels[a];return a==null?null:a.get()};d.setInstance=function(a,b){var c=d.channels[a];return c==null?null:c.set(b)};d.prototype={src:null,length:0,available:0,tags:null,init:function(a){this.src=a;this.tags=[]},add:function(a){this.tags.push(a);this.length++;this.available=this.tags.length},get:function(){if(this.tags.length==0)return null;this.available=this.tags.length;var a=this.tags.pop();document.body.appendChild(a);
return a},set:function(a){this.tags.indexOf(a)==-1&&this.tags.push(a);document.body.removeChild(a);this.available=this.tags.length},toString:function(){return"[HTMLAudioPlugin TagChannel]"}}})(window);