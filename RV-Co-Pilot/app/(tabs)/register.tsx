import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React from 'react'

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
        <View style={styles.body}>
            <Text style={styles.h1}>Create Account</Text>
            <View style={styles.panel}>
                <Text style={styles.listSub}>Registration Form Placeholder</Text>   {/*TODO: Add register form.*/}
            </View>

            <TouchableOpacity style={[styles.button, { width: 200, marginVertical: 50,}]}
                                        onPress={() => router.push('/(tabs)/register')}> {/*TODO: Add login .*/}
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={[styles.button, { width: 100, marginVertical: 0,}]}
                                        onPress={() => router.push('/(tabs)/welcome')}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
        </View>
      </View> 
    </View>
  )
}

export default register