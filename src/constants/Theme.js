import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';

const NYUSTTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#2A9D8F',
        secondary: '#E76F51',
        tertiary: '#A1C181',
        background: '#264653',
        card: '#2A9D8F',
        text: '#F0F0F0',
    },
};

export default NYUSTTheme;