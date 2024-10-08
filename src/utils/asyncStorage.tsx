// AsyncStorage functions (utils/asyncStorage.ts)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Products } from '../models/Products';

const FAVORITES_KEY = '@SE160326';

// Retrieve favorites from AsyncStorage
export const getFavorites = async (): Promise<Products[]> => {
    try {
        const favoritesString = await AsyncStorage.getItem(FAVORITES_KEY);
        if (favoritesString !== null) {
            return JSON.parse(favoritesString);
        }
        return [];
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

// Save favorites to AsyncStorage
export const saveFavorites = async (favorites: Products[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
};
