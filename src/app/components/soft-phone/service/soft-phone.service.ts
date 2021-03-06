import {ElementRef, Inject, Injectable, Injector} from '@angular/core';
import SIPml from 'ecmascript-webrtc-sipml';
import {AppConfig} from '../../../../environments/environment';
import {LoginDataClass} from '../../../services/loginData.class';
import {MessageService} from '../../message/service/message.service';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {UserInfoService} from '../../users/services/user-info.service';
import {TranslateService} from '@ngx-translate/core';
import {CompanyInterface} from '../../select-company/logic/company-interface';
import {IncomingInterface} from '../logic/incoming.interface';
import {ExtensionInterface} from '../logic/extension.interface';
import {SoftphoneUserInterface} from '../logic/softphone-user.interface';
import {CompanySelectorService} from '../../select-company/services/company-selector.service';

export interface EssentialTagsInterface {
  audioRemote: ElementRef<HTMLAudioElement>;
  ringtone: ElementRef<HTMLAudioElement>;
  ringbacktone: ElementRef<HTMLAudioElement>;
  dtmfTone: ElementRef<HTMLAudioElement>;
}

declare global {
  interface Window {
    RTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SoftPhoneService extends LoginDataClass {
  allUsersSoftphone: Array<SoftphoneUserInterface> = [];
  loggedInUserSoftphone: SoftphoneUserInterface;
  debugMode = false;
  oSipStack;
  oSipSessionRegister;
  oSipSessionCall;
  oSipSessionTransferCall;
  oNotifICall;
  oConfigCall;
  ringtone;
  ringbacktone;

  private _users: Array<SoftphoneUserInterface> | null = null;
  private users = new BehaviorSubject(this._users);
  public currentSoftPhoneUsers = this.users.asObservable();

  private _extensionList: Array<ExtensionInterface> | null = null;
  private extensionList = new BehaviorSubject(this._extensionList);
  public currentExtensionList = this.extensionList.asObservable();

  private _incomingCall: IncomingInterface | null = null;
  private incomingCallStatus = new BehaviorSubject(this._incomingCall);
  public currentIncomingCallStatus = this.incomingCallStatus.asObservable();

  private _onCallUser: SoftphoneUserInterface | null = null;
  private onCallUser = new BehaviorSubject(this._onCallUser);
  public currentOnCallUser = this.onCallUser.asObservable();

  private _connectedCall = false;
  private connectedCall = new BehaviorSubject(this._connectedCall);
  public currentConnectedCall = this.connectedCall.asObservable();

  private _softphoneConnected = false;
  private softphoneConnected = new BehaviorSubject(this._softphoneConnected);
  public currentSoftphoneConnected = this.softphoneConnected.asObservable();

  private _minimizeCallPopUp = false;
  private minimizeCallPopUp = new BehaviorSubject(this._minimizeCallPopUp);
  public currentMinimizeCallPopUp = this.minimizeCallPopUp.asObservable();

  private _activeTab = 0;
  private activeTab = new BehaviorSubject(this._activeTab);
  public currentActiveTab = this.activeTab.asObservable();

  private _closeSoftphone = false;
  private closeSoftphone = new BehaviorSubject(this._closeSoftphone);
  public currentCloseSoftphone = this.closeSoftphone.asObservable();

  private audioRemoteTag: BehaviorSubject<EssentialTagsInterface> = new BehaviorSubject(null);

  /*videoRemote;
  videoLocal;
  sTransferNumber;
  oRingTone;
  oRingbackTone;
  bFullScreen = false;
  bDisableVideo = false;
  viewVideoLocal;
  viewVideoRemote;
  oReadyStateTimer;
  viewLocalScreencast; // <video> (webrtc) or <div> (webrtc4all)*/

  constructor(@Inject('windowObject') private window: Window,
              private injector: Injector,
              private messageService: MessageService,
              private userInfoService: UserInfoService,
              private translateService: TranslateService,
              private companySelectorService: CompanySelectorService) {
    super(injector, userInfoService);
  }

  public get audioRemoteTagValue(): EssentialTagsInterface {
    return {
      audioRemote: this.audioRemoteTag.value.audioRemote,
      ringtone: this.audioRemoteTag.value.ringtone,
      ringbacktone: this.audioRemoteTag.value.ringbacktone,
      dtmfTone: this.audioRemoteTag.value.dtmfTone
    };
  }

  changeSoftPhoneUsers(softPhoneUsers: Array<SoftphoneUserInterface> | null): void {
    this.users.next(softPhoneUsers);
  }

  changeExtensionList(list: Array<ExtensionInterface> | null): Promise<boolean> {
    return new Promise((resolve) => {
      this.extensionList.next(list);

      resolve(true);
    });
  }

  changeIncomingCallStatus(status: IncomingInterface): void {
    this.incomingCallStatus.next(status);
  }

  changeOnCallUser(onCallUser: SoftphoneUserInterface | null): void {
    if (onCallUser === null && this.debugMode) {
      console.log('On Call Destroyed');
    }

    this.onCallUser.next(onCallUser);
  }

  changeConnectedCall(status: boolean): void {
    if (status === false && this.debugMode) {
      console.log('Connected Call Destroyed');
    }

    this.connectedCall.next(status);
  }

  get getSoftphoneConnectedStatus(): boolean {
    return this.softphoneConnected.getValue();
  }

  changeSoftphoneConnected(status: boolean): void {
    if (status === false && this.debugMode) {
      console.log('Softphone Connected Call Destroyed');
    }

    this.softphoneConnected.next(status);
  }

  changeMinimizeCallPopUp(minimize: boolean): void {
    if (minimize === false && this.debugMode) {
      console.log('Minimize Call PopUp Destroyed');
    }

    this.minimizeCallPopUp.next(minimize);
  }

  changeAudioRemoteTag(essentialTags: EssentialTagsInterface): void {
    this.audioRemoteTag.next(essentialTags);

    this.ringtone = this.audioRemoteTagValue.ringtone.nativeElement;
    this.ringbacktone = this.audioRemoteTagValue.ringbacktone.nativeElement;

    SIPml.init(this.postInit, false);
  }

  changeActiveTab(tab: number): void {
    this.activeTab.next(tab);
  }

  changeCloseSoftphone(status: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      this.closeSoftphone.next(status);

      if (status) {
        setTimeout(() => this.closeSoftphone.next(false));
      }

      resolve(true);
    });
  }

  combineUsersSoftPhoneInformation(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const loggedInUserExtension = this.extensionList.getValue().filter((ext: ExtensionInterface) => this.loggedInUser.email === ext.username).pop();

        if (loggedInUserExtension) {
          this.loggedInUserSoftphone = {...this.loggedInUser, ...loggedInUserExtension};

          this.allUsersSoftphone = [];

          this.changeSoftPhoneUsers(this.extensionList.getValue());

          resolve(true);
        } else {
          this.messageService.showMessage(`Your extension is not ready, please call service owner`, 'error', 10000);

          reject(false);
        }
      });
    });
  }

  sipRegister = (): void => {
    this.combineUsersSoftPhoneInformation().then(() => {
      try {
        // enable notifications if not already done
        // if (webkitNotifications && webkitNotifications.checkPermission() != 0) {
        //     webkitNotifications.requestPermission();
        // }

        Notification.requestPermission().finally();
        // save credentials
        //saveCredentials();

        // update debug level to be sure new values will be used if the user haven't updated the page
        SIPml.setDebugLevel('info');

        const defaultCompany: CompanyInterface = this.companySelectorService.currentCompany;

        const config = {
          realm: AppConfig.REALM,
          impi: `${this.loggedInUserSoftphone.extension_no}-${defaultCompany.subdomain}`,
          impu: `sip:${this.loggedInUserSoftphone.extension_no}-${defaultCompany.subdomain}@${AppConfig.REALM}`,
          password: this.loggedInUserSoftphone.extension_no,
          display_name: `${this.loggedInUserSoftphone.extension_no}-${defaultCompany.subdomain}`,
          websocket_proxy_url: AppConfig.WEBSOCKET_PROXY_URL,
          outbound_proxy_url: null,
          ice_servers: null,
          enable_rtcweb_breaker: false,
          events_listener: {events: '*', listener: this.onSipEventStack},
          enable_early_ims: true, // Must be true unless you're using a real IMS network
          enable_media_stream_cache: false,
          // bandwidth: null, // could be redefined a session-level
          // video_size: null, // could be redefined a session-level
          sip_headers: [
            {name: 'User-Agent', value: 'IM-client/OMA1.0 sipML5-v1.2016.03.04'},
            {name: 'Organization', value: 'Enoox Container'}
          ]
        };

        // create SIP stack
        this.oSipStack = new SIPml.Stack(config);

        if (this.oSipStack.start() != 0) {
          if (this.debugMode) {
            console.log('<b>Failed to start the SIP stack</b>');
          }
        } else return;
      } catch (e) {
        if (this.debugMode) {
          console.log(`<b> 2: ${e} </b>`);
        }
      }
      //btnRegister.disabled = false;
    });
  };

  sipTransfer = (number): void => {
    if (this.oSipSessionCall) {
      if (this.debugMode) {
        console.log('in console');
      }
      //if (!tsk_string_is_null_or_empty(s_destination)) {
      //btnTransfer.disabled = true;
      if (this.oSipSessionCall.transfer(number) != '0') {
        if (this.debugMode) {
          console.log('in transfer');
          console.log('<i>Call transfer failed</i>');
        }
        //btnTransfer.disabled = false;
        return;
      }

      if (this.debugMode) {
        console.log('<i>Transferring the call...</i>');
      }
      //}
    }
  };

  sipCall = (s_type: string, number = 0): void => {
    if (this.oSipStack && !this.oSipSessionCall) {
      if (s_type == 'call-screenshare') {
        if (!SIPml.isScreenShareSupported()) {
          alert('Screen sharing not supported. Are you using chrome 26+?');
          return;
        }
        if (!location.protocol.match('https')) {
          if (confirm('Screen sharing requires https://. Do you want to be redirected?')) {
            this.sipUnRegister();
            // location = 'https://ns313841.ovh.net/call.htm';
          }
          return;
        }
      }
      // btnCall.disabled = true;
      // btnHangUp.disabled = false;

      // create call session
      this.oSipSessionCall = this.oSipStack.newSession(s_type, this.oConfigCall);
      // make call
      if (this.oSipSessionCall.call(number) != 0) {
        if (this.debugMode) {
          console.log('outgoing number : ', number);
          console.log('Failed to make call');
        }
        this.oSipSessionCall = null;
        console.log('on call != 0');

        this.changeOnCallUser(null);
        this.changeConnectedCall(false);
        this.changeMinimizeCallPopUp(false);
        //btnCall.disabled = false;
        //btnHangUp.disabled = true;
        return;
      }
      //saveCallOptions();
    } else if (this.oSipSessionCall) {
      if (this.debugMode) {
        console.log('<i>Connecting...</i>');
      }
      this.oSipSessionCall.accept(this.oConfigCall);
    }
  };

  sipUnRegister = (): void => {
    if (this.oSipStack) {
      this.changeSoftphoneConnected(false);

      this.oSipStack.stop(); // shutdown all sessions
    }
  };

  sipHangUp = (): void => {
    if (this.oSipSessionCall) {
      if (this.debugMode) {
        console.log('<i>Terminating the call...</i>');
      }

      this.oSipSessionCall.hangup({events_listener: {events: '*', listener: this.onSipEventSession}});
      this.oSipSessionCall = null;
      console.log('on hang up');
    }

    this.changeOnCallUser(null);
    this.changeConnectedCall(false);
    this.changeMinimizeCallPopUp(false);
  };

  sipToggleMute = (): boolean => {
    if (this.oSipSessionCall) {
      const bMute = !this.oSipSessionCall.bMute;

      const i_ret = this.oSipSessionCall.mute('audio'/*could be 'video'*/, bMute);

      if (i_ret != 0) {
        return;
      }

      this.oSipSessionCall.bMute = bMute;

      return bMute;
    }
  };

  startRingTone = (): void => {
    try {
      this.ringtone.play();
    } catch (e) {
      if (this.debugMode) {
        console.log(e);
      }
    }
  };

  stopRingTone = (): void => {
    try {
      this.ringtone.pause();
    } catch (e) {
      if (this.debugMode) {
        console.log(e);
      }
    }
  };

  startRingbackTone = (): void => {
    try {
      this.ringbacktone.play();
    } catch (e) {
      if (this.debugMode) {
        console.log(e);
      }
    }
  };

  stopRingbackTone = (): void => {
    try {
      this.ringbacktone.pause();
    } catch (e) {
      if (this.debugMode) {
        console.log(e);
      }
    }
  };

  onSipEventStack = (e: any): void => {
    const type: string = e.type.toLowerCase();
    const description: string = e.description.toLowerCase();

    if (this.debugMode) {
      console.log('-----------mmmmmmmm-----------');
      console.log('------------------------------');
      console.log('==session event = ', `[${type}]`, ' --- ', `[${description}]`);
      console.log('------------------------------');
      console.log('-----------mmmmmmmm-----------');
    }

    switch (e.type) {
      case 'started': {
        // catch exception for IE (DOM not ready)
        try {
          // LogIn (REGISTER) as soon as the stack finish starting
          this.oSipSessionRegister = this.oSipStack.newSession('register', {
            expires: 200,
            events_listener: {events: '*', listener: this.onSipEventSession},
            sip_caps: [
              {name: '+g.oma.sip-im', value: null},
              //{ name: '+sip.ice' }, // rfc5768: FIXME doesn't work with Polycom TelePresence
              {name: '+audio', value: null},
              {name: 'language', value: '"en,fr"'}
            ]
          });
          this.oSipSessionRegister.register();
        } catch (e: any) {
          if (this.debugMode) {
            console.log(`<b>1: ${e}</b>`);
          }
          //btnRegister.disabled = false;
        }
        break;
      }
      case 'stopping':
      case 'stopped':
      case 'failed_to_start':
      case 'failed_to_stop': {
        const bFailure = (e.type == 'failed_to_start') || (e.type == 'failed_to_stop');

        this.oSipStack = null;
        this.oSipSessionRegister = null;

        console.log('on failed to stop');

        this.oSipSessionCall = null;

        console.log(this.connectedCall.getValue());

        /*this.changeOnCallUser(null);
        this.changeConnectedCall(false);
        this.changeMinimizeCallPopUp(false);

        this.messageService.showMessage(`Error has been detected, Please call again`);

        this.sipRegister();
        */

        //uiOnConnectionEvent(false, false);

        this.stopRingbackTone();
        this.stopRingTone();

        //uiVideoDisplayShowHide(false);
        //divCallOptions.style.opacity = 0;

        //txtCallStatus.innerHTML = '';

        if (this.debugMode) {
          console.log(bFailure ? `<i>Disconnected: <b> ${description} </b></i>` : '<i>Disconnected</i>');
        }

        break;
      }

      case 'i_new_call': {
        if (this.oSipSessionCall) {
          // do not accept the incoming call if we're already 'in call'
          e.newSession.hangup(); // comment this line for multi-line support
        } else {
          this.changeIncomingCallStatus({status: true, data: e});
          this.oSipSessionCall = e.newSession;
          // start listening for events
          this.oSipSessionCall.setConfiguration(this.oConfigCall);

          if (this.debugMode) {
            // alert('Answer / Reject');
            console.log('Answer / Reject', e.o_event.o_message.o_hdr_From.s_display_name);
          }
          //uiBtnCallSetText('Answer');
          //btnHangUp.value = 'Reject';
          //btnCall.disabled = false;
          //btnHangUp.disabled = false;

          this.startRingTone();

          const sRemoteNumber: string = (this.oSipSessionCall.getRemoteFriendlyName() || 'unknown');

          if (this.debugMode) {
            console.log(`<i>Incoming call from [<b>${sRemoteNumber}</b>]</i>`);
          }
          //showNotifICall(sRemoteNumber);
        }
        break;
      }

      case 'm_permission_requested': {
        //divGlassPanel.style.visibility = 'visible';
        break;
      }
      case 'm_permission_accepted':
      case 'm_permission_refused': {
        //divGlassPanel.style.visibility = 'hidden';
        if (e.type == 'm_permission_refused') {
          this.oSipSessionCall = null;
          console.log('on m_permission_refused');
          this.changeOnCallUser(null);
          this.changeConnectedCall(false);
          this.changeMinimizeCallPopUp(false);
          //uiCallTerminated('Media stream permission denied');
        }
        break;
      }

      case 'starting':
      default:
        break;
    }
  };

  onSipEventSession = (e: any): void => {
    const type: string = e.type.toLowerCase();
    const description: string = e.description.toLowerCase();
    let extensionNumberFrom = '';
    let extensionNumberTo = '';
    let incomingExtensionTo: ExtensionInterface;
    let incomingExtensionFrom: ExtensionInterface;

    const defaultCompany: CompanyInterface = this.companySelectorService.currentCompany;

    if (e.o_event && e.o_event.o_session) {
      try {
        extensionNumberFrom = e.o_event.o_session.o_uri_from ? e.o_event.o_session.o_uri_from.s_user_name.replace(`-${defaultCompany.subdomain}`, '') : '-';
        extensionNumberTo = e.o_event.o_session.o_uri_to ? e.o_event.o_session.o_uri_to.s_user_name.replace(`-${defaultCompany.subdomain}`, '') : '-';

        incomingExtensionFrom = this.extensionList.getValue().filter((ext: ExtensionInterface) => ext.extension_no === extensionNumberFrom).pop();
        incomingExtensionTo = this.extensionList.getValue().filter((ext: ExtensionInterface) => ext.extension_no === extensionNumberTo).pop();
      } catch (e) {
        if (this.debugMode) {
          console.log(e);
        }
      }
    }

    let callerUserName = '...';

    if (incomingExtensionFrom && incomingExtensionFrom.extension_no === this.loggedInUserSoftphone.extension_no) {
      callerUserName = incomingExtensionTo && incomingExtensionTo.extension_name ? incomingExtensionTo.extension_name : '';
    } else if (incomingExtensionTo && incomingExtensionTo.extension_no === this.loggedInUserSoftphone.extension_no) {
      callerUserName = incomingExtensionFrom && incomingExtensionFrom.extension_name ? incomingExtensionFrom.extension_name : '';
    }

    if (this.debugMode) {
      console.log('-----------oooooooo-----------');
      console.log('------------------------------');
      console.log('==session event = ', `[${type}]`, ' --- ', `[${description}]`);
      console.log('------------------------------');
      console.log('-----------oooooooo-----------');
    }

    if (type === 'connecting') {
      this.changeConnectedCall(false);
    }

    if (type === 'connected' && description !== 'connected') {
      this.changeConnectedCall(true);
    }

    switch (type) {
      case 'connecting':
      case 'connected': {
        this.messageService.showMessage(description);

        switch (description) {
          case 'in call': {
            if (this.debugMode) {
              console.log(e);
            }

            this.messageService.showMessage(`You are in call with ${callerUserName}`);

            break;
          }

          case 'connecting...': {
            this.messageService.showMessage(`Connecting...`);

            break;
          }

          case 'connected': {
            this.changeSoftphoneConnected(true);

            this.messageService.showMessage(`Your Softphone is now connected`);

            break;
          }
        }

        const bConnected = (type == 'connected');
        if (e.session == this.oSipSessionRegister) {
          //uiOnConnectionEvent(bConnected, !bConnected);
          if (this.debugMode) {
            console.log(e, '<i>' + description + '</i>');
          }
        } else if (e.session == this.oSipSessionCall) {
          //btnHangUp.value = 'HangUp';
          //btnCall.disabled = true;
          //btnHangUp.disabled = false;
          //btnTransfer.disabled = false;
          //if (btnBFCP) btnBFCP.disabled = false;

          if (bConnected) {
            this.stopRingbackTone();
            this.stopRingTone();

            if (this.oNotifICall) {
              this.oNotifICall.cancel();
              this.oNotifICall = null;
            }
          }

          if (this.debugMode) {
            console.log('<i>' + description + '</i>');
          }
          //divCallOptions.style.opacity = bConnected ? 1 : 0;

          if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback
            //uiVideoDisplayEvent(false, true);
            //uiVideoDisplayEvent(true, true);
          }
        }
        break;
      } // 'connecting' | 'connected'
      case 'terminating':
      case 'terminated': {
        this.changeOnCallUser(null);
        this.changeIncomingCallStatus({status: false});
        this.changeMinimizeCallPopUp(false);
        this.stopRingbackTone();
        this.stopRingTone();

        switch (description) {
          case 'forbidden': {
            this.messageService.showMessage(`${incomingExtensionTo ? 'Rejected by ' + incomingExtensionTo.extension_name : 'Your softphone not ready, please call service owner'}`);
            break;
          }

          case 'declined': {
            this.messageService.showMessage(`Not answered by ${incomingExtensionTo ? incomingExtensionTo.extension_name : ''}`);
            break;
          }

          case 'temporarily unavailable': {
            this.messageService.showMessage(`${callerUserName ? callerUserName : 'User'} is not available now`);
            break;
          }

          case 'ok': {
            this.messageService.showMessage('Softphone was disconnected');
            break;
          }

          case 'call terminated': {
            this.messageService.showMessage('Call terminated');
            break;
          }

          case 'call rejected': {
            if (this.debugMode) {
              console.log(e);
            }

            this.messageService.showMessage(`You rejected incoming call from ${incomingExtensionFrom.extension_name}`);
            break;
          }
        }

        if (e.session == this.oSipSessionRegister) {
          //uiOnConnectionEvent(false, false);

          this.oSipSessionCall = null;
          this.changeOnCallUser(null);
          this.changeConnectedCall(false);
          this.changeMinimizeCallPopUp(false);
          console.log('on equal');
          this.oSipSessionRegister = null;

          if (this.debugMode) {
            console.log('<i>' + description + '</i>');
          }
        } else if (e.session == this.oSipSessionCall) {
          this.oSipSessionCall = null;
          console.log('on else if equal');
          this.changeOnCallUser(null);
          this.changeConnectedCall(false);
          this.changeMinimizeCallPopUp(false);

          //uiCallTerminated(e.description);
        }
        break;
      } // 'terminating' | 'terminated'

      case 'm_stream_video_local_added': {
        if (e.session == this.oSipSessionCall) {
          //uiVideoDisplayEvent(true, true);
        }
        break;
      }
      case 'm_stream_video_local_removed': {
        if (e.session == this.oSipSessionCall) {
          //uiVideoDisplayEvent(true, false);
        }
        break;
      }
      case 'm_stream_video_remote_added': {
        if (e.session == this.oSipSessionCall) {
          //uiVideoDisplayEvent(false, true);
        }
        break;
      }
      case 'm_stream_video_remote_removed': {
        if (e.session == this.oSipSessionCall) {
          //uiVideoDisplayEvent(false, false);
        }
        break;
      }
      case 'm_stream_audio_local_added':
      case 'm_stream_audio_local_removed':
      case 'm_stream_audio_remote_added':
      case 'm_stream_audio_remote_removed': {
        break;
      }
      case 'i_ect_new_call': {
        this.oSipSessionTransferCall = e.session;
        break;
      }
      case 'i_ao_request': {
        if (e.session == this.oSipSessionCall) {
          const iSipResponseCode = e.getSipResponseCode();
          if (iSipResponseCode == 180 || iSipResponseCode == 183) {
            this.startRingbackTone();

            if (this.debugMode) {
              console.log('<i>Remote ringing...</i>');
            }
          }
        }
        break;
      }
      case 'm_early_media': {
        if (e.session == this.oSipSessionCall) {
          this.stopRingbackTone();
          this.stopRingTone();

          if (this.debugMode) {
            console.log('<i>Early media started</i>');
          }
        }
        break;
      }
      case 'm_local_hold_ok': {
        if (e.session == this.oSipSessionCall) {
          if (this.oSipSessionCall.bTransfering) {
            this.oSipSessionCall.bTransfering = false;
            // this.AVSession.TransferCall(this.transferUri);
          }
          //btnHoldResume.value = 'Resume';
          //btnHoldResume.disabled = false;
          //txtCallStatus.innerHTML = '<i>Call placed on hold</i>';
          this.oSipSessionCall.bHeld = true;
        }
        break;
      }
      case 'm_local_hold_nok': {
        if (e.session == this.oSipSessionCall) {
          this.oSipSessionCall.bTransfering = false;
          //btnHoldResume.value = 'Hold';
          //btnHoldResume.disabled = false;

          if (this.debugMode) {
            console.log('<i>Failed to place remote party on hold</i>');
          }
        }
        break;
      }
      case 'm_local_resume_ok': {
        if (e.session == this.oSipSessionCall) {
          this.oSipSessionCall.bTransfering = false;
          //btnHoldResume.value = 'Hold';
          //btnHoldResume.disabled = false;
          //txtCallStatus.innerHTML = '<i>Call taken off hold</i>';
          this.oSipSessionCall.bHeld = false;

          if (SIPml.isWebRtc4AllSupported()) { // IE don't provide stream callback yet
            //uiVideoDisplayEvent(false, true);
            //uiVideoDisplayEvent(true, true);
          }
        }
        break;
      }
      case 'm_local_resume_nok': {
        if (e.session == this.oSipSessionCall) {
          this.oSipSessionCall.bTransfering = false;
          //btnHoldResume.disabled = false;
          if (this.debugMode) {
            console.log('<i>Failed to unhold call</i>');
          }
        }
        break;
      }
      case 'm_remote_hold': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('<i>Placed on hold by remote party</i>');
          }
        }
        break;
      }
      case 'm_remote_resume': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('<i>Taken off hold by remote party</i>');
          }
        }
        break;
      }
      case 'm_bfcp_info': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('BFCP Info: <i>' + description + '</i)>');
          }
        }
        break;
      }
      case 'o_ect_trying': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('<i>Call transfer in progress...</i>');
          }
        }
        break;
      }
      case 'o_ect_accepted': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('<i>Call transfer accepted</i>');
          }
        }
        break;
      }
      case 'o_ect_completed':
      case 'i_ect_completed': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('<i>Call transfer completed</i>');
          }
          //btnTransfer.disabled = false;
          if (this.oSipSessionTransferCall) {
            this.oSipSessionCall = this.oSipSessionTransferCall;
          }
          this.oSipSessionTransferCall = null;
        }
        break;
      }
      case 'o_ect_failed':
      case 'i_ect_failed': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log('<i>Call transfer failed</i>');
          }
          //btnTransfer.disabled = false;
        }
        break;
      }
      case 'o_ect_notify':
      case 'i_ect_notify': {
        if (e.session == this.oSipSessionCall) {
          if (this.debugMode) {
            console.log(`<i>Call Transfer: <b> ${e.getSipRespo} ${description} </b></i>`);
          }

          if (e.getSipResponseCode() >= 300) {
            if (this.oSipSessionCall.bHeld) {
              this.oSipSessionCall.resume();
            }
            //btnTransfer.disabled = false;
          }
        }
        break;
      }
      case 'i_ect_requested': {
        if (e.session == this.oSipSessionCall) {
          const s_message = `Do you accept call transfer to [ ${e.getTransferDestinationFriendlyName()} ]?`; // FIXME

          if (confirm(s_message)) {
            if (this.debugMode) {
              console.log('<i>Call transfer in progress...</i>');
            }
            this.oSipSessionCall.acceptTransfer();
            break;
          }
          this.oSipSessionCall.rejectTransfer();
        }
        break;
      }
    }
  };

  postInit = (): void => {
    this.oConfigCall = {
      audio_remote: this.audioRemoteTagValue.audioRemote.nativeElement,
      video_local: null,
      video_remote: null,
      screencast_window_id: 0x00000000, // entire desktop
      bandwidth: {audio: undefined, video: undefined},
      video_size: {minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined},
      events_listener: {events: '*', listener: this.onSipEventSession},
      sip_caps: [
        {name: '+g.oma.sip-im'},
        {name: 'language', value: '"en,fr"'}
      ]
    };
  };

  uiBtnCallSetText = (s_text: string): void => {
    switch (s_text) {
      case 'Call': {
        this.sipCall('call-audio');

        break;
      }
      default: {
        this.sipCall('call-audio');
        break;
      }
    }
  };

  showNotifICall = (s_number: number): void => {
    // permission already asked when we registered
    //if (webkitNotifications && webkitNotifications.checkPermission() == 0) {
    if (this.oNotifICall) {
      this.oNotifICall.cancel();
    }
    //this.oNotifICall = Notification.createNotification('images/sipml-34x39.png', 'Incaming call', 'Incoming call from ' + s_number);
    this.oNotifICall.onclose = () => {
      this.oNotifICall = null;
    };
    this.oNotifICall.show();
    //}
  };

  sipSendDTMF(c: any): void {
    if (this.oSipSessionCall && c) {
      if (this.oSipSessionCall.dtmf(c) == 0) {
        try {
          this.audioRemoteTagValue.dtmfTone.nativeElement.play();
        } catch (e) {
          if (this.debugMode) {
            console.log(e);
          }
        }
      }
    } else {
      this.audioRemoteTagValue.dtmfTone.nativeElement.play();
    }
  }

  getConnectionStatus = (logInfo = true): Promise<any> => new Promise((resolve, reject) => {
    this.window.RTCPeerConnection = this.window.RTCPeerConnection ||
        this.window.mozRTCPeerConnection ||
        this.window.webkitRTCPeerConnection;

    if (typeof this.window.RTCPeerConnection == 'undefined')
      return reject('WebRTC not supported by browser');

    const pc = new RTCPeerConnection();
    const ips = [];

    pc.createDataChannel('');
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(err => reject(err));
    pc.onicecandidate = event => {
      if (!event || !event.candidate) {
        // All ICE candidates have been sent.
        if (ips.length == 0)
          return reject('WebRTC disabled or restricted by browser');

        return resolve(ips);
      }

      const parts = event.candidate.candidate.split(' ');
      const [base, componentId, protocol, priority, ip, port, , type, ...attr] = parts;
      const component = ['rtp', 'rtpc'];

      if (!ips.some(e => e == ip))
        ips.push(ip);

      if (!logInfo)
        return;

    };
  });

  getTranslate(word: string): string {
    return this.translateService.instant(word);
  }
}
