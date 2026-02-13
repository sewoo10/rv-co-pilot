import { View, Text, Pressable, TextInput } from 'react-native'
import { styles, theme } from "../styles"
import { router } from 'expo-router'
import React from 'react'
import Spacer from '../components/Spacer';


const login = () => {
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
            <Text style={styles.h1}>Welcome back!</Text>
            <Spacer height={5} />
            <Text style={styles.caption}>Sign in to your account</Text>
            <Spacer height={32} />

            {/*Text Entry*/}
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
            <Spacer height={16} />
            <Pressable >
                <View style={styles.loginForm}>
                <TextInput
                    autoCapitalize='none'
                    autoComplete='password'
                    autoCorrect={false}
                    returnKeyType='done'
                    secureTextEntry
                    textContentType='password'
                    placeholder='Password'
                    placeholderTextColor={theme.COLORS.muted}
                />
                </View>
            </Pressable>
            <Spacer height={25} />

            {/*Buttons*/}
            <Pressable style={[styles.button, { width: 200}]}
                                        onPress={() => router.push('/(tabs)/login')}> {/*TODO: Add login.*/}
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Spacer height={25} />
            <Pressable style={[styles.button, {alignItems: 'center', width: 100}]}
                                        onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>Home</Text>
            </Pressable>
        </View>
      </View> 
    </View>
  )
}

export default login