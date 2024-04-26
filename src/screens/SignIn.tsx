import React, { useEffect } from 'react';
import { useRef } from 'react';
import { TextInput, Platform, TouchableWithoutFeedback, Keyboard, Alert, } from 'react-native';

import { VStack, HStack, Text, Center, Actionsheet, useDisclose, KeyboardAvoidingView, useToast, Image } from 'native-base'

import Pokeapi from '../assets/pokeapi.png'
import Input from '../components/Input';
import { ButtonGhost } from '../components/ButtonGhost';
import { Button } from '../components/Button';

import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '../routes/auth.routes';



type FormDataPropsSignIn = {
    email: string;
    password: string;
}
type FormDataPropsForgetPassword = {
    email: string;
}

const signInSchema = yup.object({
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
});
const forgetPasswordSchema = yup.object({
    email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
});


export function SignIn() {
    const { signIn, isLoadingSigIn, isLoadingRedefinePassword, redefinePassword } = useAuth()
    const passwordRef = useRef<TextInput>(null)
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclose();
    const navigation = useNavigation<AuthNavigatorRoutesProps>();



    const {
        control: signInControl,
        handleSubmit: handleSignInSubmit,
        formState: { errors: signInErrors }
    } = useForm<FormDataPropsSignIn>({
        resolver: yupResolver(signInSchema)
    });

    function handleSignIn({ email, password }: FormDataPropsSignIn) {
        toast.closeAll();
        console.log('Verificando...')
        signIn(email, password)
    }


    const {
        control: forgetPasswordControl,
        handleSubmit: handleForgetPasswordSubmit,
        formState: { errors: forgetPasswordErrors }
    } = useForm<FormDataPropsForgetPassword>({
        resolver: yupResolver(forgetPasswordSchema)
    });
    function handleForgotPassword({ email }: FormDataPropsForgetPassword) {
        toast.closeAll();
        redefinePassword(email)
        onClose()
    }
    

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <VStack mt={10} flex={1} px={12} pb={16} alignItems='center' justifyContent='center'>
                    <Image source={Pokeapi} alt="Pokeapi Image"  /* mt={8} */ />


                    <VStack w={'100%'} mt={12}>
                        <Center>

                            <Controller
                                control={signInControl}
                                name='email'
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        placeholder='Digite seu email'
                                        keyboardType='email-address'
                                        value={value}
                                        onChangeText={onChange}
                                        errorMessage={signInErrors.email?.message}
                                        returnKeyType='next'
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                    />
                                )}
                            />


                            <Controller
                                control={signInControl}
                                name='password'
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        ref={passwordRef}
                                        placeholder='Senha'
                                        secureTextEntry
                                        autoCapitalize='none'
                                        value={value}
                                        onChangeText={onChange}
                                        errorMessage={signInErrors.password?.message}
                                        returnKeyType='send'
                                        onSubmitEditing={handleSignInSubmit(handleSignIn)}
                                    />)}
                            />



                            <ButtonGhost
                                title='Esqueceu a senha?'
                                onPress={onOpen}
                            />

                            <Button
                                title='Entrar'
                                mt={10}
                                onPress={handleSignInSubmit(handleSignIn)}
                                    isLoading={isLoadingSigIn}
                            />

                            <ButtonGhost
                                title='Não possui conta? clique aqui'
                                mt={4}
                                onPress={() => navigation.navigate('signUp')}
                            />

                        </Center>
                    </VStack>



                    {/* Pop up esqueci minha senha */}
                    <Actionsheet isOpen={isOpen} onClose={onClose}>
                        <KeyboardAvoidingView
                            behavior="padding"
                            w={'100%'}
                        >
                            <Actionsheet.Content>
                                <VStack px={9} mt={5} mb={5} w={'100%'} alignItems='center'>
                                    <Text color='blue.600' fontFamily='heading' fontSize='xl'>
                                        Recuperar Senha
                                    </Text>
                                    <Controller
                                        control={forgetPasswordControl}
                                        name='email'
                                        render={({ field: { onChange, value } }) => (
                                            <Input
                                                mt={3}
                                                placeholder='E-mail'
                                                keyboardType='email-address'
                                                autoCapitalize='none'
                                                onChangeText={onChange}
                                                value={value}
                                                errorMessage={forgetPasswordErrors.email?.message}
                                                returnKeyType='send'
                                                onSubmitEditing={handleForgetPasswordSubmit(handleForgotPassword)}
                                            />
                                        )}
                                    />
                                    <Button
                                        title='Enviar'
                                        mt={3}
                                        mb={5}
                                        onPress={handleForgetPasswordSubmit(handleForgotPassword)}
                                        isLoading={isLoadingRedefinePassword}
                                    />
                                </VStack>
                            </Actionsheet.Content>
                        </KeyboardAvoidingView>
                    </Actionsheet>
                </VStack>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}