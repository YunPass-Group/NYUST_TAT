import { View, Text, ScrollView, Image, Animated } from 'react-native'
import React from 'react'
import { NYUSTTheme } from '../../constants'


const SchoolMap = () => {
    const scale = React.useRef(new Animated.Value(1)).current;
    const translateX = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(new Animated.Value(0)).current;

    return (
        <ScrollView style={{
            backgroundColor: NYUSTTheme.colors.background,
            paddingTop: 55 + 30,
        }}>
            <Image
                resizeMode='contain'
                source={require('../../assets/images/2022-N-02.jpg')} style={{
                    // marginHorizontal: 30,
                    width: '100%',
                    height: undefined,
                    aspectRatio: 1,
                    // resizeMode: 'contain',
                }} />
        </ScrollView>
    )
}

export default SchoolMap