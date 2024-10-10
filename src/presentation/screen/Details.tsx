import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderComponent from '../components/HeaderComponent';
import { Ionicons } from '@expo/vector-icons';
import { showInfoRemoveToast, showSuccessToast } from '../components/Toast';
import { getFavorites, saveFavorites } from '../../utils/asyncStorage';
import { Products } from '../../models/Products';
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
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredComments = selectedRating === null
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
        <View style={styles.productContainer}>
          <Image source={{ uri: products.image }} resizeMode='contain' style={styles.image} />
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={40} color={isFavorite ? 'red' : 'gray'} />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            <Text style={styles.name}>{products.artName}</Text>
            <Text style={styles.price}>${products.price}</Text>
            <Text style={styles.description}>{products.description}</Text>
            <Text style={styles.details}>Brand: {products.brand}</Text>
            <Text style={styles.details}>Glass Surface: {products.glassSurface ? 'Yes' : 'No'}</Text>
            <Text style={styles.limitedTimeDeal}>Limited Time Deal: {products.limitedTimeDeal * 100}% Off</Text>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Customer Reviews</Text>
          {/* Thanh lựa chọn số sao */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.starScroll}>
            {[0, 5, 4, 3, 2, 1].map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.starButton,
                  selectedRating === rating ? styles.starButtonSelected : null,
                ]}
                onPress={() => setSelectedRating(rating === 0 ? null : rating)}
              >
                <Text style={[
                  styles.starButtonText,
                  selectedRating === rating ? styles.starButtonTextSelected : null,
                ]}>
                  {rating === 0 ? 'All' : `${rating} Star${rating > 1 ? 's' : ''}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filteredComments && filteredComments.length > 0 ? (
            filteredComments.map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <Text style={styles.commentAuthor}>
                  <Icon name="user" size={16} color="#000" /> {comment.author}
                </Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <View style={styles.commentRatingContainer}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.commentRating}> {comment.rating}/5</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>No comments available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 80,
  },
  productContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  productInfo: {
    marginTop: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 22,
    color: '#007BFF',
    marginVertical: 8,
  },
  description: {
    fontSize: 18,
    color: '#666',
    marginVertical: 8,
  },
  details: {
    fontSize: 16,
    color: '#999',
    marginVertical: 4,
  },
  limitedTimeDeal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6347',
    marginVertical: 8,
    textAlign: 'center',
  },
  commentsSection: {
    width: '90%',
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  starScroll: {
    marginBottom: 16,
  },
  starButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
    marginHorizontal: 4,
  },
  starButtonSelected: {
    backgroundColor: '#32CD32',
  },
  starButtonText: {
    fontSize: 16,
    color: '#666',
  },
  starButtonTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  commentContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  commentAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 16,
    marginTop: 5,
    color: '#333',
  },
  commentRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentRating: {
    fontSize: 16,
    marginLeft: 5,
    color: '#FFD700',
  },
  noComments: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default DetailsScreen;
