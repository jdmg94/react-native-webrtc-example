# Basic React-Native-WebRTC example app

## Motivation

Real Time Technologies are back in style, while this is fairly standard on the Web platforms, React Native faced a steeper learning curve to get into WebRTC Technologies specially without Expo support for native modules.

I wanted to provide the most basic codebase to provide a starting point for developers looking at WebRTC technologies for React Native using `react-native-webrtc` and `react-native@^0.60` with as little overhead as possible.


As it is also required on the Web Standard, RTC technologies require a broker to help with the signaling of its peers, this has also been included in the form of a thin `express`/`socket.io` server under the `./backend` folder, 

>Of course this is only going to be a local instance of the broker so you will have to expose it using a service like [localTunnel](https://github.com/localtunnel/localtunnel) or [ngrok](https://ngrok.com/) so 2 people on different networks will be able to use the client app, remember to update the socket address on the code if you do this.

## Usage

First you need to start the signaling server so we can handle the peer activity, you can do this by running `cd ./backend && npm install && npm start` on a terminal window located at the project's path.

Once you have the signaling server up you need to launch the client app and the process is a little different for each platform. For the best DX you should use a real device.

### Android 

For Android the setup has been tweaked for `react-native^0.60` and if you want to replicate this on your own project you should take a look at the following files to extrapolate the config:

-  `./android/settings.graddle`
-  `./android/graddle.properties`
-  `./android/build.graddle`
-  `./android/app/build.graddle`
-  `./android/app/src/AndroidManifest.xml`
-  `./android/app/src/main/java/com/basicwebrtcexample/MainApplication.java`


to run the client app just have your physical android device connected and listed under `adb devices`, once your physical device is connected and trusted just run `npm run android`

### ios

For iOS most of the legwork is done with cocoapods, if you want to extrapolate the config for your project take a look at the following files:

- `./ios/podfile`
- `./ios/basicwebrtcexample/info.plist`

once you have updated your config files, run `npx pod-install` at the root of the project.

to run the client app run `npm start` on a separate terminal located at the project root and have your iPhone connected and authorized on your Mac then open Xcode and select the workspace for your project, then give the main project signing capabilities and select your iPhone on the emulator options, then hit run, after the debugger is installed you can close xcode.

Copyleft: **Jose Munoz 2020**

