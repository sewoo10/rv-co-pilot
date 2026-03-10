// This page shows the user's trips in a list view where they can click on a trip to access trip_details page

import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { getTrips, Trips } from '../../api/tripCampsiteService'

const Trip = () => {

  //============================
  // State
  //============================

  const [trips, setTrips] = useState<Trips[]>([])
  const [loading, setLoading] = useState(true)

  //============================
  // Fetch Trips
  //============================

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getTrips()
        setTrips(data)
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  //============================
  // Render
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
          <Text style={styles.listTitle}>Trips</Text>

          <ScrollView>
            {loading ? (
              <Text>Loading trips...</Text>
            ) : trips.length === 0 ? (
              <Text>No trips created yet.</Text>
            ) : (
              trips.map((trip) => (
                <TouchableOpacity
                  key={trip.trip_id}
                  style={styles.panel}
                  onPress={() => router.push(`/trip_details?id=${trip.trip_id}`)}
                >
                  <Text style={styles.listSub}>{trip.trip_name}</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
          
        </View>

        {/*Footer*/}
        <View style={styles.footer}>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/account')}
          >
            <Text style={styles.navBtnText}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/campsite_map')}
          >
            <Text style={styles.navBtnText}>Map</Text>
          </TouchableOpacity>

        </View>     
        </View>
      </View>
  )
}

export default Trip