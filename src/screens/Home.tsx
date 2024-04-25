import { TextInput, Platform, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { Center, KeyboardAvoidingView, Text, VStack, View } from "native-base";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/auth";


import { StackAppNavigationProp } from '../routes/stackApp.routes'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from "react";
import { HeaderHome } from '../components/HeaderHome';
import { ButtonCardMenu } from '../components/ButtonCardMenu';
//() => navigation.navigate('frequency')

export function Home() {
    const { signOut, user } = useAuth()
    const navigation = useNavigation<StackAppNavigationProp>();


    useEffect(() => {
        console.log('USER: ', user)
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <HeaderHome
                nameUser={user!.name.split(" ")[0]}
            />

            <VStack  px={12} flex={1} py={18} alignItems={'center'}>
                
                  <ButtonCardMenu 
                    title='Favoritos'
                    color={'blueButton'}
                    mb={4}
                  />
                  <ButtonCardMenu 
                    title='Pokedex'
                    color={'redButton'}
                    onPress={() => navigation.navigate('pokedex')}
                  />
            </VStack>
        </KeyboardAvoidingView>
    )
}