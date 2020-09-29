import 'react-native-gesture-handler';
import * as React from 'react';
import { Root } from 'native-base'
import { StatusBar } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/home'
import DetailScreen from './src/screens/detail'

const Stack = createStackNavigator();

function App() {
  return (
    <Root>
      <StatusBar backgroundColor={'#000'} />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
}

export default App;