import { TouchableOpacity, Text, View } from 'react-native'
import React from 'react'
import { NYUSTTheme } from '../../constants'

const Cell = ({
  text = null,
  isHeader = false,
  isTime = false,
  data = null,
  onPress = null,
}) => {

  
  return (
    <TouchableOpacity
      onPress={() => {
        // navigation to the details screen
        onPress && data &&  onPress(
          data["course"]['Details Website'],
          data["course"]['Class Name'],
          data["course"]["Student List URL"],
        );
      }}
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 3,
        backgroundColor: data ? data.color : 'transparent',
        width: "12.5%",
        height: 90,
        margin: 1,
        borderRadius: 10,
      }}>
      <Text style={{
        flex: 1,
        color: isHeader || isTime ? 'white' : 'black',
        fontWeight: isHeader ? 'bold' : 'normal',
        justifyContent: 'center',
        // alignSelf: 'center',
        width: 30,
        // backgroundColor: 'red',
        textAlign: 'center',
        fontSize: isTime ? 12 : 12,
      }}>{text ? text : (data && data["course"] ? data["course"]['Class Name'] : '')}</Text>
    </TouchableOpacity>
  )
}

export default Cell