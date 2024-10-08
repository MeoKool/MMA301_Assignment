import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

type Props = {
    handleGoBack: () => void;
    handleGoHome: () => void;
};

const HeaderComponent: React.FC<Props> = ({ handleGoBack, handleGoHome }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleGoBack}>
                <AntDesign name="arrowleft" size={25} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Details Product</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleGoHome} style={styles.icon}>
                    <AntDesign name="home" size={25} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontStyle: 'normal',
        textAlign: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 20,
    },
});

export default HeaderComponent;
