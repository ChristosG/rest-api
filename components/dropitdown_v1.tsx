import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownMenuProps {
    isMobile: boolean;
}


interface Category {
    name: string;
    colors: string[];
}


const DropdownMenu: React.FC<DropdownMenuProps> = ({ isMobile }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    //const categories = ['Cars', 'Books', 'Music'];
    const [inputWidth, setInputWidth] = useState(Dimensions.get('window').width);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const categories: Category[] = [
        { name: 'Cars', colors: ['Red', 'Blue', 'Green'] },
        { name: 'Books', colors: ['Black', 'White', 'Brown'] },
        { name: 'Music', colors: ['Yellow', 'Purple', 'Pink'] },
    ];

    useEffect(() => {
        const updateWidth = () => {
            setInputWidth(Dimensions.get('window').width);
        };

        Dimensions.addEventListener('change', updateWidth);


    }, []);



    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
        setSelectedCategory(null);  //maybe fix otan pataw stin othoni na pigenei back anti na kleinei?

    };

    const homePage = () => {
        console.log('homePAge');
    };

    const selectCategory = (category: Category) => {
        if (isMobile) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory(selectedCategory === category ? null : category);
        }
    };

    const renderMenu = () => {
        if (inputWidth < 600) {
            return (
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={toggleDropdown} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>

                        <TouchableOpacity onPress={homePage}>
                            <Image source={require('./mylogo.svg')} style={{
                                width: 24,
                                height: 24,

                            }} />
                        </TouchableOpacity>

                        <Ionicons name="menu-outline" size={24} color="white" />

                    </TouchableOpacity></View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', }}>
                    <TouchableOpacity onPress={toggleDropdown} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>

                        <TouchableOpacity onPress={homePage}>
                            <Image source={require('./mylogo.svg')} style={{
                                width: inputWidth * 0.02,
                                height: inputWidth * 0.02,

                            }} />
                        </TouchableOpacity>

                        <Text style={[styles.pageTitle, {
                            fontSize: inputWidth * 0.01,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }]}>     <Ionicons name="menu-outline" size={24} color="white" /> Categories </Text>

                    </TouchableOpacity>
                </View>

            );
        }
    };

    const renderColors = () => {
        if (selectedCategory) {
            return selectedCategory.colors.map((color, index) => (
                <TouchableOpacity key={index} onPress={() => console.log(color)}>
                    <Text style={styles.color}>{color}</Text>
                </TouchableOpacity>
            ));
        } else {
            return null;
        }
    };



    //<Text style={[styles.pageTitle, { fontSize: inputWidth * 0.01 }]}>Logo or Title? </Text>

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {renderMenu()}
            </View>
            <Modal visible={isDropdownOpen} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={closeDropdown}>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.dropdown, {
                                width: Math.min(inputWidth * 0.5, 400),
                                //right: inputWidth * 0.45,
                            }]}>
                                {categories.map((category, index) => (
                                    <TouchableOpacity key={index} onPress={() => selectCategory(category)}>
                                        <Text style={{
                                            fontSize: 20// Math.min(inputWidth * 0.1, 24)
                                        }}>{category.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                        </TouchableWithoutFeedback>
                        {selectedCategory && (
                            <View style={[styles.colorModal, { marginLeft: Math.min(inputWidth * 0.5, 400) }]}>
                                {renderColors()}
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
    pageTitle: {
        //fontSize: 18,
        //fontWeight: 'bold',
        //fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: 'transparent',
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 50,
    },
    dropdown: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
    category: {
        fontSize: 20,
    },
    colorModal: {
        //flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 8,
        marginTop: -100,
    },
    color: {
        fontSize: 16,
        marginBottom: 5,
    },
});



export default DropdownMenu;
