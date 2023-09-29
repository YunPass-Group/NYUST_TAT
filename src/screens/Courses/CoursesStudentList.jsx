import { View, Text } from 'react-native'
import React from 'react'
import { NYUSTTheme } from '../../constants'

const CoursesStudentList = () => {
  return (
    <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: NYUSTTheme.colors.background,
    }}>
      <Text>CoursesStudentList</Text>
    </View>
  )
}

export default CoursesStudentList