import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
    title: string;
    isLoading?: boolean;
}


export function Button({ title, isLoading = false, ...rest }: Props) {
    return (
        <ButtonNativeBase
            w="full"
            h={14}
            bg="blue.700"
            borderWidth={0}
            rounded='md'
            _pressed={{
                bg: "blue.600"
            }}
            shadow={7}
            isLoading={isLoading}

            {...rest}
        >
            <Text
                color="white"
                fontFamily="heading"
                fontSize="lg"
            >
                {title}
            </Text>
        </ButtonNativeBase>
    )
}