import {Spinner, Center, Image} from 'native-base'

/* import LogoSvg from '@assets/logo.svg'
 */

export function LoadingPage(){
    return(
        <Center flex={1} bg={'blue.300'}>
            {/* <LogoSvg /> */}
            <Spinner color="purple.600" size='lg' mt={8}/>
        </Center>
    );
}