import { View, Text, Pressable, TextInput, TouchableOpacity } from 'react-native'
import { styles, theme } from "../styles"
import { router } from 'expo-router'
import React from 'react'
import Spacer from '../components/Spacer';

const register = () => {
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

            {/*Text Entry*/}
            <Pressable>
                <View style={styles.loginForm}>
                <TextInput
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
            <Pressable>
                <View style={styles.loginForm}>
                <TextInput
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
            <Pressable>
                <View style={styles.loginForm}>
                <TextInput
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
            <Pressable>
                <View style={styles.loginForm}>
                <TextInput 
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

            <TouchableOpacity style={[styles.button, { width: 200}]}
                                        onPress={() => router.push('/(tabs)/register')}> {/*TODO: Add login.*/}
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={[styles.button, { width: 100, marginVertical: 0,}]}
                                        onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
            <Spacer height={15} />
            <Text style={styles.caption}>Already have an account? Login.</Text>

        </View>
      </View> 
    </View>
  )
}

export default register