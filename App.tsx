import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NativeBaseProvider, StatusBar } from 'native-base';

import { THEME } from './src/theme';

import { Routes } from './src/routes';
import { LoadingPage } from './src/components/LoadingPage';
import { AuthProvider } from './src/hooks/auth';



export default function App() {
    const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

    const config = {
        dependencies: {
          "linear-gradient": require("expo-linear-gradient").LinearGradient,
        },
      };

    return (
        <NativeBaseProvider theme={THEME} config={config}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <AuthProvider>
                {fontsLoaded ? <Routes /> : <LoadingPage/>}
            </AuthProvider>
        </NativeBaseProvider>
    );
}