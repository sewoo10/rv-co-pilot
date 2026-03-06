// This page will show the nearby campsites in a map format

import { View, Text, Image, TouchableOpacity } from 'react-native'
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
  const [mapRegion, setMapRegion] = useState ({  // TODO: Update with user location. Center map on Corvallis for now
    latitude: 44.56,
    longitude: -123.26,
    latitudeDelta: .1,
    longitudeDelta: .1,
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

      console.log((formattedCampsite));
      setCampsites(formattedCampsite);
    } catch (error) {
      console.error("Failed to fetch campsites:", error);
    }
  };

  fetchCampsites();
}, []);

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
            <Text style={styles.headerTitle}>RV COPILOT</Text>
          </View>
        </View>

        {/*Body*/}
        <View style={styles.body}>
          <Text style={styles.listTitle}>Nearby Campsites</Text>
          <View style={[styles.container, {marginVertical: 10}]}>
              <Map region={mapRegion} campsites={campsites}/>
          </View>
        </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonSmall, { width: 90 }]}
              onPress={() => router.push('/campsite_list')}
            >
              <Text style={styles.buttonText}>List</Text>
            </TouchableOpacity>
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

export default CampsiteMap