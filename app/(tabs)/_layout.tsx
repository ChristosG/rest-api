import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { ScrollView, Image, FlatList, Modal, TouchableWithoutFeedback, TouchableOpacity, Pressable, useColorScheme, StyleSheet, Dimensions, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import React, { createContext, useState, useRef, useEffect } from 'react';
import LoginButton from '../LoginButton';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import Banner from '../../components/Banner';
import DropdownMenu from '../../components/DropdownMenu';
import CustomHeader from '../CustomHeader';
import axios from 'axios';
import { MonoText } from '../../components/StyledText';
import { StatusBar } from 'expo-status-bar';
import ShoppingCart from '../ShoppingCart';
import { useSignUpContext } from '../SignUpContext';
import { useAppContext } from '../AppContext';
import { useTranslation } from 'react-i18next';

const isMobile = Dimensions.get('window').width < 600;

//const UserContext = createContext();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { t } = useTranslation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [buttonCoordinates, setButtonCoordinates] = useState({ x: 250, y: 250 });
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const buttonRef1 = useRef(null);
  const buttonRef2 = useRef(null);
  const buttonRef3 = useRef(null);

  const colorScheme = useColorScheme();
  const { quantityInCart, quantityAboveCart, updateQaboveCart, updateQinCart, updateLanguage } = useAppContext();

  const { isSignedUp, setIsSignedUp, updateSignedUser, someValue, } = useSignUpContext();

  const handleSignUp = () => {
    setIsSignedUp(true);
  };

  const navigation = useNavigation();
  const navigateToLogin = () => {
    navigation.navigate('LoginButton');
  };

  const navigateToLogout = () => {
    setIsSignedUp(false);
    updateQaboveCart(0);
    updateQinCart(0);
    // updateSignedUser(null);
    //navigation.navigate('LoginButton');
  };

  /* const filteredProducts = products.filter((product) =>
     product.name.toLowerCase().includes(searchQuery.toLowerCase())
   );*/

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:9191/products');
      setProducts(response.data);
      //console.log(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const showModal1 = () => {
    //setSearchQuery('1')
    if (buttonRef1.current) {
      buttonRef1.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonCoordinates({ x: pageX, y: pageY + height });
        setModalVisible(true);
      });
    }
  };
  const showModal2 = () => {
    //setSearchQuery('1')
    if (buttonRef2.current) {
      buttonRef2.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonCoordinates({ x: pageX, y: pageY + height });
        setModalVisible(true);
      });
    }
  };
  const showModal3 = () => {
    //setSearchQuery('1')
    if (buttonRef3.current) {
      buttonRef3.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonCoordinates({ x: pageX, y: pageY + height });
        setModalVisible(true);
      });
    }
  };

  const hideModal = () => {
    setModalVisible(false);
    //setButtonCoordinates({ x: buttonCoordinates.x, y: buttonCoordinates.y });

  };



  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => <Banner />,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerLeft: () => (
            <View style={{ marginLeft: 30, backgroundColor: 'transparent' }}>

              <DropdownMenu isMobile={isMobile} />
            </View>
          ),
          headerRight: ({ navigation }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'transparent' }}>
              <View style={{ marginLeft: '-5%', backgroundColor: 'transparent' }}>
                {isSignedUp ? <Text style={styles.welcomeBack}>Welcome back, <Text style={{ color: 'rgba(255, 192, 14, 1)' }}>{someValue.name}</Text></Text> : <Text></Text>}
              </View>
              {!isSignedUp ? (<Pressable
                style={isMobile ? {
                  paddingVertical: 7,
                  paddingHorizontal: 5,
                  alignSelf: 'center',
                  marginRight: 15,
                  backgroundColor: 'rgba(10, 91, 233, 1)',
                  borderRadius: 5,
                } : styles.signinButton}
                onPress={() => navigateToLogin()}>
                <Text style={isMobile ? { fontSize: 14, width: '100%', color: 'rgba(255, 192, 14, 1)' } : styles.buttonText}>Sign in</Text>
              </Pressable>) : (
                <View style={{ backgroundColor: 'transparent' }}>

                  <Pressable
                    style={isMobile ? {
                      paddingVertical: 7,
                      paddingHorizontal: 5,
                      alignSelf: 'center',
                      marginRight: 15,
                      backgroundColor: 'rgba(10, 91, 233, 1)',
                      borderRadius: 5,
                    } : styles.signinButton}
                    onPress={() => navigateToLogout()}>
                    <Text style={[styles.buttonText]}>Logout</Text>
                  </Pressable></View>
              )}
              <View style={{ backgroundColor: 'transparent' }}>
                <Pressable

                  ref={buttonRef1}
                  onPress={showModal1}
                >

                  {({ pressed }) => (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <FontAwesome
                        name="shopping-cart"
                        size={25}
                        color={'rgba(255, 192, 14, 1)'}//Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, backgroundColor: 'transparent' }}

                      />
                      {quantityAboveCart > 0 && (
                        <View
                          style={{
                            position: 'absolute',
                            top: '-35%',
                            right: '12%',
                            backgroundColor: 'red',
                            borderRadius: 10,
                            width: 19,
                            height: 19,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{quantityAboveCart}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
                <TouchableWithoutFeedback onPress={hideModal}>
                  <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}

                  >
                    <ShoppingCart cords={buttonCoordinates} />
                  </Modal>
                </TouchableWithoutFeedback>

              </View>
              <Link href="/info" asChild>
                <Pressable>
                  {({ pressed }) => (

                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={'rgba(255, 192, 14, 1)'}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, backgroundColor: 'transparent' }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          ),

        }}
      />



      <Tabs.Screen
        name="two"
        options={{
          title: 'Prods',
          headerTitle: () => <Banner />,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerLeft: () => (
            <View style={{ marginLeft: 30, backgroundColor: 'transparent' }}>
              <DropdownMenu isMobile={isMobile} />
            </View>
          ),
          headerRight: ({ navigation }) => (

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'transparent' }}>
              <View style={{ marginLeft: '-5%', backgroundColor: 'transparent' }}>
                {isSignedUp ? <Text style={styles.welcomeBack}>Welcome back, <Text style={{ color: 'rgba(255, 192, 14, 1)' }}>{someValue.name}</Text></Text> : <Text> </Text>}
              </View>
              {!isSignedUp ? (<Pressable
                style={isMobile ? {
                  paddingVertical: 7,
                  paddingHorizontal: 5,
                  alignSelf: 'center',
                  marginRight: 15,
                  backgroundColor: 'rgba(10, 91, 233, 1)',
                  borderRadius: 5,
                } : styles.signinButton}
                onPress={() => navigateToLogin()}>
                <Text style={isMobile ? { fontSize: 14, width: '100%', color: 'rgba(255, 192, 14, 1)' } : styles.buttonText}>Sign in</Text>
              </Pressable>) : (
                <Pressable
                  style={isMobile ? {
                    paddingVertical: 7,
                    paddingHorizontal: 5,
                    alignSelf: 'center',
                    marginRight: 15,
                    backgroundColor: 'rgba(10, 91, 233, 1)',
                    borderRadius: 5,
                  } : styles.signinButton}
                  onPress={() => navigateToLogout()}>
                  <Text style={styles.buttonText}>Logout</Text>
                </Pressable>

              )}
              <View style={{ backgroundColor: 'transparent' }}>
                <Pressable

                  ref={buttonRef2}
                  onPress={showModal2}
                >

                  {({ pressed }) => (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <FontAwesome
                        name="shopping-cart"
                        size={25}
                        color={'rgba(255, 192, 14, 1)'}//Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, backgroundColor: 'transparent' }}

                      />
                      {quantityAboveCart > 0 && (
                        <View
                          style={{
                            position: 'absolute',
                            top: '-35%',
                            right: '12%',
                            backgroundColor: 'red',
                            borderRadius: 10,
                            width: 19,
                            height: 19,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{quantityAboveCart}</Text>
                        </View>
                      )}
                    </View>

                  )}
                </Pressable>
                <TouchableWithoutFeedback onPress={hideModal}>
                  <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}

                  >


                    <ShoppingCart cords={buttonCoordinates} />
                  </Modal>
                </TouchableWithoutFeedback>

              </View>
              <Link href="/info" asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={'rgba(255, 192, 14, 1)'}//Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, backgroundColor: 'transparent' }}
                    />
                  )}
                </Pressable>
              </Link>


            </View>
          ),
        }}
      />


      <Tabs.Screen
        name="MyProfileTab"
        options={{
          title: 'My Profile',
          headerTitle: () =>
            <View style={{ backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => updateLanguage('en')}>
                <Image
                  source={{ uri: '../../assets/eng.png' }}
                  style={{
                    width: 23.5, height: 23.5, resizeMode: 'contain',
                    marginRight: '30%', marginLeft: '-90%',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateLanguage('de')}>
                <Image
                  source={{ uri: '../../assets/ger.png' }}
                  style={{ width: 20, height: 20, resizeMode: 'contain', marginLeft: '-70%' }}
                />
              </TouchableOpacity><Banner /> </View>,
          headerTitleAlign: 'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerLeft: () => (
            <View style={{
              marginLeft: 30, backgroundColor: 'transparent', flexDirection: 'row',

            }}>

              <DropdownMenu isMobile={isMobile} />

            </View>


          ),
          headerRight: ({ navigation }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', justifyContent: 'space-evenly' }}>
              <View style={{ marginLeft: '-5%', backgroundColor: 'transparent', }}>
                {isSignedUp ? <Text style={styles.welcomeBack}>{t('Welcome back')}, <Text style={{ color: 'rgba(255, 192, 14, 1)' }}>{someValue.name}</Text></Text> : <Text></Text>}
              </View>
              {!isSignedUp ? (<Pressable
                style={isMobile ? {
                  paddingVertical: 7,
                  paddingHorizontal: 5,
                  alignSelf: 'center',
                  marginRight: 15,
                  backgroundColor: 'rgba(10, 91, 233, 1)',
                  borderRadius: 5,
                } : styles.signinButton}
                onPress={() => navigateToLogin()}>
                <Text style={isMobile ? { fontSize: 14, width: '100%', color: 'rgba(255, 192, 14, 1)' } : styles.buttonText}>{t('Sign in')}</Text>
              </Pressable>) : (
                <Pressable
                  style={styles.signinButton}
                  onPress={() => navigateToLogout()}>
                  <Text style={styles.buttonText}>{t('Logout')}</Text>
                </Pressable>

              )}
              <View style={{ backgroundColor: 'transparent' }}>
                <Pressable
                  ref={buttonRef3}
                  onPress={showModal3}
                >

                  {({ pressed }) => (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <FontAwesome
                        name="shopping-cart"
                        size={25}
                        color={'rgba(255, 192, 14, 1)'}//Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, backgroundColor: 'transparent' }}

                      />
                      {quantityAboveCart > 0 && (
                        <View
                          style={{
                            position: 'absolute',
                            top: '-35%',
                            right: '12%',
                            backgroundColor: 'red',
                            borderRadius: 10,
                            width: 19,
                            height: 19,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{quantityAboveCart}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
                <TouchableWithoutFeedback onPress={hideModal}>
                  <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                  >


                    <ShoppingCart cords={buttonCoordinates} />
                  </Modal>
                </TouchableWithoutFeedback>

              </View>
              <Link href="/info" asChild>
                <Pressable>
                  {({ pressed }) => (

                    <FontAwesome
                      name="info-circle"
                      size={25}
                      color={'rgba(255, 192, 14, 1)'}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            </View>
          ),

        }}
      />

    </Tabs >

  );

}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
  sss: {
    backgroundColor: '#3498db',
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
    marginLeft: '0%'
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
    padding: 8,
    fontWeight: 'bold',
    color: 'rgba(10, 91, 233, 1)'//'rgba(255, 192, 14, 1)'

  },
  monostyle: {
    fontWeight: 'bold',
    color: 'rgba(10, 91, 233, 1)'//'rgba(255, 192, 14, 0.6)'

  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 8
  },
  productImage: {
    width: 50,
    height: 40,
    marginRight: 8,
  },
  scrollContainer: {
    maxHeight: 200,
    backgroundColor: 'rgba(255, 192, 14, 1)',
    borderRadius: 8,
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
  welcomeBack: { backgroundColor: 'transparent', fontSize: 20, color: 'white', justifyContent: 'center', marginLeft: '-5%' },
});
