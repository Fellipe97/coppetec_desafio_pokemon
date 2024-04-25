/* import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

import {Home}  from "../screens/Home";
import {Pokedex}  from "../screens/Pokedex";
import {DetailPokemon}  from "../screens/DetailPokemon";

type StackAppRoutes = {
    home: undefined;
    pokedex: undefined;
    detailPokemon: undefined;
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
            <Screen
                name="pokedex"
                component={Pokedex}
            />
            <Screen
                name="detailPokemon/:id"
                component={DetailPokemon}
            />
        </Navigator>
    )
} */
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { Pokedex } from "../screens/Pokedex";
import { DetailPokemon } from "../screens/DetailPokemon";

export type StackAppRoutes = {
    home: undefined;
    pokedex: undefined;
    detailPokemon: { id: string | undefined };
}

export type StackAppNavigationProp = NativeStackNavigationProp<StackAppRoutes>;

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
            <Screen
                name="pokedex"
                component={Pokedex}
            />
            <Screen
                name="detailPokemon"
                component={DetailPokemon}
                initialParams={{ id: undefined }} // Valor inicial do parâmetro id
            />
        </Navigator>
    )
}
