// CategoryFilter.tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface CategoryFilterProps {
    team: string[];
    selectedTeam: string | null;
    onSelectTeam: (team: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ team, selectedTeam, onSelectTeam }) => {
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
                            selectedTeam === item || (selectedTeam === null && item === 'All') ? styles.selected : {},
                        ]}
                        onPress={() => onSelectTeam(item === 'All' ? null : item)}
                        accessibilityLabel={`Select ${item}`}
                    >
                        <Text
                            style={[
                                styles.buttonText,
                                selectedTeam === item || (selectedTeam === null && item === 'All')
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

export default memo(CategoryFilter);
