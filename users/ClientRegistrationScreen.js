import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import { firebase } from '../firebase/firebaseUserConfig';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const ClientRegistrationScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigation = useNavigation();

    // Load Poppins font
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const validateInput = () => {
        let errors = {};
        const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegex.test(firstName) || firstName.length > 15) errors.firstName = 'Enter a valid first name';
        if (!nameRegex.test(lastName) || lastName.length > 15) errors.lastName = 'Enter a valid last name';
        if (!emailRegex.test(email)) errors.email = 'Enter a valid email address';
        if (password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleClientRegistration = async () => {
        if (!validateInput()) {
            Alert.alert('Error', 'Please fix the highlighted fields.');
            return;
        }

        setUploading(true);

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await user.sendEmailVerification();
            Alert.alert('Success', 'Verification email sent.');

            const userData = {
                firstName,
                lastName,
                email,
                role: 'Client',
                uid: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };

            await firebase.firestore().collection('users').doc(user.uid).set(userData);
            await firebase.firestore().collection('clients').doc(user.uid).set(userData);

            Alert.alert('Success', 'Account created! Please verify your email to log in.');
            navigation.navigate('Login');
        } catch (error) {
            handleFirebaseError(error);
        } finally {
            setUploading(false);
        }
    };

    const handleFirebaseError = (error) => {
        if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Error', 'This email is already registered.');
        } else if (error.code === 'auth/invalid-email') {
            Alert.alert('Error', 'Invalid email format.');
        } else if (error.code === 'auth/weak-password') {
            Alert.alert('Error', 'Password should be at least 6 characters.');
        } else {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        onPress={() => navigation.navigate('HomeRegistrationScreen')}
                        style={styles.backButton}
                    />
                    <Text style={styles.title}>Register as Client</Text>

                    <TextInput
                        mode="outlined"
                        label="First Name"
                        value={firstName}
                        onChangeText={(text) => setFirstName(text.trimStart())}
                        style={styles.input}
                        error={!!errors.firstName}
                        theme={{ colors: { primary: '#8A2BE2' } }}
                        maxLength={15}
                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                    <TextInput
                        mode="outlined"
                        label="Last Name"
                        value={lastName}
                        onChangeText={(text) => setLastName(text.trimStart())}
                        style={styles.input}
                        error={!!errors.lastName}
                        theme={{ colors: { primary: '#8A2BE2' } }}
                        maxLength={15}
                    />
                    {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

                    <TextInput
                        mode="outlined"
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        error={!!errors.email}
                        theme={{ colors: { primary: '#8A2BE2' } }}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <TextInput
                        mode="outlined"
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        error={!!errors.password}
                        theme={{ colors: { primary: '#8A2BE2' } }}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <TextInput
                        mode="outlined"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        style={styles.input}
                        error={!!errors.confirmPassword}
                        theme={{ colors: { primary: '#8A2BE2' } }}
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                    {uploading ? (
                        <ActivityIndicator size="large" color="#8A2BE2" style={styles.loadingIndicator} />
                    ) : (
                        <Button
                            mode="contained"
                            onPress={handleClientRegistration}
                            style={styles.button}
                            labelStyle={styles.buttonText}
                        >
                            Register
                        </Button>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ClientRegistrationScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#E6E6FA',
        padding: 20,
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#8A2BE2',
        marginBottom: 20,
        marginTop: 29,
    },
    input: {
        width: '100%',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#8A2BE2',
        padding: 10,
        width: '100%',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins_400Regular',
        fontSize: 18,
    },
    loadingIndicator: {
        marginTop: 20,
    },
});
