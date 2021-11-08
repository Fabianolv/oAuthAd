import React, {useContext, useEffect} from 'react';
import {
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {createAppContainer, NavigationContext} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

const Dashboard = () => {
  const navigation = useContext(NavigationContext);

  const {
    state: {params},
  } = navigation;

  console.log(params);

  return (
    <View>
      <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
        Logado
      </Text>
    </View>
  );
};

const getDeepLink = (path = '') => {
  const scheme = 'my-scheme';
  const prefix =
    Platform.OS === 'android' ? `${scheme}://my-host/` : `${scheme}://`;
  return prefix + path;
};

const Home = () => {
  const navigation = useContext(NavigationContext);

  const openUrl = async () => {
    try {
      const deepLink = getDeepLink('callback');

      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(
          `http://localhost:3000/test?redirect_uri=${deepLink}`,
          deepLink,
          {
            animated: true,
            dismissButtonStyle: 'cancel',
            showTitle: true,
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right',
            },
          },
        );

        if (result.type === 'success' && result.url) {
          Linking.openURL('my-scheme://callback');
        }
      }
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity onPress={openUrl}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Dashboard');
        }}>
        <Text style={{fontSize: 24, fontWeight: 'bold', color: 'black'}}>
          Dashboard
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const AppStack = createStackNavigator(
  {
    Home: {
      screen: Home,
    },
    Dashboard: {
      screen: Dashboard,
      path: 'callback/',
    },
  },
  {
    initialRouteName: 'Home',
    index: 0,
    headerMode: 'none',
  },
);

const Container = createAppContainer(AppStack);

const App = () => <Container uriPrefix={getDeepLink()} />;

export default App;
