import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownMenuProps {
    isMobile: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isMobile }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const categories = ['Menu', 'Cars', 'Books', 'Music'];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const renderMenu = () => {
        if (isMobile) {
            return (
                <TouchableOpacity onPress={toggleDropdown}>
                    <Ionicons name="menu-outline" size={24} color="black" />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={toggleDropdown}>
                    <Text style={{ color: 'white' }}>Menu</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.container}>
            {renderMenu()}
            {isDropdownOpen && (
                <View style={styles.dropdown}>
                    {categories.map((category, index) => (
                        <TouchableOpacity key={index} onPress={() => console.log(category)}>
                            <Text>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
    },
    dropdown: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        zIndex: 1,
    },
});

export default DropdownMenu;
