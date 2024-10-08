import Toast from "react-native-toast-message";

export const showSuccessToast = () => {
    Toast.show({
        type: "success",
        text1: "Add Successfully",
        text2: "Items add to WishList Screen!",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
    });
};

export const showInfoRemoveToast = () => {
    Toast.show({
        type: "info",
        text1: "Remove Item  Successfully",
        text2: "Items are remove  to WishList Screen!",
        text1Style: { fontSize: 18 },
        text2Style: { fontSize: 14 },
    });
};
