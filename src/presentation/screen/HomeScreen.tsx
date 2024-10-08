import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View, StyleSheet } from "react-native"
import { Products } from "../../models/Products";
import { PlayerAPI } from "../../api/PlayerAPI";
import { getFavorites, saveFavorites } from "../../utils/asyncStorage";
import { showInfoRemoveToast, showSuccessToast } from "../components/Toast";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";

const HomeScreen: React.FC = () => {
    const [product, setProduct] = useState<Products[]>([]);
    const [filteredPlayer, setFilteredPlayer] = useState<Products[]>([]);
    const [favorites, setFavorites] = useState<Products[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const isFocused = useIsFocused();


    useEffect(() => {
        const fetchProduct = async () => {
            const api = new PlayerAPI();
            try {
                const data = await api.getAllPlayer();
                setProduct(data);
                setFilteredPlayer(data);
            } catch (err) {
                console.log('Error fetching perfumes', err);
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
        if (selectedTeam) {
            setFilteredPlayer(product.filter(product => product.brand === selectedTeam));
        } else {
            setFilteredPlayer(product);
        }
    }, [selectedTeam, product]);

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

    const isFavorite = (perfumeId: string) => {
        try {
            return favorites.findIndex(fav => fav.id === perfumeId) !== -1;
        } catch (error) {
            console.log('Error checking favorite', error);
            return false;
        }
    };




    const team = Array.from(new Set(product.map(perfume => perfume.brand)));

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.header}>Products</Text>
            </View>
            <CategoryFilter
                team={team}
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeam}
            />
            <FlatList
                data={filteredPlayer}
                showsVerticalScrollIndicator={false}
                numColumns={2}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 64,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 30,
    },
    list: {
        flexGrow: 1,
        paddingHorizontal: 3,
        paddingTop: 10,
        paddingBottom: 30,
        backgroundColor: '#96C9F4',
    },
    centeredText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});

export default HomeScreen;
