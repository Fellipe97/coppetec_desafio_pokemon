import { forwardRef, ForwardRefRenderFunction, ForwardedRef } from 'react';
import { TextInput } from 'react-native';
import { Input as NativeBaseInput, IInputProps, FormControl } from "native-base";



type Props = IInputProps & {
    errorMessage?: string | null;
}

//export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
const Input: ForwardRefRenderFunction<TextInput, Props> = ({ errorMessage = null, isInvalid, ...rest }, ref: ForwardedRef<TextInput>) => {

    const invalid = !!errorMessage || isInvalid;

    return (
        <FormControl isInvalid={invalid} mb={4}>
            <NativeBaseInput
                ref={ref as any} // Converter explicitamente para any para evitar erro de tipo
                bg="gray.100"
                h={14}
                px={4}
                borderWidth={2}
                fontSize="md"
                color="black"
                fontFamily="body"
                placeholderTextColor="gray.500"
                isInvalid={invalid}
                _invalid={{
                    borderColor: 'red.500'
                }}
                _focus={{
                    bg: "gray.100",
                    borderColor: "blue.700"
                }}
                {...rest}
            />

            <FormControl.ErrorMessage _text={{color:'red.500'}}>
                {errorMessage}
            </FormControl.ErrorMessage>
        </FormControl>
    );
}

export default forwardRef(Input);
