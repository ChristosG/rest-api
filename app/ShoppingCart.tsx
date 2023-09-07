import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Animated, ScrollView, Image, FlatList, Modal, TouchableWithoutFeedback, TouchableOpacity, Pressable, useColorScheme, StyleSheet, Dimensions, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import React, { createContext, useState, useRef, useEffect } from 'react';
import LoginButton from './LoginButton';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import Banner from '../components/Banner';
import DropdownMenu from '../components/DropdownMenu';
import CustomHeader from './CustomHeader';
import axios from 'axios';
import { MonoText } from '../components/StyledText';
import { StatusBar } from 'expo-status-bar';
import { useSignUpContext } from './SignUpContext';
import { useAppContext } from './AppContext';


const ShoppingCart = ({ cords }) => {

    const { quantityInCart, quantityAboveCart, updateQaboveCart, updateQinCart, cartQuantity, setCartQuantity, updateProductpage } = useAppContext();
    const { isSignedUp, setIsSignedUp, someValue } = useSignUpContext();
    const [isModalVisible, setModalVisible] = useState(false);
    const [buttonCoordinates, setButtonCoordinates] = useState({ x: cords.x, y: cords.y });
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    //const [cartQuantity, setCartQuantityINCart] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [names, setNames] = useState([]);
    const [productResults, setProductResults] = useState([]);
    const [images, setImages] = useState([]);
    const [resp, setResponse] = useState({});


    const handleMouseEnterCategory = (meti: any) => {
        setHoveredCategory(meti);
    };

    const handleMouseLeaveCategory = () => {
        setHoveredCategory(null);
    };


    useEffect(() => {
        fetchImages();
    }, [cartQuantity]);

    useEffect(() => {
        fetchProducts();
        //setButtonCoordinates({ x: cords.x, y: cords.y });
        showModal();
        fetchImages();

    }, []);

    const getImage = async (pid) => {
        try {
            const response = await axios.get(`http://localhost:9191/imageByProductId/${pid}`);
            return response.data[0].imageUrl;
        } catch (error) {
            console.error('Error fetching products:', error);

        }
    };

    const fetchImages = async () => {

        const response = await axios.get('http://localhost:9191/products');
        const imagePromises = response.data.map(async (product) => {
            const imageUrl = await getImage(product.id);
            return { [product.id]: imageUrl };
        });

        const resolvedImages = await Promise.all(imagePromises);
        const imagesObject = resolvedImages.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});

        setImageUrls(imagesObject);
        setResponse(response);
        setNames(response.data.reduce((acc, res) => {
            acc[res.id] = res.name;
            return acc;
        }, {}));
        //setNames(response.data.map(res => res.name));
    };

    /*const fetchImageUrls = async () => {
        try {
            const results = await Promise.all(
                cartQuantity.map(async (item) => {
                    const imageUrl = await getProductImage(item.product_id);
                    return {
                        id: imageUrl.id, availableQuantity: imageUrl.availableQuantity,
                        productImage: imageUrl.imageUrl, text: imageUrl.name,
                        info: imageUrl.info, price: imageUrl.price
                    };
                })
            );

            const imageUrls = results.map(result => result.productImage);
            const names = results.map(result => result.name);
            setProductResults(results);
            setImageUrls(imageUrls);
            setNames(names);
            console.log(imageUrls);

        } catch (error) {
            console.error('Error fetching image URLs:', error);
        }
    };

    const getProductImage = async (pid: String) => {
        try {
            const response = await axios.get(`http://localhost:9191/productId/${pid}`);
            console.log(response.data.imageUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
        }

    };
*/


    const fetchProducts = async () => {
        try {
            const user = !isSignedUp ? 'guest' : someValue.name;
            const response = await axios.get(`http://localhost:9191/getUserCart/${user}`);
            //setProducts(response.data);
            //console.log(response.data);
            setCartQuantity(response.data.map(cartQQ => ({
                id: cartQQ.id,
                name: cartQQ.name,
                product_id: cartQQ.product_id,
                quantity: cartQQ.quantity,
            })));

            console.log('cart', response.data);


        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const handleDeleteItem = async (itemCart) => {
        try {

            //console.log('hovCat', hoveredCategory.id);
            console.log('prodId', itemCart.id);
            const response = await axios.delete(`http://localhost:9191/deleteFromCartId/${itemCart.id}`);
            updateQaboveCart(quantityAboveCart - 1);
            updateQinCart(quantityInCart - itemCart.quantity);

            setCartQuantity((prevCart) =>
                prevCart.filter((item) => item.id !== itemCart.id)
            );

            setCartQuantity((prevCart) =>
                prevCart.filter((item) => item.id !== itemCart.id)
            );

            console.log('cq', cartQuantity);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const navigation = useNavigation();

    const handlePressItem = (pressedItem) => {

        console.log('pressed', pressedItem);
        console.log('pres2', productResults);
        try {
            console.log(productResults);

            const selectedProduct = resp.data.find(item => item.id === Number(pressedItem.product_id));
            console.log('selectedprod', selectedProduct);

            updateProductpage(selectedProduct);
            navigation.navigate('ProductPage', { productData: selectedProduct });

        } catch (error) {
            console.error('Error on product redirection:', error);
        }
    };

    const showModal = () => {
        setButtonCoordinates({ x: cords.x, y: cords.y });
        setModalVisible(true);
    };

    const viewCart = () => {
        console.log('view your cart');
    };

    const preventPropagation = (event) => {
        event.stopPropagation();
    };


    const scrollY = useRef(new Animated.Value(0)).current;
    const [scrollBarTop, setScrollBarTop] = useState(new Animated.Value(0));

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const scrollContentHeight = 230 + (cartQuantity.length - 3.6) * (224 / 3.6);
    const scrollViewHeight = 230;
    const scrollBarHeight = scrollViewHeight * (scrollViewHeight / scrollContentHeight);

    scrollY.addListener((value) => {
        if (cartQuantity.length > 3) {
            const maxScrollBarTop = scrollViewHeight - scrollBarHeight;
            const scrollPercentage = value.value;
            console.log('val', value.value)
            const newScrollBarTop = scrollPercentage * 1 / Math.log(cartQuantity.length - Math.log(cartQuantity.length - 1));

            setScrollBarTop(new Animated.Value(newScrollBarTop));
        }
    });


    return (

        <View style={styles.modalContainer}>
            <View
                style={[
                    styles.modalContent,
                    {
                        left: buttonCoordinates.x - 250,
                        top: buttonCoordinates.y + 14,
                    },
                ]}
            >
                <View style={styles.arrowContainer}>
                    <View style={styles.arrow} />
                </View>
                <Text style={styles.modalText}>
                    Your cart ({quantityInCart})  {/*get produicts apo to count db user cart*/}
                </Text>



                {isModalVisible && (
                    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                        <ScrollView
                            style={styles.scrollContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            scrollEventThrottle={16}
                            onScroll={onScroll}
                        //showsVerticalScrollIndicator={false}

                        >

                            {cartQuantity.map((item, index) => (

                                <View key={item.id}
                                    onClick={() => handlePressItem(item)}

                                    style={[
                                        styles.resultItem,
                                        (hoveredCategory === item) && styles.highlightedCategory,
                                    ]}
                                    onMouseEnter={() => handleMouseEnterCategory(item)}
                                    onMouseLeave={handleMouseLeaveCategory}>


                                    <Image source={{ uri: imageUrls[item.product_id] }} style={styles.productImage} />

                                    <View style={{ backgroundColor: 'transparent' }}>
                                        <Text style={[styles.resultText,
                                        (hoveredCategory === item) && { color: 'rgba(255, 192, 14, 1)' }]}>

                                            {names[item.product_id]}
                                        </Text>

                                        <MonoText style={[styles.monostyle,
                                        (hoveredCategory === item) && { color: 'rgba(255, 192, 14, 0.7)' }]}>
                                            Quantity:{item.quantity}
                                        </MonoText></View>

                                    <TouchableOpacity style={styles.trashIconContainer}>
                                        <FontAwesome
                                            name="trash"
                                            size={20}
                                            color="red"
                                            onPress={() => handleDeleteItem(item)}
                                            style={[styles.trashIcon,
                                            (hoveredCategory === item) && { color: 'rgba(255, 192, 14, 1)' }]} />
                                    </TouchableOpacity>

                                </View>
                            ))}
                        </ScrollView>
                        <View style={{
                            width: 10, height: 230, position: 'absolute', right: -10, top: 0,
                            backgroundColor: 'transparent', borderRadius: 8
                        }}>
                            {(cartQuantity.length > 3) &&
                                <Animated.View
                                    style={{
                                        width: '100%',
                                        height: scrollBarHeight,
                                        backgroundColor: 'rgba(10, 91, 233, 0.6)',
                                        position: 'absolute',
                                        top: scrollBarTop,
                                        borderRadius: 8
                                    }}
                                />}
                        </View>
                    </View>
                )}


                <TouchableOpacity style={styles.modalButton} onPress={viewCart}>
                    <Text style={{
                        color: 'rgba(255, 192, 14, 1)', fontSize: 14,
                        fontWeight: 'bold'
                    }}>View your cart</Text>
                </TouchableOpacity>
            </View>
        </View >

    );
};

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'transparent',
        // Add any additional styles you need for the header title
    },
    sss: {
        backgroundColor: '#3498db', // A nice blue color
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignSelf: 'center',
        //marginTop: 20,
        marginRight: 10,
    },
    signinButton: {
        paddingVertical: 7,
        paddingHorizontal: 16,
        alignSelf: 'center',
        //marginTop: 20,
        marginRight: 20,
        backgroundColor: 'rgba(10, 91, 233, 1)',
        borderRadius: 5,

        textAlign: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'rgba(255, 192, 14, 1)',
        fontSize: 16,
        justifyContent: 'center',
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'transparent'
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalContent: {
        position: 'absolute',
        width: 300,
        backgroundColor: 'rgba(255, 192, 14, 1)',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
    },
    modalText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
        color: 'rgba(10, 91, 233, 1)',
    },
    modalButton: {
        marginTop: 20,
        padding: 8,
        backgroundColor: 'rgba(10, 91, 233, 1)',
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center'
    },
    arrowContainer: {
        position: 'absolute',
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 10,
        backgroundColor: 'transparent',
        marginLeft: '78%'
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(255, 192, 14, 1)',
        //transform: [{ rotate: '180deg' }],
    },
    secondaryColor: {
        color: 'rgba(200, 200, 2, 1)',
    },

    resultsContainer: {
        //position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'rgba(10, 91, 233, 0.6)',
        //marginTop: '0%',
        borderRadius: 8,
        //elevation: 3,
    },
    resultText: {
        //padding: 8,
        fontWeight: 'bold',
        color: 'rgba(10, 91, 233, 1)'//'rgba(255, 192, 14, 1)'

    },
    monostyle: {
        fontSize: 11,
        fontWeight: '100',
        color: 'rgba(10, 91, 233, 0.6)'//'rgba(255, 192, 14, 0.6)'

    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: 'transparent',
        borderRadius: 8,

    },
    productImage: {
        width: 50,
        height: 45,
        marginRight: 8,
        resizeMode: 'contain'
    },
    scrollContainer: {
        maxHeight: 220,
        // backgroundColor: 'rgba(255, 192, 14, 1)',

    },
    scrollContent: {
        alignItems: 'auto',
        justifyContent: 'center',
    },
    modalButtons: {
        color: 'rgba(10, 91, 233, 1)'
    },
    trashIconContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: '6%',

    },
    trashIcon: {
        color: 'rgba(10, 91, 233, 0.6)',
    },
    highlightedCategory: {
        backgroundColor: 'rgba(10, 91, 233, 0.9)',
        //color: 'rgba(255, 192, 14, 1)',
    },
});

export default ShoppingCart;
