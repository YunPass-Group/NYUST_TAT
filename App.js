import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Student from "./src/utils/Student";

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [account, setAccount] = useState({
    username: null,
    password: null,
  });

  const [htmlContent, setHtmlContent] = useState("");
  React.useEffect(() => {
    try {
      AsyncStorage.getItem('account').then((value) => {
        if (value !== null) {
          setAccount(JSON.parse(value));
        }else{
          console.log("No account");
          setAccount({
            username: "",
            password: "",
          });
          AsyncStorage.setItem('account', JSON.stringify(account));
          console.log(account);
        }
      });
    }
    catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >

      {Student(account.username,account.password, (data) => {
        // data is a array of objects({Course Serial No, Curriculum No, Class Name, Department, Class Type, Credit, Time/Location, Instructor, Students Joined, Student Limit, Teaching Materials Website})
        data = JSON.stringify(data);
        console.log(data);
        setHtmlContent(data);
      }).getCourseSyllabusAndTeachingPlan('https://webapp.yuntech.edu.tw/WebNewCAS/Course/Plan/Query.aspx?&112&1&0105')}

      {/* <View style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
      }}>
        <Text>{htmlContent}</Text>
      </View> */}
    </View>
  );
}

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
