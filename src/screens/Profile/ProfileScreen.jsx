import { View, Text } from 'react-native'
import React from 'react'
import Student from '../../utils/Student'

const ProfileScreen = () => {

    const [account, setAccount] = React.useState({
        username: "",
        password: '',
    });

  return (
    <View>
      {
        
        Student(account.username, account.password, (data) => {
          
        }).getStudentInfo()
      }
    </View>
  )
}

export default ProfileScreen