import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ScreenAdmin from '../components/ScreenAdmin';
import { Text, View } from '../components/Themed';
import { StyleSheet, Dimensions, Pressable, TextInput, TouchableWithoutFeedback, Modal } from 'react-native';



const ImageUploader: React.FC<{ profileData: any }> = ({ profileData }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>('');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setUploadedImageUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUpload = async () => {
    console.log(selectedFile, title, category, price, quantity);
    if (selectedFile) {//} && title && category && price && quantity) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', title);
      formData.append('price', price);
      formData.append('info', category);
      formData.append('availableQuantity', quantity);


      try {
        const response = await axios.post('http://localhost:9191/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Product uploaded:', response.data);
        setModalMessage('Upload successful!');
        setShowUploadModal(true);
      } catch (error) {
        console.error('Error uploading product:', error);

        if (!title) {
          setModalMessage('Error: insert title');
        }
        else if (!price) {
          setModalMessage('Error: insert price');
        }
        else if (!quantity) {
          setModalMessage('Error: insert quantity');
        } else {
          setModalMessage('Error: product already exists');
        }
        setShowUploadModal(true);
      }
    }
  };
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

  const fileInputRef = useRef(null);

  const handleFileButtonPress = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const hideUploadModal = () => {
    setShowUploadModal(false);
    //setButtonCoordinates({ x: buttonCoordinates.x, y: buttonCoordinates.y });

  };

  return (

    <View>

      <View style={styles.container}>
        <Pressable onPress={handleFileButtonPress} style={styles.chooseButton}>
          <Text style={styles.buttonText}>Choose Image</Text>
        </Pressable>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <Pressable style={styles.buttons} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload</Text>
        </Pressable>
        <TouchableWithoutFeedback onPress={hideUploadModal}>
          <Modal
            visible={showUploadModal}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.messageBox}>
                <Text style={styles.messageText}>{modalMessage}</Text>
              </View>
              <Pressable onPress={hideUploadModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>

          </Modal>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.3)" />

      <View style={styles.containerImage}>
        {uploadedImageUrl && (
          <img
            src={uploadedImageUrl}
            alt="Uploaded Product"
            style={{ maxWidth: '100%', maxHeight: '300px', margin: '20px 0' }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '3%'
  },
  containerImage: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '-2%'
  },
  chooseButton: {
    backgroundColor: 'rgba(10, 91, 233, 1)',
    color: "black",
    borderRadius: 5,
    width: '12%',
    height: '17%',
    textAlign: 'center',
    justifyContent: 'center',
    margin: 5
  },
  buttons: {
    backgroundColor: 'rgba(10, 91, 233, 1)',
    color: "black",
    borderRadius: 5,
    width: '8%',
    height: '17%',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 15
  },
  buttonText: {
    color: 'rgba(255, 192, 14, 1)',
    fontSize: 16,
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginLeft: '-10%',
    marginVertical: 30,
    height: 1,
    width: '120%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: '13%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  messageBox: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 192, 14, 1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(10, 91, 233, 1)'
  },
  closeButton: {
    marginTop: '-3%',
    backgroundColor: 'rgba(10, 91, 233, 1)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});


export default ImageUploader;
