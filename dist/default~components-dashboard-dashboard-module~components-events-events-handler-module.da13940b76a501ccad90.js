(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{C6zf:function(e,i,t){"use strict";t.d(i,"a",(function(){return r}));var n=t("tk/3"),a=t("AytR"),o=t("fXoL"),r=function(){function e(e){this.http=e,this.accessToken="",this.API_URL=a.a.EVENT_HANDLER_URL,this.headers={headers:new n.c({"Content-Type":"application/json; charset=UTF-8",Accept:"application/json; charset=UTF-8"})}}return e.prototype.getAllActionType=function(){return this.http.get(this.API_URL+"/actionType/getAllActionType")},e.prototype.addNewEvent=function(e){return this.http.post(this.API_URL+"/AddEvent",e)},e.prototype.addNewReminder=function(e){return this.http.post(this.API_URL+"/reminder/AddReminder",e)},e.prototype.getAllReminderType=function(){return this.http.get(this.API_URL+"/reminderType/getAllReminderType")},e.prototype.getAllStatusType=function(){return this.http.get(this.API_URL+"/statusReminderType/getAllStatusType")},e.prototype.getEventByEmail=function(e){return this.http.post(this.API_URL+"/getEventByEmail/?date="+e.date+"&email="+e.email,null)},e.prototype.deleteEventById=function(e){return this.http.delete(this.API_URL+"/deleteEvent/?id="+e,this.headers)},e.prototype.deleteReminderById=function(e){return this.http.delete(this.API_URL+"/reminder/deleteReminder/?id="+e,this.headers)},e.\u0275fac=function(i){return new(i||e)(o.Xb(n.a))},e.\u0275prov=o.Jb({token:e,factory:e.\u0275fac,providedIn:"root"}),e}()},FD2y:function(e,i,t){"use strict";t.d(i,"a",(function(){return R}));var n=t("wd/R"),a=t("BCsW"),o=t("zB/H"),r=t("C6zf"),c=t("OVb6"),m=t("+Ibf"),s=t("0d0Z"),u=t("unh5"),l=t("gaxV"),y=t("pjkF"),d=t("fXoL"),z=t("0IaG"),A=t("cH1L"),h=t("ofXK"),f=t("TFyl"),g=t("MutI"),p=t("bTqV"),v=t("NFeN"),b=t("FKr1"),k=t("sYmb"),S=t("K3ar"),_=["picker"],D=["insideElement"],T=["dateCalendar"];function I(e,i){if(1&e&&(d.Tb(0,"mat-list-item"),d.Ic(1,"\n            "),d.Tb(2,"mat-icon",13),d.Ic(3,"access_alarm"),d.Sb(),d.Ic(4,"\n            "),d.Tb(5,"div",14),d.Ic(6),d.Sb(),d.Ic(7,"\n            "),d.Tb(8,"div",15),d.Ic(9),d.fc(10,"jalali"),d.Sb(),d.Ic(11,"\n          "),d.Sb()),2&e){var t=i.$implicit;d.Bb(6),d.Jc(t.description),d.Bb(3),d.Jc(d.gc(10,2,t.startReminder))}}function C(e,i){if(1&e){var t=d.Ub();d.Tb(0,"div"),d.Ic(1,"\n      "),d.Tb(2,"mat-list",7),d.Ic(3,"\n        "),d.Tb(4,"div",8),d.Ic(5),d.fc(6,"translate"),d.Tb(7,"b",9),d.Ic(8),d.fc(9,"translate"),d.Sb(),d.Ic(10,"\n        "),d.Sb(),d.Ic(11,"\n        "),d.Tb(12,"div"),d.Ic(13,"\n          "),d.Gc(14,I,12,4,"mat-list-item",10),d.Ic(15,"\n        "),d.Sb(),d.Ic(16,"\n      "),d.Sb(),d.Ic(17,"\n      "),d.Tb(18,"button",11),d.ac("click",(function(){return d.wc(t),d.ec(2).showEventHandlerWindow(null,!0)})),d.Ic(19,"\n        "),d.Tb(20,"span",12),d.Ic(21),d.fc(22,"translate"),d.Sb(),d.Ic(23,"\n      "),d.Sb(),d.Ic(24,"\n    "),d.Sb()}if(2&e){var n=d.ec(2);d.Bb(5),d.Kc("",d.gc(6,5,"dashboard.dashboard_toolbar.reminder"),"\n          "),d.Bb(3),d.Lc("",d.gc(9,7,"events_handler.main.reminder_count"),"\n            : ",n.events_reminders.reminders.length,"\n          "),d.Bb(6),d.kc("ngForOf",n.events_reminders.reminders.slice(0,3)),d.Bb(7),d.Jc(d.gc(22,9,"events_handler.main.see_more"))}}function w(e,i){if(1&e&&(d.Tb(0,"mat-list-item"),d.Ic(1,"\n            "),d.Tb(2,"mat-icon",13),d.Ic(3,"access_alarm"),d.Sb(),d.Ic(4,"\n            "),d.Tb(5,"div",14),d.Ic(6),d.Sb(),d.Ic(7,"\n            "),d.Tb(8,"div",15),d.Ic(9),d.fc(10,"jalali"),d.Sb(),d.Ic(11,"\n          "),d.Sb()),2&e){var t=i.$implicit,n=d.ec(4);d.Bb(6),d.Jc(t.description),d.Bb(3),d.Jc(d.hc(10,2,t.startReminder,n.rtlDirection))}}function B(e,i){if(1&e&&(d.Tb(0,"mat-list",18),d.Ic(1,"\n        "),d.Tb(2,"div",19),d.Ic(3),d.fc(4,"translate"),d.Tb(5,"b",9),d.Ic(6),d.fc(7,"translate"),d.Sb(),d.Ic(8,"\n        "),d.Sb(),d.Ic(9,"\n        "),d.Tb(10,"div",20),d.Ic(11,"\n          "),d.Gc(12,w,12,5,"mat-list-item",10),d.Ic(13,"\n        "),d.Sb(),d.Ic(14,"\n      "),d.Sb()),2&e){var t=d.ec(3);d.Bb(3),d.Kc("",d.gc(4,4,"dashboard.dashboard_toolbar.reminder"),"\n          "),d.Bb(3),d.Lc("",d.gc(7,6,"events_handler.main.reminder_count"),"\n            : ",t.events_reminders.reminders.length,""),d.Bb(6),d.kc("ngForOf",t.events_reminders.reminders)}}function E(e,i){if(1&e&&(d.Tb(0,"div",16),d.Ic(1,"\n      "),d.Gc(2,B,15,8,"mat-list",17),d.Ic(3,"\n    "),d.Sb()),2&e){var t=d.ec(2);d.Bb(2),d.kc("ngIf",t.events_reminders&&t.events_reminders.reminders.length)}}function M(e,i){if(1&e&&(d.Tb(0,"div",4),d.Ic(1,"\n\n    "),d.Gc(2,C,25,11,"div",5),d.Ic(3,"\n\n    "),d.Gc(4,E,4,1,"div",6),d.Ic(5,"\n  "),d.Sb()),2&e){var t=d.ec();d.Bb(2),d.kc("ngIf",t.serviceList),d.Bb(2),d.kc("ngIf",!t.serviceList)}}var P=function(e){return{"calendar-rtl":e}},R=function(){function e(e,i,t,n,a,r,c,m){var s=this;this.dialog=e,this.elemRef=i,this.eventApi=t,this.viewDirection=n,this.datetimeService=a,this.eventHandlerService=r,this.eventHandlerSocketService=c,this.windowManagerService=m,this.rtlDirection=!1,this.serviceList=[],this.events_reminders={events:[],reminders:[]},this.datePickerConfig=null,this._subscription=new o.Subscription,this._subscription.add(this.viewDirection.currentDirection.subscribe((function(e){s.rtlDirection=e,s.setupCalendar()}))),this._subscription.add(this.eventHandlerService.currentEventsReminderList.subscribe((function(e){e&&(s.events_reminders.events=e.events,s.events_reminders.reminders=e.reminders)})))}return e.prototype.ngOnInit=function(){this.eventHandlerSocketService.initializeWebSocketConnection().then((function(e){}))},e.prototype.ngAfterViewInit=function(){this.getEvents()},e.prototype.setupCalendar=function(){var e=this;setTimeout((function(){e.datePickerConfig={locale:e.rtlDirection?"fa":"en",dayBtnCssClassCallback:function(i){e.dayBtnCssClassCallback(i)}};var i=e.rtlDirection?a(e.datetimeService.getDateByTimezoneReturnDate(new Date)):n(e.datetimeService.getDateByTimezoneReturnDate(new Date));e.datePickerDirective.api.moveCalendarTo(i)}))},e.prototype.dayBtnCssClassCallback=function(e){var i=this;this.events_reminders.events.length&&setTimeout((function(){var t=i.rtlDirection?e.locale("fa").format("YYYY/M/D"):e.locale("en").format("DD-MM-YYYY"),n=document.querySelector("#"+i.indexID+' .dp-calendar-day[data-date="'+t+'"]');if(n){var a=0;i.events_reminders.events.map((function(t){i.datetimeService.getDateByTimezoneReturnDate(t.startDate).toLocaleDateString()==e._d.toLocaleDateString()&&(a<1&&n.insertAdjacentHTML("beforeend","<div data-objects='"+JSON.stringify(t)+"' class='event-point'></div>"),a++)}))}}))},e.prototype.eventClick=function(e){var i=this,t=this.events_reminders.events.filter((function(t){return i.datetimeService.getDateByTimezoneReturnDate(t.startDate).toLocaleDateString()==e.date._d.toLocaleDateString()}));if(t.length){var n=this.dialog.open(l.a,{data:{eventTemp:t,rtlDirection:this.rtlDirection},autoFocus:!1,width:"400px",height:"300px"});this._subscription.add(n.afterOpened().subscribe((function(){i.windowManagerService.dialogOnTop(n.id)}))),this._subscription.add(n.afterClosed().subscribe((function(t){t&&(t.actionCallback&&"add"==t.actionCallback?(i.currentDate=i.datetimeService.getDateByTimezoneReturnDate(e.date._d),i.showEventHandlerWindow()):i.showEventHandlerWindow(t))})))}else this.currentDate=e.date._d,this.showEventHandlerWindow()},e.prototype.showEventHandlerWindow=function(e,i){if(void 0===e&&(e=null),void 0===i&&(i=!1),this.eventHandlerService.moveDay(i?null:e?this.datetimeService.getDateByTimezoneReturnDate(e.startDate):this.currentDate),this.eventHandlerService.moveEventItems(e||null),this.serviceList){var t=this.serviceList.filter((function(e){return"events_calendar"==e.service_name}));this.windowManagerService.openWindowState(t[0])}},e.prototype.onNavigationClick=function(e){this.getEvents(e.to._d)},e.prototype.getEvents=function(e){var i=this;void 0===e&&(e=null),this.events_reminders.reminders=[];var t=n(this.datetimeService.getDateByTimezoneReturnDate(new Date)).format("YYYY-MM-DD"),o=this.rtlDirection?a(this.datetimeService.getDateByTimezoneReturnDate(new Date)):n(this.datetimeService.getDateByTimezoneReturnDate(new Date));e&&(t=n(this.datetimeService.getDateByTimezoneReturnDate(e)).format("YYYY-MM-DD"),o=this.rtlDirection?a(this.datetimeService.getDateByTimezoneReturnDate(e)):n(this.datetimeService.getDateByTimezoneReturnDate(e))),this.eventHandlerSocketService.getEventsByEmail({email:this.loggedInUser.email,date:t},this.loggedInUser).then((function(e){i.events_reminders=e,setTimeout((function(){i.datePickerDirective.api.moveCalendarTo(o)}))}))},e.prototype.ngOnDestroy=function(){this._subscription&&this._subscription.unsubscribe()},e.\u0275fac=function(i){return new(i||e)(d.Nb(z.b),d.Nb(d.l),d.Nb(r.a),d.Nb(u.a),d.Nb(c.a),d.Nb(m.a),d.Nb(y.a),d.Nb(s.a))},e.\u0275cmp=d.Hb({type:e,selectors:[["app-events-handler-calendar"]],viewQuery:function(e,i){if(1&e&&(d.Nc(_,!0),d.Nc(D,!0),d.Nc(T,!0)),2&e){var t=void 0;d.rc(t=d.bc())&&(i.picker=t.first),d.rc(t=d.bc())&&(i.insideElement=t.first),d.rc(t=d.bc())&&(i.datePickerDirective=t.first)}},inputs:{loggedInUser:"loggedInUser",indexID:"indexID",rtlDirection:"rtlDirection",serviceList:"serviceList"},decls:9,vars:7,consts:[[1,"box-dark","width-240","dateCalendar-transparent","padding-full","pos-rel",3,"dir","ngClass"],["theme","dp-material",3,"config","dir","onLeftNav","onRightNav","onSelect"],["dateCalendar",""],["class","padding-t-full full-height",4,"ngIf"],[1,"padding-t-full","full-height"],[4,"ngIf"],["class","height-full-minus-45 display-flex flex-direction-column flex-space-between",4,"ngIf"],[1,"event-list"],["mat-subheader","",1,"padding-l-tiny"],[1,"font-7-rem","padding-full"],[4,"ngFor","ngForOf"],["mat-raised-button","",1,"custom-flat-button","full-width","padding-mini-r-l","line-height-30","font-9-em","overflow-hide","text-weight-normal",3,"click"],[1,"padding-mini-r-l"],["mat-list-icon","",1,"font-full-plus-three-tenth-em"],["mat-line","",1,"font-8-em"],["mat-line","",1,"font-8-rem"],[1,"height-full-minus-45","display-flex","flex-direction-column","flex-space-between"],["class","event-list height-full-minus-280","style","height: calc(100% - 280px);",4,"ngIf"],[1,"event-list","height-full-minus-280",2,"height","calc(100% - 280px)"],["mat-subheader","",1,"height-45"],[1,"height-full-minus-45","overflow-y-auto"]],template:function(e,i){1&e&&(d.Tb(0,"div",0),d.Ic(1,"\n  "),d.Tb(2,"dp-day-calendar",1,2),d.ac("onLeftNav",(function(e){return i.onNavigationClick(e)}))("onRightNav",(function(e){return i.onNavigationClick(e)}))("onSelect",(function(e){return i.eventClick(e)})),d.Ic(4,"\n  "),d.Sb(),d.Ic(5,"\n\n  "),d.Gc(6,M,6,2,"div",3),d.Ic(7,"\n"),d.Sb(),d.Ic(8,"\n")),2&e&&(d.kc("dir",i.rtlDirection?"rtl":"ltr")("ngClass",d.oc(5,P,i.rtlDirection)),d.Bb(2),d.kc("config",i.datePickerConfig)("dir",i.rtlDirection?"rtl":"ltr"),d.Bb(4),d.kc("ngIf",i.events_reminders&&i.events_reminders.reminders.length))},directives:[A.b,h.i,f.b,h.k,g.a,g.f,h.j,p.b,g.d,v.a,g.c,b.j],pipes:[k.c,S.a],encapsulation:2}),e}()},OC8m:function(e,i,t){"use strict";t.d(i,"a",(function(){return o}));var n=t("7RJT"),a=t("fXoL"),o=function(){function e(){this._notification=null,this.notification=new n.BehaviorSubject(this._notification),this.currentNotification=this.notification.asObservable()}return e.prototype.changeCurrentNotification=function(e){this.notification.next(e)},e.\u0275prov=a.Jb({token:e,factory:e.\u0275fac=function(i){return new(i||e)},providedIn:"root"}),e}()},OVb6:function(e,i,t){"use strict";t.d(i,"a",(function(){return u}));var n,a=t("BCsW"),o=[{city:"Abidjan",timezone:"Africa/Abidjan"},{city:"Accra",timezone:"Africa/Accra"},{city:"Adak",timezone:"America/Adak"},{city:"Adelaide",timezone:"Australia/Adelaide"},{city:"Algiers",timezone:"Africa/Algiers"},{city:"Almaty",timezone:"Asia/Almaty"},{city:"Amman",timezone:"Asia/Amman"},{city:"Amsterdam",timezone:"Europe/Amsterdam"},{city:"Anadyr",timezone:"Asia/Anadyr"},{city:"Anchorage",timezone:"America/Anchorage"},{city:"Andorra",timezone:"Europe/Andorra"},{city:"Apia",timezone:"Pacific/Apia"},{city:"Aqtau",timezone:"Asia/Aqtau"},{city:"Aqtobe",timezone:"Asia/Aqtobe"},{city:"Araguaina",timezone:"America/Araguaina"},{city:"Argentina",timezone:"America/Argentina/Buenos_Aires"},{city:"Argentina",timezone:"America/Argentina/Cordoba"},{city:"Argentina",timezone:"America/Argentina/Salta"},{city:"Argentina",timezone:"America/Argentina/Jujuy"},{city:"Argentina",timezone:"America/Argentina/Tucuman"},{city:"Argentina",timezone:"America/Argentina/Catamarca"},{city:"Argentina",timezone:"America/Argentina/La_Rioja"},{city:"Argentina",timezone:"America/Argentina/San_Juan"},{city:"Argentina",timezone:"America/Argentina/Mendoza"},{city:"Argentina",timezone:"America/Argentina/San_Luis"},{city:"Argentina",timezone:"America/Argentina/Rio_Gallegos"},{city:"Argentina",timezone:"America/Argentina/Ushuaia"},{city:"Ashgabat",timezone:"Asia/Ashgabat"},{city:"Astrakhan",timezone:"Europe/Astrakhan"},{city:"Asuncion",timezone:"America/Asuncion"},{city:"Athens",timezone:"Europe/Athens"},{city:"Atikokan",timezone:"America/Atikokan"},{city:"Atyrau",timezone:"Asia/Atyrau"},{city:"Auckland",timezone:"Pacific/Auckland"},{city:"Azores",timezone:"Atlantic/Azores"},{city:"Baghdad",timezone:"Asia/Baghdad"},{city:"Bahia",timezone:"America/Bahia"},{city:"Bahia_Banderas",timezone:"America/Bahia_Banderas"},{city:"Baku",timezone:"Asia/Baku"},{city:"Bangkok",timezone:"Asia/Bangkok"},{city:"Barbados",timezone:"America/Barbados"},{city:"Barnaul",timezone:"Asia/Barnaul"},{city:"Beirut",timezone:"Asia/Beirut"},{city:"Belem",timezone:"America/Belem"},{city:"Belgrade",timezone:"Europe/Belgrade"},{city:"Belize",timezone:"America/Belize"},{city:"Berlin",timezone:"Europe/Berlin"},{city:"Bermuda",timezone:"Atlantic/Bermuda"},{city:"Bishkek",timezone:"Asia/Bishkek"},{city:"Bissau",timezone:"Africa/Bissau"},{city:"Blanc",timezone:"America/Blanc-Sablon"},{city:"Boa_Vista",timezone:"America/Boa_Vista"},{city:"Bogota",timezone:"America/Bogota"},{city:"Boise",timezone:"America/Boise"},{city:"Bougainville",timezone:"Pacific/Bougainville"},{city:"Brisbane",timezone:"Australia/Brisbane"},{city:"Broken_Hill",timezone:"Australia/Broken_Hill"},{city:"Brunei",timezone:"Asia/Brunei"},{city:"Brussels",timezone:"Europe/Brussels"},{city:"Bucharest",timezone:"Europe/Bucharest"},{city:"Budapest",timezone:"Europe/Budapest"},{city:"Cairo",timezone:"Africa/Cairo"},{city:"Cambridge_Bay",timezone:"America/Cambridge_Bay"},{city:"Campo_Grande",timezone:"America/Campo_Grande"},{city:"Canary",timezone:"Atlantic/Canary"},{city:"Cancun",timezone:"America/Cancun"},{city:"Cape_Verde",timezone:"Atlantic/Cape_Verde"},{city:"Caracas",timezone:"America/Caracas"},{city:"Casablanca",timezone:"Africa/Casablanca"},{city:"Casey",timezone:"Antarctica/Casey"},{city:"Cayenne",timezone:"America/Cayenne"},{city:"Ceuta",timezone:"Africa/Ceuta"},{city:"Chagos",timezone:"Indian/Chagos"},{city:"Chatham",timezone:"Pacific/Chatham"},{city:"Chicago",timezone:"America/Chicago"},{city:"Chihuahua",timezone:"America/Chihuahua"},{city:"Chisinau",timezone:"Europe/Chisinau"},{city:"Chita",timezone:"Asia/Chita"},{city:"Choibalsan",timezone:"Asia/Choibalsan"},{city:"Christmas",timezone:"Indian/Christmas"},{city:"Chuuk",timezone:"Pacific/Chuuk"},{city:"Cocos",timezone:"Indian/Cocos"},{city:"Colombo",timezone:"Asia/Colombo"},{city:"Copenhagen",timezone:"Europe/Copenhagen"},{city:"Costa_Rica",timezone:"America/Costa_Rica"},{city:"Creston",timezone:"America/Creston"},{city:"Cuiaba",timezone:"America/Cuiaba"},{city:"Curacao",timezone:"America/Curacao"},{city:"Currie",timezone:"Australia/Currie"},{city:"Damascus",timezone:"Asia/Damascus"},{city:"Danmarkshavn",timezone:"America/Danmarkshavn"},{city:"Darwin",timezone:"Australia/Darwin"},{city:"Davis",timezone:"Antarctica/Davis"},{city:"Dawson",timezone:"America/Dawson"},{city:"Dawson_Creek",timezone:"America/Dawson_Creek"},{city:"Denver",timezone:"America/Denver"},{city:"Detroit",timezone:"America/Detroit"},{city:"Dhaka",timezone:"Asia/Dhaka"},{city:"Dili",timezone:"Asia/Dili"},{city:"Dubai",timezone:"Asia/Dubai"},{city:"Dublin",timezone:"Europe/Dublin"},{city:"DumontDUrville",timezone:"Antarctica/DumontDUrville"},{city:"Dushanbe",timezone:"Asia/Dushanbe"},{city:"Easter",timezone:"Pacific/Easter"},{city:"Edmonton",timezone:"America/Edmonton"},{city:"Efate",timezone:"Pacific/Efate"},{city:"Eirunepe",timezone:"America/Eirunepe"},{city:"El_Aaiun",timezone:"Africa/El_Aaiun"},{city:"El_Salvador",timezone:"America/El_Salvador"},{city:"Enderbury",timezone:"Pacific/Enderbury"},{city:"Eucla",timezone:"Australia/Eucla"},{city:"Fakaofo",timezone:"Pacific/Fakaofo"},{city:"Famagusta",timezone:"Asia/Famagusta"},{city:"Faroe",timezone:"Atlantic/Faroe"},{city:"Fiji",timezone:"Pacific/Fiji"},{city:"Fort_Nelson",timezone:"America/Fort_Nelson"},{city:"Fortaleza",timezone:"America/Fortaleza"},{city:"Funafuti",timezone:"Pacific/Funafuti"},{city:"Galapagos",timezone:"Pacific/Galapagos"},{city:"Gambier",timezone:"Pacific/Gambier"},{city:"Gaza",timezone:"Asia/Gaza"},{city:"Gibraltar",timezone:"Europe/Gibraltar"},{city:"Glace_Bay",timezone:"America/Glace_Bay"},{city:"Godthab",timezone:"America/Godthab"},{city:"Goose_Bay",timezone:"America/Goose_Bay"},{city:"Grand_Turk",timezone:"America/Grand_Turk"},{city:"Guadalcanal",timezone:"Pacific/Guadalcanal"},{city:"Guam",timezone:"Pacific/Guam"},{city:"Guatemala",timezone:"America/Guatemala"},{city:"Guayaquil",timezone:"America/Guayaquil"},{city:"Guyana",timezone:"America/Guyana"},{city:"Halifax",timezone:"America/Halifax"},{city:"Havana",timezone:"America/Havana"},{city:"Hebron",timezone:"Asia/Hebron"},{city:"Helsinki",timezone:"Europe/Helsinki"},{city:"Hermosillo",timezone:"America/Hermosillo"},{city:"Ho_Chi_Minh",timezone:"Asia/Ho_Chi_Minh"},{city:"Hobart",timezone:"Australia/Hobart"},{city:"Hong_Kong",timezone:"Asia/Hong_Kong"},{city:"Honolulu",timezone:"Pacific/Honolulu"},{city:"Hovd",timezone:"Asia/Hovd"},{city:"Indiana",timezone:"America/Indiana/Indianapolis"},{city:"Indiana",timezone:"America/Indiana/Vincennes"},{city:"Indiana",timezone:"America/Indiana/Winamac"},{city:"Indiana",timezone:"America/Indiana/Marengo"},{city:"Indiana",timezone:"America/Indiana/Petersburg"},{city:"Indiana",timezone:"America/Indiana/Vevay"},{city:"Indiana",timezone:"America/Indiana/Tell_City"},{city:"Indiana",timezone:"America/Indiana/Knox"},{city:"Inuvik",timezone:"America/Inuvik"},{city:"Iqaluit",timezone:"America/Iqaluit"},{city:"Irkutsk",timezone:"Asia/Irkutsk"},{city:"Istanbul",timezone:"Europe/Istanbul"},{city:"Jakarta",timezone:"Asia/Jakarta"},{city:"Jamaica",timezone:"America/Jamaica"},{city:"Jayapura",timezone:"Asia/Jayapura"},{city:"Jerusalem",timezone:"Asia/Jerusalem"},{city:"Johannesburg",timezone:"Africa/Johannesburg"},{city:"Juba",timezone:"Africa/Juba"},{city:"Juneau",timezone:"America/Juneau"},{city:"Kabul",timezone:"Asia/Kabul"},{city:"Kaliningrad",timezone:"Europe/Kaliningrad"},{city:"Kamchatka",timezone:"Asia/Kamchatka"},{city:"Karachi",timezone:"Asia/Karachi"},{city:"Kathmandu",timezone:"Asia/Kathmandu"},{city:"Kentucky",timezone:"America/Kentucky/Louisville"},{city:"Kentucky",timezone:"America/Kentucky/Monticello"},{city:"Kerguelen",timezone:"Indian/Kerguelen"},{city:"Khandyga",timezone:"Asia/Khandyga"},{city:"Khartoum",timezone:"Africa/Khartoum"},{city:"Kiev",timezone:"Europe/Kiev"},{city:"Kiritimati",timezone:"Pacific/Kiritimati"},{city:"Kirov",timezone:"Europe/Kirov"},{city:"Kolkata",timezone:"Asia/Kolkata"},{city:"Kosrae",timezone:"Pacific/Kosrae"},{city:"Krasnoyarsk",timezone:"Asia/Krasnoyarsk"},{city:"Kuala_Lumpur",timezone:"Asia/Kuala_Lumpur"},{city:"Kuching",timezone:"Asia/Kuching"},{city:"Kwajalein",timezone:"Pacific/Kwajalein"},{city:"La_Paz",timezone:"America/La_Paz"},{city:"Lagos",timezone:"Africa/Lagos"},{city:"Lima",timezone:"America/Lima"},{city:"Lindeman",timezone:"Australia/Lindeman"},{city:"Lisbon",timezone:"Europe/Lisbon"},{city:"London",timezone:"Europe/London"},{city:"Lord_Howe",timezone:"Australia/Lord_Howe"},{city:"Los_Angeles",timezone:"America/Los_Angeles"},{city:"Luxembourg",timezone:"Europe/Luxembourg"},{city:"Macau",timezone:"Asia/Macau"},{city:"Maceio",timezone:"America/Maceio"},{city:"Macquarie",timezone:"Antarctica/Macquarie"},{city:"Madeira",timezone:"Atlantic/Madeira"},{city:"Madrid",timezone:"Europe/Madrid"},{city:"Magadan",timezone:"Asia/Magadan"},{city:"Mahe",timezone:"Indian/Mahe"},{city:"Majuro",timezone:"Pacific/Majuro"},{city:"Makassar",timezone:"Asia/Makassar"},{city:"Maldives",timezone:"Indian/Maldives"},{city:"Malta",timezone:"Europe/Malta"},{city:"Managua",timezone:"America/Managua"},{city:"Manaus",timezone:"America/Manaus"},{city:"Manila",timezone:"Asia/Manila"},{city:"Maputo",timezone:"Africa/Maputo"},{city:"Marquesas",timezone:"Pacific/Marquesas"},{city:"Martinique",timezone:"America/Martinique"},{city:"Matamoros",timezone:"America/Matamoros"},{city:"Mauritius",timezone:"Indian/Mauritius"},{city:"Mawson",timezone:"Antarctica/Mawson"},{city:"Mazatlan",timezone:"America/Mazatlan"},{city:"Melbourne",timezone:"Australia/Melbourne"},{city:"Menominee",timezone:"America/Menominee"},{city:"Merida",timezone:"America/Merida"},{city:"Metlakatla",timezone:"America/Metlakatla"},{city:"Mexico_City",timezone:"America/Mexico_City"},{city:"Minsk",timezone:"Europe/Minsk"},{city:"Miquelon",timezone:"America/Miquelon"},{city:"Monaco",timezone:"Europe/Monaco"},{city:"Moncton",timezone:"America/Moncton"},{city:"Monrovia",timezone:"Africa/Monrovia"},{city:"Monterrey",timezone:"America/Monterrey"},{city:"Montevideo",timezone:"America/Montevideo"},{city:"Moscow",timezone:"Europe/Moscow"},{city:"Nairobi",timezone:"Africa/Nairobi"},{city:"Nassau",timezone:"America/Nassau"},{city:"Nauru",timezone:"Pacific/Nauru"},{city:"Ndjamena",timezone:"Africa/Ndjamena"},{city:"New_York",timezone:"America/New_York"},{city:"Nicosia",timezone:"Asia/Nicosia"},{city:"Nipigon",timezone:"America/Nipigon"},{city:"Niue",timezone:"Pacific/Niue"},{city:"Nome",timezone:"America/Nome"},{city:"Norfolk",timezone:"Pacific/Norfolk"},{city:"Noronha",timezone:"America/Noronha"},{city:"North_Dakota",timezone:"America/North_Dakota/Center"},{city:"North_Dakota",timezone:"America/North_Dakota/New_Salem"},{city:"North_Dakota",timezone:"America/North_Dakota/Beulah"},{city:"Noumea",timezone:"Pacific/Noumea"},{city:"Novokuznetsk",timezone:"Asia/Novokuznetsk"},{city:"Novosibirsk",timezone:"Asia/Novosibirsk"},{city:"Ojinaga",timezone:"America/Ojinaga"},{city:"Omsk",timezone:"Asia/Omsk"},{city:"Oral",timezone:"Asia/Oral"},{city:"Oslo",timezone:"Europe/Oslo"},{city:"Pago_Pago",timezone:"Pacific/Pago_Pago"},{city:"Palau",timezone:"Pacific/Palau"},{city:"Palmer",timezone:"Antarctica/Palmer"},{city:"Panama",timezone:"America/Panama"},{city:"Pangnirtung",timezone:"America/Pangnirtung"},{city:"Paramaribo",timezone:"America/Paramaribo"},{city:"Paris",timezone:"Europe/Paris"},{city:"Perth",timezone:"Australia/Perth"},{city:"Phoenix",timezone:"America/Phoenix"},{city:"Pitcairn",timezone:"Pacific/Pitcairn"},{city:"Pohnpei",timezone:"Pacific/Pohnpei"},{city:"Pontianak",timezone:"Asia/Pontianak"},{city:"Port",timezone:"America/Port-a}u-Prince"},{city:"Port_Moresby",timezone:"Pacific/Port_Moresby"},{city:"Port_of_Spain",timezone:"America/Port_of_Spain"},{city:"Porto_Velho",timezone:"America/Porto_Velho"},{city:"Prague",timezone:"Europe/Prague"},{city:"Puerto_Rico",timezone:"America/Puerto_Rico"},{city:"Punta_Arenas",timezone:"America/Punta_Arenas"},{city:"Pyongyang",timezone:"Asia/Pyongyang"},{city:"Qatar",timezone:"Asia/Qatar"},{city:"Qostanay",timezone:"Asia/Qostanay"},{city:"Qyzylorda",timezone:"Asia/Qyzylorda"},{city:"Rainy_River",timezone:"America/Rainy_River"},{city:"Rankin_Inlet",timezone:"America/Rankin_Inlet"},{city:"Rarotonga",timezone:"Pacific/Rarotonga"},{city:"Recife",timezone:"America/Recife"},{city:"Regina",timezone:"America/Regina"},{city:"Resolute",timezone:"America/Resolute"},{city:"Reunion",timezone:"Indian/Reunion"},{city:"Reykjavik",timezone:"Atlantic/Reykjavik"},{city:"Riga",timezone:"Europe/Riga"},{city:"Rio_Branco",timezone:"America/Rio_Branco"},{city:"Riyadh",timezone:"Asia/Riyadh"},{city:"Rome",timezone:"Europe/Rome"},{city:"Rothera",timezone:"Antarctica/Rothera"},{city:"Sakhalin",timezone:"Asia/Sakhalin"},{city:"Samara",timezone:"Europe/Samara"},{city:"Samarkand",timezone:"Asia/Samarkand"},{city:"Santarem",timezone:"America/Santarem"},{city:"Santiago",timezone:"America/Santiago"},{city:"Santo_Domingo",timezone:"America/Santo_Domingo"},{city:"Sao_Paulo",timezone:"America/Sao_Paulo"},{city:"Sao_Tome",timezone:"Africa/Sao_Tome"},{city:"Saratov",timezone:"Europe/Saratov"},{city:"Scoresbysund",timezone:"America/Scoresbysund"},{city:"Seoul",timezone:"Asia/Seoul"},{city:"Shanghai",timezone:"Asia/Shanghai"},{city:"Simferopol",timezone:"Europe/Simferopol"},{city:"Singapore",timezone:"Asia/Singapore"},{city:"Sitka",timezone:"America/Sitka"},{city:"Sofia",timezone:"Europe/Sofia"},{city:"South_Georgia",timezone:"Atlantic/South_Georgia"},{city:"Srednekolymsk",timezone:"Asia/Srednekolymsk"},{city:"St_Johns",timezone:"America/St_Johns"},{city:"Stanley",timezone:"Atlantic/Stanley"},{city:"Stockholm",timezone:"Europe/Stockholm"},{city:"Swift_Current",timezone:"America/Swift_Current"},{city:"Sydney",timezone:"Australia/Sydney"},{city:"Syowa",timezone:"Antarctica/Syowa"},{city:"Tahiti",timezone:"Pacific/Tahiti"},{city:"Taipei",timezone:"Asia/Taipei"},{city:"Tallinn",timezone:"Europe/Tallinn"},{city:"Tarawa",timezone:"Pacific/Tarawa"},{city:"Tashkent",timezone:"Asia/Tashkent"},{city:"Tbilisi",timezone:"Asia/Tbilisi"},{city:"Tegucigalpa",timezone:"America/Tegucigalpa"},{city:"Tehran",timezone:"Asia/Tehran"},{city:"Thimphu",timezone:"Asia/Thimphu"},{city:"Thule",timezone:"America/Thule"},{city:"Thunder_Bay",timezone:"America/Thunder_Bay"},{city:"Tijuana",timezone:"America/Tijuana"},{city:"Tirane",timezone:"Europe/Tirane"},{city:"Tokyo",timezone:"Asia/Tokyo"},{city:"Tomsk",timezone:"Asia/Tomsk"},{city:"Tongatapu",timezone:"Pacific/Tongatapu"},{city:"Toronto",timezone:"America/Toronto"},{city:"Tripoli",timezone:"Africa/Tripoli"},{city:"Troll",timezone:"Antarctica/Troll"},{city:"Tunis",timezone:"Africa/Tunis"},{city:"Ulaanbaatar",timezone:"Asia/Ulaanbaatar"},{city:"Ulyanovsk",timezone:"Europe/Ulyanovsk"},{city:"Urumqi",timezone:"Asia/Urumqi"},{city:"Ust",timezone:"Asia/Ust-Nera"},{city:"Uzhgorod",timezone:"Europe/Uzhgorod"},{city:"Vancouver",timezone:"America/Vancouver"},{city:"Vienna",timezone:"Europe/Vienna"},{city:"Vilnius",timezone:"Europe/Vilnius"},{city:"Vladivostok",timezone:"Asia/Vladivostok"},{city:"Volgograd",timezone:"Europe/Volgograd"},{city:"Vostok",timezone:"Antarctica/Vostok"},{city:"Wake",timezone:"Pacific/Wake"},{city:"Wallis",timezone:"Pacific/Wallis"},{city:"Warsaw",timezone:"Europe/Warsaw"},{city:"Whitehorse",timezone:"America/Whitehorse"},{city:"Windhoek",timezone:"Africa/Windhoek"},{city:"Winnipeg",timezone:"America/Winnipeg"},{city:"Yakutat",timezone:"America/Yakutat"},{city:"Yakutsk",timezone:"Asia/Yakutsk"},{city:"Yangon",timezone:"Asia/Yangon"},{city:"Yekaterinburg",timezone:"Asia/Yekaterinburg"},{city:"Yellowknife",timezone:"America/Yellowknife"},{city:"Yerevan",timezone:"Asia/Yerevan"},{city:"Zaporozhye",timezone:"Europe/Zaporozhye"},{city:"Zurich",timezone:"Europe/Zurich"}],r=t("ue6I"),c=t("DDyt"),m=t("fXoL"),s=(n=function(e,i){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,i){e.__proto__=i}||function(e,i){for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t])})(e,i)},function(e,i){function t(){this.constructor=e}n(e,i),e.prototype=null===i?Object.create(i):(t.prototype=i.prototype,new t)}),u=function(e){function i(i,t){var n=e.call(this,i,t)||this;return n.injector=i,n.userInfoService=t,n.timezones=o,n.weekDaysFa=["\u0634\u0646\u0628\u0647","\u06cc\u06a9\u0634\u0646\u0628\u0647","\u062f\u0648\u0634\u0646\u0628\u0647","\u0633\u0647 \u0634\u0646\u0628\u0647","\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647","\u067e\u0646\u062c\u0634\u0646\u0628\u0647","\u062c\u0645\u0639\u0647"],n.monthFa=["\u0641\u0631\u0648\u0631\u062f\u06cc\u0646","\u0627\u0631\u062f\u06cc\u0628\u0647\u0634\u062a","\u062e\u0631\u062f\u0627\u062f","\u062a\u06cc\u0631","\u0645\u0631\u062f\u0627\u062f","\u0634\u0647\u0631\u06cc\u0648\u0631","\u0645\u0647\u0631","\u0622\u0628\u0627\u0646","\u0622\u0630\u0631","\u062f\u06cc","\u0628\u0647\u0645\u0646","\u0627\u0633\u0641\u0646\u062f"],n.weekDaysEn=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],n.todayJalali=a().locale("fa").format("D")+" "+n.monthFa[a().locale("fa").format("M")]+" "+a().locale("fa").format("YYYY"),n.todayGregorian=a().locale("en").format("D")+" "+a().locale("en").format("MMMM")+" "+a().locale("en").format("YYYY"),n.todayJalaliDayName=n.weekDaysFa[(new Date).getDay()+1],n.todayGregorianDayName=n.weekDaysEn[(new Date).getDay()],n}return s(i,e),i.prototype.changeDatetimeLabel=function(e){return this.datetime=e?{time:"",date:this.todayJalali,weekday:this.todayJalaliDayName}:{time:"",date:this.todayGregorian,weekday:this.todayGregorianDayName},this.datetime},i.prototype.formatTime=function(e,i){void 0===i&&(i=!1);var t=new Date(e),n=i?t.getUTCHours().toString():t.getHours().toString(),a=i?t.getUTCMinutes().toString():t.getMinutes().toString();return n.length<2&&(n="0"+n),a.length<2&&(a="0"+a),[n,a].join(":")},i.prototype.formatDate=function(e,i){void 0===i&&(i=!1);var t=new Date(e),n=t.getFullYear(),a=t.getMonth()+1,o=i?t.getDate().toString():t.getDate();return[n,a<10?"0"+a:""+a,o<10?"0"+o:""+o].join("-")},i.prototype.convertToGMT=function(e,i){return this.formatDate(new Date(e+" "+i),!0)+" "+this.formatTime(new Date(e+" "+i),!0)+":00"},i.prototype.getDateByTimezone=function(e,i){var t=new Date(e).toLocaleString("en-US",{timeZone:i});return this.formatDate(t)+" "+this.formatTime(t)},i.prototype.getDateByTimezoneReturnDate=function(e){var i;return i="string"==typeof e?new Date(e).toLocaleString("en-US",{timeZone:this.loggedInUser.timezone}):"object"==typeof e?e.toLocaleString("en-US",{timeZone:this.loggedInUser.timezone}):(new Date).toLocaleString("en-US",{timeZone:this.loggedInUser.timezone}),new Date(i)},i.\u0275fac=function(e){return new(e||i)(m.Xb(m.t),m.Xb(c.a))},i.\u0275prov=m.Jb({token:i,factory:i.\u0275fac,providedIn:"root"}),i}(r.a)},pjkF:function(e,i,t){"use strict";t.d(i,"a",(function(){return A}));var n=t("wd/R"),a=t("ds6q"),o=t("AytR"),r=t("quSY"),c=t("XiUW"),m=t("C6zf"),s=t("dJ3e"),u=t("OVb6"),l=t("OC8m"),y=t("+Ibf"),d=t("fXoL"),z=t("sYmb"),A=function(){function e(e,i,t,n,o,c,m){this.eventApi=e,this.messageService=i,this.electronService=t,this.dateTimeservice=n,this.translateService=o,this.notificationService=c,this.eventHandlerService=m,this.msg=new a.Subject,this.connectedStatus=new a.Subject,this._subscription=new r.a}return e.prototype.getEventsByEmail=function(e,i){var t=this;return this.loggedInUsers=i,new Promise((function(n){t.eventApi.getEventByEmail(e).subscribe((function(e){var a=[],o=[];if(200==e.status)if(e.contents){if(e.contents.length){(a=e.contents).map((function(e){e.sTime=new Date(e.startDate).toLocaleTimeString(),e.eTime=new Date(e.endDate).toLocaleTimeString(),e.startDate=t.dateTimeservice.getDateByTimezone(e.startDate,i.timezone),e.endDate=t.dateTimeservice.getDateByTimezone(e.endDate,i.timezone),e.reminders.length&&(o=function(){for(var e=0,i=0,t=arguments.length;i<t;i++)e+=arguments[i].length;var n=Array(e),a=0;for(i=0;i<t;i++)for(var o=arguments[i],r=0,c=o.length;r<c;r++,a++)n[a]=o[r];return n}(o,e.reminders))})),o.map((function(e){e.startdate_format=new Date(e.startReminder).toLocaleDateString(),e.enddate_format=new Date(e.endReminder).toLocaleDateString(),e.startReminder=t.dateTimeservice.getDateByTimezone(e.startReminder,i.timezone),e.endReminder=t.dateTimeservice.getDateByTimezone(e.endReminder,i.timezone)}));var r={events:a,reminders:o};t.eventHandlerService.moveEventsReminders(r),n(r)}}else t.messageService.showMessage(e.error,"error"),n({events:[],reminders:[]});else t.messageService.showMessage(e.error,"error"),n({events:[],reminders:[]})}))}))},e.prototype.initializeWebSocketConnection=function(){var e=this;return new Promise((function(i,t){var a=new SockJS(o.a.EVENT_HANDLER_URL+"/api");e.stompClient=Stomp.over(a),e.stompClient.debug=function(){},e.stompClient.reconnect_delay=2e3,e.stompClient.connect({},(function(t){i(t),e.connectedStatus.next(!0),e.stompClient.subscribe("/calendar",(function(i){var t,a=JSON.parse(i.body);Array.isArray(a)?(a=a[0],e.electronService.isElectron&&(e.electronService.remote.getCurrentWindow().isFocused()||(t=new Notification(e.getTranslate("events_handler.main.notification_reminder_title"),{body:a.description+" "+a.startReminder,icon:"",dir:"auto",data:e.loggedInUsers})))):a.users&&a.users.length&&a.users.forEach((function(i){e.electronService.isElectron&&(e.electronService.remote.getCurrentWindow().isFocused()||(t=new Notification(e.getTranslate("events_handler.main.notification_event_title"),{body:e.getTranslate("events_handler.main.notification_event_from")+" "+a.createUser.name,icon:"assets/profileImg/"+a.createUser.email+".jpg",dir:"auto",data:e.loggedInUsers})));var o={email:e.loggedInUsers.email,date:n(new Date).format("YYYY-MM-DD")};e.getEventsByEmail(o,e.loggedInUsers)})),e.electronService.isElectron&&(e.electronService.remote.getCurrentWindow().isFocused()||(e.notificationService.changeCurrentNotification(t),e._subscription.add(e.notificationService.currentNotification.subscribe((function(i){i&&(i.onclick=function(){e.electronService.isElectron&&e.electronService.remote.getCurrentWindow().show()},i.onclose=function(){})})))))})),e.stompClient.subscribe("/actionEvent",(function(e){})),e.stompClient.subscribe("/actionReminder",(function(e){}))}),(function(i){t(),e.errorCallBack(i)}))}))},e.prototype.getTranslate=function(e){return this.translateService.instant(e)},e.prototype.errorCallBack=function(e){},e.prototype.sendMessage=function(e){this.stompClient.send("/app/autoComplete",{},JSON.stringify(e))},e.prototype.sendMessageSearchAll=function(e){console.log("send: ",e),this.stompClient.send("/app/search",{},JSON.stringify(e))},e.\u0275fac=function(i){return new(i||e)(d.Xb(m.a),d.Xb(c.a),d.Xb(s.a),d.Xb(u.a),d.Xb(z.d),d.Xb(l.a),d.Xb(y.a))},e.\u0275prov=d.Jb({token:e,factory:e.\u0275fac,providedIn:"root"}),e}()}}]);