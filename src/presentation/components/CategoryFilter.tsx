// CategoryFilter.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface CategoryFilterProps {
    team: string[];
    selectedBrand: string | null;
    onSelectBrand: (product: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ team, selectedBrand, onSelectBrand }) => {
    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={['All', ...team]}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.button,
                            selectedBrand === item || (selectedBrand === null && item === 'All') ? styles.selected : {},
                        ]}
                        onPress={() => onSelectBrand(item === 'All' ? null : item)}
                        accessibilityLabel={`Select ${item}`}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selectedBrand === item || (selectedBrand === null && item === 'All')
                                    ? styles.selectedText
                                    : {},
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

// StyleSheet updated with more refined styles
const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        backgroundColor: '#32CD32',
    },
    buttonText: {
        color: '#333',
    },
    selectedText: {
        color: '#fff',
    },
});

export default CategoryFilter;
