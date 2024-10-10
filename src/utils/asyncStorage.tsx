// AsyncStorage functions (utils/asyncStorage.ts)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Products } from '../models/Products';

const FAVORITES_KEY = '@SE160326';
const SEARCH_HISTORY_KEY = '@SearchHistory'; // Key để lưu lịch sử tìm kiếm

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

// Lấy lịch sử tìm kiếm từ AsyncStorage
export const getSearchHistory = async (): Promise<string[]> => {
    try {
        const historyString = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        if (historyString !== null) {
            return JSON.parse(historyString);
        }
        return [];
    } catch (error) {
        console.error('Error getting search history:', error);
        return [];
    }
};

// Lưu lịch sử tìm kiếm vào AsyncStorage (thêm từ khóa mới vào danh sách)
export const saveSearchHistory = async (newSearch: string): Promise<string[]> => {
    try {
        const history = await getSearchHistory();
        const updatedHistory = [newSearch, ...history.filter(item => item !== newSearch)].slice(0, 10); // Lưu tối đa 10 từ khóa
        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
    } catch (error) {
        console.error('Error saving search history:', error);
        return [];
    }
};

// Xóa một từ khỏi lịch sử tìm kiếm
export const removeFromSearchHistory = async (itemToRemove: string): Promise<string[]> => {
  try {
    const history = await getSearchHistory();
    const updatedHistory = history.filter(item => item !== itemToRemove);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error removing from search history:', error);
    return [];
  }
};

// Xóa một từ khỏi lịch sử tìm kiếm
export const removeAllSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error removing all search history:', error);
  }
};