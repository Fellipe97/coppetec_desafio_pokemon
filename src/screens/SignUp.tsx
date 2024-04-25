import React, { useRef } from 'react';
import { TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Image, KeyboardAvoidingView, Text, VStack, ScrollView, useToast } from "native-base";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/auth";

import { StackAppNavigationProp } from '../routes/stackApp.routes'
import { useNavigation } from '@react-navigation/native'
import { Header } from "../components/Header";

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import Input from "../components/Input";

import TreinadoresCasal from '../assets/treinadoresCasal.png'

type FormDataPropsSignUp = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const signUpSchema = yup.object({
    name: yup
        .string()
        .required('Informe o seu nome.'),
    email: yup
        .string()
        .required('Informe o e-mail.')
        .email('E-mail inválido.'),
    password: yup
        .string()
        .required('Informe a senha.')
        .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
    confirmPassword: yup
        .string()
        .required('Confirme a senha nova.')
        .min(6, 'A senha deve ter pelo menos 6 dígitos.')
        .test('passwords-match', 'As senhas não coincidem.', function (value) {
            return value === this.resolve(yup.ref('confirmPassword'));
        })
});

export function SignUp() {
    const toast = useToast();
    const { registerUser, isLoadingRegisterUser } = useAuth()
    const navigation = useNavigation<StackAppNavigationProp>();
    const passwordRef = useRef<TextInput>(null)
    const emailRef = useRef<TextInput>(null)
    const confirmPasswordRef = useRef<TextInput>(null)

    const {
        control: signUpControl,
        handleSubmit: handleSignUpSubmit,
        formState: { errors: signUpErrors }
    } = useForm<FormDataPropsSignUp>({
        resolver: yupResolver(signUpSchema)
    });

    function handleSignUp({ name, email, password, confirmPassword }: FormDataPropsSignUp) {
        toast.closeAll();
        registerUser(name, email, password)
            .then((json) => {
                if (json.error) {
                    // Faça algo se houver um erro
                    toast.show({
                        title: 'Cadastrar usuário',
                        description: json.error,
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                } else {
                    // Faça algo se for um sucesso
                    toast.show({
                        title: 'Cadastrar usuário',
                        description: 'Usuário cadastrado com sucesso.',
                        placement: 'top',
                        bgColor: 'emerald.500'
                    })
                }
            })
            .catch((error) => {
                // Faça algo se houver um erro na chamada de registerUser
            });
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <VStack mt={1} flex={1}>
                    <Header title="Cadastrar" />
                    <ScrollView flex={1} keyboardShouldPersistTaps="handled">
                        <VStack justifyContent={'center'} px={12} flex={1} w={'100%'}>
                            <VStack alignItems={'center'} mb={4}>
                                <Image source={TreinadoresCasal} alt="Pokeapi Image" />
                                <Text
                                    fontFamily={'body'}
                                    textAlign={'center'}
                                    fontSize={18}
                                >Vamos nos aventurar e{'\n'} ser o mais novo treinador!</Text>
                            </VStack>
                            <Controller
                                control={signUpControl}
                                name='name'
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        placeholder='Digite o seu nome'
                                        autoCapitalize='none'
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={signUpErrors.name?.message}
                                        returnKeyType='next'
                                        onSubmitEditing={() => emailRef.current?.focus()}
                                    />
                                )}
                            />
                            <Controller
                                control={signUpControl}
                                name='email'
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        ref={emailRef}
                                        placeholder='Digite o seu e-mail'
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={signUpErrors.email?.message}
                                        returnKeyType='next'
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                    />
                                )}
                            />
                            <Controller
                                control={signUpControl}
                                name='password'
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        ref={passwordRef}
                                        placeholder='Digite a sua senha'
                                        secureTextEntry
                                        autoCapitalize='none'
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={signUpErrors.password?.message}
                                        returnKeyType='next'
                                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                    />
                                )}
                            />
                            <Controller
                                control={signUpControl}
                                name='confirmPassword'
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        ref={confirmPasswordRef}
                                        placeholder='Repita a sua senha'
                                        secureTextEntry
                                        autoCapitalize='none'
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={signUpErrors.confirmPassword?.message}
                                        returnKeyType='send'
                                    />
                                )}
                            />
                        </VStack>
                        <VStack px={12} mb={7}>
                            <Button
                                mt={4}
                                title="Cadastrar"
                                onPress={handleSignUpSubmit(handleSignUp)}
                                isLoading={isLoadingRegisterUser}
                            />
                        </VStack>
                    </ScrollView>
                </VStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}
