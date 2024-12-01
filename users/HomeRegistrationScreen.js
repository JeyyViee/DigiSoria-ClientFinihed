import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const HomeRegistrationScreen = () => {
    const navigation = useNavigation();

    // Load Poppins font
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    // Animation values for each button
    const clientButtonAnimation = useRef(new Animated.Value(1)).current;
    const sellerButtonAnimation = useRef(new Animated.Value(1)).current;

    // Animation function
    const animateButton = (animationValue, navigateTo) => {
        Animated.sequence([
            Animated.timing(animationValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => navigation.navigate(navigateTo)); // Navigate after animation ends
    };

    if (!fontsLoaded) return null; // Prevent rendering until fonts are loaded

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.title}>Choose Your Role</Text>

            <Animated.View style={{ transform: [{ scale: clientButtonAnimation }] }}>
                <TouchableOpacity
                    style={[styles.button, styles.clientButton]}
                    onPress={() => animateButton(clientButtonAnimation, 'ClientRegistrationScreen')}
                >
                    <Ionicons name="cash-outline" size={50} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Client</Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: sellerButtonAnimation }] }}>
                <TouchableOpacity
                    style={[styles.button, styles.sellerButton]}
                    onPress={() => animateButton(sellerButtonAnimation, 'SellerRegistrationScreen')}
                >
                    <Ionicons name="briefcase-outline" size={50} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Seller</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

export default HomeRegistrationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8A2BE2',
        paddingTop: 50, // Added padding for the back button at the top
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
        backgroundColor: 'transparent',
        zIndex: 1, // Ensures it appears above other elements
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold', // Bold Poppins font
        color: '#FFFFFF',
        marginBottom: 40,
    },
    button: {
        flexDirection: 'column',
        height: 280,
        width: 280,
        paddingVertical: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    clientButton: {
        backgroundColor: '#6A0DAD',
    },
    sellerButton: {
        backgroundColor: '#4B0082',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Poppins_400Regular', // Regular Poppins font
        marginTop: 10,
        textAlign: 'center',
    },
});
