import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { NYUSTTheme } from '../../constants'

const CoueseTextBooks = ({ route }) => {

    console.log(JSON.stringify(route.params.books))

    const [data, setData] = React.useState(null)

    React.useEffect(() => {
        setData(route.params.books)
    }, [])

    const DataBox = ({ value, dark, }) => {

        console.log(value)

        return <View
            style={{
                paddingHorizontal: 30,
                paddingVertical: 15,
                height: 75,
                width: "100%",
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
                backgroundColor: dark ? NYUSTTheme.colors.background : '#1C333D',
                // backgroundColor: NYUSTTheme.colors.notification,
            }}>
            <Text
                numberOfLines={2}
                style={{ width: "85%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {value["書名/ISBN"].書名}
            </Text>
            <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                        value["書名/ISBN"].書名,
                        `ISBN: ${(value["書名/ISBN"].ISBN.length == 0 ? "未提供" : value["書名/ISBN"].ISBN)}\n作者: ${value["作者"].length == 0 ? "未提供" : value["作者"]}\n出版者: ${value["出版者"].length == 0 ? "未提供" : value["出版者"]}\n出版年: ${value["出版年"].length == 0 ? "未提供" : value["出版年"]}\n`,
                        [
                            {
                                text: "複製書名",
                                onPress: async () => { 
                                    await Clipboard.setStringAsync(value["書名/ISBN"].書名.replace('&amp;', '&'));
                                 },
                                style: "cancel"
                            },
                            {
                                text: "複製ISBN",
                                onPress: async () => { 
                                    await Clipboard.setStringAsync(value["書名/ISBN"].ISBN);
                                 },
                                style: "cancel"
                            },
                            {
                                text: "複製作者",
                                onPress: async () => { 
                                    await Clipboard.setStringAsync(value["作者"]);
                                 },
                                style: "cancel"
                            },
                            {
                                text: "複製出版者",
                                onPress: async () => { 
                                    await Clipboard.setStringAsync(value["出版者"]);
                                 
                                },
                                style: "cancel"
                            },
                            {
                                text: "複製年份",
                                onPress: async () => { 
                                    await Clipboard.setStringAsync(value["出版年"]);
                                },
                                style: "cancel"
                            },
                            {
                                text: "好",
                                onPress: async () => { },
                                style: "cancel"
                            },
                        ],
                        { cancelable: true }
                        
                    )
                }}
                style={{ width: "15%", flex: 1, fontWeight: 'normal', fontSize: 15, alignSelf: "center"}}>
                <Ionicons style={{
                    alignSelf: "flex-end",
                
                }} name="ios-information-circle" size={24} color={NYUSTTheme.colors.text} />
            </TouchableOpacity>
        </View>
    }

    return (
        <View style={{
            height: "100%",
        }}>

            <ScrollView
                style={{
                    flex: 1,
                    position: 'relative',
                    paddingTop: 55,
                    flexDirection: 'column',
                    backgroundColor: NYUSTTheme.colors.background,
                }}>
                {data && data.map((item, index) => {
                    return (
                    <DataBox key={index} value={item} dark={index % 2 !== 0} />
                )
                    {/* return <Text>{JSON.stringify(item)}</Text> */}
                })}
                <View style={{
                    height: 150,
                }}>
                </View>
            </ScrollView>
        </View>
    )
}

export default CoueseTextBooks