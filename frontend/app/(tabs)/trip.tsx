// This page will show the user's trips in a list view where they can click on a trip to access trip_details page

import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { JSX } from 'react'

const Trip = (): JSX.Element => {
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
          <Text style={styles.listTitle}>Trips</Text>
          <View style={styles.panel}>
            <Text style={styles.listSub}>Trip A</Text>          {/*NEED TO ADD WAY TO LIST USER'S SAVED TRIPS*/}
          </View>
        </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
          <TouchableOpacity 
            style={[styles.button, styles.buttonSmall, { width: 100 }]}
            onPress={() => router.push('/create_trip')}
          >
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View> 

        <View style={styles.footer}>
          <View style={styles.navBtn}>
            <Text style={styles.navBtnText}>Account</Text>     {/*NEED TO LINK ACCOUNT PAGE ONCE IT IS MADE*/}
          </View>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/campsite_map')}
            >
              <Text style={styles.navBtnText}>Campsites</Text>
            </TouchableOpacity>
          </View>        
        </View>
      </View>
  )
}

export default Trip