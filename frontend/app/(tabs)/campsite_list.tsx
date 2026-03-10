// This page will show the nearby campsites in a list format

import { View, Text, Image, Pressable, ScrollView } from 'react-native'
import { styles } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { getNearbyCampsites } from '../../api/tripCampsiteService'


const CampsiteList = () => {

  //============================
  // State
  //============================
  const [campsites, setCampsites] = useState([]);
  const latitude = Number(useLocalSearchParams().latitude)
  const longitude = Number(useLocalSearchParams().longitude)

  // Retrieve nearby campsites from backend on page load
  useEffect(() => {
  const fetchCampsites = async () => {
    try {
      const data = await getNearbyCampsites( latitude, longitude );
      setCampsites(data);
    } catch (error) {
      console.error("Failed to fetch campsites:", error);
    }
  };
  fetchCampsites();}, []);

  //============================
  // Render Page
  //============================

  return (
        <View style={styles.screen}>
        <View style={styles.phoneFrame}>
            
            {/*Header*/}
            <View style={styles.header}>
            <Image source={require("../../assets/images/logo.png")} style={styles.headerLeftIcon}/>
            <View style={styles.headerTitleWrap}>
                <Text style={styles.appTitleSmall}>RV COPILOT</Text>
            </View>
            </View>

        {/*Body*/}
        <View style={styles.body}>
          <Text style={styles.listTitle}>Nearby Campsites</Text>
          <ScrollView style={[styles.panel, {marginVertical: 10}]}>
            {campsites.map((campsite) => (
              <Pressable key={campsite.campsite_id} style={[styles.campsitePanel, {marginVertical: 4}]}
                onPress={() => router.push({ pathname: "/campsite", params: { campsite_id: campsite.campsite_id }})}>
                <Text style={styles.listSub}>
                  {campsite.campsite_name ?? "Unnamed Campsite"}
                </Text>
              </Pressable> ))}
          </ScrollView>
        </View>

        {/*Footer*/}      
        <View style={styles.footer}>

          <Pressable
            style={styles.navBtn}
            onPress={() => router.push('/account')}
          >
            <Text style={styles.navBtnText}>Account</Text>
          </Pressable>

          <Pressable
            style={styles.navBtn}
            onPress={() => router.push('/campsite_map')}
          >
            <Text style={styles.navBtnText}>Map</Text>
          </Pressable>

          <Pressable
            style={styles.navBtn}
            onPress={() => router.push('/trip')}
          >
            <Text style={styles.navBtnText}>Trips</Text>
          </Pressable>

        </View>
              
        </View>
    </View>
  )
}
export default CampsiteList