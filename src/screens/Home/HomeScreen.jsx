import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NYUSTTheme } from '../../constants/';
import Student from "../../utils/Student";

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {

  const [account, setAccount] = useState({
    username: null,
    password: null,
  });

  const [htmlContent, setHtmlContent] = useState("");
  const [semesterList, setSemesterList] = useState(null); // ["1121", "1112", "1111", "1102", "1101"
  React.useEffect(() => {
    try {
      AsyncStorage.getItem('account').then((value) => {
        if (value !== null) {
          setAccount(JSON.parse(value));
        } else {
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
      console.error(e);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >

      {Student("", "", (data) => {
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
            return Student("", "", (data) => {
              console.log(JSON.stringify(data));
            }).getCreditFromSemesterYear(semester, index)
        })
      }

      {/* <View style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: NYUSTTheme.colors.background,
      }}>
        
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
