import {
  NavigationContainer, 
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { StatusBar } from "expo-status-bar";
import { useColorScheme, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//constant
import { NYUSTTheme } from './src/constants/';

// screens
import { HomeScreen } from './src/screens/';

const Tab = createBottomTabNavigator();

function App() {
  
  const scheme = useColorScheme();
  

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* <Tab.Screen name="Settings" component={() => <Text>hi</Text>} /> */}
      </Tab.Navigator>
      <StatusBar style={scheme === 'dark' ? "auto" : "light"} />
    </NavigationContainer>
  );
}

export default App;