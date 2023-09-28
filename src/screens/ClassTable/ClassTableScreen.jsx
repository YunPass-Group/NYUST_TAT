import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet, Platform, Pressable } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { NYUSTTheme } from '../../constants';
import Student from '../../utils/Student';
import storage from '../../utils/storage';
import { StatusBar } from 'expo-status-bar';
const Stack = createNativeStackNavigator();
import { Cell } from "../../components/Table"

const ClassTable = React.memo(({ semester }) => {

  const [account, setAccount] = React.useState(null);
  const [courses, setCourses] = React.useState(null);
  const tableColor = [
    '#FFCCBB',
    '#FFECB2',
    '#FFCDD2',
    '#B3E5FC',
    '#B2DFDD',
    '#C8E6CA',
    '#F0F5C2',
    '#DDEDC8',
    '#FEE0B2',
    '#FEFAC2',
    '#E2BEE8',
    '#F9BBD0',

  ]

  React.useEffect(() => {

    storage.load({ key: 'account', id: 'account' })
      .then((value) => {
        setAccount(value);
      });

    storage.load({ key: 'courses', id: 'courses' })
      .then((value) => {
        setCourses(value);
      })
      .catch((err) => {
        //fetches the courses

      });
  }, [])

  const TableClassProcesser = (week, time) => {
    let result = null;

    console.log('Processing for Week:', week, 'Time:', time);

    if (courses && courses.Courses) {
      console.log('Courses Available:', courses.Courses);

      courses.Courses.forEach((course, index) => {
        const classTime = course.ClassTime;
        console.log('Checking Course:', course['Class Name'], 'Week:', classTime.Week, 'Time:', classTime.Time);

        if (classTime.Week === week && classTime.Time.includes(time)) {
          result = {
            color: tableColor[index % tableColor.length],
            course: course,
            detailsWebsite: course['Details Website']
          };
          console.log('Match Found:', result);
        }
      });
    }

    return result;
  }


  const timeTable = ['07:10', '08:10', '09:10', '10:10', '11:10', '12:10', '13:10', '14:10', '15:10', '16:10', '17:10', '18:25', '19:20', '20:15', '21:10']
  const timeTable2 = ['節次X', '節次A', '節次B', '節次C', '節次D', '節次Y', '節次E', '節次F', '節次G', '節次H', '節次Z', '節次I', '節次J', '節次K', '節次L']
  return (
    <>

      {
        courses === null &&
        <ActivityIndicator style={{ height: "100%", width: "100%", alignSelf: "center", backgroundColor: NYUSTTheme.colors.background }} size="large" />
      }{courses !== null &&
        <View style={{
          position: "absolute",
          top: 100,
          left: 0,
          zIndex: 100,
          width: "100%",
          height: 60,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          borderBottomWidth: 1,
          shadowOpacity: 0.5,
          shadowRadius: 10,
          shadowColor: NYUSTTheme.colors.card,
          shadowOffset: {
            width: 0,
            height: 10,
          },
        }}>
          <BlurView
            tint="dark"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
          <Cell text="節次" isHeader={true} />
          <Cell text="ㄧ" isHeader={true} />
          <Cell text="二" isHeader={true} />
          <Cell text="三" isHeader={true} />
          <Cell text="四" isHeader={true} />
          <Cell text="五" isHeader={true} />
          <Cell text="六" isHeader={true} />
          <Cell text="日" isHeader={true} />
        </View>
      }
      <ScrollView style={{
        flex: 1,
        backgroundColor: NYUSTTheme.colors.background,
        // position: "relative",
        height: "100%",
        // padding header bar,
        paddingTop: Platform.OS === 'ios' ? 101 + 60 : 70 + 60,
      }}>
        <StatusBar style="light" />
        {/* api */}
        <View style={{ height: 0, position: 'relative' }}>
          {account &&
            Student(account.username, account.password, (data) => {
              console.log(JSON.stringify(data))
              if (data) {
                setCourses(data);
              }
            }).getCourseList(semester, 0)
          }
        </View>
        <View style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          paddingBottom: 100,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: NYUSTTheme.colors.background,
        }}>
          {/* <Text>{JSON.stringify(account)}</Text>
        <Text>{semester}</Text>
        <Text>test</Text> */}
          {/* table */}
          {

            ['X', 'A', 'B', 'C', 'D', 'Y', 'E', 'F', 'G', 'H', 'Z', 'I', 'J', 'K', 'L'].map((_time, index) => {
              return <View
                key={index}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: index % 2 === 0 ? '#1C333D' : NYUSTTheme.colors.background,
                }}>

                <Cell text={timeTable[index]} text2={timeTable2[index]} isTime={true} />
                <Cell data={TableClassProcesser(week = 1, time = _time)} />
                <Cell data={TableClassProcesser(week = 2, time = _time)} />
                <Cell data={TableClassProcesser(week = 3, time = _time)} />
                <Cell data={TableClassProcesser(week = 4, time = _time)} />
                <Cell data={TableClassProcesser(week = 5, time = _time)} />
                <Cell data={TableClassProcesser(week = 6, time = _time)} />
                <Cell data={TableClassProcesser(week = 7, time = _time)} />
              </View>
            })
          }
          <View style={{
            height: 144,
          }}>

          </View>
        </View>
      </ScrollView>

    </>
  )
});

const ScreenWrapper = ({ semester }) => {
  if (!semester) return <ActivityIndicator size="large" />;
  return <ClassTable semester={semester} />;
};

const ClassTableScreen = () => {
  const [semesterList, setSemesterList] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [selectionDialogVisible, setSelectionDialogVisible] = React.useState(false);

  React.useEffect(() => {
    storage.load({
      key: 'semesterList',
      id: 'semesterList',
    }).then((data) => {
      console.log(JSON.stringify(data))
      setSemesterList(data);
      setSelectedYear(data[0]);
    }).catch((err) => {
      //Alert
      Alert.alert("Error", err.message);
    });
  }, [])

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name={`${selectedYear && (parseInt(selectedYear.replace('"', '').replace('"', '').substring(0, 3)) + 1) + "年 第" + "1112".charAt(3) + "學期"} 課表`}
          children={() => <ScreenWrapper semester={selectedYear} />}
          initialParams={{ selectedYear }}
          options={{
            headerTransparent: true,
            headerShadowVisible: true,
            headerBackground: () => (
              <BlurView
                tint="dark"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  setSelectionDialogVisible(!selectionDialogVisible);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{
                  color: NYUSTTheme.colors.primary,
                  fontSize: 15,
                  fontWeight: "bold",
                }}>
                  切換學期
                </Text>
              </TouchableOpacity>
            )
          }}

        />
      </Stack.Navigator>
      {
        selectionDialogVisible &&
        <View style={{
          height: Platform.OS === 'ios' ? "80%" : "100%",
          width: "100%",
          position: "absolute",
          top: Platform.OS === 'ios' ? 100 : 0,
          Bottom: 144,
          left: 0,
          zIndex: 100,


        }}>
          <BlurView
            tint="dark"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            onPress={() => setSelectionDialogVisible(false)}
            style={{ gap: 30, width: "100%", height: "100%", paddingHorizontal: 30, justifyContent: "center", }}>
            {semesterList && semesterList.map((semester, index) => {
              return <TouchableOpacity
                key={index}
                onPress={() => {
                  if (semester !== selectedYear)
                    setSelectedYear(semester);
                  setSelectionDialogVisible(false);
                }}
                style={{
                  height: 50,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: semester === selectedYear ? NYUSTTheme.colors.card : NYUSTTheme.colors.background,
                  borderRadius: 30,
                }}>
                <Text style={{
                  color: NYUSTTheme.colors.primary,
                  fontSize: 15,
                  fontWeight: "bold",
                }}>
                  {(parseInt(semester.replace('"', '').replace('"', '').substring(0, 3)) + 1) + "年 第" + "1112".charAt(3) + "學期"}
                </Text>
              </TouchableOpacity>
            })}
          </Pressable>
        </View>
      }
    </>
  )
}

export default ClassTableScreen