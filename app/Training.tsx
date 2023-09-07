import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Title, Subheading } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
type StackParamList = {
  Training: {
    miles: number;
    calories: number;
  };
};



const Training: React.FC<{ dataTransfer: any }> = ({ dataTransfer }) => {
  const route = useRoute();
  const responseData = route.params.dataTransfer;
  console.log('Training: ', responseData.data);

  const [smartTrue, setSmartTrue] = useState(false);
  const [smartError, setSmartError] = useState('');
  // const [currentUser, setCurrentUser] = useState('');
  //setCurrentUser(responseData.data.name);
  const [milez, setMilez] = useState(responseData.data.miles);
  const [caloriez, setCaloriez] = useState(responseData.data.calories);

  const [showModal, setShowModal] = useState(false);
  const [selectedMilez, setSelectedMilez] = useState(milez);
  const [selectedCaloriez, setSelectedCaloriez] = useState(caloriez);

  const handleModalConfirm = async (responseData: any) => {
    setMilez(selectedMilez);
    setCaloriez(selectedCaloriez);
    try {
      await axios.put(`http://localhost:9191/updateTraining`, {
        name: responseData.data.name,
        miles: selectedMilez,
        calories: selectedCaloriez
      });
      setSmartTrue(true);

    } catch (error) {
      console.error('smart Error:', error);
      if (error.response && error.response.status === 500) {
        setSmartError('smart Error');
      }
    }

    setSmartError('');
    setShowModal(false);
  };

  const handleSmartWatch = () => {
    setShowModal(true);
    setSmartTrue(true)
  };
  const handleClose = () => {
    setShowModal(false);
  };


  return (

    <View style={styles.container}>

      <Title style={styles.title}>Training Details</Title>
      <View style={styles.detailsContainer}>
        {milez !== 0 && <Subheading style={styles.detailText}>Miles: {milez}</Subheading>}
        {caloriez !== 0 && <Subheading style={styles.detailText}>Calories: {caloriez}</Subheading>}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSmartWatch()}
      >
        <Text style={styles.buttonText}>Import from smartwatch</Text>
      </TouchableOpacity>


      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Insert into db Miles and Calories for user: <Text style={styles.secondaryColor}>{responseData.data.name}</Text></Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabelText}>Miles: <Text style={styles.secondaryColor}>{selectedMilez}</Text></Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={selectedMilez}
              onValueChange={value => setSelectedMilez(value)}
            />
          </View>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabelText}>Calories: <Text style={styles.secondaryColor}>{selectedCaloriez}</Text></Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={selectedCaloriez}
              onValueChange={value => setSelectedCaloriez(value)}
            />
          </View>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => handleModalConfirm(responseData)}

          >
            <Text>OK</Text>
          </TouchableOpacity>

        </View>
      </Modal>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  slider: {
    color: 'rgba(200, 200, 2, 1)',
    //backgroundColor: 'rgba(200, 200, 2, 0.1)',
    width: 200,
  },
  title: {
    marginBottom: 20,
    fontSize: 24,
    color: 'gray'
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailText: {
    fontSize: 18,
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: 'purple',
    justifyContent: 'center',
  },
  button: {
    width: '20%',
    height: '7%',
    paddingVertical: 10,
    backgroundColor: 'orange',
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center',

  },
  modalContainer: {
    //flex: 1,
    marginLeft: '40%',
    marginTop: '17%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 120, 0.9)',
    width: '20%',
    height: '50%',
    borderRadius: 10,
    padding: 25,
  },

  modalButton: {
    backgroundColor: 'rgba(200, 200, 2, 1)',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '30%',
    textAlign: 'center',

  },

  modalText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'rgba(200, 33, 33, 1)',
    textAlign: 'center',
  },
  sliderContainer: {
    marginBottom: 20,
    width: '80%',
  },
  sliderLabelText: {
    fontSize: 16,
    color: 'rgba(200, 33, 33, 1)',
    marginBottom: 8,
    textAlign: 'center',
  },

  secondaryColor: {
    color: 'rgba(200, 200, 2, 1)',

  }



});

export default Training;
