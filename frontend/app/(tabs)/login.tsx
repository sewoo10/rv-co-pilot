import { View, Text, Pressable, TextInput } from 'react-native'
import { styles, theme } from "../styles"
import { router } from 'expo-router'
import React, { useState } from 'react'
import Spacer from '../../components/Spacer'
import { login } from '../api/authService'


const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
      // Validate email and password fields
      if (!email || !password) {
        setError("Please enter email and password")
        return
      }

      // Send login request and redirect to home after successful login
      try {
        setError(null)
        const data = await login({ email, password })
        router.replace('/') 

      } catch (err: any) {
        setError("Invalid email or password")
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
              <Text style={styles.h1}>Welcome back!</Text>
              <Spacer height={5} />
              <Text style={styles.caption}>Sign in to your account</Text>
              <Spacer height={32} />

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
              <Spacer height={16} />

              {/*Password Entry*/}
              <Pressable >
                  <View style={styles.loginForm}>
                  <TextInput style={styles.accountInput}
                      value={password}
                      onChangeText={setPassword}
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

              {/*Error messages*/}
              {error && (<Text style={{ color: "red" }}>{error}</Text>)}
              
              {/*Buttons*/}
              <Pressable style={[styles.button, { width: 200}]}
                                          onPress={handleLogin}>
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

export default Login