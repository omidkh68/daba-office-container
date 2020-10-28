export const AppConfig = {
  production: false,
  environment: 'LOCAL',
  API_URL: 'http://localhost:3000/api',
  // CONTAINER_URL: 'http://officecontainer.dabacenter.ir:3001',
  CONTAINER_URL: 'http://gateway-test.dabacenter.ir:3002',
  SOCKET_URL: 'http://apiofficecontainer.dabacenter.ir:4000',
  CONF_URL: 'https://conference.dabacenter.ir/main.php',
  ATTENDANCE_URL: 'http://loginofficecontainer.dabacenter.ir/api',
  WRTC_URL: 'http://wrtc.dabacenter.ir/api',
  ADMIN_URL: 'http://admincontainer.dabacenter.ir',
  EIS_URL: 'https://eis.enoox.com',
  // REALM: '213.202.217.19',
  REALM: '44.238.165.42',
  // WEBSOCKET_PROXY_URL: 'wss://213.202.217.19:8089/ws',
  WEBSOCKET_PROXY_URL: 'wss://44.238.165.42:8089/ws',
  //EVENT_HANDLER_URL : 'http://192.168.110.156:8080/eventhandler-0.0.1'
  EVENT_HANDLER_URL : 'http://94.139.172.74:8080/eventhandler-0.0.1',
  LMS_API: 'http://192.168.110.156:8080/bbb-0.0.1-SNAPSHOT',
  EVENT_HANDLER_WS : 'http://94.139.172.74:8080/eventhandler-0.0.1/api'
};
