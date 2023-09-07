
import React from 'react';
import { Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../constants/Colors';

const CustomHeader = ({ username }) => {
  return (
    <Text style={styles.heads}>Welcome back, {username}</Text>
  );
};

const styles = {
  heads: {
    fontSize: 20,
    fontWeight: 'bold',
  },
};

export default CustomHeader;
