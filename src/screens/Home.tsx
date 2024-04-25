import { TextInput, Platform, TouchableWithoutFeedback, Keyboard, } from 'react-native';
import { Center, KeyboardAvoidingView, Text, VStack, View } from "native-base";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/auth";


import { StackAuthNavigatorRoutesProps } from '../routes/stackApp.routes'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from "react";
import { HeaderHome } from '../components/HeaderHome';
//() => navigation.navigate('frequency')

export function Home() {
    const { signOut, user } = useAuth()
    const navigation = useNavigation<StackAuthNavigatorRoutesProps>();


    useEffect(() => {
        console.log('USER: ', user)
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <HeaderHome
                nameUser={user!.name.split(" ")[0]}
            />

            <VStack flex={1}>
                <Center>
                    <Text>HOME</Text>
                    <Button
                        title="Sair"
                        onPress={() => signOut()}
                    />
                </Center>
            </VStack>
        </KeyboardAvoidingView>
    )
}