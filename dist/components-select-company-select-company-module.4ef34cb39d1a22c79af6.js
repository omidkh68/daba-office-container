(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"9U9y":function(t,n,e){"use strict";e.r(n),e.d(n,"SelectCompanyModule",(function(){return P}));var o,i=e("PCNd"),r=e("tyNb"),c=e("ofXK"),a=e("sYmb"),l=e("AytR"),s=e("EEPM"),p=e("zB/H"),g=e("ue6I"),u=e("DDyt"),f=e("dJ3e"),b=e("ISpo"),m=e("unh5"),h=e("Qjjq"),y=e("R0Ic"),d=e("fXoL"),v=e("cH1L"),w=e("MutI"),_=e("NFeN"),O=(o=function(t,n){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])})(t,n)},function(t,n){function e(){this.constructor=t}o(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}),S=function(){return(S=Object.assign||function(t){for(var n,e=1,o=arguments.length;e<o;e++)for(var i in n=arguments[e])Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i]);return t}).apply(this,arguments)},C=function(t){return{"margin-b-full":t}};function I(t,n){if(1&t){var e=d.Ub();d.Tb(0,"mat-list-item",7),d.ac("click",(function(){d.wc(e);var t=n.$implicit;return d.ec().goHome(t)})),d.Ic(1,"\n        "),d.Tb(2,"div",8),d.Ic(3,"\n          "),d.Tb(4,"span",9),d.Ic(5),d.Sb(),d.Ic(6,"\n\n          "),d.Tb(7,"div",10),d.Ic(8,"\n            "),d.Tb(9,"mat-icon",11),d.Ic(10),d.Sb(),d.Ic(11,"\n          "),d.Sb(),d.Ic(12,"\n        "),d.Sb(),d.Ic(13,"\n      "),d.Sb()}if(2&t){var o=n.$implicit,i=n.index,r=d.ec();d.kc("dir",r.rtlDirection?"rtl":"ltr")("ngClass",d.oc(4,C,i!==r.companies.length-1)),d.Bb(5),d.Jc(o.name),d.Bb(5),d.Kc("\n              ",r.rtlDirection?"keyboard_arrow_left":"keyboard_arrow_right","\n            ")}}var k=function(t){function n(n,e,o,i,r,c,a,l){var s=t.call(this,e,i)||this;return s.router=n,s.injector=e,s.apiService=o,s.userInfoService=i,s.electronService=r,s.refreshLoginService=c,s.viewDirectionService=a,s.companySelectorService=l,s.companies=[],s.showBackLink=!1,s._subscription=new p.Subscription,s._subscription.add(s.viewDirectionService.currentDirection.subscribe((function(t){return s.rtlDirection=t}))),s}return O(n,t),n.prototype.ngOnInit=function(){this.getUserCompanies()},n.prototype.getUserCompanies=function(){var t=this;this.loginData&&this.loginData.token_type&&(this.apiService.accessToken=this.loginData.token_type+" "+this.loginData.access_token),this._subscription.add(this.apiService.getUserCompanies().subscribe((function(n){n.success&&(t.companies=n.data,setTimeout((function(){return t.showBackLink=!0}),500),1===t.companies.length&&t.changeSelectedCompany(t.companies[0]).then((function(){t.router.navigateByUrl("/").finally()})))}),(function(){t.userInfoService.changeLoginData(null),t.router.navigateByUrl("/login").finally()})))},n.prototype.getLoginDataAndWriteCompanyInfo=function(t){var n=this;return new Promise((function(e,o){try{var i=void 0,r=void 0;if(n.electronService.isElectron){var c=l.a.production?n.electronService.remote.app.getPath("userData"):n.electronService.remote.app.getAppPath();r=n.electronService.path.join(c,"loginData.txt"),i=n.electronService.fs.readFileSync(r,"utf8")}else i=localStorage.getItem("loginData");if(i){var a=JSON.parse(i);a=S(S({},a),{company:t}),n.electronService.isElectron?n.electronService.fs.writeFileSync(r,JSON.stringify(a)):localStorage.setItem("loginData",JSON.stringify(a)),e(!0)}else o(!1)}catch(s){o(!1)}}))},n.prototype.changeSelectedCompany=function(t){var n=this;return new Promise((function(e){n.getLoginDataAndWriteCompanyInfo(t).then((function(){n.companySelectorService.changeSelectedCompany(t),e(!0)}))}))},n.prototype.goHome=function(t){var n=this;this.changeSelectedCompany(t).then((function(){n.router.navigateByUrl("/").finally()}))},n.prototype.goToLogin=function(){var t=this;this.userInfoService.changeLoginData(null),setTimeout((function(){return t.showBackLink=!1}),500),this.router.navigateByUrl("/login").finally()},n.prototype.ngOnDestroy=function(){this._subscription&&this._subscription.unsubscribe()},n.\u0275fac=function(t){return new(t||n)(d.Nb(r.a),d.Nb(d.t),d.Nb(s.a),d.Nb(u.a),d.Nb(f.a),d.Nb(b.a),d.Nb(m.a),d.Nb(h.a))},n.\u0275cmp=d.Hb({type:n,selectors:[["app-select-company"]],features:[d.yb],decls:28,vars:11,consts:[[1,"background-gradient","full-width-screen","full-height-screen","display-flex","flex-center",3,"dir"],[1,"thirty-width","display-flex","pos-rel"],[1,"pos-abs","top-full-2-reverse","no-margin","full-width","text-white","font-full-plus-half-em"],[1,"full-width"],["class","company-item pos-rel cursor-pointer height-70 mat-elevation-z3 bg-white round-corner transition overflow-hide",3,"dir","ngClass","click",4,"ngFor","ngForOf"],[1,"pos-abs","bottom-full-reverse-2",3,"ngClass"],[1,"display-flex","text-white","align-items-center","cursor-pointer",3,"click"],[1,"company-item","pos-rel","cursor-pointer","height-70","mat-elevation-z3","bg-white","round-corner","transition","overflow-hide",3,"dir","ngClass","click"],[1,"padding-full","display-flex","flex-space-between","full-height","align-items-center","full-width"],[1,"company-name","transition"],[1,"arrow-container","pos-rel","display-flex","align-items-center","overflow-hide","width-35","height-50"],[1,"arrow","transition","font-full-em-3","full-width","full-height","pos-abs","text-green-500"]],template:function(t,n){1&t&&(d.Tb(0,"div",0),d.Ic(1,"\n  "),d.Tb(2,"div",1),d.Ic(3,"\n    "),d.Tb(4,"h1",2),d.Ic(5),d.fc(6,"translate"),d.Sb(),d.Ic(7,"\n\n    "),d.Tb(8,"mat-list",3),d.Ic(9,"\n      "),d.Gc(10,I,14,6,"mat-list-item",4),d.Ic(11,"\n    "),d.Sb(),d.Ic(12,"\n\n    "),d.Tb(13,"div",5),d.Ic(14,"\n      "),d.Tb(15,"a",6),d.ac("click",(function(){return n.goToLogin()})),d.Ic(16,"\n        "),d.Tb(17,"mat-icon"),d.Ic(18),d.Sb(),d.Ic(19,"\n\n        "),d.Tb(20,"span"),d.Ic(21),d.fc(22,"translate"),d.Sb(),d.Ic(23,"\n      "),d.Sb(),d.Ic(24,"\n    "),d.Sb(),d.Ic(25,"\n  "),d.Sb(),d.Ic(26,"\n"),d.Sb(),d.Ic(27,"\n")),2&t&&(d.kc("dir",n.rtlDirection?"rtl":"ltr"),d.Bb(5),d.Kc("\n      ",d.gc(6,7,"select_company.title"),"\n    "),d.Bb(3),d.kc("@listAnimation",n.companies.length),d.Bb(2),d.kc("ngForOf",n.companies),d.Bb(3),d.kc("ngClass",n.showBackLink?"":"display-none"),d.Bb(5),d.Jc(n.rtlDirection?"keyboard_arrow_right":"keyboard_arrow_left"),d.Bb(3),d.Jc(d.gc(22,9,"select_company.back_to_login")))},directives:[v.b,w.a,c.j,c.i,_.a,w.d],pipes:[a.c],styles:['.background-gradient[_ngcontent-%COMP%]{background-image:linear-gradient(120deg,#743c97,#f43b47)}.top-full-2-reverse[_ngcontent-%COMP%]{top:-2em!important}.bottom-full-reverse-2[_ngcontent-%COMP%]{bottom:-3em!important}.company-item[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;bottom:0;width:0;background-color:#4caf50;transition:all .4s}.company-item[dir=rtl][_ngcontent-%COMP%]:before{right:0}.company-item[dir=rtl][_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]{right:-100px}.company-item[dir=ltr][_ngcontent-%COMP%]:before{left:0}.company-item[dir=ltr][_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]{left:-100px}.company-item[_ngcontent-%COMP%]   .arrow[_ngcontent-%COMP%]{opacity:0}.company-item[_ngcontent-%COMP%]:hover{box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.company-item[_ngcontent-%COMP%]:hover:before{width:10px}.company-item[_ngcontent-%COMP%]:hover   .arrow[_ngcontent-%COMP%]{opacity:1;-webkit-animation:show-arrow 1s linear;animation:show-arrow 1s linear}.company-item[_ngcontent-%COMP%]:hover[dir=rtl]{padding-right:10px}.company-item[_ngcontent-%COMP%]:hover[dir=rtl]   .arrow[_ngcontent-%COMP%]{right:0}.company-item[_ngcontent-%COMP%]:hover[dir=ltr]{padding-left:10px}.company-item[_ngcontent-%COMP%]:hover[dir=ltr]   .arrow[_ngcontent-%COMP%]{left:0}.company-item[_ngcontent-%COMP%]:hover   .company-name[_ngcontent-%COMP%]{font-weight:700}@-webkit-keyframes show-arrow{0%{opacity:0}33.33333%{opacity:.5}to{opacity:1}}@keyframes show-arrow{0%{opacity:0}33.33333%{opacity:.5}to{opacity:1}}'],data:{animation:[Object(y.n)("listAnimation",[Object(y.m)("* => *",[Object(y.h)(":leave",[Object(y.j)(100,[Object(y.e)("0.2s",Object(y.l)({opacity:0}))])],{optional:!0}),Object(y.h)(":enter",[Object(y.l)({opacity:0}),Object(y.j)(100,[Object(y.e)("0.2s",Object(y.l)({opacity:1}))])],{optional:!0})])])]}}),n}(g.a),P=function(){function t(){}return t.\u0275mod=d.Lb({type:t}),t.\u0275inj=d.Kb({factory:function(n){return new(n||t)},imports:[[c.c,i.a,r.b.forChild([{path:"",component:k}]),a.b.forChild()]]}),t}()}}]);