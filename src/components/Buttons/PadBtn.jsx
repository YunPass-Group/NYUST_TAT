import { View, Text, TouchableOpacity } from 'react-native'
import { SimpleLineIcons, Ionicons, MaterialCommunityIcons, FontAwesome5, Foundation } from '@expo/vector-icons';
import React from 'react'
import { NYUSTTheme } from '../../constants';

export default function PadBtn({
    onPress,
    icon,
    text = 'simple',
    iconPack,
    size = 20,
    color = NYUSTTheme.colors.card
}) {

    const iconElement = (iconPack) => {
        switch (iconPack) {
            case 'SimpleLineIcons':
                return <SimpleLineIcons name={icon} size={size} color="white" />
            case 'Ionicons':
                return <Ionicons name={icon} size={size} color="white" />

            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={icon} size={size} color="white" />
            case 'FontAwesome5':
                return <FontAwesome5 name={icon} size={size} color="white" />
            case 'Foundation':
                return <Foundation name={icon} size={size} color="white" />


        }
    }
    return (
        <TouchableOpacity style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }} >
            <View style={{
                backgroundColor: color,
                borderRadius: 30,
                height: 60,
                width: 60,
                padding: 20,
                shadowColor: color,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}>

                {iconElement(iconPack)}

            </View>
            <Text style={{
                color: 'white',

            }}>{text}</Text>
        </TouchableOpacity>
    )
}