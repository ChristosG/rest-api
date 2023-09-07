import React, { useState } from 'react';
import { Text, View } from '../components/Themed';
import { useRoute } from '@react-navigation/native';
import { Pressable, Platform, StyleSheet, useColorScheme, TextInput, Button, Dimensions } from 'react-native';
import { SplashScreen, Stack, Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import { useAppContext } from './AppContext';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSignUpContext } from './SignUpContext';

const MyProfile: React.FC<{ profileData: any }> = ({ profileData }) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const colorScheme = useColorScheme();
  const route = useRoute();
  const responseData = route.params.profileData;
  console.log('MyProf', responseData);
  const { updateSomeValue } = useAppContext();

  const { updateSignedUser } = useSignUpContext();
  updateSignedUser(responseData);

  const navigation = useNavigation();

  const items = [
    { id: 1, text: 'Subscriptions' },
    { id: 2, text: 'My Training' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
    { id: 5, text: 'Item 5' },
    { id: 6, text: 'Item 6' },
  ];

  const handleItemPress = async (id: number, responseData: any) => {
    if (id === 1) {
      navigation.navigate('Subscription', { dataTransfer: responseData });
    }
    if (id === 2) {
      try {
        const trainingData = await axios.get(`http://localhost:9191/training/${responseData.name}`);
        //console.log(trainingData.status);
        updateSomeValue(trainingData.data.name);

        navigation.navigate('Training', { dataTransfer: trainingData });

      } catch (error) {
        console.error('Error signing in:', error);
        if (error.response && error.response.status === 500) {
          console.log('Training error');
        }
      }
    }
  };

  return (

    <View style={styles.container}>
      <Text style={styles.introText}>Select a category</Text>
      <View style={styles.gridContainer}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.gridItem,
              item.id === hoveredItem && styles.hoveredGridItem,
            ]}
            onPress={() => handleItemPress(item.id, responseData)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  hoveredGridItem: {
    transform: [{ scale: 1.1 }],
    shadowColor: 'rgba(255, 240, 23, 0.8)',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  introText: {
    fontSize: 18,
    marginBottom: 10,
  },

  gridItem: {
    width: '30%',
    height: '70%',
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 240, 23, 0.8)',
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: 'rgba(64, 84, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',

  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(243, 108, 11, 0.9)',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  heads: {

    fontSize: '20px',
    fontWeight: 'bold',

  },

});

export default MyProfile;

