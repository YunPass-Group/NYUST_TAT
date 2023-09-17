import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Student from "./src/utils/Student";

export default function App() {

  const [htmlContent, setHtmlContent] = useState("");

  return (
    <View
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      {Student(process.env.USERNAME,process.env.PASSWORD, (data) => {
        console.log(data);
        setHtmlContent(data);
      }).getCourseList()}
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
    // top: -1000,
    // left: -1000,
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 50,
  },
});
