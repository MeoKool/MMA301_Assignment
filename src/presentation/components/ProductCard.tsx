import { Products } from "../../models/Products";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigation";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export interface PlayerCardProps {
    product: Products;
    favorite: boolean;
    onChangeFavList: () => void;
}

const ProductCard: React.FC<PlayerCardProps> = ({ product, favorite, onChangeFavList }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('Details', { products: product })}
            >
                <Image style={styles.image} resizeMode="cover" source={{ uri: product.image }} />
                <Text style={styles.name}>{product.artName}</Text>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.price}>Brand: {product.brand}</Text>

            </TouchableOpacity>
            <TouchableOpacity style={styles.fav} onPress={onChangeFavList}>
                <FontAwesome
                    name={favorite ? 'heart' : 'heart-o'}
                    size={24}
                    color={favorite ? 'red' : 'gray'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 240,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 8,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        position: 'relative',
    },
    cardContent: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        height: 40,
        textAlign: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',

    },
    fav: {
        position: 'absolute',
        top: 20,
        right: 15,
        borderRadius: 10,
        padding: 4,
        color: 'white',
    },
    image: {
        width: 140,
        height: 140,
        marginLeft: 3,
    },
});

export default ProductCard;
