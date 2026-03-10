// This page shows the nearby campsites in a map format

import { View, Text, Image, Pressable } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import Map from '../../components/Map'
import { getNearbyCampsites } from '../../api/tripCampsiteService'
import * as Location from "expo-location"


const CampsiteMap = () => {
  
  //============================
  // State
  //============================

  // Set map centerpoint and zoom level
  const [mapRegion, setMapRegion] = useState({
    latitude: 44.25,
    longitude: -123.5,
    latitudeDelta: 1.75,
    longitudeDelta: 1.75,
  });

  const [campsites, setCampsites] = useState([]);

  // Prevents map rendering before user's location is retrieved
  const [locationReady, setLocationReady] = useState(false);

  // Updates map region and reloads campsites after map movement
  const handleRegionChange = async (region) => {
    setMapRegion(region);

    const data = await getNearbyCampsites(
      region.latitude,
      region.longitude
    );

    const formatted = data.map((c) => ({
      id: c.campsite_id.toString(),
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
      title: c.campsite_name ?? "Unnamed Campsite",
    }));
    setCampsites(formatted);
  };

  // On initial load: request location permission, center the map, and load nearby campsites
  useEffect(() => {
    const loadMapData = async () => {
      try {

        // Ask for permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocationReady(true);

        // Update map region
        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 1.75,
          longitudeDelta: 1.75,
        });

        // Fetch nearby campsites
        const data = await getNearbyCampsites(latitude, longitude);

        const formattedCampsite = data.map((campsite) => ({
          id: campsite.campsite_id.toString(),
          latitude: Number(campsite.latitude),
          longitude: Number(campsite.longitude),
          title: campsite.campsite_name ?? "Unnamed Campsite",
        }));

        setCampsites(formattedCampsite);

        // Defaults to Corvallis if user location unavailable
      } catch (error) {
        console.error("Failed to load map data:", error)
        setLocationReady;
      }
    };

    loadMapData();
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
            {locationReady ? (
              <Map
                region={mapRegion}
                campsites={campsites}
                onRegionChange={handleRegionChange}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                Loading map...
              </Text>
            )}
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