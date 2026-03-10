// This page will show the nearby campsites in a map format

import { View, Text, Image, Pressable } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import Map from '../../components/Map'
import { getNearbyCampsites } from '../../api/tripCampsiteService'



const CampsiteMap = () => {
  
  //============================
  // State
  //============================

  // Set map centerpoint and zoom level
  const [mapRegion, setMapRegion] = useState ({
    latitude: 44.25,
    longitude: -123.5,
    latitudeDelta: 1.75,
    longitudeDelta: 1.75,
  });

  const [campsites, setCampsites] = useState([]);

  // Retrieve nearby campsites from backend on page load
  useEffect(() => {
  const fetchCampsites = async () => {
    try {
      const data = await getNearbyCampsites(
        mapRegion.latitude,
        mapRegion.longitude
      );

      // Convert backend structure to map marker structuree
      const formattedCampsite = data.map((campsite) => ({
        id: campsite.campsite_id.toString(),
        latitude: Number(campsite.latitude),
        longitude: Number(campsite.longitude),
        title: campsite.campsite_name ?? "Unnamed Campsite",
      }));
      setCampsites(formattedCampsite);
      
    } catch (error) {
      console.error("Failed to fetch campsites:", error);
    }
  };
  fetchCampsites();}, []);

  //===========================
  // Handlers
  //===========================


  //===========================
  // Render Page
  //===========================
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
          <Text style={{ textAlign: "center", marginTop: 5 }}>
            Press and hold on the map to add a campsite
          </Text>
          <View style={[styles.container, {marginVertical: 10}]}>
              <Map region={mapRegion} campsites={campsites}/>
          </View>
        </View>

        <View style={styles.centerToggleWrap}>
          <Pressable style={[styles.button, styles.buttonSmall, { width: 120 }]}
              onPress={() => router.push({ pathname: "/campsite_list", 
              params: { latitude: mapRegion.latitude, longitude: mapRegion.longitude }})}>
            <Text style={styles.buttonText}>Campsites</Text>
          </Pressable>
        </View> 

        {/*Footer*/}
        <View style={styles.footer}>
          <Pressable style={styles.navBtn} onPress={() => router.push('/account')}>
            <Text style={styles.navBtnText}>Account</Text>
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => router.push('/trip')} >
              <Text style={styles.navBtnText}>Trips</Text>
          </Pressable>
          </View>        
        </View>
      </View>
  )
}

export default CampsiteMap