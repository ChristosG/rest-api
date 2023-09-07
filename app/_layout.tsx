import FontAwesome from '@expo/vector-icons/FontAwesome';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Modal, TouchableWithoutFeedback, Pressable, Button, useColorScheme, StyleSheet, Dimensions } from 'react-native';
import Banner from '../components/Banner';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import DropdownMenu from '../components/DropdownMenu';
import { Link, Tabs } from 'expo-router';
import CustomHeader from './CustomHeader';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { AppProvider, useAppContext } from './AppContext';
import ShoppingCart from './ShoppingCart';
import { useSignUpContext, SignUpProvider } from './SignUpContext';
import { useQuantityContext, QuantityProvider } from './QuantityContext';


const isMobile = Dimensions.get('window').width < 600;

const { width, height } = Dimensions.get('window');


export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const deleteGuest = async () => {
    await axios.delete('http://localhost:9191/deleteFromCartName/guest');
  };

  useEffect(() => {
    deleteGuest();
    if (error) throw error;
  }, [error]);
  return (
    <>
      {!loaded && <SplashScreen />}
      {loaded && <AppProvider><SignUpProvider><QuantityProvider><RootLayoutNav /></QuantityProvider></SignUpProvider></AppProvider>}
    </>
  );
}


function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [buttonCoordinates, setButtonCoordinates] = useState({ x: 250, y: 250 });
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const buttonRef = useRef(null);

  const { someValue, updateSomeValue, productpage } = useAppContext();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const showModal = () => {
    setSearchQuery('1')
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonCoordinates({ x: pageX, y: pageY + height });
        setModalVisible(true);
      });
    }
  };


  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

        <Stack>

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen name="SignupScreen"
            options={{
              presentation: 'modal',
              title: 'SignupScreen',
              headerTitle: () => (<Text style={styles.heads}>Sign Up Page</Text>),
              headerTitleAlign: 'left',

              headerRight: () => (

                <Link href="/info" asChild>
                  <Pressable>
                    {({ pressed }) => (

                      <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }} />

          <Stack.Screen name="ImageUploader"
            options={{
              presentation: 'modal',
              title: 'ImageUploader',
              headerTitle: () => (<DropdownMenu ></DropdownMenu>),
              headerTitleAlign: 'left',
              headerRight: () => (
                <Text style={[styles.heads, {
                  alignSelf: 'flex-start',
                  marginLeft: '1%'
                }]}>
                  Admin Panel</Text>
              ),

            }} />

          <Stack.Screen name="LoginButton"
            options={{
              presentation: 'modal',
              title: 'LoginButon',
              headerTitle: () => (<Text style={styles.heads}>Login Page</Text>),
              headerTitleAlign: 'left',

              headerRight: () => (

                <Link href="/info" asChild>
                  <Pressable>
                    {({ pressed }) => (

                      <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }} />

          <Stack.Screen name="ProductPage"
            options={{
              presentation: 'modal',
              title: 'ProductPage redux',
              headerTitle: () => (<Text style={styles.heads}>

                <Text>{productpage.name} : </Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: 18,
                  fontStyle: 'italic',
                }}>
                  {productpage.info}
                </Text>
              </Text>),
              headerTitleAlign: 'left',

              headerRight: () => (

                <Link href="/info" asChild>
                  <Pressable>
                    {({ pressed }) => (

                      <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }} />

          <Stack.Screen name="MyProfile"
            options={({ route }) => ({
              presentation: 'modal',
              headerTitle: () => <Text>Welcome back, <Text style={styles.someVal}>{someValue}</Text></Text>,
              headerTitleAlign: 'left',
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent' }}>

                  <View style={{ backgroundColor: 'transparent' }}>
                    <Pressable
                      onPress={showModal}
                      ref={buttonRef}

                    >

                      {({ pressed }) => (
                        <FontAwesome
                          name="shopping-cart"
                          size={25}
                          color={'rgba(255, 192, 14, 1)'}//Colors[colorScheme ?? 'light'].text}
                          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, backgroundColor: 'transparent' }}

                        />

                      )}
                    </Pressable>
                    <TouchableWithoutFeedback onPress={hideModal}>
                      <Modal
                        visible={isModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={hideModal}
                      >


                        <ShoppingCart buttonRef={buttonRef} />
                      </Modal>
                    </TouchableWithoutFeedback>

                  </View>
                  <Link href="/info" asChild>
                    <Pressable>
                      {({ pressed }) => (

                        <FontAwesome
                          name="info-circle"
                          size={25}
                          color={Colors[colorScheme ?? 'light'].text}
                          style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                        />
                      )}
                    </Pressable>
                  </Link>
                </View>
              ),
            })} />

          <Stack.Screen name="Training"
            options={({ route }) => ({
              presentation: 'modal',
              headerTitle: () => <Text>Training of <Text style={styles.someVal}>{someValue}</Text></Text>,
              headerTitleAlign: 'left',
              headerRight: () => (

                <Link href="/info" asChild>
                  <Pressable>
                    {({ pressed }) => (

                      <FontAwesome
                        name="info-circle"
                        size={25}
                        color={Colors[colorScheme ?? 'light'].text}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            })} />



          <Stack.Screen name="info"
            options={{
              presentation: 'modal',
              headerTitle: () => <Banner />,
              headerTitleAlign: 'center',
              headerRight: () => (
                <View style={{ marginRight: width * 0.04, backgroundColor: 'transparent' }}>
                  <Text style={styles.headerTitle}>About us</Text>
                </View>
              ),

            }} />

        </Stack>
      </ThemeProvider >
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
  heads: {

    fontSize: 20,
    fontWeight: 'bold',

  },
  someVal: {
    color: 'red'
  }
});
