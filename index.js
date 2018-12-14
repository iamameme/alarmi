/** @format */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Platform } from 'react-native';
import { setCustomSourceTransformer } from 'react-native/Libraries/Image/resolveAssetSource';

setCustomSourceTransformer(function (resolver) {

    if (Platform.OS === 'android'
        && !resolver.serverUrl
        && !resolver.bundlePath
        && resolver.asset.type === 'html') {
        resolver.bundlePath = '/android_asset/';
    }

    return resolver.defaultAsset();
});

AppRegistry.registerComponent(appName, () => App);
