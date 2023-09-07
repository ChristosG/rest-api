import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Button, Pressable, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Banner from '../components/Banner';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';
import { useSignUpContext } from './SignUpContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';


const SignupScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigation = useNavigation();
  const { updateSomeValue } = useAppContext();
  const { isSignedUp, setIsSignedUp, updateSignedUser } = useSignUpContext();


  const handleSignup = async () => {
    setSignupSuccess(false);
    setSignupError('');

    try {
      const response = await axios.post('http://localhost:9191/addUser', {
        id: 15,
        name: username,
        password: password,
      });

      console.log(response.data);
      if (response.data === username) {
        await axios.post(`http://localhost:9191/addTraining`, {
          name: username,
          miles: 0,
          calories: 0,

        });
        console.log('User registered successfully');
        setSignupSuccess(true);
        const profileId = await axios.get(`http://localhost:9191/user/${username}`);
        setIsSignedUp(true);
        updateSignedUser(profileId.data);
        updateSomeValue(profileId.data.name);
        navigation.navigate('MyProfileTab');
        //navigation.navigate('MyProfile', { profileData : profileId.data });

      } else {
        console.log('Empty Password');
        setSignupError('Empty password');

      }

    } catch (error) {
      console.error('Error signing up:', error);
      if (error.response && error.response.status === 500) {
        setSignupError('Username already exists');
      }
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <View>
        <Text>{signupSuccess && <Text style={styles.successText}>Signup successful!</Text>}</Text>
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

        onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign up</Text>
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

export default SignupScreen;
