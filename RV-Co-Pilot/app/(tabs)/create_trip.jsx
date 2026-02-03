// This page will allow the user to create a trip

import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React from 'react'

const create_trip = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.phoneFrame}>
        
        {/*Header*/}
        <View style={styles.header}>
          <Image source={require("../../assets/images/logo.png")} style={styles.headerLeftIcon}/>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>RV COPILOT</Text>
          </View>
        </View>

        {/*Body*/}
        <View style={styles.body}>
          <Text style={styles.listTitle}>Create Trip</Text>
          <View style={styles.panel}>
            <Text style={styles.listSub}>Trip Details Here</Text>   {/*NEED TO ADD USER FILL-IN*/}
          </View>
        </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
            <View style={[styles.button, styles.buttonSmall]}>
            <Text style={styles.navBtnText}>Add</Text>    {/*NEED TO ADD FUNCTION*/}
            </View>
        </View> 

        <View style={styles.footer}>
          <View style={styles.navBtn}>
          <Text style={styles.navBtnText}>Account</Text>    {/*NEED TO LINK ACCOUNT PAGE ONCE IT IS MADE*/}
          </View>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/trip')}  
            >
              <Text style={styles.navBtnText}>Trips</Text>
            </TouchableOpacity>
          </View>        
        </View>

    </View>
  )
}

export default create_trip