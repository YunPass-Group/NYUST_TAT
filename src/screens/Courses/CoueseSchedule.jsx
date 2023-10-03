import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native'
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { NYUSTTheme } from '../../constants'

const CoueseSchedule = ({ route }) => {

    console.log(JSON.stringify(route.params.schedule))

    const [data, setData] = React.useState(null)

    React.useEffect(() => {
        setData(route.params.schedule)
    }, [])

    const DataBox = ({ value, dark, }) => {

        console.log(value)

        return <View
            style={{
                paddingHorizontal: 30,
                paddingVertical: 15,
                gap: 15,
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
                style={{ width: "16%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {`第${value.week}週`}
            </Text>
            <Text
                
                numberOfLines={2}
                style={{ width: "45%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {value.teachingContent.map((item, index) => {
                    {
                        return `${index !== 0 ? '\n' : ''}${item}`
                    }
                })}
            </Text>
            <Text
                style={{ width: "10%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {value.teachingMethod}
            </Text>
            <TouchableOpacity
                onPress={() => {

                    let buttons = []
                    if(value.remarks.length !== 0){
                        //if reamrk is url then open it
                        if(value.remarks.includes("http")){
                            buttons.push({
                                text: "開啟連結",
                                onPress: async () => { 
                                    await Linking.openURL(value.remarks);
                                 },
                                style: "cancel"
                            })
                    }
                        buttons.push({
                            text: "複製備註",
                            onPress: async () => { 
                                await Clipboard.setStringAsync(value.remarks);
                             },
                            style: "cancel"
                        })
                    
                    }
                    buttons.push({
                                text: "好",
                                style: "cancel"
                            })

                    Alert.alert(
                        `第${value.week}週`,
                        `${value.teachingContent} \n\n備註:${value.remarks.length == 0 ? "無備註" : value.remarks}`,
                        buttons,
                        { cancelable: true }
                        
                    )
                }}
                style={{ width: "15%", flex: 1, fontWeight: 'normal', fontSize: 15, alignSelf: "center"}}>
                <Ionicons style={{
                    alignSelf: "flex-end",
                
                }} name={`${value.remarks.length !== 0 ? 'ios-information-circle' : 'ios-information-circle-outline'}`} size={24} color={NYUSTTheme.colors.text} />
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
                    {/* return <Text>{JSON.stringify(item)}</Text> */ }
                })}
                <View style={{
                    height: 60,
                }}>
                </View>
            </ScrollView>
        </View>
    )
}

export default CoueseSchedule