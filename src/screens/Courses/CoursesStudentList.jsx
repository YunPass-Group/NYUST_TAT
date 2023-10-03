import { View, Text, ScrollView, Linking, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { Foundation, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react'
import { NYUSTTheme } from '../../constants'
import storage from '../../utils/storage'
import Student from '../../utils/Student'

const CoursesStudentList = ({ route }) => {

  const [data, setData] = React.useState(null)
  const [account, setAccount] = React.useState(null)
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setCourses(null);
    // setRefreshing(false);
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      data && setRefreshing(false);
    }, 1000);
  }, [data])

  React.useEffect(() => {

    console.log(route.params.stdurl);

    storage.load({
      key: 'account',
      id: 'account'
    }).then((data) => {
      setAccount(data)
    }).catch((err) => {
      // NOT LOGIN
    })

    storage.load({
      key: "courseStudentList",
      id: route.params.stdurl,
    }).then((data) => {
      setData(data)
      console.log(data);
    }).catch((err) => {
      // console.log(err);
    })

  }, [])

  const DataBox = ({ title, value, dark, }) => {

    return <View style={{
      paddingHorizontal: 30,
      paddingVertical: 15,
      height: 75,
      width: "100%",
      flex: 1,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between',
      alignContent: 'center', backgroundColor: dark ? NYUSTTheme.colors.background : '#1C333D',
    }}>
      <Text
        style={{ width: "25%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center", justifyContent: "center" }}>
        {value.studentClass}
      </Text>
      {/* <Text
        style={{ width: "10%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
        {value.studentEnglishName}
      </Text> */}
      <Text
        style={{ width: "25%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
        {value.studentNumber}
      </Text>
      
      <Text
        style={{ width: "25%", fontWeight: 'normal', fontSize: 15, color: NYUSTTheme.colors.text, alignSelf: "center" }}>
        {value.studentName}
      </Text>
      <TouchableOpacity 
      style={{ width: "10%", alignSelf: "center" }}
      onPress={() => {
        Linking.openURL(`mailto:${value.studentEmail}`)
      }}>
        <Ionicons style={{alignSelf: "center" }} name="ios-mail" size={24} color={NYUSTTheme.colors.text} />
      </TouchableOpacity>
    </View>
  }


  return (
    <>
      <View style={{ height: 0, position: "absolute" }}>
        {(data === null || refreshing) && account && Student(account.username, account.password, (data) => setData(data)).getCourseStudentList(route.params.stdurl)}
      </View>
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
            title={refreshing ? '正在和學校網頁溝通' : '下拉重新向學校網頁抓取學生列表'}
            tintColor='lightgray'
            progressViewOffset={60}
            refreshing={refreshing}
            onRefresh={onRefresh} />
        }
        style={{
          flex: 1,
          flexDirection: 'column',
          paddingTop: 60,
          backgroundColor: NYUSTTheme.colors.background,
        }}>
        {
          data && data.map((item, index) => {
            return <DataBox key={index} value={item} dark={index % 2 === 0} />
            {/* return <Text key={index}>{item}</Text> */ }
          })
        }
        <View style={{
          height: 60,
        }}>

        </View>
      </ScrollView>
      {(!refreshing && data === null) && <ActivityIndicator style={{ height: "100%", width: "100%", alignSelf: "center", backgroundColor: NYUSTTheme.colors.background, paddingBottom: 130 }} size="large" />}
    </>
  )
}

export default CoursesStudentList