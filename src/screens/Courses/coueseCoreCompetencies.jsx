import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import WebView from 'react-native-webview';
import { Radar } from "react-chartjs-2";
import { NYUSTTheme } from '../../constants';
import chartJSContent from '../../utils/chart.js'


const CoueseCoreCompetencies = ({ route }) => {


    console.log(chartJSContent.toString());

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
                    `${value.noRelation ? '無關連' : value.lowRelation ? '低度關聯' : value.moderateRelation ? '中度關聯' : value.highRelation ? '高度關聯' : value.completeRelation ? '完全關聯' : '無關聯'}`,
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
                {`${value.noRelation ? '無關連' : value.lowRelation ? '低度關聯' : value.moderateRelation ? '中度關聯' : value.highRelation ? '高度關聯' : value.completeRelation ? '完全關聯' : '無關聯'}`}
            </Text>
        </TouchableOpacity>
    }
    const radarHTML =

        `
        <body style="background-color: ${NYUSTTheme.colors.background}">
        <div >
        <canvas id="myChart"></canvas>
       </div>
       <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

       <script>
       const ctx = document.getElementById('myChart');
       Chart.defaults.color = '#fff';
       Chart.defaults.font.size = 30;
       Chart.defaults.borderColor = '${NYUSTTheme.colors.primary}';
       new Chart(ctx, {
           type: 'radar',
           data: {
               labels: [
                   ${data && data.map((item, index) => { return `'${item.itemNumber}'` })}
               ],
           datasets: [{
               label: '核心能力雷達圖',
               data: [${data && data.map((value, index) => { return value.noRelation ? '0' : value.lowRelation ? '1' : value.moderateRelation ? '2' : value.highRelation ? '3' : value.completeRelation ? '4' : '0' })}],
               fill: true,
               backgroundColor: '#2A9D8F44',
               borderColor: '${NYUSTTheme.colors.card}',
               pointBackgroundColor: '${NYUSTTheme.colors.card}',
               pointBorderColor: '#fff',
               pointHoverBackgroundColor: '#fff',
               pointHoverBorderColor: '${NYUSTTheme.colors.card}'
           }]
           },
           options: {
            scales: {
                r: {
                    
                    suggestedMin: 0,
                    suggestedMax: 4,
                    ticks: {
                        display: false,
                        stepSize: 1,
                    },
                    pointLabels: {
                        font: {
                            size: 30
                        }
                      }
                }
            },
               elements: {
                   line: {
                       borderWidth: 3
                   }
               },
               plugins: {
                   customCanvasBackgroundColor: {
                     color: '${NYUSTTheme.colors.background}',
                   }
                 }
           },
       });
       </script>
        </body>
        `

    return (
        <View style={{
            height: "100%",
        }}>
            {/* {data.length === 0  && 
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: NYUSTTheme.colors.background,
                paddingTop: 55,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text>沒有資料</Text>
            </View>} */}
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
                    position: 'relative',
                }}>
                    
                    <WebView
                        // injectedJavaScript={() => chartJSContent.toString()}
                        allowsBackForwardNavigationGestures={false}
                        onTouchMove={() => { }}
                        source={{ html: radarHTML }}
                        style={{
                            
                            padding: 0,
                            marginTop: 20,
                            height: 400,
                            width: "100%",
                            backgroundColor: NYUSTTheme.colors.background
                        }}
                    />
                    <View style={{
                        position: 'absolute',
                        height: 800,
                        width: "100%",
                        // backgroundColor: NYUSTTheme.colors.card,
                    }}>

                    </View>
                </View>
                <View style={{
                    height: 60,
                }}>
                </View>
            </ScrollView>
        </View>
    )
}

export default CoueseCoreCompetencies;
