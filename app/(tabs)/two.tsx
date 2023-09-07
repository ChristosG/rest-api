import { Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Pressable, Button } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

import ScreenInfoTwo from '../../components/ScreenInfoTwo';
import { Text, View } from '../../components/Themed';
import Banner from '../../components/Banner';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useSignUpContext } from '../SignUpContext';
//import { useQuantityContext } from '../QuantityContext';
import { useAppContext } from '../AppContext';

const isMobile = Dimensions.get('window').width < 600;

const CustomScrollBar = ({ contentHeight, visibleHeight, scrollY }) => {
  const scrollBarHeight = (visibleHeight / contentHeight) * visibleHeight;
  const scrollBarTop = (scrollY / contentHeight) * visibleHeight;

  return (
    <View style={styles.scrollBarContainer}>
      <View
        style={[
          styles.scrollBar,
          { height: scrollBarHeight, top: scrollBarTop },
        ]}
      />
    </View>
  );
};

export default function TabTwoScreen() {
  const [inputHeight, setInputHeight] = useState(Dimensions.get('window').height);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);

  const [productsArray, setProductsArray] = useState([]);
  const { isSignedUp, setIsSignedUp, someValue } = useSignUpContext();
  const [quantity, setQuantity] = useState(0);
  //const [cartQuantity, setCartQuantity] = useState([]);
  const { quantityInCart, quantityAboveCart, updateQaboveCart, updateQinCart,
    updateProductpage, cartQuantity, setCartQuantity } = useAppContext();

  const navigation = useNavigation();

  const getSelectedQuantity = (pid) => {
    // updateCartQuantity(cartQuantity);
    const cartItem = cartQuantity.find((cartQ) => cartQ.product_id === String(pid));
    const cartQuantityToShow = cartItem ? cartItem.quantity : 0;
    return cartQuantityToShow;
  };


  const addToCart = async (product) => {
    try {

      const user = isSignedUp ? someValue.name : 'guest';
      const getQuantity = await axios.get(`http://localhost:9191/getUserCart/${user}`);
      setCartQuantity(getQuantity.data.map(cartQQ => ({
        id: cartQQ.id,
        name: cartQQ.name,
        product_id: cartQQ.product_id,
        quantity: cartQQ.quantity,
      })));

      // updateCartQuantity(cartQuantity);
      updateQinCart(quantityInCart + 1);

      //console.log('getQ', getQuantity.data);
      //console.log('Qabove', cartQuantity);

      if (!getQuantity.data.find((item) => item.product_id == product.id)) {
        const response = await axios.post('http://localhost:9191/addToCart', {
          name: user,
          product_id: product.id,
          quantity: 1,
        });


        updateQaboveCart(quantityAboveCart + 1);
      } else {

        //setQuantity((getQuantity.data.quantity) + 1);
        const thisQuantity = getQuantity.data.find((item) => item.product_id == product.id).quantity + 1;
        const thisID = getQuantity.data.find((item) => item.product_id == product.id).id;
        await axios.put(`http://localhost:9191/updateCart`, {
          id: thisID,
          name: user,
          product_id: product.id,
          quantity: thisQuantity
        });
      }

    } catch (error) {
      console.error('Error signing up:', error);
    }
    fetchStart();
  };


  const removeFromCart = async (product) => {
    try {

      const user = isSignedUp ? someValue.name : 'guest';
      const getQuantity = await axios.get(`http://localhost:9191/getUserCart/${user}`);
      setCartQuantity(getQuantity.data.map(cartQQ => ({
        id: cartQQ.id,
        name: cartQQ.name,
        product_id: cartQQ.product_id,
        quantity: cartQQ.quantity,
      })));

      //updateCartQuantity(cartQuantity);
      updateQinCart(quantityInCart - 1);

      if (!getQuantity.data.find((item) => item.product_id == product.id)) {
        fetchStart();
        return;

      } else {


        const thisQuantity = getQuantity.data.find((item) => item.product_id == product.id).quantity - 1;
        const thisID = getQuantity.data.find((item) => item.product_id == product.id).id;

        if (thisQuantity === 0) {
          await axios.delete(`http://localhost:9191/deleteFromCartId/${thisID}`);
          updateQaboveCart(quantityAboveCart - 1);


        } else {
          await axios.put(`http://localhost:9191/updateCart`, {
            id: thisID,
            name: user,
            product_id: product.id,
            quantity: thisQuantity
          });
        }
      }

    } catch (error) {
      console.error('Error signing up:', error);
    }
    fetchStart();
  };


  const goToProduct = async (product) => {
    //console.log('prod', product);
    try {
      updateProductpage(product);
      navigation.navigate('ProductPage', { productData: product });

    } catch (error) {
      console.error('Error on product redirection:', error);
    }
  };



  const fetchStart = async () => {
    const user = isSignedUp ? someValue.name : 'guest';
    const getQuantity = await axios.get(`http://localhost:9191/getUserCart/${user}`);
    setCartQuantity(getQuantity.data.map(cartQQ => ({
      id: cartQQ.id,
      name: cartQQ.name,
      product_id: cartQQ.product_id,
      quantity: cartQQ.quantity,
    })));
    // updateCartQuantity(cartQuantity);
    fetchImages();


  };

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

    setImages(imagesObject);

  };

  const updateCartQuantity2 = (newCartQuantity) => {
    console.log('im here');
    setCartQuantity(newCartQuantity);
    fetchStart();

  };


  useEffect(() => {
    fetchStart();
    fetchProducts();


    const updateHeight = () => {
      setInputHeight(Dimensions.get('window').height);
    };

    Dimensions.addEventListener('change', updateHeight);
    return () => {
      Dimensions.removeEventListener('change', updateHeight);
    };

  }, [isSignedUp]);   //clumpsy ? check





  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:9191/products');

      setProducts(response.data);
      setProductsArray(response.data.map(product => ({
        id: product.id,
        name: product.name,
        info: product.info,
        productImage: product.imageUrl,
        price: product.price,
        availableQuantity: product.availableQuantity
      })));


      //productsArray.map((product) => (console.log(product)));
    } catch (error) {
      console.error('Error fetching products:', error);
    }

  };


  const scrollViewRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };



  return (

    <View style={styles.containerScroll}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Shop</Text>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.3)" />
        </View >

        <View style={isMobile ? [styles.gridContainer, { marginBottom: '20%' }] : [styles.gridContainer, { marginBottom: '20%', marginLeft: '10%' }]}>
          {productsArray.map((product) => (

            <View key={product.id}>
              <TouchableOpacity

                style={[
                  styles.gridItem,
                  product.id === hoveredItem && styles.hoveredGridItem,
                  { backgroundColor: 'rgba(255,255,255,1)' }
                  // { backgroundImage: `url(${images[product.id]})` }
                ]}
                onPress={() => goToProduct(product)}
                onMouseEnter={() => setHoveredItem(product.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >

                <Image
                  style={[styles.productImage]}
                  source={{ uri: images[product.id] }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10%' }}>
                <Pressable onPress={() => { goToProduct(product) }}>
                  <Text style={[styles.itemText]}>{product.name}</Text>
                </Pressable>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: '10%' }}>
                  <View style={styles.buttonContainer}>
                    <Pressable onPress={() => removeFromCart(product)} style={styles.button}>
                      <Text style={styles.buttonText}>-</Text>
                    </Pressable>
                  </View>




                  <Text style={styles.quantityText}> {getSelectedQuantity(product.id)} </Text>


                  <View style={styles.buttonContainer}>
                    <Pressable onPress={() => { addToCart(product); }} style={styles.button}>

                      <Text style={styles.buttonText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
              <Text style={{ marginLeft: '10%', color: 'rgba(255, 192, 14, 0.8)' }}>{product.price} €</Text>
              <Text style={{ marginLeft: '10%', color: 'rgba(255, 192, 14, 0.5)' }}>Available quantity: {product.availableQuantity}</Text>

            </View>
          ))}


        </View>

      </ScrollView >
      <CustomScrollBar
        contentHeight={10}
        visibleHeight={10}
        scrollY={scrollY}
      />
    </View >

  );
}

const styles = StyleSheet.create({
  containerScroll: {
    flex: 1,
    flexDirection: 'row',
    // alignContent: 'center',
    //justifyContent: 'center'

  },
  scrollView: {
    flex: 1,
  },
  scrollBarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
  },
  scrollBar: {
    position: 'absolute',
    width: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 4,
  },

  scrollContainer: {
    flexGrow: 1,

  },
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
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
    justifyContent: 'flex-start',
    //marginLeft: '10%'
    // alignContent: 'flex-start',
    //alignItems: 'flex-start',
    //marginTop: '2%'
  },
  introText: {
    fontSize: 18,
    marginTop: '-5%',
  },

  gridItem: {
    width: 300,
    height: 200,
    borderWidth: 3,
    borderColor: 'rgba(10, 91, 233, 0.8)',
    borderRadius: 10,
    marginVertical: 80,
    marginHorizontal: 40,
    //backgroundColor: 'rgba(64, 84, 255, 0.8)',
    // justifyContent: 'flex-end',


  },

  itemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255, 192, 14, 1)',
    //textAlign: 'left',
    //marginRight: '-0%'
    // marginBottom: '40%'
  },

  heads: {
    fontSize: 20,
    fontWeight: 'bold',

  },

  gridContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },

  productImage: {
    width: '99%',
    height: '99%',
    borderRadius: 9,
    resizeMode: 'resize'
  },


  buttonContainer: {
    borderWidth: 1,
    borderColor: 'rgba(255, 192, 14, 1)',
    backgroundColor: 'rgba(10, 91, 233, 0.7)',
    borderRadius: 5,
    padding: 0,
    width: 20,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    padding: 5,
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '30%',
    color: 'rgba(255, 192, 14, 0.8)'
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});


/* 

  <View style={styles.sinplinView}>
    <Pressable onPress={togglePress}><Text style={styles.sinplin}>+</Text></Pressable>

    <Pressable onPress={togglePress}><Text style={styles.sinplin}>-</Text></Pressable>
  </View>

    sinplin: {
    fontSize: 25, fontWeight: 'bold', color: 'black', transform: [{ rotate: '90deg' }]
  },
  sinplinView: {

    transform: [{ rotate: '90deg' }], backgroundColor: 'transparent'
  },
*/