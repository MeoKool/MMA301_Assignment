import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSearchHistory, saveSearchHistory, removeFromSearchHistory, removeAllSearchHistory } from '../../utils/asyncStorage';

interface SearchArtNameProps {
  artNames: string[];
  onSelectArt: (artName: string) => void;
  onSearchChange: (query: string) => void;
}

const Search: React.FC<SearchArtNameProps> = ({ artNames, onSelectArt, onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArtNames, setFilteredArtNames] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  useEffect(() => {
    const loadSearchHistory = async () => {
      const history = await getSearchHistory();
      setSearchHistory(history);
    };
    loadSearchHistory();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
    setIsInputFocused(false); 

    if (query.trim()) {
      const filtered = artNames.filter((art) => art.toLowerCase().includes(query.toLowerCase()));
      setFilteredArtNames(filtered);
    } else {
      setFilteredArtNames([]);
    }
  };

  const handleSelectArt = async (artName: string) => {
    setSearchQuery(artName);
    setFilteredArtNames([]);
    onSelectArt(artName);

    const updatedHistory = await saveSearchHistory(artName);
    setSearchHistory(updatedHistory);
    setIsInputFocused(false);

    Keyboard.dismiss();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredArtNames([]);
    onSearchChange('');
    setIsInputFocused(true);
  };

  const handleDeleteHistoryItem = async (item: string) => {
    const updatedHistory = await removeFromSearchHistory(item);
    setSearchHistory(updatedHistory);
  };

  const handleClearAllHistory = async () => {
    await removeAllSearchHistory();
    setSearchHistory([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search art name..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
          onFocus={() => setIsInputFocused(true)}
        />
        {searchQuery !== '' && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {isInputFocused && searchQuery.trim() === '' && searchHistory.length > 0 && (
        <>
          <View style={styles.historyHeader}>
            <Text style={styles.historyHeaderText}>History Search</Text>
            <TouchableOpacity onPress={handleClearAllHistory}>
              <Text style={styles.clearAllText}>Clear all history</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={searchHistory}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={styles.historyItemContainer}>
                <TouchableOpacity style={styles.listItem} onPress={() => handleSelectArt(item)}>
                  <Text style={styles.itemText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteHistoryItem(item)}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            )}
          />
        </>
      )}

      {searchQuery.trim() !== '' && (
        <FlatList
          data={filteredArtNames}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.listItem} onPress={() => handleSelectArt(item)}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f8fa',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 2,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    height: 40,
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearAllText: {
    fontSize: 14,
    color: '#007BFF',
  },
  historyItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listItem: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default Search;