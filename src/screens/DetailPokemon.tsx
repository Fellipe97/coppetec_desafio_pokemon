/* import { TextInput, Platform, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { Center, KeyboardAvoidingView, Text, VStack, View } from "native-base";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/auth";


import { StackAuthNavigatorRoutesProps } from '../routes/stackApp.routes'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from "react";
import { HeaderHome } from '../components/HeaderHome';
import { ButtonCardMenu } from '../components/ButtonCardMenu';
//() => navigation.navigate('frequency')

export function DetailPokemon() {
    const { signOut, user } = useAuth()
    const navigation = useNavigation<StackAuthNavigatorRoutesProps>();



    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>


            <VStack  px={12} flex={1} py={18} alignItems={'center'}>
                
                  <Text>DetailPokemon.tsx</Text>
            </VStack>
        </KeyboardAvoidingView>
    )
} */


import React from "react";
import { RouteProp } from "@react-navigation/native";
import { Text, View } from "react-native";
import { StackAppNavigationProp, StackAppRoutes } from '../routes/stackApp.routes'


type DetailPokemonRouteProp = RouteProp<StackAppRoutes, 'detailPokemon'>;

interface DetailPokemonProps {
    route: DetailPokemonRouteProp;
}

export function DetailPokemon({ route }: DetailPokemonProps) {
    const { id } = route.params; // Acessando o ID passado como parâmetro

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Detail Pokemon Screen</Text>
            <Text>ID: {id}</Text>
        </View>
    );
}
