import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Products } from "../../models/Products";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigation";

interface FavoriteListScreenProps {
    favoriteProducts: Products[]; 
    onDelete: (id: string) => void; 
}

const Favor: React.FC<FavoriteListScreenProps> = ({ favoriteProducts, onDelete }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>
            <SwipeListView
                data={favoriteProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.cardContent}
                            onPress={() => navigation.navigate('Details', { products: item })}
                        >
                            <Image style={styles.image} resizeMode="cover" source={{ uri: item.image }} />
                            <Text style={styles.name}>{item.artName}</Text>
                            <Text style={styles.price}>{item.price}$</Text>
                            <Text style={styles.brand}>Brand: {item.brand}</Text>
                        </TouchableOpacity>
                      
                    </View>
                )}
                renderHiddenItem={({ item }) => (
                    <View style={styles.rowBack}>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
                            <FontAwesome name="trash" size={24} color="white" />
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                rightOpenValue={-75}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardContent: {
        flex: 1,
        marginLeft: 16,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: 'gray',
        marginVertical: 4,
    },
    brand: {
        fontSize: 14,
        color: 'gray',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    fav: {
        position: 'absolute',
        top: 20,
        right: 15,
        borderRadius: 10,
        padding: 4,
        color: 'white',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: 'red',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 75,
        backgroundColor: 'red',
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    deleteText: {
        color: 'white',
        marginTop: 5,
        fontSize: 12,
    },
});

export default Favor;
