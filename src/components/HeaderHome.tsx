import { useState, useEffect } from 'react'
import { Button, HStack, Image, Text, VStack } from "native-base";

import { useIsFocused } from '@react-navigation/native';

import Perfil from '../assets/perfil.png'
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../hooks/auth';

type Props = {
    nameUser: string;
}

export function HeaderHome({ nameUser }: Props) {
    const { signOut } = useAuth()

    const isFocused = useIsFocused();
    /* const [dayPeriod, setDayPeriod] = useState('Olá');

    useEffect(() => {
        var dataInicio = new Date();
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'America/Sao_Paulo',
            hour: 'numeric',
        };
        const horaBrasil = new Intl.DateTimeFormat('pt-BR', options).format(dataInicio);

        console.log(horaBrasil)
        if (parseInt(horaBrasil) > -1 && parseInt(horaBrasil) < 12) {
            setDayPeriod('Bom dia')
        }
        if (parseInt(horaBrasil) > 11 && parseInt(horaBrasil) < 18) {
            setDayPeriod('Boa tarde')
        }
        if (parseInt(horaBrasil) > 17 && parseInt(horaBrasil) < 24) {
            setDayPeriod('Boa noite')
        }
        console.log('atualizou')
        //ele atualiza quando sai o focu tb, poderia evitado, como? n sei
    }, [isFocused]) */

    return (
        <VStack
            //w={'100%'}
            height={40}
            px={10}
            justifyContent={'flex-end'}
            alignItems={'flex-start'}

        /* bg={{
            linearGradient: {
                colors: ['purple.600', 'purple.700'],
                start: [0, 0],
                end: [0, 1]
            }
        }} */
        >
            {/* <HeaderHomeSvg width={'100%'}> */}
            <HStack width={'100%'}>
                <HStack justifyContent={'center'} alignItems={'center'} >
                    <Image px={3} source={Perfil} alt="Pokeapi Image" style={{ width: 60, height: 60 }} />
                </HStack>
                <VStack ml={2} flex={1} >
                    <Text mt={4} fontSize={'2xl'} bold color={'black'}>Olá, {nameUser}! 👋</Text>
                    <Text mb={4} fontSize={'sm'} bold color={'gray.500'}>Seja bem-vindo</Text>
                </VStack>
                <HStack justifyContent={'center'} alignItems={'center'} >
                    <Button
                        onPress={signOut} 
                        bg="transparent"
                        position="absolute"
                        _pressed={{
                            bg: "transparent",
                            opacity: .3
                        }}
                    >
                        <MaterialIcons name="exit-to-app" size={32} color='#EF5350' />
                    </Button>
                </HStack>
            </HStack>
        </VStack>
    )
}
