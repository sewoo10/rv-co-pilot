// This page will show the nearby campsites in a map format

import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { useState } from 'react'
import Map from '../../components/Map'



const CampsiteMap = () => {
  
  const [mapRegion, setMapRegion] = useState ({  // TODO: Update with user location. Center map on Corvallis for now
    latitude: 44.56,
    longitude: -123.26,
    latitudeDelta: .1,
    longitudeDelta: .1,
  });

  const [campsites, setCampsites] = useState([  // TODO: Pull campsites from backend. Populate test markers for now
  {
    id: "1",
    latitude: 44.55,
    longitude: -123.23,
    title: "Test Campsite",
  },
  {
    id: "2",
    latitude: 44.53,
    longitude: -123.22,
    title: "Test Campsite 2",
  },
  {
    id: "3",
    latitude: 44.57,
    longitude: -123.24,
    title: "Test Campsite 3",
  },
  ]);

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