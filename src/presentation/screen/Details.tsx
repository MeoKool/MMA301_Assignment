import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../components/HeaderComponent';
import { Ionicons } from '@expo/vector-icons';
import { showInfoRemoveToast, showSuccessToast } from '../components/Toast';
import { getFavorites, saveFavorites } from '../../utils/asyncStorage';
import { Products } from '../../models/Products';

type RootStackParamList = {
    Details: { products: Products };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

type Props = {
    route: DetailsScreenRouteProp;
    navigation: DetailsScreenNavigationProp;
};

const DetailsScreen: React.FC<Props> = ({ route, navigation }) => {
    const { products } = route.params;
    const [favorites, setFavorites] = useState<Products[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const loadFavoritesFromStorage = async () => {
            try {
                const storedFavorites = await getFavorites();
                setFavorites(storedFavorites);
                setIsFavorite(storedFavorites.some(fav => fav.id === products.id));
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavoritesFromStorage();
    }, []);

    const toggleFavorite = async () => {
        let updatedFavorites = [...favorites];
        if (isFavorite) {
            updatedFavorites = updatedFavorites.filter(fav => fav.id !== products.id);
            showInfoRemoveToast();
        } else {
            updatedFavorites.push(products);
            showSuccessToast();
        }
        setFavorites(updatedFavorites);
        setIsFavorite(!isFavorite);
        await saveFavorites(updatedFavorites);
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderComponent
                handleGoBack={() => navigation.goBack()}
                handleGoHome={() => navigation.navigate('Home' as any)}
            />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={{ position: 'relative', alignItems: 'center' }}>
                    <Image source={{ uri: products.image }} resizeMode='contain' style={styles.image} />
                    <TouchableOpacity
                        onPress={toggleFavorite}
                        style={styles.favoriteButton}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={40}
                            color={isFavorite ? 'red' : 'gray'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.name}>{products.artName}</Text>
                    <Text style={styles.price}>Price: {products.price}$</Text>
                    <Text style={styles.price}>{products.description}</Text>
                    <Text style={styles.price}>Brand: {products.brand}</Text>
                    <Text style={styles.price}>GlassSurface: {products.glassSurface ? 'True' : 'False'}</Text>
                    <Text style={styles.price}>LimitedTimeDeal: {products.limitedTimeDeal}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    notes: {
        fontSize: 16,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    image: {
        width: 250,
        height: 300,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: 19,
        marginVertical: 20,
    },
    favoriteButton: {
        position: 'absolute',
        top: 40,
        right: 40,
        zIndex: 10,
    },
});

export default DetailsScreen;