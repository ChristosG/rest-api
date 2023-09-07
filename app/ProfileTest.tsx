import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const ProfileTest: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: 'ChangeUsername', label: 'Change Username/Password' },
        { id: 'AddAddress', label: 'Add Address' },
        { id: 'Notifications', label: 'Notifications' },
    ];

    const renderCategory = ({ item }: { item: { id: string; label: string } }) => (
        <TouchableOpacity
            onPress={() => setSelectedCategory(item.id)}
            style={[
                styles.categoryItem,
                {
                    borderLeftWidth: item.id === selectedCategory ? 10 : 0,
                    borderColor: 'rgba(50, 220, 73, 1)',
                    backgroundColor: item.id === selectedCategory ? 'rgba(10, 91, 233, 0.4)' : 'transparent',
                },
            ]}
        >
            <Text style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</Text>
        </TouchableOpacity >
    );

    return (
        <View style={{ flex: 1, backgroundImage: `url(../assets/profileBackgroundSide.png)`, }}>
            <View style={{
                backgroundImage: `url(../assets/ProfileBackGTop.png)`,
                flex: 1, width: '70%', alignSelf: 'center', marginTop: '0%',
            }}> <Text style={{
                color: 'black',
                backgroundColor: 'rgba(50, 220, 73, 1)',
                borderRadius: 30,
                padding: 10,
                fontSize: 35, alignSelf: 'center', marginTop: '5%'
            }}> Profile Overview </Text>
            </View>
            <View style={styles.containerProf}>

                <View style={styles.sidebar}>
                    <FlatList
                        style={{}}
                        data={categories}
                        renderItem={renderCategory}
                        keyExtractor={(item) => item.id}
                        ItemSeparatorComponent={() => <View style={styles.separatorProf} />}
                    />
                </View>

                <View style={styles.content}>{selectedCategory && <Text>{selectedCategory} Content</Text>}</View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerProf: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '70%',
        marginTop: '-25%',

    },
    sidebar: {
        flex: 1,
        //backgroundColor: 'rgba(255, 192, 14, 0.7)',
        backgroundImage: `url(../assets/sidelist.png)`,

    },
    categoryItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',


    },
    separatorProf: {
        height: 0.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    content: {
        flex: 4,
        padding: 16,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileTest;
