(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{uhCW:function(e,n,t){"use strict";t.r(n),t.d(n,"ConferenceModule",(function(){return q}));var i,o=t("PCNd"),r=t("ofXK"),c=t("sYmb"),a=t("zB/H"),s=t("7RJT"),l=t("fXoL"),b=function(){function e(){this._refreshWebView=!1,this.refreshWebView=new s.BehaviorSubject(this._refreshWebView),this.currentRefreshWebView=this.refreshWebView.asObservable()}return e.prototype.changeRefreshWebView=function(e){var n=this;this.refreshWebView.next(e),e&&setTimeout((function(){return n.changeRefreshWebView(!1)}),500)},e.\u0275prov=l.Jb({token:e,factory:e.\u0275fac=function(n){return new(n||e)},providedIn:"root"}),e}(),d=t("0d0Z"),f=t("unh5"),u=t("cH1L"),p=t("5+WD"),m=t("NFeN"),g=t("AytR"),h=t("XiUW"),w=t("ue6I"),I=t("DDyt"),v=t("dJ3e"),y=t("3Pt+"),S=t("0IaG"),x=t("kmnG"),k=t("qFsG"),T=t("bTqV"),_=(i=function(e,n){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])})(e,n)},function(e,n){function t(){this.constructor=e}i(e,n),e.prototype=null===n?Object.create(n):(t.prototype=n.prototype,new t)});function C(e,n){1&e&&(l.Tb(0,"mat-error"),l.Ic(1),l.fc(2,"translate"),l.Sb()),2&e&&(l.Bb(1),l.Kc("\n        ",l.gc(2,1,"login_info.username_error"),"\n      "))}function N(e,n){1&e&&(l.Tb(0,"mat-error"),l.Ic(1),l.fc(2,"translate"),l.Sb()),2&e&&(l.Bb(1),l.Kc("\n        ",l.gc(2,1,"conference.conf_name_error"),"\n      "))}function B(e,n){if(1&e){var t=l.Ub();l.Tb(0,"div",1),l.Ic(1,"\n  "),l.Tb(2,"h1",2),l.Ic(3),l.fc(4,"translate"),l.Sb(),l.Ic(5,"\n\n  "),l.Tb(6,"a",3),l.ac("click",(function(){return l.wc(t),l.ec().closeDialog()})),l.Ic(7,"\n    "),l.Tb(8,"mat-icon",4),l.Ic(9,"close"),l.Sb(),l.Ic(10,"\n  "),l.Sb(),l.Ic(11,"\n\n  "),l.Tb(12,"p",5),l.Ic(13),l.fc(14,"translate"),l.Sb(),l.Ic(15,"\n\n  "),l.Tb(16,"form",6),l.Ic(17,"\n    "),l.Tb(18,"mat-form-field",7),l.Ic(19,"\n      "),l.Tb(20,"mat-icon",8),l.Ic(21,"person"),l.Sb(),l.Ic(22,"\n      "),l.Ob(23,"input",9),l.fc(24,"translate"),l.Ic(25,"\n      "),l.Gc(26,C,3,3,"mat-error",10),l.Ic(27,"\n    "),l.Sb(),l.Ic(28,"\n\n    "),l.Tb(29,"mat-form-field",7),l.Ic(30,"\n      "),l.Tb(31,"mat-icon",8),l.Ic(32,"meeting_room"),l.Sb(),l.Ic(33,"\n      "),l.Ob(34,"input",11),l.fc(35,"translate"),l.Ic(36,"\n      "),l.Gc(37,N,3,3,"mat-error",10),l.Ic(38,"\n    "),l.Sb(),l.Ic(39,"\n\n    "),l.Tb(40,"button",12),l.ac("click",(function(){return l.wc(t),l.ec().createRoom()})),l.Ic(41),l.fc(42,"translate"),l.Sb(),l.Ic(43,"\n  "),l.Sb(),l.Ic(44,"\n"),l.Sb()}if(2&e){var i=l.ec();l.kc("dir",i.rtlDirection?"rtl":"ltr"),l.Bb(3),l.Kc("\n    ",l.gc(4,11,"conference.create_or_join_conference"),"\n  "),l.Bb(3),l.kc("ngClass",i.rtlDirection?"left-full":"right-full"),l.Bb(7),l.Kc("\n    ",l.gc(14,13,"conference.for_create_conf_fill_inputs"),"\n  "),l.Bb(3),l.kc("formGroup",i.form),l.Bb(7),l.lc("placeholder",l.gc(24,15,"login_info.username")),l.Bb(3),l.kc("ngIf",!i.form.get("username").valid&&i.form.get("username").touched),l.Bb(8),l.lc("placeholder",l.gc(35,17,"conference.conf_name")),l.Bb(3),l.kc("ngIf",!i.form.get("confname").valid&&i.form.get("confname").touched),l.Bb(3),l.kc("disabled",!i.form.valid),l.Bb(1),l.Kc("\n      ",l.gc(42,19,"global.submit"),"\n    ")}}var D=function(e){function n(n,t,i,o,r,c){var s=e.call(this,t,o)||this;return s.viewDirection=n,s.injector=t,s.fb=i,s.userInfoService=o,s.dialogRef=r,s.data=c,s._subscription=new a.Subscription,s._subscription.add(s.viewDirection.currentDirection.subscribe((function(e){return s.rtlDirection=e}))),s}return _(n,e),n.prototype.ngOnInit=function(){this.createForm()},n.prototype.createForm=function(){this.form=this.fb.group({username:new y.e(this.loggedInUser.email.replace("@dabacenter.ir","")),confname:new y.e("")})},n.prototype.createRoom=function(){this.form.valid&&this.dialogRef.close(this.form.value)},n.prototype.closeDialog=function(){this.dialogRef.close(null)},n.\u0275fac=function(e){return new(e||n)(l.Nb(f.a),l.Nb(l.t),l.Nb(y.d),l.Nb(I.a),l.Nb(S.e),l.Nb(S.a))},n.\u0275cmp=l.Hb({type:n,selectors:[["app-conference-add"]],features:[l.yb],decls:2,vars:1,consts:[["class","pos-abs left-0 right-0 top-0 bottom-0 padding-full z-index-99",3,"dir",4,"ngIf"],[1,"pos-abs","left-0","right-0","top-0","bottom-0","padding-full","z-index-99",3,"dir"],[1,"margin-b-full","font-full-em","text-weight-500"],[1,"pos-abs","top-full","cursor-pointer","text-gray-600",3,"ngClass","click"],[1,"text-grey-500"],[1,"no-margin","font-9-em","text-gray-700"],["autocomplete","off",1,"full-height",3,"formGroup"],[1,"full-width","font-full-em","margin-b-full"],["matPrefix","",1,"text-gray-500"],["autoFocus","","autocomplete","off","dir","ltr","formControlName","username","matInput","","readonly","","required","","tabindex","1","type","text",1,"text-left","padding-mini-r-l",3,"placeholder"],[4,"ngIf"],["autoFocus","","autocomplete","off","dir","ltr","formControlName","confname","matInput","","required","","tabindex","1","type","text",1,"text-left","padding-mini-r-l",3,"placeholder"],["mat-raised-button","","tabindex","3",1,"green-gradient","full-width","text-white","line-height-30","font-9-em","text-weight-normal",3,"disabled","click"]],template:function(e,n){1&e&&(l.Gc(0,B,45,21,"div",0),l.Ic(1,"\n")),2&e&&l.kc("ngIf",n.form)},directives:[r.k,u.b,r.i,m.a,y.v,y.o,y.i,x.c,x.g,y.c,k.b,y.n,y.g,y.t,T.b,x.b],pipes:[c.c],encapsulation:2}),n}(w.a),O=t("mrmJ"),F=t("Z4Gg"),M=t("UXJo"),W=function(){var e=function(n,t){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var t in n)Object.prototype.hasOwnProperty.call(n,t)&&(e[t]=n[t])})(n,t)};return function(n,t){function i(){this.constructor=n}e(n,t),n.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}}(),E=["webFrame"];function V(e,n){if(1&e){var t=l.Ub();l.Tb(0,"div",7),l.Ic(1,"\n      "),l.Tb(2,"button",8),l.ac("click",(function(){return l.wc(t),l.ec().addNewVideoConf()})),l.Ic(3,"\n        "),l.Tb(4,"span",9),l.Ic(5),l.fc(6,"translate"),l.Sb(),l.Ic(7,"\n      "),l.Sb(),l.Ic(8,"\n    "),l.Sb()}2&e&&(l.Bb(5),l.Jc(l.gc(6,1,"conference.add")))}var z=function(e){return{showFrame:e}};function G(e,n){if(1&e&&(l.Rb(0),l.Ic(1,"\n      "),l.Ob(2,"webview",10,11),l.Ic(4,"\n    "),l.Qb()),2&e){var t=l.ec();l.Bb(2),l.kc("ngClass",l.oc(1,z,!t.showFrame))}}function L(e,n){if(1&e&&(l.Ic(0,"\n      "),l.Ob(1,"iframe",12,11),l.Ic(3,"\n    ")),2&e){var t=l.ec();l.Bb(1),l.kc("ngClass",l.oc(1,z,!t.showFrame))}}function P(e,n){if(1&e){var t=l.Ub();l.Tb(0,"div",13),l.Ic(1,"\n    "),l.Tb(2,"button",14),l.ac("click",(function(){return l.wc(t),l.ec().copyInClipBoard()})),l.Ic(3,"\n      "),l.Tb(4,"mat-icon",15),l.Ic(5,"content_copy"),l.Sb(),l.Ic(6,"\n      "),l.Ic(7,"\n    "),l.Sb(),l.Ic(8,"\n\n    "),l.Tb(9,"button",16),l.ac("click",(function(){return l.wc(t),l.ec().exitOfConference()})),l.Ic(10,"\n      "),l.Tb(11,"mat-icon",17),l.Ic(12,"close"),l.Sb(),l.Ic(13,"\n      "),l.Ic(14,"\n    "),l.Sb(),l.Ic(15,"\n  "),l.Sb()}if(2&e){var i=l.ec();l.kc("dir",i.rtlDirection?"rtl":"ltr")("ngClass",i.rtlDirection?"left-half":"right-half"),l.Bb(2),l.kc("cdkCopyToClipboard",i.confAddress)}}function R(e,n){1&e&&(l.Tb(0,"div",18),l.Ic(1,"\n    "),l.Tb(2,"div",19),l.Ic(3,"\n      "),l.dc(),l.Tb(4,"svg",20),l.Ic(5,"\n        "),l.Tb(6,"rect",21),l.Ic(7,"\n          "),l.Ob(8,"animate",22),l.Ic(9,"\n          "),l.Ob(10,"animate",23),l.Ic(11,"\n        "),l.Sb(),l.Ic(12,"\n        "),l.Tb(13,"rect",24),l.Ic(14,"\n          "),l.Ob(15,"animate",25),l.Ic(16,"\n          "),l.Ob(17,"animate",26),l.Ic(18,"\n        "),l.Sb(),l.Ic(19,"\n        "),l.Tb(20,"rect",27),l.Ic(21,"\n          "),l.Ob(22,"animate",28),l.Ic(23,"\n          "),l.Ob(24,"animate",29),l.Ic(25,"\n        "),l.Sb(),l.Ic(26,"\n      "),l.Sb(),l.Ic(27,"\n\n      "),l.cc(),l.Tb(28,"span",30),l.Ic(29),l.fc(30,"translate"),l.Sb(),l.Ic(31,"\n    "),l.Sb(),l.Ic(32,"\n  "),l.Sb()),2&e&&(l.Bb(29),l.Jc(l.gc(30,1,"global.loading")))}var j=function(e){function n(n,t,i,o,r,c,s,l,b,d){var f=e.call(this,t,r)||this;return f.dialog=n,f.injector=t,f.messageService=i,f.webViewService=o,f.userInfoService=r,f.electronService=c,f.translateService=s,f.viewDirection=l,f.windowManagerService=b,f.loadingIndicatorService=d,f.loadingIndicator={status:!1,serviceName:"videoConference"},f.showFrame=!1,f.confAddress="",f.reloadWebView=!1,f._subscription=new a.Subscription,f._subscription.add(f.loadingIndicatorService.currentLoadingStatus.subscribe((function(e){return f.loadingIndicator=e}))),f._subscription.add(f.viewDirection.currentDirection.subscribe((function(e){return f.rtlDirection=e}))),f._subscription.add(f.webViewService.currentRefreshWebView.subscribe((function(e){if(f.reloadWebView=e,f.reloadWebView&&f.webFrame)if(f.isElectron)f.webFrame.nativeElement.reloadIgnoringCache();else{var n=f.webFrame.nativeElement.getAttribute("src");f.webFrame.nativeElement.setAttribute("src","");var t=Date.now();setTimeout((function(){f.webFrame.nativeElement.setAttribute("src",n+"&var="+t)}),500)}}))),f}return W(n,e),n.prototype.addNewVideoConf=function(){var e=this,n=this.dialog.open(D,{autoFocus:!1,width:"350px",height:"280px",data:{action:"add"}});this._subscription.add(n.afterOpened().subscribe((function(){e.windowManagerService.dialogOnTop(n.id)}))),this._subscription.add(n.afterClosed().subscribe((function(n){if(n){e.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"videoConference"}),e.confAddress=n.confname;var t=Date.now();e.webFrame.nativeElement.setAttribute("src",g.a.CONF_URL+"?username="+n.username+"&confname="+n.confname+"&lang="+(e.rtlDirection?"fa":"en")+"&darkMode="+e.loggedInUser.dark_mode+"&var="+t),e.isElectron?(e.webFrame.nativeElement.addEventListener("did-start-loading",(function(){e.electronService.remote.webContents.fromId(e.webFrame.nativeElement.getWebContentsId()).session.clearCache(),e.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"videoConference"})})),e.webFrame.nativeElement.addEventListener("did-stop-loading",(function(){e.loadingIndicatorService.changeLoadingStatus({status:!1,serviceName:"videoConference"})}))):e.loadingIndicatorService.changeLoadingStatus({status:!1,serviceName:"videoConference"}),setTimeout((function(){return e.showFrame=!0}))}})))},Object.defineProperty(n.prototype,"isElectron",{get:function(){return this.electronService.isElectron},enumerable:!1,configurable:!0}),n.prototype.copyInClipBoard=function(){var e=this.getTranslate("conference.added_to_clipboard");this.messageService.showMessage(e)},n.prototype.exitOfConference=function(){this.webFrame.nativeElement.setAttribute("src",""),this.isElectron&&this.webFrame.nativeElement.stop(),this.showFrame=!1},n.prototype.getTranslate=function(e){return this.translateService.instant(e)},n.prototype.ngOnDestroy=function(){this._subscription&&this._subscription.unsubscribe()},n.\u0275fac=function(e){return new(e||n)(l.Nb(S.b),l.Nb(l.t),l.Nb(h.a),l.Nb(b),l.Nb(I.a),l.Nb(v.a),l.Nb(c.d),l.Nb(f.a),l.Nb(d.a),l.Nb(O.a))},n.\u0275cmp=l.Hb({type:n,selectors:[["app-conference-main"]],viewQuery:function(e,n){var t;1&e&&l.Oc(E,!0),2&e&&l.rc(t=l.bc())&&(n.webFrame=t.first)},features:[l.yb],decls:17,vars:5,consts:[[1,"full-width","full-height","bg-white","pos-rel"],[1,"content-container","full-width","full-height","display-flex","flex-center"],["class","width-200",4,"ngIf"],[4,"ngIf","ngIfElse"],["iframe",""],["class","copy-clipboard-container pos-abs bottom-7-em display-flex",3,"dir","ngClass",4,"ngIf"],["class","loading-container pos-abs top-0 left-0 bottom-0 right-0 full-width full-height flex-center z-index-9999",4,"ngIf"],[1,"width-200"],["mat-raised-button","",1,"blue-gradient","full-width","padding-mini-r-l","text-white","line-height-30","font-9-em","overflow-hide","text-weight-normal",3,"click"],[1,"padding-mini-r-l"],[1,"webView-frame","full-width","full-height",3,"ngClass"],["webFrame",""],["allow","camera;microphone;fullscreen","loading","lazy","sandbox","allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation","allowfullscreen","",1,"webView-frame","full-width","full-height","no-border",3,"ngClass"],[1,"copy-clipboard-container","pos-abs","bottom-7-em","display-flex",3,"dir","ngClass"],["mat-raised-button","",1,"white-gradient","mat-elevation-z1","padding-mini-r-l","margin-mini-r-l","text-gray-700","line-height-20","font-7-em","overflow-hide","text-weight-normal","flex-center",3,"cdkCopyToClipboard","click"],[1,"text-green-600","width-18","height-18","line-height-18","font-8-rem"],["mat-raised-button","",1,"red-gradient","mat-elevation-z1","padding-mini-r-l","text-white","line-height-20","font-7-em","overflow-hide","text-weight-normal","flex-center",3,"click"],[1,"width-18","height-18","line-height-18","font-8-rem"],[1,"loading-container","pos-abs","top-0","left-0","bottom-0","right-0","full-width","full-height","flex-center","z-index-9999"],[1,"text-center"],["height","30px","id","Layer_1","version","1.1","viewBox","0 0 24 30","width","24px","x","0px",0,"xml","space","preserve","xmlns","http://www.w3.org/2000/svg","y","0px",2,"enable-background","new 0 0 50 50"],["fill","#333","height","5","width","4","x","0","y","13"],["attributeName","height","attributeType","XML","begin","0s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],["fill","#333","height","5","width","4","x","10","y","13"],["attributeName","height","attributeType","XML","begin","0.15s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0.15s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],["fill","#333","height","5","width","4","x","20","y","13"],["attributeName","height","attributeType","XML","begin","0.3s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0.3s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],[1,"display-block","font-8-em","text-gray-700"]],template:function(e,n){if(1&e&&(l.Tb(0,"div",0),l.Ic(1,"\n  "),l.Tb(2,"div",1),l.Ic(3,"\n    "),l.Gc(4,V,9,3,"div",2),l.Ic(5,"\n\n    "),l.Gc(6,G,5,3,"ng-container",3),l.Ic(7,"\n    "),l.Gc(8,L,4,3,"ng-template",null,4,l.Hc),l.Ic(10,"\n\n  "),l.Sb(),l.Ic(11,"\n\n  "),l.Gc(12,P,16,3,"div",5),l.Ic(13,"\n\n  "),l.Gc(14,R,33,3,"div",6),l.Ic(15,"\n"),l.Sb(),l.Ic(16,"\n")),2&e){var t=l.sc(9);l.Bb(4),l.kc("ngIf",!n.showFrame),l.Bb(2),l.kc("ngIf",n.isElectron)("ngIfElse",t),l.Bb(6),l.kc("ngIf",n.showFrame),l.Bb(2),l.kc("ngIf",n.loadingIndicator.status&&"videoConference"===n.loadingIndicator.serviceName)}},directives:[r.k,T.b,F.a,r.i,u.b,M.a,m.a],pipes:[c.c],styles:[".webView-frame.showFrame[_ngcontent-%COMP%]{position:absolute!important;width:0!important;height:0!important}.copy-clipboard-container.bottom-7-em[_ngcontent-%COMP%]{bottom:.7em}.copy-clipboard-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{min-width:25px!important;width:25px!important}"]}),n}(w.a);function A(e,n){if(1&e&&(l.Ic(0,"\n      "),l.Tb(1,"h3",12),l.Ic(2,"\n        "),l.Tb(3,"mat-icon",13),l.Ic(4),l.Sb(),l.Ic(5),l.Sb(),l.Ic(6,"\n    ")),2&e){var t=l.ec();l.Bb(3),l.kc("ngClass",t.rtlDirection?"margin-l-half":"margin-r-half"),l.Bb(1),l.Jc(t.data.icon),l.Bb(1),l.Kc("\n        ",t.rtlDirection?t.data.name_fa:t.data.name,"\n      ")}}function J(e,n){if(1&e&&(l.Ic(0,"\n      "),l.Tb(1,"h3",14),l.Ic(2,"\n        "),l.Tb(3,"mat-icon",13),l.Ic(4),l.Sb(),l.Ic(5),l.Sb(),l.Ic(6,"\n    ")),2&e){var t=l.ec();l.Bb(3),l.kc("ngClass",t.rtlDirection?"margin-l-half":"margin-r-half"),l.Bb(1),l.Jc(t.data.icon),l.Bb(1),l.Kc("\n        ",t.rtlDirection?t.data.name_fa:t.data.name,"\n      ")}}function U(e,n){if(1&e){var t=l.Ub();l.Tb(0,"button",15),l.ac("click",(function(e){return l.wc(t),l.ec().minimize(),e.stopPropagation()})),l.Ic(1,"\n        "),l.Tb(2,"mat-icon",10),l.Ic(3,"\n          minimize\n        "),l.Sb(),l.Ic(4,"\n      "),l.Sb()}}function X(e,n){if(1&e){var t=l.Ub();l.Tb(0,"button",9),l.ac("click",(function(e){return l.wc(t),l.ec().restore(),e.stopPropagation()})),l.Ic(1,"\n        "),l.Tb(2,"mat-icon",10),l.Ic(3,"\n          filter_none\n        "),l.Sb(),l.Ic(4,"\n      "),l.Sb()}}function H(e,n){if(1&e){var t=l.Ub();l.Tb(0,"button",9),l.ac("click",(function(e){return l.wc(t),l.ec().maximize(),e.stopPropagation()})),l.Ic(1,"\n        "),l.Tb(2,"mat-icon",10),l.Ic(3,"\n          crop_square\n        "),l.Sb(),l.Ic(4,"\n      "),l.Sb()}}var K=function(){function e(e,n,t){var i=this;this.webViewService=e,this.viewDirection=n,this.windowManagerService=t,this._subscription=new a.Subscription,this._subscription.add(this.viewDirection.currentDirection.subscribe((function(e){return i.rtlDirection=e})))}return e.prototype.ngOnInit=function(){var e=this;this._subscription.add(this.windowManagerService.windowsList.subscribe((function(n){e.windowInstance=n.filter((function(n){return n.windowService.service_name===e.data.service_name})).pop()})))},e.prototype.activeWindow=function(){this.windowManagerService.activeWindow(this.data)},e.prototype.minimize=function(){this.windowManagerService.minimizeWindow(this.data)},e.prototype.maximize=function(){this.windowManagerService.maximizeWindow(this.data)},e.prototype.restore=function(){this.windowManagerService.restoreWindow(this.data)},e.prototype.close=function(){this.windowManagerService.closeWindow(this.data)},e.prototype.centerWindow=function(){this.windowManagerService.centerWindow()},e.prototype.reload=function(){this.webViewService.changeRefreshWebView(!0)},e.prototype.ngOnDestroy=function(){this._subscription&&this._subscription.unsubscribe()},e.\u0275fac=function(n){return new(n||e)(l.Nb(b),l.Nb(f.a),l.Nb(d.a))},e.\u0275cmp=l.Hb({type:e,selectors:[["app-conference-window"]],decls:38,vars:7,consts:[[1,"pos-abs","left-0","right-0","bottom-0","top-0","full-width",3,"dir","click"],["cdkDrag","","cdkDragBoundary",".dashboard-app-boundary","cdkDragRootElement",".cdk-overlay-pane",1,"window-heading","full-width","height-45","padding-mini-r-l","display-flex","align-items-center",3,"dblclick"],[3,"ngIfElse","ngIf"],["notDraggableHeading",""],[1,"window-actions","display-flex",3,"ngClass"],[1,"width-30","height-30","text-center","line-height-25","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em","flex-center",3,"click"],[1,"text-dark-mode-color","line-height-23","text-center","font-9-em","text-gray-600","text-weight-bold"],["class","width-30 height-30 text-center line-height-25 no-padding no-border no-bg cursor-pointer font-full-plus-two-tenth-em",3,"click",4,"ngIf"],["class","width-30 height-30 text-center line-height-35 no-padding no-border no-bg cursor-pointer font-full-plus-two-tenth-em",3,"click",4,"ngIf"],[1,"width-30","height-30","text-center","line-height-35","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em",3,"click"],[1,"text-dark-mode-color","full-width","full-height","text-center","font-9-em","text-gray-600","text-weight-bold"],[1,"window-content","pos-rel"],["cdkDragHandle","",1,"window-title","full-width","full-height","font-full-plus-one-tenth-em","text-dark-mode-color","display-flex","align-items-center","no-margin"],[1,"text-dark-mode-color","pos-rel",3,"ngClass"],[1,"window-title","full-width","font-full-plus-one-tenth-em","text-dark-mode-color","display-flex","align-items-center","no-margin"],[1,"width-30","height-30","text-center","line-height-25","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em",3,"click"]],template:function(e,n){if(1&e&&(l.Tb(0,"div",0),l.ac("click",(function(){return n.activeWindow()})),l.Ic(1,"\n  "),l.Tb(2,"div",1),l.ac("dblclick",(function(){return n.windowInstance.isMaximized?n.restore():n.maximize()})),l.Ic(3,"\n    "),l.Gc(4,A,7,3,"ng-template",2),l.Ic(5,"\n\n    "),l.Gc(6,J,7,3,"ng-template",null,3,l.Hc),l.Ic(8,"\n\n    "),l.Tb(9,"div",4),l.Ic(10,"\n      "),l.Ic(11,"\n      "),l.Tb(12,"button",5),l.ac("click",(function(e){return n.reload(),e.stopPropagation()})),l.Ic(13,"\n        "),l.Tb(14,"mat-icon",6),l.Ic(15,"\n          refresh\n        "),l.Sb(),l.Ic(16,"\n      "),l.Sb(),l.Ic(17,"\n      "),l.Gc(18,U,5,0,"button",7),l.Ic(19,"\n      "),l.Gc(20,X,5,0,"button",8),l.Ic(21,"\n      "),l.Gc(22,H,5,0,"button",8),l.Ic(23,"\n      "),l.Tb(24,"button",9),l.ac("click",(function(e){return n.close(),e.stopPropagation()})),l.Ic(25,"\n        "),l.Tb(26,"mat-icon",10),l.Ic(27,"close\n        "),l.Sb(),l.Ic(28,"\n      "),l.Sb(),l.Ic(29,"\n    "),l.Sb(),l.Ic(30,"\n  "),l.Sb(),l.Ic(31,"\n  "),l.Tb(32,"div",11),l.Ic(33,"\n    "),l.Ob(34,"app-conference-main"),l.Ic(35,"\n  "),l.Sb(),l.Ic(36,"\n"),l.Sb(),l.Ic(37,"\n")),2&e){var t=l.sc(7);l.kc("dir",n.rtlDirection?"rtl":"ltr"),l.Bb(4),l.kc("ngIfElse",t)("ngIf",n.windowInstance.isDraggable),l.Bb(5),l.kc("ngClass",n.rtlDirection?" margin-r-auto":" margin-l-auto"),l.Bb(9),l.kc("ngIf",!n.windowInstance.isMinimized),l.Bb(2),l.kc("ngIf",n.windowInstance.isMaximized||n.windowInstance.isMinimized),l.Bb(2),l.kc("ngIf",!n.windowInstance.isMaximized&&!n.windowInstance.isMinimized)}},directives:[u.b,p.a,r.k,r.i,m.a,j,p.b],encapsulation:2}),e}(),q=function(){function e(e){this.componentFactoryResolver=e}return e.prototype.resolveComponent=function(){return this.componentFactoryResolver.resolveComponentFactory(K)},e.\u0275mod=l.Lb({type:e}),e.\u0275inj=l.Kb({factory:function(n){return new(n||e)(l.Xb(l.j))},imports:[[r.c,o.a,c.b.forChild({})]]}),e}()}}]);