import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NYUSTTheme } from '../../constants/';
import Student from "../../utils/Student";
import { BlurView } from "expo-blur";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
function Home() {

  const [account, setAccount] = useState({
    username: "",
    password: "",
  });

  const [htmlContent, setHtmlContent] = useState("");
  const [semesterList, setSemesterList] = useState(null); // ["1121", "1112", "1111", "1102", "1101"

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >

      {Student(account.username, account.password, (data) => {
        // data is a array of objects({Course Serial No, Curriculum No, Class Name, Department, Class Type, Credit, Time/Location, Instructor, Students Joined, Student Limit, Teaching Materials Website})
        data = JSON.stringify(data);
        {/* console.log(data); */}
        setHtmlContent(data);
        data = data.replace("]", "").replace("[", "").split(",");
        setSemesterList(data); //["1121","1112","1111","1102","1101"]
      }).getSemeseterList()}
      {
        semesterList && semesterList.map((semester, index) => {
          //this semester is corect like 1111
          if (semester !== undefined) 
            return Student(account.username, account.password, (data) => {
              {/* console.log(JSON.stringify(data)); */}
            }).getCreditFromSemesterYear(semester, index)
        })
      }
      {
        Student(account.username, account.password, (data) => {
          console.log(JSON.stringify(data));
        }).getCourseSyllabusAndTeachingPlan("https://webapp.yuntech.edu.tw/WebNewCAS/Course/Plan/Query.aspx?&112&1&8653")
      }

      <View style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: NYUSTTheme.colors.background,
      }}>
        
      </View>
    </View>
  );
}

export default HomeScreen = () => {
  return (
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
    marginTop: StatusBar.currentHeight || 50,
  },
});
