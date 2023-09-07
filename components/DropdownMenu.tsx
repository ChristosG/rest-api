import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAppContext } from '../app/AppContext';
import { useTranslation } from 'react-i18next';

interface DropdownMenuProps {
    isMobile: boolean;
}

interface Category {
    name: string;
    colors: string[];
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ isMobile }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [hoveredOption, setHoveredOption] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [pressedCategory, setPressedCategory] = useState<string | null>(null);
    const [selectedCategoryTop, setSelectedCategoryTop] = useState(0);
    const [inputWidth, setInputWidth] = useState(Dimensions.get('window').width);
    const { t } = useTranslation();

    const [infos, setInfos] = useState([]);//<Category | null>(null);
    const { updateProductpage } = useAppContext();
    const navigation = useNavigation();

    const goToProduct = async (color) => {

        try {
            const product = await axios.get(`http://localhost:9191/product/${color}`);
            updateProductpage(product.data);
            navigation.navigate('ProductPage', { productData: product.data });

        } catch (error) {
            console.error('Error on product redirection:', error);
        }
    };

    const fetchProducts = async () => {
        const response = await axios.get('http://localhost:9191/products');
        const filters = response.data.reduce((acc, product) => {
            const key = product.info;
            if (!acc[key]) {
                acc[key] = [];
            }


            acc[key].push(product.name);

            return acc;
        }, {});
        setInfos(filters);
        console.log('filters', filters);

    };

    const categories: Category[] = Object.keys(infos).map((name) => ({
        name,
        colors: infos[name],
    }));

    useEffect(() => {
        fetchProducts();

        const updateWidth = () => {
            setInputWidth(Dimensions.get('window').width);
        };

        Dimensions.addEventListener('change', updateWidth);

        return () => {
            Dimensions.removeEventListener('change', updateWidth);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {

        setIsDropdownOpen(false);
        setSelectedCategory(null);
        if (isMobile) setPressedCategory(null);
    };

    const homePage = () => {
        navigation.navigate('index');

    };

    const resetHighlight = () => {
        setHoveredCategory(null);
    };

    const selectCategory = (category: Category) => {
        setIsTransitioning(true);
        if (isMobile) {
            setTimeout(() => {
                setSelectedCategory(category);
                setHoveredCategory(category.name);
                setIsTransitioning(false);
                resetHighlight();

            }, 200); // 200 milliseconds delay
        } else {
            setSelectedCategory(category);
            setIsTransitioning(false);
        }
    };


    const handleMouseEnterCategory = (category: Category, index: number) => {
        if (!isMobile) {
            setSelectedCategory(category);
            setHoveredCategory(category.name);
            setSelectedCategoryTop(index * 50);
        }
    };


    const handleMouseLeaveCategory = () => {
        if (!isMobile) {
            setHoveredCategory(null);
        }
    };

    const renderMenu = () => {
        if (inputWidth < 600) {
            return (
                <TouchableOpacity onPress={toggleDropdown} style={styles.menuContainer}>
                    <View style={styles.menuItem}>
                        <TouchableOpacity onPress={homePage}>
                            <Image source={require('./mylogo.svg')} style={styles.logo} />
                        </TouchableOpacity>
                        <Ionicons name="menu-outline" size={24} color='rgba(255, 192, 14, 1)' />
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={toggleDropdown} style={styles.menuContainer}>
                    <View style={styles.menuItem}>
                        <TouchableOpacity onPress={homePage}>
                            <Image source={require('./mylogo.svg')} style={styles.logo} />
                        </TouchableOpacity>
                        <Ionicons name="menu-outline" size={24} color='rgba(255, 192, 14, 1)' />
                        <Text style={[styles.pageTitle, styles.menuText]}>
                            {t('Categories')}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
    };


    const renderSubCategory = () => {
        if (selectedCategory) {
            return selectedCategory.colors.map((color, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => goToProduct(color)}
                    onMouseEnter={() => setHoveredOption(color)}
                    onMouseLeave={() => setHoveredOption(null)}
                    style={[styles.color, hoveredOption === color && styles.highlightedOption,]}
                >
                    <Text style={styles.categoryFonts}>{color}</Text>
                </TouchableOpacity>
            ));
        } else {
            return null;
        }
    };


    const renderDropdown = () => {
        if (isMobile && selectedCategory) {
            return renderSubCategory();
        }

        return categories.map((category, index) => (
            <TouchableOpacity
                key={index}
                //onPress={() => !isTransitioning && selectCategory(category)}
                onPress={() => {
                    !isTransitioning && selectCategory(category);
                    if (isMobile) setPressedCategory(category.name);
                }}
                onMouseEnter={() => handleMouseEnterCategory(category, index)}

                //onMouseEnter={() => handleMouseEnterCategory(category)}
                onMouseLeave={handleMouseLeaveCategory}
                /*style={[
                    styles.category,
                    hoveredCategory === category.name && styles.highlightedCategory,

                ]}*/
                style={[
                    styles.category,
                    (isMobile ? pressedCategory === category.name : hoveredCategory === category.name) && styles.highlightedCategory,
                ]}

            >
                <Text style={[styles.categoryFonts, hoveredCategory === category.name ? styles.highlightedCategoryText : null]}>{category.name}</Text>
                <Ionicons name="chevron-forward-outline" size={24} color="black" />
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {!isDropdownOpen && renderMenu()}
            </View>
            <Modal visible={isDropdownOpen} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={closeDropdown}>
                    <View style={styles.modal}>
                        {isDropdownOpen && (
                            <View style={styles.absoluteMenu}>{renderMenu()}</View>
                        )}
                        <TouchableWithoutFeedback>
                            <View style={[styles.dropdown, { width: Math.min(inputWidth * 0.5, 400) }]}>
                                {renderDropdown()}
                            </View>
                        </TouchableWithoutFeedback>
                        {!isMobile && selectedCategory && (
                            <View style={[
                                styles.colorModal,
                                { marginLeft: Math.min(inputWidth * 0.5, 400), top: selectedCategoryTop }
                            ]}>
                                {renderSubCategory()}
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 5,
    },
    pageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255, 192, 14, 1)',
        backgroundColor: 'transparent',


    },
    menuText: {
        marginLeft: 5,
        marginBottom: '1%'

    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 0,


    },
    dropdown: {

        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 0,
        paddingTop: 50,

    },
    category: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',

    },
    highlightedCategory: {
        backgroundColor: 'rgb(134, 139, 141)',
    },
    highlightedCategoryText: {
        color: 'white',
    },

    colorModal: {
        backgroundColor: 'red',
        padding: 0,
        borderRadius: 0,
        marginTop: 50.5,
        position: 'absolute',


    },
    color: {
        fontSize: 16,
        marginBottom: 5,
        backgroundColor: 'transparent',
        padding: 10,
    },
    highlightedOption: {
        backgroundColor: 'navy',


    },
    categoryFonts: {
        fontSize: 22
    },
    absoluteMenu: {   //fixes  the logo,ioni,categories position on the banner!!

        position: 'relative',
        top: 20,
        left: 40,
        zIndex: 2,
    },
});

export default DropdownMenu;
