import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NYUSTTheme } from '../../constants';

const CoueseCoreCompetencies = ({ route }) => {

    console.log(JSON.stringify(route.params.CoreCompetencies))
    const [data, setData] = React.useState(null)

    React.useEffect(() => {
        setData(route.params.CoreCompetencies)
    }, [])

    const DataBox = ({ value, dark, }) => {

        console.log(value)

        return <TouchableOpacity

        onPress={() => {
            Alert.alert(
                value.coreAbility,
                `${value.noRelation ? '無關連' : value.lowRelation ? '低度關聯' : value.moderateRelation ? '中度關聯' : value.highRelation ?'高度關聯' : value.completeRelation ? '完全關聯' : '無關聯'}`,
                [
                    {
                        text: "好",
                        style: "cancel"
                    },
                ],
                {
                    cancelable: true,
                }
            );
        }}

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
                style={{ width: "10%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {value.itemNumber}
            </Text>
            <Text
                
                numberOfLines={2}
                style={{ width: "70%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {value.coreAbility}
            </Text>
            <Text
                style={{ width: "10%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
                {`${value.noRelation ? '無關連' : value.lowRelation ? '低度關聯' : value.moderateRelation ? '中度關聯' : value.highRelation ?'高度關聯' : value.completeRelation ? '完全關聯' : '無關聯'}`}
            </Text>
        </TouchableOpacity>
    }

    return(
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
                })}
                <View style={{
                    height: 60,
                }}>
                </View>
            </ScrollView>
        </View>
    )
}

export default CoueseCoreCompetencies;
