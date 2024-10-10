import { Products } from "../../models/Products";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screen/HomeScreen";
import DetailsScreen from "../screen/Details";
import Favorite from "../screen/Favorite";
import { NavigationContainer } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

export type RootStackParamList = {
    Home: undefined;
    Details: { products: Products };
    Favorites: undefined;
    Main: undefined;
};

export type TabParamList = {
    HomeStack: undefined;
    FavoritesStack: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="Home" 
                component={HomeScreen}  
                options={({ route }) => ({
                    title: route.name === 'Home' ? 'Products' : route.name,
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#000',
                    headerTitleAlign: 'center',
                })}
            />
        </Stack.Navigator>
    );
};

const FavoritesStackNavigator: React.FC = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Favorites" component={Favorite} />
        </Stack.Navigator>
    );
};

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            headerShown: false,
            tabBarStyle: {
                position: "absolute",
                right: 0,
                left: 0,
                elevation: 0,
                height: 70,
            },
        }}>
            <Tab.Screen options={{
                tabBarIcon: ({ focused }) => (
                    <FontAwesome name="home" size={28} color={focused ? '#39B78D' : 'gray'} />
                ),
            }} name="HomeStack" component={HomeStackNavigator} />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons name="favorite" size={28} color={focused ? '#39B78D' : 'gray'} />
                    ),
                }}
                name="FavoritesStack" component={FavoritesStackNavigator} />
        </Tab.Navigator>
    );
};

export const AppNavigation: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
            <Toast />
        </NavigationContainer>
    );
};