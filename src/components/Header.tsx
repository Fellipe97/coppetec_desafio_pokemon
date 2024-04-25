import { Center, HStack, Text, VStack, Button } from "native-base";

import { useNavigation } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons';


type Props = {
    title: string;
    buttonBack?: boolean;
}

export function Header({title, buttonBack=true}: Props) {
    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack();
    }


    return (
        <VStack
            w={'100%'}
            height={24}
            justifyContent={'flex-end'}
        >
            <HStack alignItems="center" >
                {buttonBack &&
                    <Button 
                        onPress={handleGoBack} 
                        bg="transparent" 
                        p={0} 
                        position="absolute"
                        left={8}
                        zIndex={2}
                        _pressed={{
                            bg:"transparent",
                            opacity: .3
                        }}
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color="#3761A8" />
                    </Button>
                }

                <VStack flex={1} /* 
                 */>
                    <Center>
                        <Text
                            fontFamily={'heading'}
                            fontSize={24}
                            color={'blue.700'}
                        >{title}</Text>  
                    </Center>
                </VStack>

            </HStack>

        </VStack>
    );
}