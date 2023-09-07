import React, { useState, useEffect } from 'react';
import { Text, View } from '../components/Themed';
import { useRoute } from '@react-navigation/native';
import { Image, Pressable, Platform, StyleSheet, useColorScheme, TextInput, Button, Dimensions } from 'react-native';
import { SplashScreen, Stack, Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import { useAppContext } from './AppContext';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useSignUpContext } from './SignUpContext';

const ProductPage: React.FC<{ productData: any }> = ({ productData }) => {
    const [productImages, setProductImages] = useState<string[]>([]);
    const route = useRoute();
    const responseData = route.params.productData;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {

        axios
            .get(`http://localhost:9191/imageByProductId/${responseData.id}`)
            .then((response) => {

                //let firstImage = [responseData.productImage];
                const imageUrls = response.data.map((image: any) => image.imageUrl);
                //const allImages = firstImage.concat(imageUrls);
                setProductImages(imageUrls);

            })
            .catch((error) => {
                console.error('Error fetching product images:', error);
            });
    }, [responseData.id]);


    const goToPreviousImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
        if (currentIndex == 0) {
            setCurrentIndex(productImages.length - 1);
        }
        // if indx = 0 go to last img (indx = images.length)
    };

    const goToNextImage = () => {
        if (currentIndex < productImages.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
        if (currentIndex == productImages.length - 1) {
            setCurrentIndex(0);
        }
        //if images.lnght go to 0
    };

    console.log('inside prod', responseData);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={goToPreviousImage}
                //disabled={currentIndex === 0}
                >
                    {productImages.length > 1 && <Text style={styles.arrowText}>{'<'}</Text>}
                </TouchableOpacity>
                <Image
                    source={{ uri: productImages[currentIndex] }}
                    style={styles.image}
                />

                <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={goToNextImage}
                // disabled={currentIndex === productImages.length - 1}
                >
                    {productImages.length > 1 && <Text style={styles.arrowText}>{'>'}</Text>}
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>{responseData.name}</Text>
            <View style={styles.separator} />
            <Text style={styles.info}>{responseData.info}</Text>
            <Text style={styles.price}>Price: €{responseData.price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    image: {
        width: 450,
        height: 450,
        marginBottom: 20,
        resizeMode: 'contain',

    },
    text: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: '1%',
        marginTop: '1%',

    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
    price: {
        fontSize: 17,
        fontWeight: 'bold',
    },


    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2%'
    },
    arrowButton: {
        margin: '7%',
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 192, 14, 1)',
        borderRadius: 360,
    },
    arrowText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: '-20%',
        //margin: '5%',
        //  marginLeft: '-10%',
        // marginRight: '-10%',
        color: 'rgba(10, 91, 233, 0.8)'
    },

});

export default ProductPage;

