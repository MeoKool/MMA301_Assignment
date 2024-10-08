// CategoryFilter.tsx
import React from 'react';
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
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.button,
                            selectedTeam === item || (selectedTeam === null && item === 'All') ? styles.selected : {},
                        ]}
                        onPress={() => onSelectTeam(item === 'All' ? null : item)}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

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
    },
    selected: {
        backgroundColor: '#39B78D',
    },
    buttonText: {
        color: '#333',
    },
});

export default CategoryFilter;
