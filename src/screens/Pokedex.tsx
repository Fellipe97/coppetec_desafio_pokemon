import React, { useEffect, useState } from "react";
import { Platform } from 'react-native';
import { Center, KeyboardAvoidingView, Spinner, VStack, Button, HStack, Text, FlatList } from "native-base";
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { Header } from "../components/Header";
import { ButtonCardPokemon } from "../components/ButtonCardPokemon";
import Api from "../helpers/Api";
import { FontAwesome6 } from '@expo/vector-icons';
import { StackAppNavigationProp } from "../routes/stackApp.routes";

interface PokemonEntry {
    entry_number: number;
    pokemon_species: {
        name: string;
        url: string;
    };
}

interface Pokemon {
    id: number;
    name: string;
    url: string;
    types?: string[]; // Adicione o campo types como um array de strings
}

const types = [
    {
        name: 'grass',
        color: '#4CAF50'
    },
    {
        name: 'poison',
        color: '#9C27B0'
    },
    {
        name: 'psychic',
        color: '#FFC107'
    },
    {
        name: 'fire',
        color: '#FF5722'
    },
    {
        name: 'water',
        color: '#2196F3'
    },
    {
        name: 'bug',
        color: '#8BC34A'
    },
    {
        name: 'normal',
        color: '#9E9E9E'
    },
    {
        name: 'electric',
        color: '#FFEB3B'
    },
    {
        name: 'ground',
        color: '#795548'
    },
    {
        name: 'fairy',
        color: '#E91E63'
    },
    {
        name: 'fighting',
        color: '#F44336'
    },
    {
        name: 'rock',
        color: '#607D8B'
    },
    {
        name: 'steel',
        color: '#607D8B'
    },
    {
        name: 'ice',
        color: '#03A9F4'
    },
    {
        name: 'ghost',
        color: '#673AB7'
    },
    {
        name: 'dragon',
        color: '#9C27B0'
    },
    {
        name: 'dark',
        color: '#333333'
    },
    {
        name: 'flying',
        color: '#03A9F4'
    }
];

export function Pokedex() {
    const api = Api()
    const isFocused = useIsFocused();
    const navigation = useNavigation<StackAppNavigationProp>();

    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const handleGetAllPokemons = async () => {
        try {
            setIsLoading(true);
            const json = await api.getAllPokemon();
            const pokemonsJson: Pokemon[] = await Promise.all(json.pokemon_entries.map(async (entry: PokemonEntry) => {
                const pokemonDetails = await api.typePokemon(entry.entry_number);
                return {
                    id: entry.entry_number,
                    name: entry.pokemon_species.name,
                    url: entry.pokemon_species.url,
                    types: pokemonDetails.types.map((type: any) => type.type.name)
                };
            }));
            setPokemons(pokemonsJson);
            setFilteredPokemons(pokemonsJson);
        } catch (error) {
            // Trate o erro aqui
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (isFocused) {
            handleGetAllPokemons();
        }
    }, [isFocused]);

    const handleNextPage = () => {
        setStartIndex(startIndex + 3);
    }

    const handlePreviousPage = () => {
        setStartIndex(startIndex - 3);
    }

    const handleTypeFilter = (type: string) => {
        setSelectedType(type);
        if (type === null) {
            setFilteredPokemons(pokemons);
        } else {
            const filtered = pokemons.filter(pokemon => pokemon.types?.includes(type));
            setFilteredPokemons(filtered);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

            {/* header go back */}
            <Header
                title="Pokédex"
                buttonBack
            />

            {isLoading &&
                <Center flex={1} bg={'gray.100'}>
                    <Spinner color="blue.029600" size='lg' mt={8} />
                </Center>
            }
            {!isLoading &&
                <VStack px={12} py={6} flex={1} width={'full'} alignItems={'center'} background={'gray.100'}>

                    <FlatList
                        h={'5px'}
                        contentContainerStyle={{ marginVertical: 4 }}
                        horizontal
                        data={types}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Button
                                rounded='lg'
                                key={item.name}
                                h={'50px'}
                                w={'100px'}
                                onPress={() => handleTypeFilter(item.name)}
                                bg={selectedType === item.name ? item.color : 'gray.400'}
                                _pressed={{
                                    opacity: .3
                                }}
                                mx={2}
                            >
                                <Text color="white" fontWeight="bold">{item.name}</Text>
                            </Button>
                        )}
                    />

                    {filteredPokemons.slice(startIndex, startIndex + 3).map((item: Pokemon) => (
                        <ButtonCardPokemon
                            key={item.id}
                            idPokemon={item.id}
                            title={item.name}
                            color={'blueButton'}
                            mb={4}
                            onPress={() => navigation.navigate('detailPokemon', { id: item.id.toString() })}
                        />
                    ))}
                    <HStack flex={1} justifyContent={'space-around'}>
                        {startIndex !== 0 &&
                            <Button
                                onPress={handlePreviousPage}
                                bg="transparent"
                                _pressed={{
                                    bg: "transparent",
                                    opacity: .3
                                }}
                            >
                                <FontAwesome6 name="arrow-alt-circle-left" size={48} color="black" />
                            </Button>
                        }
                        {pokemons.length > startIndex + 3 &&
                            <Button
                                onPress={handleNextPage}
                                bg="transparent"
                                _pressed={{
                                    bg: "transparent",
                                    opacity: .3
                                }}
                            >
                                <FontAwesome6 name="arrow-alt-circle-right" size={48} color="black" />
                            </Button>
                        }
                    </HStack>
                </VStack>
            }
        </KeyboardAvoidingView>
    )
}
