(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{iPSC:function(t,e,i){"use strict";i.r(e),i.d(e,"WebBrowserModule",(function(){return k}));var n=i("PCNd"),r=i("ofXK"),a=i("sYmb"),o=i("zB/H"),s=i("fXoL"),c=i("0d0Z"),d=i("unh5"),l=i("cH1L"),b=i("5+WD"),u=i("NFeN"),h=i("0IaG"),g=i("mrmJ"),w=i("Z4Gg");const f=["webFrame"];function m(t,e){1&t&&(s.Wb(0,"div",8),s.Wb(1,"div",9),s.hc(),s.Wb(2,"svg",10),s.Wb(3,"rect",11),s.Rb(4,"animate",12),s.Rb(5,"animate",13),s.Vb(),s.Wb(6,"rect",14),s.Rb(7,"animate",15),s.Rb(8,"animate",16),s.Vb(),s.Wb(9,"rect",17),s.Rb(10,"animate",18),s.Rb(11,"animate",19),s.Vb(),s.Vb(),s.gc(),s.Wb(12,"span",20),s.Jc(13),s.jc(14,"translate"),s.Vb(),s.Vb(),s.Vb()),2&t&&(s.Cb(13),s.Kc(s.kc(14,1,"global.loading")))}let p=(()=>{class t{constructor(t,e,i,n){this.dialog=t,this.translateService=e,this.viewDirection=i,this.loadingIndicatorService=n,this.currentUrl="https://www.google.com",this.loadingIndicator=null,this._subscription=new o.Subscription,this._subscription.add(this.loadingIndicatorService.currentLoadingStatus.subscribe(t=>this.loadingIndicator=t)),this._subscription.add(this.viewDirection.currentDirection.subscribe(t=>this.rtlDirection=t))}ngAfterViewInit(){this.webFrame&&(this.webFrame.nativeElement.setAttribute("src","https://www.google.com"),this.webFrame.nativeElement.addEventListener("did-start-loading",()=>{this.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"webBrowser"})}),this.webFrame.nativeElement.addEventListener("did-stop-loading",()=>{this.loadingIndicatorService.changeLoadingStatus({status:!1,serviceName:"webBrowser"})}))}enterAddress(t){this.currentUrl=t.target.value,"Enter"===t.key&&(this.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"webBrowser"}),this.webFrame.nativeElement.setAttribute("src",""+this.currentUrl),this.webFrame.nativeElement.addEventListener("did-start-loading",()=>{this.loadingIndicatorService.changeLoadingStatus({status:!0,serviceName:"webBrowser"})}))}reloadWebView(){this.webFrame&&this.webFrame.nativeElement.reloadIgnoringCache()}getTranslate(t){return this.translateService.instant(t)}ngOnDestroy(){this._subscription&&this._subscription.unsubscribe()}}return t.\u0275fac=function(e){return new(e||t)(s.Qb(h.b),s.Qb(a.e),s.Qb(d.a),s.Qb(g.a))},t.\u0275cmp=s.Kb({type:t,selectors:[["app-web-browser-main"]],viewQuery:function(t,e){var i;1&t&&s.Pc(f,!0),2&t&&s.uc(i=s.fc())&&(e.webFrame=i.first)},decls:10,vars:3,consts:[[1,"full-width","full-height","bg-white","pos-rel"],[1,"height-50","address-bar-container","display-flex","flex-space-between"],[1,"reload-btn","round-corner-all","no-padding","display-flex","flex-center","cursor-pointer","bg-white",3,"ngClass","click"],["placeholder","Type a URL","type","text",1,"no-box-shadow","btn-rounded","full-height","padding-r-l","font-9-em",3,"value","focus","keyup"],["addressBar",""],[1,"webView-frame","full-width","height-full-minus-50"],["webFrame",""],["class","loading-container pos-abs top-0 left-0 bottom-0 right-0 full-width full-height flex-center z-index-9999",4,"ngIf"],[1,"loading-container","pos-abs","top-0","left-0","bottom-0","right-0","full-width","full-height","flex-center","z-index-9999"],[1,"text-center"],["height","30px","id","Layer_1","version","1.1","viewBox","0 0 24 30","width","24px","x","0px",0,"xml","space","preserve","xmlns","http://www.w3.org/2000/svg","y","0px",2,"enable-background","new 0 0 50 50"],["fill","#333","height","5","width","4","x","0","y","13"],["attributeName","height","attributeType","XML","begin","0s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],["fill","#333","height","5","width","4","x","10","y","13"],["attributeName","height","attributeType","XML","begin","0.15s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0.15s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],["fill","#333","height","5","width","4","x","20","y","13"],["attributeName","height","attributeType","XML","begin","0.3s","dur","0.6s","repeatCount","indefinite","values","5;21;5"],["attributeName","y","attributeType","XML","begin","0.3s","dur","0.6s","repeatCount","indefinite","values","13; 5; 13"],[1,"display-block","font-8-em","text-gray-700"]],template:function(t,e){if(1&t){const t=s.Xb();s.Wb(0,"div",0),s.Wb(1,"div",1),s.Wb(2,"a",2),s.ec("click",(function(){return e.reloadWebView()})),s.Wb(3,"mat-icon"),s.Jc(4,"refresh"),s.Vb(),s.Vb(),s.Wb(5,"input",3,4),s.ec("focus",(function(){return s.zc(t),s.vc(6).select()}))("keyup",(function(t){return e.enterAddress(t)})),s.Vb(),s.Vb(),s.Rb(7,"webview",5,6),s.Hc(9,m,15,3,"div",7),s.Vb()}2&t&&(s.Cb(2),s.oc("ngClass",e.rtlDirection?"margin-l-half":"margin-r-half"),s.Cb(3),s.oc("value",e.currentUrl),s.Cb(4),s.oc("ngIf",e.loadingIndicator&&e.loadingIndicator.status&&"webBrowser"===e.loadingIndicator.serviceName))},directives:[r.q,u.a,w.a,r.t],pipes:[a.d],styles:[".address-bar-container[_ngcontent-%COMP%]{border-bottom:1px solid hsla(0,0%,86.3%,.93);background-color:#f1f1f1;padding:.65em .75em}.address-bar-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{background-color:#fff;border:1px solid #ddd;width:calc(100% - 40px)}.reload-btn[_ngcontent-%COMP%]{width:32px;height:32px;border:1px solid #ddd!important}.reload-btn[_ngcontent-%COMP%]   .mat-icon[_ngcontent-%COMP%]{transform:scale(.8)}"]}),t})();function v(t,e){if(1&t&&(s.Wb(0,"h3",10),s.Wb(1,"mat-icon",11),s.Jc(2),s.Vb(),s.Jc(3),s.Vb()),2&t){const t=s.ic();s.Cb(1),s.oc("ngClass",t.rtlDirection?"margin-l-half":"margin-r-half"),s.Cb(1),s.Kc(t.data.icon),s.Cb(1),s.Lc(" ",t.rtlDirection?t.data.name_fa:t.data.name," ")}}function x(t,e){if(1&t&&(s.Wb(0,"h3",12),s.Wb(1,"mat-icon",11),s.Jc(2),s.Vb(),s.Jc(3),s.Vb()),2&t){const t=s.ic();s.Cb(1),s.oc("ngClass",t.rtlDirection?"margin-l-half":"margin-r-half"),s.Cb(1),s.Kc(t.data.icon),s.Cb(1),s.Lc(" ",t.rtlDirection?t.data.name_fa:t.data.name," ")}}function y(t,e){if(1&t){const t=s.Xb();s.Wb(0,"button",13),s.ec("click",(function(e){return s.zc(t),s.ic().minimize(),e.stopPropagation()})),s.Wb(1,"mat-icon",8),s.Jc(2," minimize "),s.Vb(),s.Vb()}}function W(t,e){if(1&t){const t=s.Xb();s.Wb(0,"button",7),s.ec("click",(function(e){return s.zc(t),s.ic().restore(),e.stopPropagation()})),s.Wb(1,"mat-icon",8),s.Jc(2," filter_none "),s.Vb(),s.Vb()}}function C(t,e){if(1&t){const t=s.Xb();s.Wb(0,"button",7),s.ec("click",(function(e){return s.zc(t),s.ic().maximize(),e.stopPropagation()})),s.Wb(1,"mat-icon",8),s.Jc(2," crop_square "),s.Vb(),s.Vb()}}let I=(()=>{class t{constructor(t,e){this.windowManagerService=t,this.viewDirection=e,this._subscription=new o.Subscription,this._subscription.add(this.viewDirection.currentDirection.subscribe(t=>this.rtlDirection=t))}ngOnInit(){this._subscription.add(this.windowManagerService.windowsList.subscribe(t=>{this.windowInstance=t.filter(t=>t.windowService.serviceTitle===this.data.serviceTitle).pop()}))}activeWindow(){this.windowManagerService.activeWindow(this.data)}minimize(){this.windowManagerService.minimizeWindow(this.data)}maximize(){this.windowManagerService.maximizeWindow(this.data)}restore(){this.windowManagerService.restoreWindow(this.data)}close(){this.windowManagerService.closeWindow(this.data)}centerWindow(){this.windowManagerService.centerWindow()}ngOnDestroy(){this._subscription&&this._subscription.unsubscribe()}}return t.\u0275fac=function(e){return new(e||t)(s.Qb(c.a),s.Qb(d.a))},t.\u0275cmp=s.Kb({type:t,selectors:[["app-web-browser-window"]],decls:14,vars:7,consts:[[1,"pos-abs","left-0","right-0","bottom-0","top-0","full-width",3,"dir","click"],["cdkDrag","","cdkDragBoundary",".dashboard-app-boundary","cdkDragRootElement",".cdk-overlay-pane",1,"window-heading","full-width","height-45","padding-mini-r-l","display-flex","align-items-center",3,"dblclick"],[3,"ngIfElse","ngIf"],["notDraggableHeading",""],[1,"window-actions","display-flex",3,"ngClass"],["class","width-30 height-30 text-center line-height-25 no-padding no-border no-bg cursor-pointer font-full-plus-two-tenth-em",3,"click",4,"ngIf"],["class","width-30 height-30 text-center line-height-35 no-padding no-border no-bg cursor-pointer font-full-plus-two-tenth-em",3,"click",4,"ngIf"],[1,"width-30","height-30","text-center","line-height-35","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em",3,"click"],[1,"text-dark-mode-color","full-width","full-height","text-center","font-9-em","text-gray-600","text-weight-bold"],[1,"window-content","pos-rel"],["cdkDragHandle","",1,"window-title","full-width","full-height","font-full-plus-one-tenth-em","text-dark-mode-color","display-flex","align-items-center","no-margin"],[1,"text-dark-mode-color","pos-rel",3,"ngClass"],[1,"window-title","full-width","font-full-plus-one-tenth-em","text-dark-mode-color","display-flex","align-items-center","no-margin"],[1,"width-30","height-30","text-center","line-height-25","no-padding","no-border","no-bg","cursor-pointer","font-full-plus-two-tenth-em",3,"click"]],template:function(t,e){if(1&t&&(s.Wb(0,"div",0),s.ec("click",(function(){return e.activeWindow()})),s.Wb(1,"div",1),s.ec("dblclick",(function(){return e.windowInstance.isMaximized?e.restore():e.maximize()})),s.Hc(2,v,4,3,"ng-template",2),s.Hc(3,x,4,3,"ng-template",null,3,s.Ic),s.Wb(5,"div",4),s.Hc(6,y,3,0,"button",5),s.Hc(7,W,3,0,"button",6),s.Hc(8,C,3,0,"button",6),s.Wb(9,"button",7),s.ec("click",(function(t){return e.close(),t.stopPropagation()})),s.Wb(10,"mat-icon",8),s.Jc(11,"close "),s.Vb(),s.Vb(),s.Vb(),s.Vb(),s.Wb(12,"div",9),s.Rb(13,"app-web-browser-main"),s.Vb(),s.Vb()),2&t){const t=s.vc(4);s.oc("dir",e.rtlDirection?"rtl":"ltr"),s.Cb(2),s.oc("ngIfElse",t)("ngIf",e.windowInstance.isDraggable),s.Cb(3),s.oc("ngClass",e.rtlDirection?" margin-r-auto":" margin-l-auto"),s.Cb(1),s.oc("ngIf",!e.windowInstance.isMinimized),s.Cb(1),s.oc("ngIf",e.windowInstance.isMaximized||e.windowInstance.isMinimized),s.Cb(1),s.oc("ngIf",!e.windowInstance.isMaximized&&!e.windowInstance.isMinimized)}},directives:[l.b,b.a,r.t,r.q,u.a,p,b.b],encapsulation:2}),t})(),k=(()=>{class t{constructor(t){this.componentFactoryResolver=t}resolveComponent(){return this.componentFactoryResolver.resolveComponentFactory(I)}}return t.\u0275mod=s.Ob({type:t}),t.\u0275inj=s.Nb({factory:function(e){return new(e||t)(s.ac(s.j))},imports:[[r.c,n.a,a.c.forChild({})]]}),t})()},mrmJ:function(t,e,i){"use strict";i.d(e,"a",(function(){return a}));var n=i("7RJT"),r=i("fXoL");let a=(()=>{class t{constructor(){this._loadingStatus={status:!1,serviceName:""},this.loadingStatus=new n.BehaviorSubject(this._loadingStatus),this.currentLoadingStatus=this.loadingStatus.asObservable()}changeLoadingStatus(t){this.loadingStatus.next(t)}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275prov=r.Mb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})()}}]);