(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{mrmJ:function(e,t,i){"use strict";i.d(t,"a",(function(){return r}));var n=i("7RJT"),o=i("fXoL");let r=(()=>{class e{constructor(){this._loadingStatus={status:!1,serviceName:""},this.loadingStatus=new n.BehaviorSubject(this._loadingStatus),this.currentLoadingStatus=this.loadingStatus.asObservable()}changeLoadingStatus(e){this.loadingStatus.next(e)}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=o.Mb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()},uhCW:function(e,t,i){"use strict";i.r(t),i.d(t,"ConferenceModule",(function(){return O}));var n=i("PCNd"),o=i("ofXK"),r=i("sYmb"),a=i("zB/H"),c=i("fXoL"),s=i("7RJT");let l=(()=>{class e{constructor(){this._refreshWebView=!1,this.refreshWebView=new s.BehaviorSubject(this._refreshWebView),this.currentRefreshWebView=this.refreshWebView.asObservable()}changeRefreshWebView(e){this.refreshWebView.next(e),e&&setTimeout(()=>this.changeRefreshWebView(!1),500)}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=c.Mb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var d=i("unh5"),b=i("0d0Z"),h=i("cH1L"),u=i("5+WD"),f=i("NFeN"),m=i("AytR"),g=i("ue6I"),p=i("3Pt+"),w=i("0IaG"),v=i("DDyt"),x=i("kmnG"),W=i("qFsG"),C=i("bTqV");function V(e,t){1&e&&(c.Wb(0,"mat-error"),c.Jc(1),c.jc(2,"translate"),c.Vb()),2&e&&(c.Cb(1),c.Lc(" ",c.kc(2,1,"login_info.username_error")," "))}function y(e,t){1&e&&(c.Wb(0,"mat-error"),c.Jc(1),c.jc(2,"translate"),c.Vb()),2&e&&(c.Cb(1),c.Lc(" ",c.kc(2,1,"conference.conf_name_error")," "))}function k(e,t){if(1&e){const e=c.Xb();c.Wb(0,"div",1),c.Wb(1,"h1",2),c.Jc(2),c.jc(3,"translate"),c.Vb(),c.Wb(4,"a",3),c.ec("click",(function(){return c.zc(e),c.ic().closeDialog()})),c.Wb(5,"mat-icon",4),c.Jc(6,"close"),c.Vb(),c.Vb(),c.Wb(7,"p",5),c.Jc(8),c.jc(9,"translate"),c.Vb(),c.Wb(10,"form",6),c.Wb(11,"mat-form-field",7),c.Wb(12,"mat-icon",8),c.Jc(13,"person"),c.Vb(),c.Rb(14,"input",9),c.jc(15,"translate"),c.Hc(16,V,3,3,"mat-error",10),c.Vb(),c.Wb(17,"mat-form-field",7),c.Wb(18,"mat-icon",8),c.Jc(19,"meeting_room"),c.Vb(),c.Rb(20,"input",11),c.jc(21,"translate"),c.Hc(22,y,3,3,"mat-error",10),c.Vb(),c.Wb(23,"button",12),c.ec("click",(function(){return c.zc(e),c.ic().createRoom()})),c.Jc(24),c.jc(25,"translate"),c.Vb(),c.Vb(),c.Vb()}if(2&e){const e=c.ic();c.oc("dir",e.rtlDirection?"rtl":"ltr"),c.Cb(2),c.Lc(" ",c.kc(3,11,"conference.create_or_join_conference")," "),c.Cb(2),c.oc("ngClass",e.rtlDirection?"left-full":"right-full"),c.Cb(4),c.Lc(" ",c.kc(9,13,"conference.for_create_conf_fill_inputs")," "),c.Cb(2),c.oc("formGroup",e.form),c.Cb(4),c.pc("placeholder",c.kc(15,15,"login_info.username")),c.Cb(2),c.oc("ngIf",!e.form.get("username").valid&&e.form.get("username").touched),c.Cb(4),c.pc("placeholder",c.kc(21,17,"conference.conf_name")),c.Cb(2),c.oc("ngIf",!e.form.get("confname").valid&&e.form.get("confname").touched),c.Cb(1),c.oc("disabled",!e.form.valid),c.Cb(1),c.Lc(" ",c.kc(25,19,"global.submit")," ")}}let I=(()=>{class e extends g.a{constructor(e,t,i,n,o,r){super(t,n),this.viewDirection=e,this.injector=t,this.fb=i,this.userInfoService=n,this.dialogRef=o,this.data=r,this._subscription=new a.Subscription,this._subscription.add(this.viewDirection.currentDirection.subscribe(e=>this.rtlDirection=e))}ngOnInit(){this.createForm()}createForm(){this.form=this.fb.group({username:new p.g(this.loggedInUser.email.replace("@dabacenter.ir","")),confname:new p.g("")})}createRoom(){this.form.valid&&this.dialogRef.close(this.form.value)}closeDialog(){this.dialogRef.close(null)}}return e.\u0275fac=function(t){return new(t||e)(c.Qb(d.a),c.Qb(c.s),c.Qb(p.f),c.Qb(v.a),c.Qb(w.h),c.Qb(w.a))},e.\u0275cmp=c.Kb({type:e,selectors:[["app-conference-add"]],features:[c.zb],decls:1,vars:1,consts:[["class","pos-abs left-0 right-0 top-0 bottom-0 padding-full z-index-99",3,"dir",4,"ngIf"],[1,"pos-abs","left-0","right-0","top-0","bottom-0","padding-full","z-index-99",3,"dir"],[1,"margin-b-full","font-full-em","text-weight-500"],[1,"pos-abs","top-full","cursor-pointer","text-gray-600",3,"ngClass","click"],[1,"text-grey-500"],[1,"no-margin","font-9-em","text-gray-700"],[1,"full-height",3,"formGroup"],[1,"full-width","font-full-em","margin-b-full"],["matPrefix","",1,"text-gray-500"],["autoFocus","","autocomplete","off","dir","ltr","formControlName","username","matInput","","readonly","","required","","tabindex","1","type","text",1,"text-left","padding-mini-r-l",3,"placeholder"],[4,"ngIf"],["autoFocus","","autocomplete","off","dir","ltr","formControlName","confname","matInput","","required","","tabindex","1","type","text",1,"text-left","padding-mini-r-l",3,"placeholder"],["mat-raised-button","","tabindex","3",1,"green-gradient","full-width","text-white","line-height-30","font-9-em","text-weight-normal",3,"disabled","click"]],template:function(e,t){1&e&&c.Hc(0,k,26,21,"div",0),2&e&&c.oc("ngIf",t.form)},directives:[o.t,h.b,o.q,f.a,p.I,p.t,p.k,x.c,x.i,p.c,W.b,p.s,p.i,p.D,C.b,x.b],pipes:[r.d],encapsulation:2}),e})();var _=i("XiUW"),S=i("mrmJ"),D=i("UXJo");const z=["webFrame"];function F(e,t){if(1&e){const e=c.Xb();c.Wb(0,"div",7),c.Wb(1,"button",8),c.ec("click",(function(){return c.zc(e),c.ic().addNewVideoConf()})),c.Wb(2,"span",9),c.Jc(3),c.jc(4,"translate"),c.Vb(),c.Vb(),c.Vb()}2&e&&(c.Cb(3),c.Kc(c.kc(4,1,"conference.add")))}function J(e,t){if(1&e){const e=c.Xb();c.Wb(0,"div",10),c.Wb(1,"button",11),c.ec("click",(function(){return c.zc(e),c.ic().exitOfConference()})),c.Wb(2,"mat-icon",12),c.Jc(3,"close"),c.Vb(),c.Wb(4,"span",9),c.Jc(5),c.jc(6,"translate"),c.Vb(),c.Vb(),c.Wb(7,"button",13),c.ec("click",(function(){return c.zc(e),c.ic().copyInClipBoard()})),c.Wb(8,"mat-icon",14),c.Jc(9,"content_copy"),c.Vb(),c.Wb(10,"span",9),c.Jc(11),c.jc(12,"translate"),c.Vb(),c.Vb(),c.Vb()}if(2&e){const e=c.ic();c.oc("dir",e.rtlDirection?"rtl":"ltr"),c.Cb(5),c.Kc(c.kc(6,4,"conference.exist_from_conf")),c.Cb(2),c.oc("cdkCopyToClipboard",e.confAddress),c.Cb(4),c.Kc(c.kc(12,6,"conference.copy_address"))}}function M(e,t){1&e&&(c.Wb(0,"div",15),c.Wb(1,"div",16),c.hc(),c.Wb(2,"svg",17),c.Wb(3,"rect",18),c.Rb(4,"animate",19),c.Rb(5,"animate",20),c.Vb(),c.Wb(6,"rect",21),c.Rb(7,"animate",22),c.Rb(8,"animate",23),c.Vb(),c.Wb(9,"rect",24),c.Rb(10,"animate",25),c.Rb(11,"animate",26),c.Vb(),c.Vb(),c.gc(),c.Wb(12,"span",27),c.Jc(13),c.jc(14,"translate"),c.Vb(),c.Vb(),c.Vb()),2&e&&(c.Cb(13),c.Kc(c.kc(14,1,"global.loading")))}const L=function(e){return{showFrame:e}};let R=(()=>{class e extends g.a{constructor(e,t,i,n,o,r,c,s,l){super(t,o),this.dialog=e,this.injector=t,this.messageService=i,this.webViewService=n,this.userInfoService=o,this.translateService=r,this.viewDirection=c,this.windowManagerService=s,this.loadingIndicatorService=l,this.loadingIndicator={status:!1,serviceName:"videoConference"},this.showFrame=!1,this.confAddress="",this.reloadWebView=!1,this._subscription=new a.Subscription,this._subscription.add(this.loadingIndicatorService.currentLoadingStatus.subscribe(e=>this.loadingIndicator=e)),this._subscription.add(this.viewDirection.currentDirection.subscribe(e=>this.rtlDirection=e)),this._subscription.add(this.webViewService.currentRefreshWebView.subscribe(e=>{if(this.reloadWebView=e,this.reloadWebView&&this.webFrame)try{this.webFrame.nativeElement.reloadIgnoringCache()}catch(t){}}))}addNewVideoConf(){const e=this.dialog.open(I,{autoFocus:!1,width:"350px",height:"280px",data:{action:"add"}});this.windowManagerService.dialogOnTop(e.id),this._subscription.add(e.afterClosed().subscribe(e=>{if(e){this.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"videoConference"}),this.confAddress=e.confname;const t=`${m.a.CONF_URL}?username=${e.username}&confname=${e.confname}&lang=${this.rtlDirection?"fa":"en"}&darkMode=${this.loggedInUser.dark_mode}`;this.webFrame&&(this.webFrame.nativeElement.setAttribute("src",t),this.webFrame.nativeElement.addEventListener("did-start-loading",()=>{this.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"videoConference"})}),this.webFrame.nativeElement.addEventListener("did-stop-loading",()=>{this.loadingIndicatorService.changeLoadingStatus({status:!1,serviceName:"videoConference"})}),setTimeout(()=>this.showFrame=!0))}}))}copyInClipBoard(){const e=this.getTranslate("conference.added_to_clipboard");this.messageService.showMessage(e)}exitOfConference(){this.webFrame.nativeElement.setAttribute("src",""),this.webFrame.nativeElement.stop(),this.showFrame=!1}getTranslate(e){return this.translateService.instant(e)}ngOnDestroy(){this._subscription&&this._subscription.unsubscribe()}}return e.\u0275fac=function(t){return new(t||e)(c.Qb(w.b),c.Qb(c.s),c.Qb(_.a),c.Qb(l),c.Qb(v.a),c.Qb(r.e),c.Qb(d.a),c.Qb(b.a),c.Qb(S.a))},e.\u0275cmp=c.Kb({type:e,selectors:[["app-conference-main"]],viewQuery:function(e,t){var i;1&e&&c.Pc(z,!0),2&e&&c.uc(i=c.fc())&&(t.webFrame=i.first)},features:[c.zb],decls:7,vars:6,consts:[[1,"full-width","full-height","bg-white","pos-rel"],[1,"content-container","full-width","full-height","display-flex","flex-center"],["class","width-200",4,"ngIf"],[1,"webView-frame","full-width","full-height",3,"ngClass"],["webFrame",""],["class","copy-clipboard-container pos-abs bottom-half",3,"dir",4,"ngIf"],["class","loading-container pos-abs top-0 left-0 bottom-0 right-0 full-width full-height flex-center z-index-9999",4,"ngIf"],[1,"width-200"],["mat-raised-button","",1,"blue-gradient","full-width","padding-mini-r-l","text-white","line-height-30","font-9-em","overflow-hide","text-weight-normal",3,"click"],[1,"padding-mini-r-l"],[1,"copy-clipboard-container","pos-abs","bottom-half",3,"dir"],["mat-raised-button","",1,"red-gradient","mat-elevation-z1","padding-mini-r-l","margin-mini-r-l","text-white","line-height-20","font-7-em","overflow-hide","text-weight-normal",3,"click"],[1,"width-18","height-18","line-height-18","font-8-rem"],["mat-raised-button","",1,"white-gradient","mat-elevation-z1","padding-mini-r-l","text-gray-700","line-height-20","font-7-em","overflow-hide","text-weight-normal",3,"cdkCopyToClipboard","click"],[1,"text-green-600","width-18","height-18","line-height-18","font-8-rem"],[1,"loading-container","pos-abs","top-0","left-0","bottom-0","right-0","full-width","full-height","flex-center","z-index-9999"],[1,"text-center"],["height","30px","id","Layer_1","version","1.1","viewBox","0 0 24 30","width","24px","x","0px",0,"xml","space","preserve","xmlns","http://www.w3.org/2000/svg","y","0px",2,"enable-background","new 0 0 50 50"],["fill","#333","height","5","width","4","x","0","y","13"],["attributeName","height","attributeType","XML","begin","0s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],["fill","#333","height","5","width","4","x","10","y","13"],["attributeName","height","attributeType","XML","begin","0.15s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0.15s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],["fill","#333","height","5","width","4","x","20","y","13"],["attributeName","height","attributeType","XML","begin","0.3s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0.3s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],[1,"display-block","font-8-em","text-gray-700"]],template:function(e,t){1&e&&(c.Wb(0,"div",0),c.Wb(1,"div",1),c.Hc(2,F,5,3,"div",2),c.Rb(3,"iframe",3,4),c.Vb(),c.Hc(5,J,13,8,"div",5),c.Hc(6,M,15,3,"div",6),c.Vb()),2&e&&(c.Cb(2),c.oc("ngIf",!t.showFrame),c.Cb(1),c.oc("ngClass",c.rc(4,L,!t.showFrame)),c.Cb(2),c.oc("ngIf",t.showFrame),c.Cb(1),c.oc("ngIf",t.loadingIndicator.status&&"videoConference"===t.loadingIndicator.serviceName))},directives:[o.t,o.q,C.b,h.b,f.a,D.a],pipes:[r.d],styles:[".webView-frame.showFrame[_ngcontent-%COMP%]{position:absolute!important;width:0!important;height:0!important}"]}),e})();function N(e,t){if(1&e&&(c.Wb(0,"h3",11),c.Wb(1,"mat-icon",12),c.Jc(2),c.Vb(),c.Jc(3),c.Vb()),2&e){const e=c.ic();c.Cb(1),c.oc("ngClass",e.rtlDirection?"margin-l-half":"margin-r-half"),c.Cb(1),c.Kc(e.data.icon),c.Cb(1),c.Lc(" ",e.rtlDirection?e.data.name_fa:e.data.name," ")}}function Q(e,t){if(1&e&&(c.Wb(0,"h3",13),c.Wb(1,"mat-icon",12),c.Jc(2),c.Vb(),c.Jc(3),c.Vb()),2&e){const e=c.ic();c.Cb(1),c.oc("ngClass",e.rtlDirection?"margin-l-half":"margin-r-half"),c.Cb(1),c.Kc(e.data.icon),c.Cb(1),c.Lc(" ",e.rtlDirection?e.data.name_fa:e.data.name," ")}}function j(e,t){if(1&e){const e=c.Xb();c.Wb(0,"button",14),c.ec("click",(function(t){return c.zc(e),c.ic().minimize(),t.stopPropagation()})),c.Wb(1,"mat-icon",6),c.Jc(2," minimize "),c.Vb(),c.Vb()}}function T(e,t){if(1&e){const e=c.Xb();c.Wb(0,"button",9),c.ec("click",(function(t){return c.zc(e),c.ic().restore(),t.stopPropagation()})),c.Wb(1,"mat-icon",6),c.Jc(2," filter_none "),c.Vb(),c.Vb()}}function X(e,t){if(1&e){const e=c.Xb();c.Wb(0,"button",9),c.ec("click",(function(t){return c.zc(e),c.ic().maximize(),t.stopPropagation()})),c.Wb(1,"mat-icon",6),c.Jc(2," crop_square "),c.Vb(),c.Vb()}}let H=(()=>{class e{constructor(e,t,i){this.webViewService=e,this.viewDirection=t,this.windowManagerService=i,this._subscription=new a.Subscription,this._subscription.add(this.viewDirection.currentDirection.subscribe(e=>this.rtlDirection=e))}ngOnInit(){this._subscription.add(this.windowManagerService.windowsList.subscribe(e=>{this.windowInstance=e.filter(e=>e.windowService.serviceTitle===this.data.serviceTitle).pop()}))}activeWindow(){this.windowManagerService.activeWindow(this.data)}minimize(){this.windowManagerService.minimizeWindow(this.data)}maximize(){this.windowManagerService.maximizeWindow(this.data)}restore(){this.windowManagerService.restoreWindow(this.data)}close(){this.windowManagerService.closeWindow(this.data)}centerWindow(){this.windowManagerService.centerWindow()}reload(){this.webViewService.changeRefreshWebView(!0)}ngOnDestroy(){this._subscription&&this._subscription.unsubscribe()}}return e.\u0275fac=function(t){return new(t||e)(c.Qb(l),c.Qb(d.a),c.Qb(b.a))},e.\u0275cmp=c.Kb({type:e,selectors:[["app-conference-window"]],decls:17,vars:7,consts:[[1,"pos-abs","left-0","right-0","bottom-0","top-0","full-width",3,"dir","click"],["cdkDrag","","cdkDragBoundary",".dashboard-app-boundary","cdkDragRootElement",".cdk-overlay-pane",1,"window-heading","full-width","height-45","padding-mini-r-l","display-flex","align-items-center",3,"dblclick"],[3,"ngIfElse","ngIf"],["notDraggableHeading",""],[1,"window-actions","display-flex",3,"ngClass"],[1,"width-30","height-30","text-center","line-height-25","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em","display-flex","align-items-center",3,"click"],[1,"text-dark-mode-color","full-width","full-height","text-center","font-9-em","text-gray-600","text-weight-bold"],["class","width-30 height-30 text-center line-height-25 no-padding no-border no-bg cursor-pointer font-full-plus-two-tenth-em",3,"click",4,"ngIf"],["class","width-30 height-30 text-center line-height-35 no-padding no-border no-bg cursor-pointer font-full-plus-two-tenth-em",3,"click",4,"ngIf"],[1,"width-30","height-30","text-center","line-height-35","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em",3,"click"],[1,"window-content","pos-rel"],["cdkDragHandle","",1,"window-title","full-width","full-height","font-full-plus-one-tenth-em","text-dark-mode-color","display-flex","align-items-center","no-margin"],[1,"text-dark-mode-color","pos-rel",3,"ngClass"],[1,"window-title","full-width","font-full-plus-one-tenth-em","text-dark-mode-color","display-flex","align-items-center","no-margin"],[1,"width-30","height-30","text-center","line-height-25","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em",3,"click"]],template:function(e,t){if(1&e&&(c.Wb(0,"div",0),c.ec("click",(function(){return t.activeWindow()})),c.Wb(1,"div",1),c.ec("dblclick",(function(){return t.windowInstance.isMaximized?t.restore():t.maximize()})),c.Hc(2,N,4,3,"ng-template",2),c.Hc(3,Q,4,3,"ng-template",null,3,c.Ic),c.Wb(5,"div",4),c.Wb(6,"button",5),c.ec("click",(function(e){return t.reload(),e.stopPropagation()})),c.Wb(7,"mat-icon",6),c.Jc(8," refresh "),c.Vb(),c.Vb(),c.Hc(9,j,3,0,"button",7),c.Hc(10,T,3,0,"button",8),c.Hc(11,X,3,0,"button",8),c.Wb(12,"button",9),c.ec("click",(function(e){return t.close(),e.stopPropagation()})),c.Wb(13,"mat-icon",6),c.Jc(14,"close "),c.Vb(),c.Vb(),c.Vb(),c.Vb(),c.Wb(15,"div",10),c.Rb(16,"app-conference-main"),c.Vb(),c.Vb()),2&e){const e=c.vc(4);c.oc("dir",t.rtlDirection?"rtl":"ltr"),c.Cb(2),c.oc("ngIfElse",e)("ngIf",t.windowInstance.isDraggable),c.Cb(3),c.oc("ngClass",t.rtlDirection?" margin-r-auto":" margin-l-auto"),c.Cb(4),c.oc("ngIf",!t.windowInstance.isMinimized),c.Cb(1),c.oc("ngIf",t.windowInstance.isMaximized||t.windowInstance.isMinimized),c.Cb(1),c.oc("ngIf",!t.windowInstance.isMaximized&&!t.windowInstance.isMinimized)}},directives:[h.b,u.a,o.t,o.q,f.a,R,u.b],encapsulation:2}),e})(),O=(()=>{class e{constructor(e){this.componentFactoryResolver=e}resolveComponent(){return this.componentFactoryResolver.resolveComponentFactory(H)}}return e.\u0275mod=c.Ob({type:e}),e.\u0275inj=c.Nb({factory:function(t){return new(t||e)(c.ac(c.j))},imports:[[o.c,n.a,r.c.forChild({})]]}),e})()}}]);