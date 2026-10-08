import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Splash } from './views/Splash';
import { Dashboard3D } from './views/Dashboard3D';
import { Recipes3D } from './views/Recipes3D';
import { LeakTest } from './views/LeakTest';
import { Settings } from './views/Settings';
import { About } from './views/About';

const Stack = createNativeStackNavigator();

export const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Dashboard" component={Dashboard3D} />
        <Stack.Screen name="Recipes" component={Recipes3D} />
        <Stack.Screen name="LeakTest" component={LeakTest} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};