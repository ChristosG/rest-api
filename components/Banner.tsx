import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, TextInput, Dimensions, FlatList, Image, Animated } from 'react-native';
import { View, Text, useThemeColor } from './Themed';
import axios from 'axios'; // 
import { MonoText } from './StyledText';
import { useTranslation } from 'react-i18next';



//import '../../../../../user/IdeaProjects/demoSpring/';

const Banner = (props) => {
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const insideSB = useThemeColor({}, 'tabIconDefault');
  const [inputWidth, setInputWidth] = useState(Dimensions.get('window').width * 0.4);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [images, setImages] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const updateWidth = () => {
      setInputWidth(Dimensions.get('window').width * 0.4);
    };

    Dimensions.addEventListener('change', updateWidth);

    fetchProducts();
    fetchImages();
    return () => {
      Dimensions.removeEventListener('change', updateWidth);
    };
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.info.toLowerCase().includes(searchQuery.toLowerCase())

  );

  const handleItemPress = async (id: number, responseData: any) => {
    if (id === 1) {
      navigation.navigate('Subscription', { dataTransfer: responseData });
    }
    if (id === 2) {
      try {
        const trainingData = await axios.get(`http://localhost:9191/training/${responseData.name}`);
        //console.log(trainingData.status);
        //updateSomeValue(trainingData.data.name);
        navigation.navigate('Training', { dataTransfer: trainingData });

      } catch (error) {
        console.error('Error signing in:', error);
        if (error.response && error.response.status === 500) {
          console.log('Training error');
        }
      }
    }
  };
  const handleMouseEnterCategory = (meti: any) => {
    setSelectedCategory(meti);
    setHoveredCategory(meti);
    // setSelectedCategoryTop(index * 50);
  };

  const handleMouseLeaveCategory = () => {
    setHoveredCategory(null);
  };


  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollBarTop, setScrollBarTop] = useState(new Animated.Value(0));
  const [barHeight, setBarHeight] = useState(0);


  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const scrollContentHeight = 224 + (filteredProducts.length - 4) * (224 / 4);
  const scrollViewHeight = 224;

  const scrollBarHeight = scrollViewHeight * (scrollViewHeight / scrollContentHeight);
  //scrollViewHeight * (scrollViewHeight / scrollContentHeight);

  scrollY.addListener((value) => {

    if (filteredProducts.length > 4) {
      //const maxScrollBarTop = scrollViewHeight;
      const scrollPercentage = value.value;      /// (maxScrollBarTop);
      console.log('val', value.value, scrollContentHeight);
      const newScrollBarTop = scrollPercentage > 200 ? (scrollPercentage * 1 / Math.log(filteredProducts.length - Math.log(filteredProducts.length))) - (1 / Math.log(filteredProducts.length - Math.log(filteredProducts.length))) * scrollBarHeight
        : scrollPercentage * 1 / Math.log(filteredProducts.length - Math.log(filteredProducts.length - 1));

      // - (scrollBarHeight * Math.log(filteredProducts.length) / 2);//+ (scrollViewHeight - ((filteredProducts.length - 4) * (224 / 4)) * (0.3)); //(scrollPercentage / Math.log(filteredProducts.length));
      // - scrollViewHeight - ((filteredProducts.length - 4) * (224 / 4)) * (0.3);
      // > 224  ? 224 - (scrollPercentage / Math.log(filteredProducts.length)) : (scrollPercentage / Math.log(filteredProducts.length));
      //const newScrollBarTop = scrollViewHeight * Math.log(filteredProducts.length) * scrollPercentage; //scrollContentHeight * scrollPercentage;
      setScrollBarTop(new Animated.Value(newScrollBarTop));
    };
  });

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


  return (
    <View style={styles.container}>
      <View >
        <TextInput
          placeholder={t('Search for a product')}
          style={[styles.searchInput, { backgroundColor: insideSB, color: 'black', width: inputWidth }]}
          value={searchQuery}
          //  onFocus={() => setShowResults(true)}
          onChangeText={(text) => {
            setScrollBarTop(new Animated.Value(0));
            setSearchQuery(text);
            setShowResults(text.length > 0);

          }}
        />
      </View>

      <View>
        {showResults && (
          <View style={[styles.resultsContainer, { width: inputWidth, backgroundColor: 'transparent' }]}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
              >
                <View style={{ backgroundColor: 'transparent' }}>
                  <FlatList
                    onScroll={onScroll}
                    data={filteredProducts}
                    renderItem={({ item }) => (
                      <View style={{ width: '100%' }}>
                        <View style={[styles.resultItem, (hoveredCategory === item) && styles.highlightedCategory]}

                          onMouseEnter={() => handleMouseEnterCategory(item)}
                          onMouseLeave={handleMouseLeaveCategory}>

                          <Image source={{ uri: images[item.id] }} style={styles.productImage} />
                          <Text style={[styles.resultText, (hoveredCategory === item) && { color: 'rgba(10, 91, 233, 1)' }]}>
                            {item.name} : <MonoText style={[styles.monostyle,
                            (hoveredCategory === item) && { color: 'rgba(10, 91, 233, 0.6)' }]}>
                              {item.info}
                            </MonoText>
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    style={{ height: 4 * 56, }}
                    scrollIndicatorInsets={{ right: 2, top: 0, bottom: 0, left: 2 }}
                    showsVerticalScrollIndicator={false}
                  //fix responseData -> product.id db entry


                  />
                </View>
              </ScrollView>

              <View style={(filteredProducts.length > 4) && {
                width: 10, height: scrollViewHeight, position: 'absolute', right: 0, top: 0,
                backgroundColor: 'rgba(10, 91, 233, 0.8)', borderRadius: 8
              }}>
                {(filteredProducts.length > 4) && (
                  <Animated.View
                    style={{
                      width: '100%',
                      height: scrollBarHeight,
                      backgroundColor: 'rgba(255, 192, 14, 0.9)',
                      position: 'absolute',
                      top: scrollBarTop,
                      borderRadius: 15
                    }}
                  />)}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    borderRadius: 8,
    padding: 16,
    position: 'relative'
  },
  searchInput: {
    height: 35,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resultsContainer: {
    position: 'absolute',
    //backgroundColor: 'rgba(10, 91, 233, 0.6)',
    //marginTop: '0%',
    borderRadius: 8,

    //elevation: 3,
  },
  resultText: {
    padding: 8,
    color: 'rgba(255, 192, 14, 1)'
  },
  monostyle: {
    color: 'rgba(255, 192, 14, 0.6)'

  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(10, 91, 233, 0.8)',
    //borderRadius: 5,
    width: '100%'//'98.5%'
  },
  productImage: {
    width: 50,
    height: 40,
    marginRight: 8,
  },
  highlightedCategory: {
    backgroundColor: 'rgba(255, 192, 14, 0.7)',
    paddingHorizontal: 15,


    //color: 'rgba(255, 192, 14, 1)',
  },
});

export default Banner;
