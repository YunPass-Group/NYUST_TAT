import { View, Text, StyleSheet, Platform, Pressable, Touchable, ActivityIndicator } from 'react-native'
import { BlurView } from "expo-blur";
import { NYUSTTheme } from '../../constants';
import React from 'react'

const YearSelectDialog = ({
  semesterList,
  selectedYear,
  setSelectedYear,
  setSelectionDialogVisible
}) => {

  const [isSpinnerVisible, setIsSpinnerVisible] = React.useState(false);

  const handleSemesterSelection = async (semester) => {


    if (semester !== selectedYear) {
      // Perform any async operations here before updating the state
      await setSelectedYear(semester);

      // setSelectedYear(semester);

      // If you need to perform async operations after updating the state,
      // you can do so using the useEffect hook in the parent component
      // or wherever the selectedYear state is being used.
    }
    setIsSpinnerVisible(false);
    setSelectionDialogVisible(false);
  };
  const [isPressing, setIsPressing] = React.useState(-1)
  return (
    <>
      {isSpinnerVisible && <ActivityIndicator style={{ height: "100%", width: "100%", alignSelf: "center" }} size="large" />}
      {!isSpinnerVisible && <View style={{
        height: Platform.OS === 'ios' ? "80%" : "100%",
        width: "100%",
        position: "absolute",
        top: Platform.OS === 'ios' ? 103 : 0,
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
            return <Pressable
              key={index}
              onPressIn={
                () => setIsPressing(index)
              }
              onPress={() => {
                setIsSpinnerVisible(true)
                handleSemesterSelection(semester);
                }
              }
              onPressOut={() => {
                // setIsSpinnerVisible(true);
                // setSelectionDialogVisible(false);
                // if (semester !== selectedYear){
                //   setSelectedYear(semester);
                // }
                setIsSpinnerVisible(true);
                setIsSpinnerVisible(false)
                setSelectionDialogVisible(false)
              }}
              style={{
                height: 50,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: (semester === selectedYear) ? NYUSTTheme.colors.card : isPressing === index? NYUSTTheme.colors.secondary : NYUSTTheme.colors.background,
                borderRadius: 30,
              }}>
              <Text style={{
                color: isPressing === index && semester !== selectedYear ? NYUSTTheme.colors.secondary : NYUSTTheme.colors.primary,
                fontSize: 15,
                fontWeight: "bold",
              }}>
                {isPressing !== index || semester === selectedYear ? Math.trunc((parseInt(semester.replace('"', '').replace('"', '')) / 10)) + "年 第" + parseInt(semester.replace('"', '').replace('"', '')) % 10 + "學期" : '載入中'}
              </Text>
            </Pressable>
          })}
        </Pressable>
      </View>}
    </>
  )
}

export default YearSelectDialog