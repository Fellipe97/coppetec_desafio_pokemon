import {  Box, Text, useTheme } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'


import { AuthRoutes } from './auth.routes';


export function Routes() {
    const user  = null;
    const { colors } = useTheme();
    const theme = DefaultTheme;
    theme.colors.background = colors.gray[100]



    return (
        <Box flex={1} bg={'gray.100'}>
            <NavigationContainer theme={theme}>
               { user ? <Text>Home</Text> : <AuthRoutes />}
            </NavigationContainer>
        </Box>
    );
}