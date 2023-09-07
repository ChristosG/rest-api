import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button, Pressable, TouchableOpacity } from 'react-native';
import { Link, Tabs } from 'expo-router';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Banner from '../components/Banner';
import React, { useState, createContext } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';
import { useSignUpContext } from './SignUpContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';

const LoginButton: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { updateSomeValue, updateQaboveCart, updateQinCart } = useAppContext();
  const { isSignedUp, setIsSignedUp, updateSignedUser } = useSignUpContext();


  const navigation = useNavigation();

  const handleNewAccount = () => {
    navigation.navigate('SignupScreen');

  };

  const handleSignin = async () => {
    setSignupSuccess(false);
    setSignupError('');
    setRedirect(false);

    try {
      const response = await axios.post('http://localhost:9191/getUser', {
        name: username,
        password: password,

      });

      if (response.data === 'Login successful') {
        if (username === 'admin') {
          setRedirect(true);
          setSignupSuccess(true);
          const profileId = await axios.get(`http://localhost:9191/user/${username}`);

          updateSomeValue(profileId.data.name);

          navigation.navigate('AdminTool', { profileData: profileId.data });

        }
        else {
          setRedirect(true);
          setSignupSuccess(true);

          console.log('Successful login');
          const profileId = await axios.get(`http://localhost:9191/user/${username}`);
          setIsSignedUp(true);
          updateSignedUser(profileId.data);
          updateSomeValue(profileId.data.name);

          const getCart = await axios.get(`http://localhost:9191/getUserCart/${username}`);
          //console.log('distinct items', getCart.data.length);
          var q = 0;
          getCart.data.forEach((item) => {
            q += item.quantity;
          });
          //console.log('quantity sum', q);
          updateQinCart(q);
          updateQaboveCart(getCart.data.length);
          navigation.navigate('MyProfileTab');
        }
        /*if(redirect){
          const profileId = await axios.get('http://localhost:9191/user/tre');
          navigation.navigate('MyProfile', { profileData : profileId.data });
        }*/

      } else {
        setSignupError('Invalid username or password');

      }

      /* if (response.data === 'Login failed') {
         console.log('Invalid username or password');
         console.log(response.data);
         setSignupError('Invalid username or password');
 
       }*/
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.response && error.response.status === 500) {
        setSignupError('Invalid username or password');
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View>
        <Text>{signupSuccess && <Text style={styles.successText}>Sign in successful!</Text>}</Text>
        <Text> {signupError && <Text style={styles.errorText}>{signupError}</Text>}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Text style={{
          fontSize: 16,
          marginTop: 30,
          marginBottom: -10,
        }}>Password:</Text>
      </View>

      <View style={styles.passwordContainer}>

        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={text => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}
          style={styles.togglePasswordButton}>
          {!showPassword ?
            <FontAwesome
              name="eye"
              size={23}
              style={[{ color: 'rgba(10, 91, 233, 0.4)', position: 'absolute' }]}
            />
            : <Entypo
              name="eye-with-line"
              size={23}
              style={[{ color: 'rgba(10, 91, 233, 0.4)', position: 'absolute' }]}
            />}
        </TouchableOpacity>
      </View>
      <Pressable style={[styles.buttons, { marginTop: '4%', width: '8%' }]}
        onPress={handleSignin}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
      <Text style={styles.orStyle}>or</Text>
      <Pressable
        style={[styles.buttons, { width: '15%' }]}
        onPress={handleNewAccount}>
        <Text style={styles.buttonText}>Create an account</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orStyle: {
    fontSize: 20,
    margin: '1%',
    color: 'lightblue'
  },
  buttons: {
    backgroundColor: 'rgba(10, 91, 233, 1)',
    color: "black",
    borderRadius: 5,

    height: '6%',
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgba(255, 192, 14, 1)',
    fontSize: 16,
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: '16%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  successText: {
    color: 'green',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordContainer: {
    //flexDirection: 'row',
    marginBottom: 15,
    width: '16%',
    //alignItems: 'center',
    backgroundColor: 'transparent'
  },
  passwordInput: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(10, 91, 233, 1)',
    color: 'rgba(255,255,255,0.2)',
    padding: 8,
    marginBottom: 16,

  },
  togglePasswordButton: {
    //padding: 8,
    marginTop: -33,
    marginLeft: '90%',
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,

  },
});

export default LoginButton;
