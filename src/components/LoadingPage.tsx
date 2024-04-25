import {Spinner, Center, Image} from 'native-base'

import Pokeapi from '../assets/pokeapi.png'

export function LoadingPage(){
    return(
        <Center flex={1} bg={'gray.100'}>
            <Image source={Pokeapi} alt="Pokeapi Image"  mt={8} />
            <Spinner color="blue.029600" size='lg' mt={8}/>
        </Center>
    );
}