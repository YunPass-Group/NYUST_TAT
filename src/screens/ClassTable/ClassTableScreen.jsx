import { View, Text, Alert, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet, Platform, RefreshControl } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { NYUSTTheme } from '../../constants';
import Student from '../../utils/Student';
import storage from '../../utils/storage';
import { StatusBar } from 'expo-status-bar';
const Stack = createNativeStackNavigator();
import { Cell } from "../../components/Table"
import { YearSelectDialog } from '../../components/Dialog/';

const ClassTable = React.memo(({ semester }) => {

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

      // // console.log('Processing for Week:', week, 'Time:', time);

      // if (courses && courses.Courses) {
      //   // console.log('Courses Available:', courses.Courses);

      //   courses.Courses.forEach((course, index) => {
      //     const classTime = course.ClassTime;
      //     // console.log('Checking Course:', course['Class Name'], 'Week:', classTime.Week, 'Time:', classTime.Time);

      //     if (classTime.Week === week && classTime.Time.includes(time)) {
      //       result = {
      //         color: tableColor[index % tableColor.length],
      //         course: course,
      //         detailsWebsite: course['Details Website']
      //       };
      //       // console.log('Match Found:', result);
      //     }
      //   });
      // }
      // console.log(courses);
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
        (!refreshing && courses === null) &&
        <ActivityIndicator style={{ height: "100%", width: "100%", alignSelf: "center", backgroundColor: NYUSTTheme.colors.background }} size="large" />
      }{
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
      {/* <View style={{
        position: "absolute",
        top: 160,
        left: 0,
        zIndex: 100,
        width: "100%",
        height: 60,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={{
          color: NYUSTTheme.colors.primary,
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
        }}>下拉重新向學校網頁抓取課表</Text>
      </View> */}
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
            progressViewOffset={160}
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          backgroundColor: NYUSTTheme.colors.background,
          // position: "relative",
          height: "100%",
          // padding header bar,
          paddingTop: Platform.OS === 'ios' ? 100 + 60 : 100 + 60,
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
                <Cell data={TableClassProcesser(week = 1, time = _time)} />
                <Cell data={TableClassProcesser(week = 2, time = _time)} />
                <Cell data={TableClassProcesser(week = 3, time = _time)} />
                <Cell data={TableClassProcesser(week = 4, time = _time)} />
                <Cell data={TableClassProcesser(week = 5, time = _time)} />
                <Cell data={TableClassProcesser(week = 6, time = _time)} />
                <Cell finishLoaded={() => {
                  setIsLoaded(true)
                  setRefreshing(false);
                }} data={TableClassProcesser(week = 7, time = _time)} />
              </View>
            })
          }
          <View style={{
            height: Platform.OS === 'ios' ? 143 : 160,
          }}>

          </View>
        </View>
      </ScrollView>

    </>
  )
});

const ScreenWrapper = ({ semester }) => {
  if (!semester) return <ActivityIndicator size="large" />;
  return <ClassTable semester={semester}/>;
};


const ClassTableScreen = () => {
  const [account, setAccount] = React.useState(null);
  const [semesterList, setSemesterList] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState(null);
  const [selectionDialogVisible, setSelectionDialogVisible] = React.useState(false);

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
          //name={`${!selectedYear ? '正在讀取學期列表...' : Math.trunc((parseInt(selectedYear.replace('"', '').replace('"', '')) / 10)) + "年 第" + parseInt(selectedYear.replace('"', '').replace('"', '')) % 10 + "學期 課表"}`}
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
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  setSelectionDialogVisible(!selectionDialogVisible);
                }}
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