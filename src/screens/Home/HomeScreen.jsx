import { StatusBar } from "expo-status-bar";
import { Image, TouchableOpacity, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { NYUSTTheme } from '../../constants/';
import Student from "../../utils/Student";
import { BlurView } from "expo-blur";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//components
import { PadBtn } from "../../components/Buttons";
import storage from "../../utils/storage";



const Stack = createNativeStackNavigator();
function Home() {


  const [student, setStudent] = useState(null);

  const [htmlContent, setHtmlContent] = useState("");
  const [semesterList, setSemesterList] = useState(null); // ["1121", "1112", "1111", "1102", "1101"

  const [account, setAccount] = useState({
    username: null,
    password: null,
  });

  React.useEffect(() => {
    setAccount({
      username: "",
      password: "",
    })
  }, []);

  React.useEffect(() => {
    console.log(student);
    console.log(account);
  }, [student])

  // Save the semester data
  React.useEffect(() => {
    if (semesterList && semesterList.length > 0) {
      storage.save({
        key: "semesterList",
        id: "semesterList",
        data: semesterList,
      })
    }
  }, [semesterList])

  // test
  React.useEffect(() => {
    if (account != null) {
      storage.save({
        key: "account",
        id: "account",
        data: account,
      })
    }
  }, [account])



  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      
      {semesterList === null && Student(account.username, account.password, (data) => {
        // data is a array of objects({Course Serial No, Curriculum No, Class Name, Department, Class Type, Credit, Time/Location, Instructor, Students Joined, Student Limit, Teaching Materials Website})
        data = JSON.stringify(data);
        {/* console.log(data); */ }
        setHtmlContent(data);
        data = data.replace("]", "").replace("[", "").split(",");
        setSemesterList(data); //["1121","1112","1111","1102","1101"]

      }).getSemeseterList()}
      {
        semesterList && semesterList.map((semester, index) => {
          //this semester is corect like 1111
          if (semester !== undefined)
            return Student(account.username, account.password, (data) => {
              {/* console.log(JSON.stringify(data)); */ }
            }).getCreditFromSemesterYear(semester, index)
        })
      }



      {/* student info */}
      {
        Student(account.username, account.password, (data) => {
          setStudent(data);
        }).getStudentInfo()
      }

      {student && <View style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: NYUSTTheme.colors.background,
        paddingTop: StatusBar.currentHeight || 30,
        // paddingHorizontal: 30,
        flex: 1,
      }}>
        {student &&
          <View>
            <View style={{
              position: "absolute",
              width: "100%",
              top: -30,
              left: 0,
              height: StatusBar.currentHeight || 135,
              background: () => {
                return <BlurView
                tint="light"
                intensity={100}
                style={StyleSheet.absoluteFill}
              />
              }
            }}>

            </View>
            <View style={styles.nameBar}>
              <Image src={"https://static.figma.com/app/icon/1/touch-180.png"} style={{ height: 60, width: 60, borderRadius: 50, }} />
              <Text style={styles.title}>Hi, {student.studNo} {student.studName}</Text>
            </View>

            <View>
              <TouchableOpacity style={styles.searchBar} onPress={() => {
                //TODO - search
              }}>
                <Text style={{ color: 'white' }}>搜尋...</Text>
                <Ionicons name="ios-search" size={15} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal={true}
              indicatorStyle="white"
              style={{
                marginBottom: 30,
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      //linear background
                      backgroundColor: `${NYUSTTheme.colors.card}`,
                      borderRadius: 30,
                      height: 120,
                      width: 330,
                      padding: 20,
                      marginEnd: 15,
                      marginStart: index === 0 ? 30 : 0,
                      shadowColor: NYUSTTheme.colors.card,
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowRadius: 30,
                    }}>
                    <Text style={{ color: 'white' }}>學生資料</Text>
                    <Ionicons name="ios-person" size={15} color="white" />
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            <Text style={{
              color: NYUSTTheme.colors.text,
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 30,
              marginLeft: 30,
            }}>常用功能</Text>


            {/* buttons grid */}
            <View style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignItems: "center",
              marginHorizontal: 30,
              gap: 30,
            }}>
              <PadBtn text="成績管理" icon='book-open' iconPack='SimpleLineIcons' />
              <PadBtn text="在學證明" icon='ios-school' iconPack='Ionicons' />
              <PadBtn text="出席查詢" icon='ios-people-sharp' iconPack='Ionicons' />
              <PadBtn text="SOS" icon='ios-help-buoy' iconPack='Ionicons' color={NYUSTTheme.colors.secondary} />
              <PadBtn text="QRcode" icon='qrcode-scan' iconPack='MaterialCommunityIcons' />
              <PadBtn text="請假系統" icon='toggle-switch-outline' iconPack='MaterialCommunityIcons' />
              <PadBtn text="我的工讀" icon='ios-briefcase' iconPack='Ionicons' />
              <PadBtn text="活動報名" icon='file-signature' iconPack='FontAwesome5' />
              <PadBtn text="分機查詢" icon='card-account-phone' iconPack='MaterialCommunityIcons' />
              <PadBtn text="校園地圖" icon='map' iconPack='Foundation' />
              <PadBtn text='館藏查詢' icon='swatchbook' iconPack='FontAwesome5' />
              <PadBtn text="交通時刻" icon='ios-train-outline' iconPack='Ionicons' />
              {/* <PadBtn />
              <PadBtn />
              <PadBtn />
              <PadBtn /> */}
            </View>

          </View>
        }
      </View>}
    </View>
  );
}

export default HomeScreen = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
            // title: "歡迎",
            // headerLargeTitle: true,
            // headerLargeTitleShadowVisible: true,
            // headerBlurEffect: "prominent",
            // headerTransparent: true,
            // headerShadowVisible: true,
            // headerStyle: {
            //   backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(255, 255, 255, 255)', // semi-transparent white for Android
            // },
          }}
        />

      </Stack.Navigator>

    </>
  );
};


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 30,

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",

  },
  nameBar: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
    justifyContent: "flex-start",
    marginVertical: 30,
    marginHorizontal: 30,
  },
  searchBar: {
    shadowRadius: 30,
    shadowOpacity: 0.9,
    shadowOffset: 10,
    shadowColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 30,
    marginBottom: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    alignContent: "center",
    marginHorizontal: 30,
  }
});
