import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NativeBaseProvider, StatusBar } from 'native-base';

import { THEME } from './src/theme';

import { Routes } from './src/routes';
import { LoadingPage } from './src/components/LoadingPage';



export default function App() {
    const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })


    return (
        <NativeBaseProvider theme={THEME}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
             {fontsLoaded ? <Routes /> : <LoadingPage/>}
        </NativeBaseProvider>
    );
}