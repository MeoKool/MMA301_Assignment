import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Cần thư viện này để sử dụng icon (npm install @expo/vector-icons)

interface SearchArtNameProps {
  artNames: string[];
  onSelectArt: (artName: string) => void;
  onSearchChange: (query: string) => void; 
}

const Search: React.FC<SearchArtNameProps> = ({ artNames, onSelectArt, onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredArtNames, setFilteredArtNames] = useState<string[]>([]);

  // Hàm xử lý khi người dùng nhập từ khóa tìm kiếm
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query); // Gọi callback để cập nhật danh sách sản phẩm trong component cha

    if (query.trim()) {
      const filtered = artNames.filter((art) =>
        art.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArtNames(filtered);
    } else {
      setFilteredArtNames([]);
    }
  };

  // Hàm xử lý khi người dùng chọn một mục
  const handleSelectArt = (artName: string) => {
    setSearchQuery(artName); // Cập nhật ô tìm kiếm với tên đã chọn
    setFilteredArtNames([]); // Ẩn danh sách sau khi chọn
    onSelectArt(artName); // Gọi callback để truyền tên đã chọn lên component cha
    Keyboard.dismiss(); // Ẩn bàn phím sau khi chọn
  };

  // Hàm xóa nội dung trong ô tìm kiếm
  const clearSearch = () => {
    setSearchQuery('');
    setFilteredArtNames([]);
    onSearchChange(''); // Gọi callback để cập nhật danh sách sản phẩm đầy đủ trong component cha
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        {/* Thanh tìm kiếm */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search art name..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {/* Nút xóa nhanh */}
        {searchQuery !== '' && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Hiển thị danh sách các tên tác phẩm nghệ thuật đã lọc */}
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
  clearButton: {
    color: '#000',
    position: 'absolute',
    right: 10, // Đặt vị trí của nút ở góc phải của TextInput
  },
  listItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#aaa',
  },
});

export default Search;