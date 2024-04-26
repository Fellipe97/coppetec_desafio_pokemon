import React, { useEffect, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackAppNavigationProp, StackAppRoutes } from '../routes/stackApp.routes'
import { Header } from "../components/Header";
import { Image, VStack, Text, View, HStack, Center, Spinner, Icon, IconButton, Toast, useToast } from "native-base";
import Api from "../helpers/Api";
import { Progress } from 'native-base';
import { Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { User, useAuth } from "../hooks/auth";



type DetailPokemonRouteProp = RouteProp<StackAppRoutes, 'detailPokemon'>;

interface DetailPokemonProps {
    route: DetailPokemonRouteProp;
}

interface PokemonInfo {
    name: string;
    url: string;
    types: string[];
    height: number;
    weight: number;
    stats: {
        atributo: string,
        valor: number
    }[]
}

const typesImages = {
    grass: require('../assets/grass.png'),
    poison: require('../assets/poison.png'),
    psychic: require('../assets/psychic.png'),
    bug: require('../assets/bug.png'),
    dark: require('../assets/dark.png'),
    dragon: require('../assets/dragon.png'),
    electric: require('../assets/electric.png'),
    fairy: require('../assets/fairy.png'),
    fighting: require('../assets/fighting.png'),
    fire: require('../assets/fire.png'),
    flying: require('../assets/flying.png'),
    ghost: require('../assets/ghost.png'),
    ground: require('../assets/ground.png'),
    normal: require('../assets/normal.png'),
    rock: require('../assets/rock.png'),
    steel: require('../assets/steel.png'),
    water: require('../assets/water.png'),
};

export function DetailPokemon({ route }: DetailPokemonProps) {
    const { user, userFavoritePokemon, userUnfavoritePokemon } = useAuth()
    const toast = useToast();

    const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
    const api = Api()
    const { id } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const [filled, setFilled] = useState(false);

    const toggleHeart = async () => {
        Toast.closeAll();

        if (filled) {
            //desfavoritar
            if (id) {
                const newFavorites = user?.favorites.filter((favId: number) => favId !== parseInt(id))
                console.log('newFavorites: ', newFavorites)
                if (newFavorites) {
                    const json = userUnfavoritePokemon(newFavorites)
                    if (!json) {
                        //error
                        toast.show({
                            title: 'Error',
                            description: 'Erro ao excluir o favorito.',
                            placement: 'top',
                            bgColor: 'red.500'
                        })
                        navigation.goBack()
                    } else {
                        toast.show({
                            title: 'Sucesso',
                            description: 'Sucesso ao excluir o favorito.',
                            placement: 'top',
                            bgColor: 'emerald.500'
                        })
                        setFilled(false);
                    }
                } else {
                    //error
                    toast.show({
                        title: 'Error',
                        description: 'Erro ao excluir o favorito.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                    navigation.goBack()
                }
            } else {
                toast.show({
                    title: 'Error',
                    description: 'Erro ao excluir o favorito.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
                navigation.goBack()
            }


        } else {
            //favoritar
            if (user && id) {
                let newFavorites = user?.favorites
                newFavorites?.push(parseInt(id))
                if (newFavorites) {
                    const json = userFavoritePokemon(newFavorites)
                    if (!json) {
                        //error
                        toast.show({
                            title: 'Error',
                            description: 'Erro ao adicionar ao favorito.',
                            placement: 'top',
                            bgColor: 'red.500'
                        })
                        navigation.goBack()
                    } else {
                        toast.show({
                            title: 'Sucesso',
                            description: 'Sucesso ao adicionar o favorito.',
                            placement: 'top',
                            bgColor: 'emerald.500'
                        })
                        setFilled(true);
                    }
                } else {
                    //error
                    toast.show({
                        title: 'Error',
                        description: 'Erro ao adicionar ao favorito.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })
                    navigation.goBack()
                }
            } else {
                //errror
                toast.show({
                    title: 'Error',
                    description: 'Erro ao adicionar ao favorito.',
                    placement: 'top',
                    bgColor: 'red.500'
                })
                navigation.goBack()
            }
        }

    };




    const infoPokemon = async () => {
        try {
            if (id) {
                const json = await api.typePokemon(parseInt(id))
                const data: PokemonInfo = {
                    name: json.name,
                    url: json.url,
                    types: json.types.map((type: any) => type.type.name),
                    height: json.height,
                    weight: json.weight,
                    stats: json.stats.map((stat: any) => ({
                        atributo: stat.stat.name,
                        valor: stat.base_stat,
                    }))
                };

                console.log('OBJETO: ', {
                    name: json.name,
                    url: json.url,
                    types: json.types.map((type: any) => type.type.name),
                    height: json.height,
                    weight: json.weight,
                    stats: json.stats.map((stat: any) => ({
                        atributo: stat.stat.name,
                        valor: stat.base_stat,
                    }))
                })
                setPokemonInfo(data);
                //setFilled(isFavorite)
                if (user) {
                    const isFavorite = user.favorites.includes(parseInt(id));
                    setFilled(isFavorite)
                }


            }
        } catch (error) {
            Alert.alert('Error', "Problema ao se comunicar ao banco de dados.")
            navigation.goBack()
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        infoPokemon()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <Header
                title=""
                buttonBack
            />
            {isLoading &&
                <VStack flex={1}>
                    <Center flex={1} bg={'gray.100'}>
                        <Spinner color="blue.029600" size='lg' mt={8} />
                    </Center>
                </VStack>
            }



            {!isLoading &&
                <VStack flex={1}>
                    <VStack alignItems={'center'}>
                        <Image
                            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` }}
                            alt="Pokeapi Image"
                            style={{ width: 150, height: 150 }}
                        />
                        <Text fontSize={32} fontFamily={'heading'}>{pokemonInfo?.name}</Text>
                    </VStack>
                    <VStack px={12} mt={4}>

                        <HStack>
                            <VStack flex={1}>
                                <Text fontSize={18} fontFamily={'heading'}>Tipo do pokémon</Text>
                                <HStack mt={2}>
                                    {pokemonInfo && pokemonInfo.types.map((type) => {
                                        const typeImage = typesImages[type as keyof typeof typesImages];
                                        if (typeImage) {
                                            return (
                                                <Image
                                                    key={type}
                                                    source={typeImage}
                                                    alt={`Type ${type}`}
                                                    style={{ width: 50, height: 50 }}
                                                    mr={2}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </HStack>
                            </VStack>
                            <VStack justifyContent={'center'} alignItems={'center'}>
                                <IconButton
                                    icon={<FontAwesome name={filled ? 'heart' : 'heart-o'} size={24} color={filled ? 'red' : 'gray'} />}
                                    onPress={toggleHeart}
                                />
                            </VStack>
                        </HStack>

                        <HStack mt={4}>
                            <VStack>
                                <Text fontSize={18} fontFamily={'heading'}>Altura</Text>
                                <Text fontSize={18} fontFamily={'body'}>{pokemonInfo?.height} m</Text>
                            </VStack>
                            <VStack ml={5}>
                                <Text fontSize={18} fontFamily={'heading'}>Peso</Text>
                                <Text fontSize={18} fontFamily={'body'}>{pokemonInfo?.weight} kg</Text>
                            </VStack>
                        </HStack>


                        <VStack mt={4}>
                            <Text fontSize={18} fontFamily={'heading'}>Atributos</Text>
                            {pokemonInfo && pokemonInfo.stats.map((item: any) => (
                                <VStack mt={2} key={item.atributo}>
                                    <Text>{(item.atributo.toUpperCase())} - {item.valor}</Text>
                                    <Progress colorScheme="emerald" value={item.valor} />
                                </VStack>
                            ))}
                        </VStack>



                    </VStack>
                </VStack>
            }
        </View>
    );
}
