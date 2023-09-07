import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ScreenAdmin from '../components/ScreenAdmin';
import { Text, View } from '../components/Themed';
import { StyleSheet, Dimensions, Pressable, TextInput, TouchableWithoutFeedback, Modal } from 'react-native';



const AdminTool: React.FC<{ profileData: any }> = ({ profileData }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [quantity, setQuantity] = useState<string>('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>('');


    const goToImageUploader = () => {
        navigation.navigate('ImageUploader', { profileData: profileData });
    };
    const goToDBM = () => {
        navigation.navigate('DBManager');
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setUploadedImageUrl(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleUpload = async () => {
        if (selectedFile && title && category && price && quantity) {
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
                setModalMessage('Error: product already exists');
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

        <View style={[styles.container]}>
            <View style={{
                flexDirection: 'row', justifyContent: 'center',
                alignContent: 'center'
            }}>
                <Pressable style={styles.buttons} onPress={goToImageUploader}>
                    <Text style={styles.buttonText}>Upload a new product</Text>
                </Pressable>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold', marginTop: '1.6%', marginLeft: '3%', marginRight: '3%',
                }}> or </Text>
                <Pressable style={styles.buttons} onPress={goToDBM}>
                    <Text style={styles.buttonText}>Manage existing products</Text>
                </Pressable>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.3)" />


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
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
        width: '10%',
        height: '100%',
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
        marginTop: '5%'
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


export default AdminTool;
