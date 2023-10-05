import { View, Text, Button, ScrollView, RefreshControl, TouchableOpacity, Platform, Linking, Alert, ActivityIndicator } from 'react-native'

import React from 'react'
import { NYUSTTheme } from '../../constants'
import { Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import storage from '../../utils/storage';
import Student from '../../utils/Student';

const CoursesDetials = ({ route = null }) => {
    const [account, setAccount] = React.useState(null)
    const [data, setData] = React.useState(null)
    const [refreshing, setRefreshing] = React.useState(false);

    const renderedJSXRef = React.useRef(null);

    React.useEffect(() => {
        if ((data === null && account) || (refreshing && account)) {
            renderedJSXRef.current = Student(account.username, account.password, (fetchedData) => {
                setData(fetchedData);
                setTimeout(() => {
                    setRefreshing(false);
                    console.log("Getting course syllabus and teaching plan from NYUST server... Done!");
                }, 1000);
            }).getCourseSyllabusAndTeachingPlan(route.params.url);
        }
    }, [data, account, refreshing, route]);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    const DataBox = ({ title, value, dark, link = null }) => {

        //if link is email
        const isEmail = link && link.includes('@') && !link.includes('http');

        return <View style={{ paddingHorizontal: 30, paddingVertical: 30, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center', backgroundColor: dark ? NYUSTTheme.colors.background : '#1C333D' }}>
            <View>
                <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                    <Foundation name="paperclip" size={24} color={NYUSTTheme.colors.text} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: NYUSTTheme.colors.text }}>
                        {title}
                    </Text>
                </View>
                <View style={{
                    flex: 1,
                    marginTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                    }}>
                        {value && value.map((item, index) => (
                            <Text
                                key={index}
                                style={{ fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, paddingLeft: 27 }}>
                                {item}
                            </Text>
                        ))}
                    </View>
                    <TouchableOpacity onPress={() => {
                        if (isEmail) {
                            Linking.openURL(`mailto:${link}`)
                                .catch(err => Alert.alert('無法開啟郵件', '請確認您的郵件設定是否正確(可能沒有安裝郵件軟體)'));
                        } else {
                            Linking.openURL(link)
                                .catch(err => Alert.alert('無法開啟網頁', '請確認您的網路設定是否正確'));
                        }
                    }}>
                        {link && isEmail && <Ionicons name="ios-mail" size={24} color={NYUSTTheme.colors.text} />}
                        {link && !isEmail && <MaterialCommunityIcons name="web" size={24} color={NYUSTTheme.colors.text} />}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }

    React.useEffect(() => {

        storage.load({ key: 'account', id: 'account' })
            .then((value) => {
                setAccount(value);
            });

        storage.load({
            key: "courseSyllabusAndTeachingPlan",
            id: route.params.url,
        })
            .then((data) => {
                setData(data)
            })
    }, [])

    React.useEffect(() => {
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, [data])

    const navigation = useNavigation();

    navigation.setOptions({ title: route.params.className })

    return (
        <>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={[
                            NYUSTTheme.colors.primary,
                            NYUSTTheme.colors.secondary,
                            NYUSTTheme.colors.tertiary,
                            NYUSTTheme.colors.card,
                        ]}
                        titleColor='lightgray'
                        title={refreshing ? '正在和學校網頁溝通' : '下拉重新向學校網頁抓取教學課綱'}
                        tintColor='lightgray'
                        refreshing={refreshing}
                        progressViewOffset={Platform.OS === 'android' ? 105 : 55 - 3}
                        onRefresh={onRefresh} />
                }
                // showsVerticalScrollIndicator={false}
                style={{
                    backgroundColor: NYUSTTheme.colors.background,
                    paddingTop: Platform.OS === 'android' ? 105 : 55,
                }} >
                <Text style={{
                    color: NYUSTTheme.colors.text,
                    fontSize: 25,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginTop: 30,
                    paddingBottom: 30,
                }}>
                    課程資料
                </Text>
                {
                    data &&
                    [['課程名稱', [data['Information']['courseName'], data['Information']['courseNameEnglish']]],
                    ['系所課號', [data['Information']['curriculumNo']]],
                    ['學年期 / 課號', [`${[data['Information']['semester']]} - ${[data['Information']['semesterType']]} / ${[data['Information']['serialNo']]}`]],
                    ['修別', [data['Information']['requiredElective']]],
                    ['授課方式', [data['Information']['courseType']]],
                    ['開課班級', [data['Information']['class']]],
                    ['講授-實習-學分', [data['Information']['credits']]],
                    ['上課時間/教室', [data['Information']['scheduleClassroom']]],
                    ['授課教師(教師所屬系所)', [`${data['Information']['instructorDepartment']['name']}(${data['Information']['instructorDepartment']['department']})`], data['Information']['instructorDepartment']['email']],
                    ['教師聯絡資訊E-mail及分機(可洽詢教師所屬系所)', [data['Information']['instructorEmailAndExt']]],
                    ['備註', [data['Information']['instructor']]],
                    ['課程簡介', data['Information']['courseIntroduction']],
                    ['教學目標', data['Information']['teachingObjectives']],
                    ['評量方式', data['Information']['evaluationMethods']],
                    ['課業輔導時間', [data['Information']['officeHours']]],
                    ['教材網站資訊', [data['Information']['teachingMaterials']], data['Information']['teachingMaterials']],
                    ].map((item, index) => (
                        <DataBox
                            key={index}
                            title={item[0]}
                            value={item[1]}
                            link={item[2]}
                            dark={index % 2}
                        />
                    ))
                }
                <View style={{ paddingHorizontal: 30, paddingVertical: 15, paddingBottom: 30, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center', backgroundColor: '#1C333D' }}>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', gap: 10, marginBottom: 30 }}>
                            <Foundation name="paperclip" size={24} color={NYUSTTheme.colors.text} />
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: NYUSTTheme.colors.text }}>
                                教學計畫附件
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        gap: 30,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CoursesTextBooks', { books: data['Textbooks']})
                            }}
                            style={{
                                height: 50,
                                // width: "100%",
                                marginHorizontal: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 30,
                                backgroundColor: NYUSTTheme.colors.card,
                            }}>
                            <Text style={{
                                color: NYUSTTheme.colors.text,
                                fontSize: 15,
                                fontWeight: "bold",
                            }}>
                                參考教科書
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CoueseSchedule', { schedule: data['Schedule']})
                            }}
                            style={{
                                height: 50,
                                // width: "100%",
                                marginHorizontal: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 30,
                                backgroundColor: NYUSTTheme.colors.card,
                            }}>
                            <Text style={{
                                color: NYUSTTheme.colors.text,
                                fontSize: 15,
                                fontWeight: "bold",
                            }}>
                                教學計畫及進度
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CoueseCoreCompetencies', { CoreCompetencies: data['CoreCompetencies']})
                            }}
                            style={{
                                height: 50,
                                // width: "100%",
                                marginHorizontal: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 30,
                                backgroundColor: NYUSTTheme.colors.card,
                            }}>
                            <Text style={{
                                color: NYUSTTheme.colors.text,
                                fontSize: 15,
                                fontWeight: "bold",
                            }}>
                                核心能力關聯
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 30, paddingVertical: 15, paddingBottom: 30, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'center', backgroundColor: NYUSTTheme.colors.background }}>
                    <View>
                        <View style={{ flex: 1, flexDirection: 'row', gap: 10, marginBottom: 30 }}>
                            <Foundation name="paperclip" size={24} color={NYUSTTheme.colors.text} />
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: NYUSTTheme.colors.text }}>
                                其他資料
                            </Text>
                        </View>
                    </View>
                    <View style={{
                        gap: 30,
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('CoursesStudentList', { stdurl: route.params.stdurl })
                            }}
                            style={{
                                height: 50,
                                // width: "100%",
                                marginHorizontal: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 30,
                                backgroundColor: NYUSTTheme.colors.card,
                            }}>
                            <Text style={{
                                color: NYUSTTheme.colors.text,
                                fontSize: 15,
                                fontWeight: "bold",
                            }}>
                                學生參與名單
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>



                {/* footer */}
                <View style={{
                    height: Platform.OS === 'android' ? 200 : 90,
                }}>
                </View>
            </ScrollView>
            <View style={{ height: 0 }}>
                {
                    ((data === null && account) || (refreshing && account)) &&
                    Student(account.username, account.password, (data) => {
                        setData(data)
                        setTimeout(() => {
                            setRefreshing(false)
                            console.log("Getting course syllabus and teaching plan from NYUST server... Done!");
                        }, 1000);
                    }).getCourseSyllabusAndTeachingPlan(route.params.url)
                }
            </View>
            {/* <View style={{ height: 0 }}>
                {renderedJSXRef.current}
            </View> */}
            {(!refreshing && data === null) && <ActivityIndicator style={{ height: "100%", width: "100%", alignSelf: "center", backgroundColor: NYUSTTheme.colors.background, paddingBottom: 130 }} size="large" />}
        </>
    )
}

export default CoursesDetials