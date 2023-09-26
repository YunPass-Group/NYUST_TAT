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
import { HomeScreen } from './src/screens/';

const Tab = createBottomTabNavigator();

function App() {

  const scheme = useColorScheme();


  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Tab.Navigator
        screenOptions={{
          headerShadowVisible: true,
          tabBarStyle: {
            position: 'absolute',
            bottom: Platform.OS === 'ios' ? 0 : 30,
            left: Platform.OS === 'ios' ? 0 : 20,
            right: Platform.OS === 'ios' ? 0 : 20,
            borderRadius: Platform.OS === 'ios' ? 0 : 15,
            borderWidth: 0,
            height: Platform.OS === 'ios' ? 83 : 80,
            paddingBottom: Platform.OS === 'ios' ? 35 : 10,
          },
          tabBarActiveTintColor: '#2A9D8F',
          tabBarBackground: Platform.OS === 'ios' ? () => (
            <BlurView
              tint={scheme === "dark" ? "dark" : "light"}
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ) : () => null,
        }}>
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <Ionicons name="ios-home" size={size} color={color} /> }} name="Home" component={HomeScreen} />
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <MaterialCommunityIcons name="bulletin-board" size={size} color={color} /> }} name="Info" component={() => <Text>hi</Text>} />
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <Ionicons name="ios-calendar" size={size} color={color} /> }} name="Calender" component={() => <Text>hi</Text>} />
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <FontAwesome name="table" size={size} color={color} /> }} name="ClassTable" component={() => <Text>hi</Text>} />
        <Tab.Screen options={{ headerShown: false, tabBarIcon: ({size, color}) => <MaterialIcons name="account-circle" size={size} color={color} /> }} name="Profile" component={() => <Text>hi</Text>} />
      </Tab.Navigator>
      <StatusBar style={scheme === 'dark' ? "auto" : "light"} />
    </NavigationContainer>
  );
}

export default App;