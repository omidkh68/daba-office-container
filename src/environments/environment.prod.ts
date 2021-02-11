import {EnvironmentInterface} from './environment-interface';

export const AppConfig: EnvironmentInterface = {
  production: true,
  environment: 'PROD',
  API_URL: 'http://192.168.110.179:3000/api',
  CONTAINER_URL: 'https://officecontainer.dabacenter.ir:3002',
  // CONTAINER_URL: 'https://gateway-test.dabacenter.ir:3002',
  SOCKET_URL: 'https://apiofficecontainer.dabacenter.ir:4000',
  CONF_URL: 'https://conference.dabacenter.ir/main.php',
  ADMIN_URL: 'https://admincontainer.dabacenter.ir',
  REALM: 'wrtcdaba.dabacenter.ir',
  PBX_LOGIN_EXTENSION: 'https://wrtcdaba.dabacenter.ir',
  WEBSOCKET_PROXY_URL: 'wss://wrtcdaba.dabacenter.ir:8089/ws',
  EVENT_HANDLER_URL : 'http://94.139.172.74:8080/eventhandler-0.0.1',
  // LMS_API: 'https://94.139.172.74:8080/bbb-0.0.1-SNAPSHOT'
  LMS_API: 'https://onlinelms.dabacenter.ir/bbb-0.0.1-SNAPSHOT'
};
