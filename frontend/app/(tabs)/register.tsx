import { View, Text, Pressable, TextInput, TouchableOpacity, ActivityIndicator, Alert} from 'react-native'
import { styles, theme } from "../styles"
import { router } from 'expo-router'
import React, {useState} from 'react'
import Spacer from '../../components/Spacer';
import { register } from '../../api/authService'

const Register = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

  
    const handleRegister = async () => {
        // Validate email and password fields
        if (!email || !password) {
        setError("Email and password are required")
        return
        }

        // Send register request and redirect to map after successful registrations
        try {
        setError(null)
        setLoading(true)
        const data = await register({ firstName, lastName, email, password })
        Alert.alert('Registration Successful!', 'Continue to home.', [{text: 'Continue'}])
        console.log(data)
        router.replace("/campsite_map") 
        } catch (err: any) {
        setError("Registration failed.")

        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.screen}>
        <View style={styles.phoneFrame}>
            
            {/*Logo*/}
            <View style={[styles.logoContainer, {marginVertical: 20}]}>       
                <Text style={styles.appTitleBig}>RV COPILOT</Text>
            </View>
            <View style = {styles.header_divider}/>

            {/*Body*/}
            <View style={[styles.body, {alignItems: 'center'}]}>
                <Text style={styles.h1}>Create Account</Text>
                <Spacer height={15} />

                {/*First Name Entry*/}
                <Pressable>
                    <View style={styles.loginForm}>
                    <TextInput style={styles.accountInput}
                        value={firstName}
                        onChangeText={setFirstName}
                        autoCapitalize='none'
                        autoComplete='given-name'
                        autoCorrect={false}
                        returnKeyType='next'
                        textContentType='givenName'
                        placeholder='First Name'
                        placeholderTextColor={theme.COLORS.muted}
                    />
                    </View>
                </Pressable>
                <Spacer height={15} />

                {/*Last Name Entry*/}
                <Pressable>
                    <View style={styles.loginForm}>
                    <TextInput style={styles.accountInput}
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize='none'
                        autoComplete='family-name'
                        autoCorrect={false}
                        returnKeyType='next'
                        textContentType='familyName'
                        placeholder='Last Name'
                        placeholderTextColor={theme.COLORS.muted}
                    />
                    </View>
                </Pressable>
                <Spacer height={15} />

                {/*Email Entry*/}
                <Pressable>
                    <View style={styles.loginForm}>
                    <TextInput style={styles.accountInput}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect={false}
                        keyboardType='email-address'
                        returnKeyType='next'
                        textContentType='username'
                        placeholder='Email'
                        placeholderTextColor={theme.COLORS.muted}
                    />
                    </View>
                </Pressable>
                <Spacer height={15} />

                {/*Password Entry*/}
                <Pressable>
                    <View style={styles.loginForm}>
                    <TextInput style={styles.accountInput}
                        value={password}
                        onChangeText={setPassword}
                        autoCapitalize='none'
                        autoComplete='password'
                        autoCorrect={false}
                        returnKeyType="done"
                        secureTextEntry
                        placeholder='Password'
                        placeholderTextColor={theme.COLORS.muted}
                    />
                    </View>
                </Pressable>
                <Spacer height={25} />


                {/*Buttons*/}
                <TouchableOpacity style={[styles.button, { width: 200}]}
                                            onPress={handleRegister}> 
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            
                <Spacer height={15} />
                <Text style={styles.caption}>Already have an account?
                <Text>  </Text>
                <Text style={[{color: 'blue'},{textDecorationLine: 'underline'} ]}
                               onPress={() => router.push('/login')}>Login</Text>
                </Text>

                {/*Error messages and loading icon*/}
                <Spacer height={15} />
                {error && (<Text style={{ color: "red" }}>{error}</Text>)}
                {loading && (<ActivityIndicator size='large' color={theme.COLORS.muted} />)}
                
            </View>
        </View> 
        </View>
    )
}

export default Register