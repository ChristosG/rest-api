import React from 'react';
import { StyleSheet } from 'react-native';
import {Link} from 'expo-router';
import Colors from '../constants/Colors';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

export default function ScreenInfoTwo({ path }) {
    const screenHeight = Number(path);
    return (
        <View>
            <View style={styles.getStartedContainer}>
                <Text
                    style={styles.getStartedText}
                    lightColor="rgba(0,0,0,0.8)"
                    darkColor="rgba(255,255,255,0.8)">
                    GRID
                </Text>
                
                <View
                    style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
                    darkColor="rgba(255,255,255,0.05)"
                    lightColor="rgba(0,0,0,0.05)">
                    <Text>{path}</Text>
                </View>

                <Text
                    style={styles.getStartedText}
                    lightColor="rgba(0,0,0,0.8)"
                    darkColor="rgba(255,255,255,0.8)">
                    ASDADSADA
                </Text>
            </View>

            <View style={{
                marginTop: (screenHeight / 10),
                justifyContent: 'flex-end',
                marginHorizontal: 20,
                alignItems: 'center',
            }}>
                <Link
                    style={styles.helpLink}
                    href="/">
                    <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
                        Tap here to return to Home
                    </Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    getStartedContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    helpContainer: {
        justifyContent: 'flex-end',
        //marginTop: screenHeight,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: 'center',
    },
});
