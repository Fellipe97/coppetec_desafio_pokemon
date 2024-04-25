import { Button as ButtonNativeBase, IButtonProps, Text, Icon, Center, VStack, HStack, Image } from "native-base";
import { AntDesign } from '@expo/vector-icons'

type Props = IButtonProps & {
    title: string,
    color: "blueButton" | "redButton" | "orangeButton" | "greenButton"
}

import PokeballBackground from '../assets/pokeballBackground.png'


export function ButtonCardMenu({ title, color, ...rest }: Props) {
    let buttonColor = "blue.600";
    let buttonColorHover = "blue.500";


    if (color === "redButton") {
        buttonColor = "red.600";
        buttonColorHover = "red.500";
    }
    if (color === "orangeButton") {
        buttonColor = "orange.600";
        buttonColorHover = "orange.500";
    }
    if (color === "greenButton") {
        buttonColor = "green.600";
        buttonColorHover = "green.500";
    }


    return (
        <ButtonNativeBase
            h={100}
            w={220}
            rounded='lg'
            bg={buttonColor}
            _pressed={{
                bg:buttonColorHover
            }}

            {...rest}
        >
                <HStack alignItems={'center'} justifyContent={'space-between'} width={'100%'}>    
                    <Text
                        fontFamily={'heading'}
                        fontSize={18}
                        color={'gray.100'}
                    >{title}</Text>
                    <Image source={PokeballBackground} alt="Pokeapi Image" style={{ width: 100, height: 100 }} />
                </HStack>
        </ButtonNativeBase >
    );
}