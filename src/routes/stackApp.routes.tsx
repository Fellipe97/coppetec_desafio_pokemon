import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import {Home}  from "../screens/Home";

type StackAppRoutes = {
    home: undefined;
}

export type StackAuthNavigatorRoutesProps = NativeStackNavigationProp<StackAppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<StackAppRoutes>();

export function StackAppRoutes() {
    return (
        <Navigator screenOptions={{ 
            headerShown: false, 
            animationTypeForReplace: "pop",
            animation: 'fade'
        }}>
            <Screen
                name="home"
                component={Home}
            />
        </Navigator>
    )
}