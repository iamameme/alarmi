/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { createStackNavigator, DrawerNavigator } from 'react-navigation';
import { Root, StyleProvider } from 'native-base';
import SideBar from './components/SideBar/SideBar';
import AlarmView from './components/Alarms/Alarms';
import MainView from './components/View/View';
import CommentView from './components/Comments/Comments';
import SettingsView from './components/Settings/Settings';
import SearchView from './components/Search/Search';
import WebViewView from './components/WebView/WebView';
import ActiveAlarmView from './components/ActiveAlarm/ActiveAlarm';
import IntroView from './components/IntroView/Intro';

import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import commonColor from './native-base-theme/variables/commonColor';

const StackNavigator = createStackNavigator({
  Home: { screen: AlarmView },
  Comments: { screen: CommentView },
  Settings: { screen: SettingsView },
  Search: { screen: SearchView },
  WebView: { screen: WebViewView }
},
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  });

const RootStack = createStackNavigator(
  {
    Main: {
      screen: StackNavigator,
    },
    ActiveAlarm: {
      screen: ActiveAlarmView,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const RootRootStack = createStackNavigator(
  {
    Main: {
      screen: RootStack,
    },
    Intro: {
      screen: IntroView,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AppNavigator = DrawerNavigator({
  HomePage: {
    screen: RootRootStack,
  },
}, {
    contentComponent: props => <SideBar {...props} />,
    /* drawerOpenRoute: 'DrawerOpen',
      drawerCloseRoute: 'DrawerClose',
      drawerToggleRoute: 'DrawerToggle',*/
    drawerWidth: 300,
  });


export default class App extends Component {
  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Root>
          <AppNavigator />
        </Root>
      </StyleProvider>
    )
  }
}
