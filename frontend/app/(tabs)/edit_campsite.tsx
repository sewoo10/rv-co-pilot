// This page will allow the user to edit a campsite

import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { JSX } from 'react'

const EditCampsite = (): JSX.Element => {
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
          <Text style={styles.listTitle}>Edit Campsite</Text>
          <View style={styles.panel}>
            <Text style={styles.listSub}>Campsite Details Here</Text>   {/*NEED TO ADD WAY TO LIST CAMPSITE DETAILS*/}
          </View>
        </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
            <View style={[styles.button, styles.buttonSmall]}>
            <Text style={styles.navBtnText}>Confirm</Text>    {/*NEED TO ADD FUNCTION*/}
            </View>
            <View style={[styles.button, styles.buttonSmall]}>
            <Text style={styles.navBtnText}>Delete</Text>   {/*NEED TO ADD FUNCTION*/}
            </View>
        </View> 

        <View style={styles.footer}>
          <View style={styles.navBtn}>
            <Text style={styles.navBtnText}>Account</Text>    {/*NEED TO LINK ACCOUNT PAGE ONCE IT IS MADE*/}
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

export default EditCampsite