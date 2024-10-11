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
                <Image style={styles.image} source={{ uri: product.image }} />
                <View style={styles.textContainer}>
                    <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                        {product.artName}
                    </Text>
                    <Text style={styles.price}>${product.price}</Text>
                    <Text style={styles.brand}>Brand: {product.brand}</Text>
                    <Text style={styles.limitedTimeDeal}> {(product.limitedTimeDeal * 100)}% Off</Text>

                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fav} onPress={onChangeFavList}>
                <FontAwesome
                    name={favorite ? 'heart' : 'heart-o'}
                    size={22}
                    color={favorite ? '#FF6B6B' : '#C1C1C1'}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        
        width: 180,
        height: 280,
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        margin: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
        position: 'relative',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginTop: 12,
        alignItems: 'center',
        width: 140, // Điều chỉnh chiều rộng để văn bản không bị tràn
        paddingHorizontal: 6,
    },
    limitedTimeDeal: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        backgroundColor: '#FF6347',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 6,
        textAlign: 'center',
        borderColor: '#FF4500',
        borderWidth: 1.5,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        letterSpacing: 0.5,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 12,
        marginBottom: 10,
        alignSelf: 'center',
        resizeMode: 'contain',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E3E3E3',
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2A2A2A',
        textAlign: 'center',
        lineHeight: 18,
        height: 38,
        flexWrap: 'wrap',
        overflow: 'hidden',
        flexShrink: 1,
        width: 140, 
    },
    price: {
    fontSize: 20,
    fontWeight: 'bold', 
    color: '#1E90FF',
    marginVertical: 4,
},
    brand: {
        fontSize: 12,
        color: '#8A8A8A',
        marginBottom: 6,
    },
    fav: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 6,
        backgroundColor: '#FFF',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default ProductCard;
