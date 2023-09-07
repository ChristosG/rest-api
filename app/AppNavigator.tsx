import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabOneScreen from './(tabs)/index';
import SignUpPage from './SignupScreen';
import MyProfile from './MyProfile';
import RootLayout from './_layout';
import Training from './Training';
import LoginButton from './LoginButton';
import ImageUploader from './ImageUploader';
//import Subscription from './Subscription';
import MyProfileTab from './(tabs)/MyProfileTab';
import ProductPage from './ProductPage';
import TabTwoScreen from './(tabs)/two'
import DBManager from './DBManager';
import AdminTool from './AdminTool';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={TabOneScreen} />
      <Stack.Screen name="two" component={TabTwoScreen} />

      <Stack.Screen name="LoginButton" component={LoginButton} />
      <Stack.Screen name="SignupScreen" component={SignUpPage} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="RootLayout" component={RootLayout} />
      <Stack.Screen name="Training" component={Training} />
      <Stack.Screen name="ImageUploader" component={ImageUploader} />
      <Stack.Screen name="MyProfileTab" component={MyProfileTab} />
      <Stack.Screen name="ProductPage" component={ProductPage} />
      <Stack.Screen name="AdminTool" component={AdminTool} />
      <Stack.Screen name="DBManager" component={DBManager} />




    </Stack.Navigator>
  );
};

export default AppNavigator;
