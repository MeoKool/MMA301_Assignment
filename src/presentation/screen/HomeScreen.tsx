import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Products } from "../../models/Products";
import { PlayerAPI } from "../../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../../utils/asyncStorage";
import { showInfoRemoveToast, showSuccessToast } from "../components/Toast";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import Search from "../components/Sreach";

const HomeScreen: React.FC = () => {
    const [product, setProduct] = useState<Products[]>([]);
    const [filteredPlayer, setFilteredPlayer] = useState<Products[]>([]);
    const [favorites, setFavorites] = useState<Products[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    useEffect(() => {
        const fetchProduct = async () => {
            const api = new PlayerAPI();
            try {
                const data = await api.getAllPlayer();
                setProduct(data);
                setFilteredPlayer(data); 
                setLoading(false);
            } catch (err) {
                console.log('Error fetching products', err);
                setLoading(false);
            }
        };

        const loadFavorites = async () => {
            try {
                const storedFavorites = await getFavorites();
                setFavorites(storedFavorites);
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };

        fetchProduct();
        loadFavorites();
    }, [isFocused]);

    useEffect(() => {
        let filtered = selectedBrand ? product.filter((item) => item.brand === selectedBrand) : product;

        if (searchQuery.trim()) {
            filtered = filtered.filter((item) =>
                item.artName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredPlayer(filtered); 
    }, [selectedBrand, product, searchQuery]); 

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setSelectedBrand(null);
            setFilteredPlayer(product);
            setSearchQuery('');
        });

        return unsubscribe;
    }, [navigation, product]);

    const toggleFavorite = async (product: Products) => {
        let updatedFavorites = [...favorites];
        if (isFavorite(product.id)) {
            updatedFavorites = updatedFavorites.filter(fav => fav.id !== product.id);
            showInfoRemoveToast();
        } else {
            updatedFavorites.push(product);
            showSuccessToast();
        }
        setFavorites(updatedFavorites);
        await saveFavorites(updatedFavorites);
    };

    const isFavorite = (productId: string) => {
        try {
            return favorites.findIndex(fav => fav.id === productId) !== -1;
        } catch (error) {
            console.log('Error checking favorite', error);
            return false;
        }
    };

    const team = Array.from(new Set(product.map(item => item.brand)));

    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
            ) : (
                <FlatList
                    data={filteredPlayer}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    ListHeaderComponent={
                        <>
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>Products</Text>
                            </View>
                            <View style={styles.searchContainer}>
                                <Search
                                    artNames={product.map(p => p.artName)}
                                    onSelectArt={(query) => setSearchQuery(query)}
                                    onSearchChange={(query) => setSearchQuery(query)} 
                                />
                            </View>
                            <CategoryFilter
                                team={team}
                                selectedBrand={selectedBrand}
                                onSelectBrand={setSelectedBrand}
                            />
                        </>
                    }
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            favorite={isFavorite(item.id)}
                            onChangeFavList={() => toggleFavorite(item)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f8fa',
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
    },
    searchContainer: {
        marginHorizontal: 16,
        marginVertical: 10,
     
    },
    list: {
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: 90,
        justifyContent: 'center',
    },
    loader: {
        marginTop: 20,
    },
});

export default HomeScreen;