import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { useColorScheme, StyleSheet, Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';


//constant
import { NYUSTTheme } from './src/constants/';

// screens

import { HomeScreen, LoginScreen } from './src/screens/';
import ClassTableScreen from './src/screens/ClassTable/ClassTableScreen';
import ProfileScreen from './src/screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

function App() {

  const scheme = useColorScheme();


  return (
    <NavigationContainer theme={DarkTheme} >
    <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShadowVisible: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 0 : 20,
            left: Platform.OS === 'ios' ? 0 : 20,
            right: Platform.OS === 'ios' ? 0 : 20,
            borderRadius: Platform.OS === 'ios' ? 0 : 15,
            borderWidth: 0,
            height: Platform.OS === 'ios' ? 83 : 70,
            paddingBottom: Platform.OS === 'ios' ? 35 : 15,
            paddingTop: Platform.OS === 'ios' ? 0 : 15,
            overflow: 'hidden',
          },
          tabBarActiveTintColor: '#2A9D8F',
          tabBarBackground:  () => (
            <BlurView
              tint='dark'
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}>
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <Ionicons name="ios-home" size={size} color={color} /> }} name="首頁" component={HomeScreen} />
        {/* <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <MaterialCommunityIcons name="bulletin-board" size={size} color={color} /> }} name="校園資訊" component={ClassTableScreen} /> */}
        {/* <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <Ionicons name="ios-calendar" size={size} color={color} /> }} name="行事曆" component={() => <Text>hi</Text>} /> */}
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <FontAwesome name="table" size={size} color={color} /> }} name="課表" component={ClassTableScreen} />
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <MaterialIcons name="account-circle" size={size} color={color} /> }} name="設定檔" component={LoginScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;