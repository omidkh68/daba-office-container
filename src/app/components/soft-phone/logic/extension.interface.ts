export interface ExtensionInterface {
  comp_id?: string;
  username?: string;
  extension_no: string;
  extension_name: string;
  caller_id_number?: string;
  extension_type?: string;
  is_online?: number;
  is_mute?: number;
  timezone?: string;
}

export interface ConferenceOnlineExtensionInterface extends ExtensionInterface {
  extension_id: string;
  chanel: string;
  is_webrtc: number;
}

export interface MuteUnMuteInterface {
  extension_no: string;
  is_mute: number;
}
