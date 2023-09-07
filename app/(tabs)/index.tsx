import { StyleSheet, Button, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import Banner from '../../components/Banner';
import ScreenInfoTwo from '../../components/ScreenInfoTwo';


export default function TabOneScreen() {
  const [inputHeight, setInputHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const updateHeight = () => {
      setInputHeight(Dimensions.get('window').height);
    };

    Dimensions.addEventListener('change', updateHeight);

    return () => {
      Dimensions.removeEventListener('change', updateHeight);
    };
  }, []);

  return (

    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.3)" />
      <Text style={styles.body}>Shop bins, books or bottles!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '3%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  body: {
    fontSize: 18
  },
});
