import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet, Platform, RefreshControl, Button } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { BlurView } from "expo-blur";
import { NYUSTTheme } from '../../constants';
import Student from '../../utils/Student';
import storage from '../../utils/storage';
import { StatusBar } from 'expo-status-bar';
const Stack = createNativeStackNavigator();
import { Cell } from "../../components/Table"
import { YearSelectDialog } from '../../components/Dialog/';
import CoursesDetials from '../Courses/CoursesDetials';
import CoueseTextBooks from "../Courses/CoueseTextBooks"
import CoursesStudentList from '../Courses/CoursesStudentList';
import CoueseSchedule from '../Courses/CoueseSchedule';
import coueseCoreCompetencies from '../Courses/coueseCoreCompetencies';

const ClassTable = React.memo(({ semester}) => {

  const navigation = useNavigation();

  // const [semester, setSemester] = React.useState(null)
  const [semesterList, setSemesterList] = React.useState(null); // ["1121", "1112", "1111", "1102", "1101"

  const [account, setAccount] = React.useState(null);
  const [courses, setCourses] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setCourses(null);
    // setRefreshing(false);
  }, []);

  React.useEffect(() => {
    courses && setRefreshing(false);
  }, [courses])

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
    storage.load({
      key: "courseList",
      id: semester,
    })
      .then((data) => {
        console.log("Found course list stored in storage");
        setCourses(data);
      });

    storage.load({
      key: 'semesterList',
      id: 'semesterList',
    }).then((data) => {
      // console.log(JSON.stringify(data))
      setSemesterList(data);
      // setSemester(data[0]);
    }).catch((err) => {
      //Alert
      Alert.alert("Error", err.message);
    });

  }, [])

  React.useEffect(() => {
    setCourses(null);
    storage.load({
      key: "courseList",
      id: semester,
    })
      .then((data) => {
        console.log("Found course list stored in storage");
        setCourses(data);
      });
  }, [semester])

  const TableClassProcesser = (week, time) => {
    try {
      const key = week + "_" + time;
      let result = null;
      return courses[key] !== undefined ? courses[key] : null;
    } catch (err) {
      //Course not found
    }
  }


  let timeTable = [
    "07:10\n節次X",
    "08:10\n節次A",
    "09:10\n節次B",
    "10:10\n節次C",
    "11:10\n節次D",
    "12:10\n節次Y",
    "13:10\n節次E",
    "14:10\n節次F",
    "15:10\n節次G",
    "16:10\n節次H",
    "17:10\n節次Z",
    "18:25\n節次I",
    "19:20\n節次J",
    "20:15\n節次K",
    "21:10\n節次L"
  ]
  return (
    <>
      {
        <View style={{
          position: "absolute",
          top: 100 - 3,
          left: 0,
          zIndex: 100,
          width: "100%",
          height: 60,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          overflow: "hidden",
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        indicatorStyle='none'
        refreshControl={
          <RefreshControl
            colors={[
              NYUSTTheme.colors.primary,
              NYUSTTheme.colors.secondary,
              NYUSTTheme.colors.tertiary,
              NYUSTTheme.colors.card,
            ]}
            titleColor='lightgray'
            title={refreshing ? '正在和學校網頁溝通' : '下拉重新向學校網頁抓取課表'}
            tintColor='lightgray'
            progressViewOffset={160 - 3}
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          backgroundColor: NYUSTTheme.colors.background,
          // position: "relative",
          height: "100%",
          // padding header bar,
          paddingTop: Platform.OS === 'ios' ? 100 + 60 - 3 : 100 + 60 - 3,
        }}>
        <StatusBar style="light" />
        {/* api */}
        <View style={{ height: 0, position: 'relative' }}>
          {((courses === null && account) || refreshing) &&
            Student(account.username, account.password, (data) => {
              {/* console.log(JSON.stringify(data)) */ }
              console.log("Getting course list from NYUST server...");
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
                <Cell text={timeTable[index]} isTime={true} />
                {[1, 2, 3, 4, 5, 6, 7].map((_week, _index) =>
                  <Cell
                    key={_time + _week}
                    data={TableClassProcesser(week = _week, time = _time)}
                    onPress={(url, className, stdurl) => {
                      console.log(url, className)
                      navigation.navigate('CoursesDetials', { url: url, className: className, stdurl: stdurl })
                    }}
                  />
                )}
              </View>
            })
          }

          {/* {semesterList && semesterList.length > 0 && semesterList.map((semester, index) => {
            return <Button key={index} onPress={() => {
              setSemester(semester)
            }} title={semester} />
          })} */}

          <View style={{
            height: Platform.OS === 'ios' ? 140 : 160,
          }}>

          </View>
        </View>
      </ScrollView>
      {
        (!refreshing && courses === null) &&
        <ActivityIndicator style={{marginBottom: 60 ,  height: "100%", width: "100%", alignSelf: "center", backgroundColor: NYUSTTheme.colors.background, position: "absolute" }} size="large" />
      }
    </>
  )
});

const ScreenWrapper = ({ semester }) => {
  if (!semester) return <ActivityIndicator size="large" />;
  return <ClassTable semester={semester} />;
};


const ClassTableScreen = () => {
  const [account, setAccount] = React.useState(null);


  const [semesterList, setSemesterList] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [selectionDialogVisible, setSelectionDialogVisible] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {

    storage.load({ key: 'account', id: 'account' })
      .then((value) => {
        setAccount(value);
      })

    storage.load({
      key: 'semesterList',
      id: 'semesterList',
    }).then((data) => {
      // console.log(JSON.stringify(data))
      setSemesterList(data);
      setSelectedYear(data[0]);
    }).catch((err) => {
      //Alert
      Alert.alert("Error", err.message);
    });
  }, [])

  const headerOptions = Platform.OS === 'android' ? {
    headerBackground: () => (
      <BlurView
        tint="dark"
        intensity={100}
        style={StyleSheet.absoluteFill}
      />
    ),
    headerLeft: () => (
      <TouchableOpacity style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginLeft: 10,
      }} onPress={() => navigation.navigate('ClassTableScreen')} >
        <Ionicons name="ios-chevron-back" size={24} color={NYUSTTheme.colors.primary} />
        <Text style={{
          fontSize: 18,
          color: NYUSTTheme.colors.primary,
        }}>回{selectedYear && selectedYear.replace('"', '').replace('"', '')}課表</Text>
      </TouchableOpacity>
    ),
  } : {};

  return (
    <>
      {/* {
      semesterList === null && account &&
      Student(account.username, account.password, (data) => {
        if (data) {
          setSemesterList(data);
          setSelectedYear(data[0]);
        }
      }).getSemeseterList()
    } */}
      <Stack.Navigator>
        <Stack.Screen
          name='ClassTableScreen'
          children={() => <ScreenWrapper semester={selectedYear} />}
          initialParams={{ selectedYear }}
          options={{

            headerTransparent: true,
            headerShadowVisible: true,
            headerTitle: `${!selectedYear ? '正在讀取學期列表...' : Math.trunc((parseInt(selectedYear.replace('"', '').replace('"', '')) / 10)) + "年 第" + parseInt(selectedYear.replace('"', '').replace('"', '')) % 10 + "學期 課表"}`,
            headerBackground: () => (
              <BlurView
                tint="dark"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
            ),
            // headerBlurEffect: "dark",
            headerRight: () => (
              Platform.OS === 'ios' ? (
                <Button
                  onPress={() => {
                    setSelectionDialogVisible(!selectionDialogVisible);
                  }}
                  color={NYUSTTheme.colors.primary}
                  title="切換學期"
                  style={{
                    // backgroundColor: NYUSTTheme.colors.card,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: NYUSTTheme.colors.primary,
                    borderRadius: 30,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                </Button>
              ) :
                (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectionDialogVisible(!selectionDialogVisible);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 30,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Text style={{
                      color: NYUSTTheme.colors.primary,
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}>切換學期</Text>
                  </TouchableOpacity>
                )
            )
          }}

        />
        <Stack.Screen
          name="CoursesDetials"
          component={CoursesDetials}
          options={{
            ...headerOptions,
            title: "課程資料",
            gestureEnabled: true,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
            backgroundColor: 'transparent',
            headerTransparent: true,
            headerShadowVisible: true,
            headerBlurEffect: "regular",
            // headerLargeTitleShadowVisible: true,
            // headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="CoursesStudentList"
          component={CoursesStudentList}
          options={{
            ...headerOptions,
            title: "學生名單",
            gestureEnabled: true,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
            backgroundColor: 'transparent',
            headerTransparent: true,
            headerShadowVisible: true,
            headerBlurEffect: "regular",
            // headerLargeTitleShadowVisible: true,
            // headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="CoursesTextBooks"
          component={CoueseTextBooks}
          options={{
            ...headerOptions,
            title: "參考教科書",
            gestureEnabled: true,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
            backgroundColor: 'transparent',
            headerTransparent: true,
            headerShadowVisible: true,
            headerBlurEffect: "regular",
            // headerLargeTitleShadowVisible: true,
            // headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="CoueseSchedule"
          component={CoueseSchedule}
          options={{
            ...headerOptions,
            title: "教學計畫及進度",
            gestureEnabled: true,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
            backgroundColor: 'transparent',
            headerTransparent: true,
            headerShadowVisible: true,
            headerBlurEffect: "regular",
            // headerLargeTitleShadowVisible: true,
            // headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="coueseCoreCompetencies"
          component={coueseCoreCompetencies}
          options={{
            ...headerOptions,
            title: "核心能力關聯",
            gestureEnabled: true,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
            backgroundColor: 'transparent',
            headerTransparent: true,
            headerShadowVisible: true,
            headerBlurEffect: "regular",
            // headerLargeTitleShadowVisible: true,
            // headerLargeTitle: true,
          }}
        />
      </Stack.Navigator>

      {
        selectionDialogVisible &&
        <YearSelectDialog
          semesterList={semesterList}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          setSelectionDialogVisible={setSelectionDialogVisible}
        />
      }
    </>
  )
}

export default ClassTableScreen