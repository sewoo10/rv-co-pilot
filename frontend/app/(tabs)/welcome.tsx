import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React from 'react'

const welcome = () => {
  return (
    <View style={styles.screen}>
      
      <View style={styles.phoneFrame}>
        
        {/*Logo*/}
        <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/logo.png")} style={styles.logoImage}/>        
            <Text style={styles.appTitleBig}>RV COPILOT</Text>
        </View>

        {/*Body*/}
        <View style={styles.body}>
          
          <TouchableOpacity style={[styles.button, { width: 200, marginVertical: 50,}]}
                                    onPress={() => router.push('/(tabs)/login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { width: 200,}]}
                                    onPress={() => router.push('/(tabs)/register')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text style={[styles.h2, {marginVertical:50}]}>Because every road trip needs a co-pilot.</Text>
        </View>
      </View> 

    </View>
  )
}

export default welcome