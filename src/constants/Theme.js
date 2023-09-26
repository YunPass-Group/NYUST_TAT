import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from '@react-navigation/native';

const NYUSTTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#FCCA46',
        secondary: '#FE7F2D',
        tertiary: '#A1C181',
        background: '#264653',
        card: '#619B8A',
        text: '#F0F0F0',
    },
};

export default NYUSTTheme;