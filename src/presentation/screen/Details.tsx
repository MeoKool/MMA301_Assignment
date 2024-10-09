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
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    const [selectedRating, setSelectedRating] = useState(0);
    const filteredComments = selectedRating === 0
        ? products.comments
        : products.comments.filter(comment => comment.rating === selectedRating);
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
                    <Text style={styles.description}>{products.description}</Text>
                    <Text style={styles.price}>Brand: {products.brand}</Text>
                    <Text style={styles.price}>GlassSurface: {products.glassSurface ? 'True' : 'False'}</Text>
                    <Text style={styles.price}>LimitedTimeDeal: {products.limitedTimeDeal}</Text>
                </View>

                <View style={styles.commentsSection}>
                    <View style={styles.filterSection}>
                        <Text style={styles.filterTitle}>Filter by Rating:</Text>
                        <Picker
                            selectedValue={selectedRating}
                            style={styles.picker}
                            onValueChange={(itemValue) => setSelectedRating(itemValue)}
                        >
                            <Picker.Item label="All Ratings" value={0} />
                            <Picker.Item label="1 Star" value={1} />
                            <Picker.Item label="2 Stars" value={2} />
                            <Picker.Item label="3 Stars" value={3} />
                            <Picker.Item label="4 Stars" value={4} />
                            <Picker.Item label="5 Stars" value={5} />
                        </Picker>
                    </View>
                    <View style={styles.commentsSection}>
                        <Text style={styles.commentsTitle}>Customer Reviews:</Text>
                        {filteredComments && filteredComments.length > 0 ? (
                            filteredComments.map((comment, index) => (
                                <View key={index} style={styles.commentContainer}>
                                    <Text style={styles.commentAuthor}>
        <Icon name="user" size={16} color="#000" /> {comment.author}:
    </Text>
                                    <Text style={styles.commentContent}>{comment.content}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.commentRating}>Rating: {comment.rating}/5</Text>
                                    <Text style={styles.commentRating}><Icon name="star" size={16} color="#FFD700"></Icon></Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noComments}>No comments available.</Text>
                        )}
                    </View>
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
    picker: {
        height: 50,
        width: 150,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    filterSection: {
        marginBottom: 16,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 80,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description:{
           fontSize: 20,
        marginVertical: 8,
        marginLeft: 19,
        marginRight: 19,
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
    commentsSection: {
        width: '90%',
        marginTop: 20,
    },
    commentsTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    commentContainer: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
    },
    commentAuthor: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    commentContent: {
        fontSize: 16,
        marginTop: 5,
        marginBottom: 10,
    },
    commentRating: {
        fontSize: 14,
        color: 'gray',
    },
    noComments: {
        fontSize: 16,
        fontStyle: 'italic',
        color: 'gray',
        textAlign: 'center',
    },
});

export default DetailsScreen;
