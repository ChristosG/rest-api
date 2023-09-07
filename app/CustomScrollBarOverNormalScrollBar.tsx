import React, { useState, useRef } from 'react';
import { Text, View, ScrollView, Animated } from 'react-native';

export default CustomScrollBarOverNormalScrollBar = (props) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [scrollBarTop, setScrollBarTop] = useState(new Animated.Value(0));

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const scrollContentHeight = 500;
    const scrollViewHeight = 200;

    const scrollBarHeight = (scrollViewHeight / scrollContentHeight) * scrollViewHeight;

    scrollY.addListener((value) => {
        const maxScrollBarTop = scrollViewHeight - scrollBarHeight;
        const scrollPercentage = value.value / (scrollContentHeight - scrollViewHeight);
        const newScrollBarTop = maxScrollBarTop * scrollPercentage;
        setScrollBarTop(new Animated.Value(newScrollBarTop));
    });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                style={{ flex: 1, backgroundColor: 'white' }}
                onScroll={onScroll}
            >
                <View style={{ width: '100%', height: 1500 }}>
                    <Text>Some content</Text>
                </View>
            </ScrollView>

            <View style={{ width: 20, height: scrollViewHeight, position: 'absolute', right: 0, top: 0 }}>

                <Animated.View
                    style={{
                        width: '100%',
                        height: scrollBarHeight,
                        backgroundColor: 'red',
                        position: 'absolute',
                        top: scrollBarTop,
                    }}
                />
            </View>
        </View>
    );
};
