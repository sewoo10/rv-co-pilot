// This page will show the user's selected trip's details

import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React from 'react'

const trip_details = () => {
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
          <Text style={styles.listTitle}>Trip A</Text>
          <View style={styles.panel}>
            <Text style={styles.listSub}>Trip details</Text>     {/*NEED TO ADD WAY TO LIST USER'S SAVED TRIP DETAILS*/}
          </View>
        </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall, { width: 100 }]}
            onPress={() => router.push('edit_trip')}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <View style={[styles.button, styles.buttonSmall, { width: 100 }]}>
            <Text style={styles.buttonText}>Delete</Text>   {/*NEED TO ADD FUNCTION*/}
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

export default trip_details