import React from 'react';
import { StyleSheet } from 'react-native';

import Colors from '../constants/Colors';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import config from './../apikey.json'
const containerStyle = {
  width: '90%',
  height: '350px',
};

const center = {
  lat: 39.639042,
  lng: 20.854587,
};

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
    
    
      <View style={styles.getStartedContainer}>
        <View
                    style={[styles.homeScreenFilename,{borderRadius: 3,
                      paddingHorizontal: 4,}]}
                    darkColor="rgba(255,255,255,0.05)"
                    lightColor="rgba(0,0,0,0.05)">
        <MonoText style={{fontSize: 17}}>Monday - Saturday: 8:00 - 23:00</MonoText>
 
        </View>

        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename,]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)">
          <MonoText style={{fontSize: 17}}>Address: Asdasda, 15 Ioannina</MonoText>
        </View>

        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
        </Text>
      </View>

      <View style={styles.maps}>
        <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14.5}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </View>

      <View style={styles.helpContainer}>
        <ExternalLink
          style={styles.helpLink}
          href="https://www.google.com/maps/@39.6413226,20.8545963,15.94z?hl=en-US&entry=ttu">
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here to redirect on google maps website
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'left',
  },
  homeScreenFilename: {
    marginVertical: 7,
    
  },
  maps:{
    marginHorizontal:'-40%'
    
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
    marginBottom:'10%'
    
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'left',
  },
  helpContainer: {
    marginTop: 15,
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
