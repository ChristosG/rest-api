import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { RangeSlider } from '@react-native-assets/slider';
import { TouchableOpacity } from 'react-native-gesture-handler';

const RangeSliderR = () => {
    const [range, setRange] = useState([200, 500]);

    const handleRangeChange = (newRange) => {
        setRange(newRange);
        console.log(newRange);
    };



    return (
        <View style={{ backgroundColor: 'white', width: '50%', alignSelf: 'center' }}>
            <Text>Min: {range[0]}</Text>
            <Text>Max: {range[1]}</Text>
            <TouchableOpacity>
                <RangeSlider
                    range={range}                    // set the current slider's value
                    minimumValue={0}                  // Minimum value
                    maximumValue={1000}                  // Maximum value
                    // step={0}                          // The step for the slider (0 means that the slider will handle any decimal value within the range [min, max])
                    //  minimumRange={10}                  // Minimum range between the two thumbs (defaults as "step")
                    // crossingAllowed={false}           // If true, the user can make one thumb cross over the second thumb
                    outboundColor='blue'              // The track color outside the current range value
                    inboundColor='red'               // The track color inside the current range value
                    thumbTintColor='yellow'         // The color of the slider's thumb

                    trackHeight={4}                   // The track's height in pixel
                    thumbSize={35}                    // The thumb's size in pixel
                    slideOnTap={true}                 // If true, touching the slider will update it's value. No need to slide the thumb.
                    onValueChange={(val => handleRangeChange(val))}         // Called each time the value changed. The type is (range: [number, number]) => void

                /></TouchableOpacity>
        </View>
    );
};

export default RangeSliderR;
