export interface LmsInterface {
  banner: string; // title of lms
  bannerC: string; // color of title
  meetingID: string; // meeting name
  viewerPassword: string; // pass 1
  moderatorPassword: string; // pass 2
  isWebCamModeratorOnly: string; // tick 1
  isRecord: string; // tick 2
  isMuteOnStart: string; // tick 3
  isUserWebCamDisable: string; // tick 4
  isUserMicDisable: string; // tick 5
  isPrivateChatDisable: string; // tick 6
  isPublicChatDisable: string; // tick 7
  moderatorWelcomeMsg: string; // welcome message in chat
  welcomeText: string; // welcome under moderator
  userName: string;
}

export interface LmsResultInterface {
  status: number;
  recordCount: number;
  content: string | null;
  contents: Array<RoomInterface> | null;
  error: string;
  result: string;
  systemError: string;
}

export interface ServerInterface {
  id: number;
  serverName: string;
  serverUrl: string;
}

export interface RoomInterface {
  id: number;
  roomName: string;
  password: string;
  serverId: ServerInterface;
  startTime: string;
  endTime: string;
  createDate: string;
  userCreator: string;
  users: Array<string>;
}

export interface JoinInterface {
  meetingID: string;
  password: string;
  userName: string;
}

export interface JoinResultInterface {
  status: number;
  recordCount: number;
  content: string;
  contents: Array<string>;
  error: string;
  result: string;
  systemError: string;
}

/*

{
  "isMuteOnStart": "false",
  "isPrivateChatDisable": "false",
  "isPublicChatDisable": "false",
  "isRecord": "false",
  "isUserMicDisable": "false",
  "isUserWebCamDisable": "false",
  "isWebCamModeratorOnly": "false",
  "meetingID": "Omid_Daba",
  "moderatorPassword": "123456",
  "moderatorWelcomeMsg": "Welcome",
  "userName": "Omid",
  "viewerPassword": "123",
  "welcomeText": "Welcome 2"
}*/
