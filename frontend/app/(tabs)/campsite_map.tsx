// This page will show the nearby campsites in a map format

import { View, Text, Image, TouchableOpacity } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { useState, JSX } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE }  from 'react-native-maps';


const CampsiteMap = (): JSX.Element => {
  const [mapRegion, setMapRegion] = useState ({
    latitude: 44.56,
    longitude: -123.26,
    latitudeDelta: .1,
    longitudeDelta: .1,
  });

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
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={mapRegion}>
              <Marker coordinate={{latitude: 44.52, longitude: -123.25,}}
              pinColor='green'
              title="test"
              />
            </MapView>
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