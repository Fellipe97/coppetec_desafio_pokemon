import { Pressable, IButtonProps, Text } from "native-base";

type Props = IButtonProps & {
    title: string;
    colorButton?: 'sucess' | 'cancel';
}

export function ButtonGhost({ title, colorButton = 'sucess', ...rest }: Props) {
    return (
        <Pressable
            variant="ghost"
            {...rest }
        >
            <Text
                color={colorButton == 'sucess' ? 'blue.700' : 'red.500'}
                fontSize="md"
                fontFamily='heading'
            >
                {title}
            </Text>
        </Pressable>
    );
}