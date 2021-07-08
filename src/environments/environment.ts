// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://api.mtalk.chat/parse',
  appId: 'yourappid',
  restApiKey: '',
  liveQueryUrl: 'wss://ws.mtalk.chat',
};

// export const environment = {
//   production: false,
//   baseUrl: 'http://localhost:1337/parse',
//   appId: 'yourappid',
//   restApiKey: '',
//   liveQueryUrl: 'ws://localhost:1337',
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
const vapid = {
  publicKey:
    'BD1_UC6deVVg4rn7jvj6NeJOrYIf9UkL1RCngay3Oixv1ZOYa4N1F0-L9zI3CbjY3OzapnZswCuKQA6lyTAZP5U',
  privateKey: 'AFFYvPSDLo6FejysOSq9ctxp--lYqmI13GC3qwKQHig',
};
