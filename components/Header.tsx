import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Header = () => {

};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f2f2f2',
    },
    searchInput: {
        flex: 1,
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
});

export default Header;
