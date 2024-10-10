import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigation';
import { showInfoRemoveToast } from '../components/Toast';
import { getFavorites, saveFavorites } from '../../utils/asyncStorage';
import { Products } from '../../models/Products';
import Favor from '../components/FavorCard';

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Favorites'>;
    route: RouteProp<RootStackParamList, 'Favorites'>;
};

const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
    const [favorites, setFavorites] = useState<Products[]>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await getFavorites();
                setFavorites(storedFavorites);
            } catch (error) {
                console.error('Error loading favorites', error);
            }
        };

        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused]);

    const removeFavorite = async (perfumeId: string) => {
        try {
            Alert.alert('Remove favorite', 'Are you sure you want to remove this favorite?', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        const updatedFavorites = favorites.filter((item: Products) => item.id !== perfumeId);
                        setFavorites(updatedFavorites);
                        await saveFavorites(updatedFavorites);
                        showInfoRemoveToast();
                    },
                },
            ]);
        } catch (error) {
            console.error('Error removing favorite', error);
        }
    };

    const removeAllFavorites = async () => {
        try {
            Alert.alert('Remove all favorites', 'Are you sure you want to remove all favorites?', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        setFavorites([]);
                        await saveFavorites([]);
                        showInfoRemoveToast();
                    },
                },
            ]);
        } catch (error) {
            console.error('Error removing all favorites', error);
        }
    };

    if (favorites.length === 0) {
        return (
            <View style={styles.noFav}>
                <Text style={styles.noFavText}>No favorites found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.header}>Favorites</Text>
                        {favorites.length >= 2 && (
                            <TouchableOpacity style={styles.removeAllButton} onPress={removeAllFavorites}>
                                <Text style={styles.removeAllButtonText}>Remove All</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <Favor
                        favoriteProducts={[item]}
                        onDelete={(id) => removeFavorite(id)}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333333',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },
    removeAllButton: {
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#ff4d4d',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    removeAllButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    noFav: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    noFavText: {
        fontSize: 20,
        color: '#808080',
        fontWeight: '500',
    },
    list: {
        paddingBottom: 90, // Thêm padding để tránh bị che bởi bottom navbar
    },
});

export default FavoritesScreen;