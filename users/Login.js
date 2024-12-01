import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Modal, Animated, Image, Dimensions, ActivityIndicator } from 'react-native';
import { TextInput, Button, Divider, useTheme } from 'react-native-paper';
import * as Font from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebase/firebaseUserConfig';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Easing } from 'react-native-reanimated';

const logo = require('../assets/Logo.png');
const headerImage = require('../assets/images/HeaderImage.jpg'); // Import your header image

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true); 
    const [isModalVisible, setModalVisible] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [logoScale] = useState(new Animated.Value(0.9));
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSendingResetLink, setIsSendingResetLink] = useState(false);

    
    const theme = useTheme();

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                'Poppins_400Regular': Poppins_400Regular,
                'Poppins_700Bold': Poppins_700Bold,
            });
            setFontsLoaded(true); 
        };

        loadFonts();
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, {
                    toValue: 1.0, 
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(logoScale, {
                    toValue: 0.9,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [logoScale]);

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const handleLoginOrSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }
        setIsLoggingIn(true); // Set isLoggingIn to true when starting the login/signup process
        try {
            if (isLogin) {
                const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Check if the user's email is verified
                if (!user.emailVerified) {
                    Alert.alert('Error', 'Your email address is not verified.');
                    await firebase.auth().signOut();
                    return;
                }

                // Fetch user data from Firestore to check if the user is banned
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                const userData = userDoc.data();

                // If the user is banned, show an alert and log out
                if (userData && userData.isBanned) {
                    Alert.alert('Error', 'Your account is banned. Please contact support.');
                    await firebase.auth().signOut();
                    return;
                }
            } else {
                // Sign-up process (if not logging in)
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                Alert.alert('Success', 'Account created! Please verify your email.');
            }
            setEmail('');
            setPassword('');
            setModalVisible(false); // Close the modal after login or sign up
        } catch (error) {
            // Check Firebase error codes and display a custom message
            switch (error.code) {
                case 'auth/invalid-email':
                    Alert.alert('Error', 'Invalid email address.');
                    break;
                case 'auth/user-disabled':
                    Alert.alert('Error', 'This account has been disabled. Contact the administrator for queries');
                    break;
                case 'auth/invalid-credential':
                    Alert.alert('Error', 'Account mismatch.');
                    break;
                default:
                    Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
                    break;
            }
        } finally {
            setIsLoggingIn(false); // Set isLoggingIn to false after process is complete
        }
    };


    const handleForgotPassword = async () => {
        if (!forgotPasswordEmail) {
            Alert.alert('Error', 'Please enter your email.');
            return;
        }
        setIsSendingResetLink(true); // Start loading indicator
        try {
            await firebase.auth().sendPasswordResetEmail(forgotPasswordEmail);
            Alert.alert('Success', 'Password reset email sent!');
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSendingResetLink(false); // Stop loading indicator
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Upper Section with Header Image */}
            <View style={styles.header}>
                <Image source={headerImage} style={styles.headerImage} />
            </View>

            {/* Lower Section with Logo and "Log In" Button */}
            <View style={styles.loginContainer}>
                <View style={styles.logoContainer}>
                    <Animated.Image
                        source={logo}
                        style={[styles.logo, { transform: [{ scale: logoScale }] }]}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.catchPhrase}>
                Creative Ideas, Infinite Digital Possibilities.
                </Text>
                <Divider style={{ width: '90%', marginVertical: 20 }} />
                
                <Button
                    mode="contained"
                    onPress={() => {
                        setIsLogin(true); // Ensure the modal opens in "Log In" mode by default
                        setModalVisible(true); // Open the modal
                    }}
                    style={styles.button}
                >
                    Log In
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => navigation.navigate('HomeRegistrationScreen')}
                    style={styles.button}
                    textColor="#C8A2D3"
                >
                    Register
                </Button>
            </View>

            {/* Login/Forgot Password Modal */}
             <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setEmail('');
                    setPassword('');
                    setForgotPasswordEmail('');
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isLogin ? 'Log In' : 'Reset Password'}</Text>
                        {(isLoggingIn || isSendingResetLink) ? ( 
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8A2BE2" />
                                <Text style={styles.loadingText}>
                                    {isLogin ? "Logging you in..." : "Sending reset link..."}
                                </Text>
                            </View>
                        ) : (
                            <>
                                {isLogin && (
                                    <>
                                        <TextInput
                                            label="Email"
                                            mode="outlined"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            style={styles.input}
                                        />
                                        <TextInput
                                            label="Password"
                                            mode="outlined"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                            style={styles.input}
                                        />
                                    </>
                                )}
                                {!isLogin && (
                                    <TextInput
                                        label="Email"
                                        mode="outlined"
                                        value={forgotPasswordEmail}
                                        onChangeText={setForgotPasswordEmail}
                                        keyboardType="email-address"
                                        style={styles.input}
                                    />
                                )}
                            </>
                        )}
                        <Button
                            mode="contained"
                            onPress={isLogin ? handleLoginOrSignUp : handleForgotPassword}
                            style={styles.modalButton}
                            disabled={isLoggingIn || isSendingResetLink}
                        >
                            {isLogin ? 'Log In' : 'Send Reset Link'}
                        </Button>
                        <Button
                            onPress={() => {
                                setEmail('');
                                setPassword('');
                                setForgotPasswordEmail('');
                                setModalVisible(false);
                            }}
                            style={styles.modalButton}
                        >
                            Cancel
                        </Button>
                        <Button onPress={toggleLogin} style={styles.toggleText}>
                            {isLogin ? "Forgot Password?" : "Back to Log In"}
                        </Button>
                    </View>
                </View>
            </Modal>
       </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6E6FA',
    },
    header: {
        height: 300, // Height of the header container
        overflow: 'hidden', // Hide anything that overflows this container
        position: 'relative', // Allow absolute positioning for child elements
    },
    headerImage: {
        position: 'absolute', // Position the image absolutely within the header
        bottom: -100, // Move the image up to crop the bottom part
        width: '100%', // Full width of the header
        height: 400, // Set a height that is larger than the header to show more of the image
        resizeMode: 'cover', // Cover the header area
    },
    loginContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        backgroundColor: '#E6E6FA',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -28,
        paddingHorizontal: 20, // Add horizontal padding to the container
    },
    logoContainer: {
        width: '100%', // Set to full width to keep logo centered
        alignItems: 'center', // Center the logo
        paddingHorizontal: 20, // Add horizontal padding to keep space on the sides
    },
    logo: {
        width: '80%', // Adjust width to be a percentage of the container
        height: 177,

    },
    catchPhrase: {
        fontSize: 20, // Adjust the font size for more impact
        fontFamily: 'Poppins_700Bold', // Keep the bold style for emphasis
        textAlign: 'center', // Center the text
        color: '#8A2BE2',
        marginVertical: 10, // Optional: Add some vertical spacing
        letterSpacing: 1, // Optional: Slight letter spacing for a more modern look
    },
    input: {
        width: '90%',
        marginBottom: 10,
    },
    button: {
        width: '90%',
        marginTop: 20,
        backgroundColor: '#8A2BE2',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        fontFamily: 'Poppins_700Bold',
    },
    modalButton: {
        width: '100%',
        marginVertical: 10,
    },
    toggleText: {
        marginTop: 20,
        fontSize: 16,
        color: '#8A2BE2',
    },
});
