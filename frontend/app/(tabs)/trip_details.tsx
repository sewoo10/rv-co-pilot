// This page shows the user's selected trip's details

import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Pressable } from 'react-native'
import { styles } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { getTripDetails } from '../../api/tripCampsiteService'
import { api } from '../../api/axios'
import { deleteTrip } from '../../api/tripCampsiteService'

//============================
// Helper Functions
//============================

const formatDateForDisplay = (date: string) => {
  if (!date) return ""

  const parsed = new Date(date)
  const month = String(parsed.getMonth() + 1).padStart(2, "0")
  const day = String(parsed.getDate()).padStart(2, "0")
  const year = parsed.getFullYear()

  return `${month}-${day}-${year}`
}

const TripDetails = () => {

  //============================
  // Params and States
  //============================

  const { id } = useLocalSearchParams<{ id: string }>()
  const [trip, setTrip] = useState<any>(null)
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  //============================
  // Fetch Trips
  //============================

  useEffect(() => {

    const fetchData = async () => {

      try {

        if (!id) return

        const tripData = await getTripDetails(Number(id))
        setTrip(tripData)

        const entriesRes = await api.get(`/trips/${id}/entries`)
        setEntries(
          (entriesRes.data || []).map((entry: any) => ({
            ...entry,
            begin_date: formatDateForDisplay(entry.begin_date),
            end_date: formatDateForDisplay(entry.end_date)
          }))
        )

      } catch (error) {
        console.error("Failed to load trip:", error)
      } finally {
        setLoading(false)
      }

    }

    fetchData()

  }, [id])

  //============================
  // Delete Trip
  //============================

const handleDelete = () => {

  Alert.alert(
    "Delete Trip",
    "Are you sure you want to delete this trip?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            if (!id) return
            await deleteTrip(Number(id))
            router.push('/trip')
          } catch (error) {
            console.error("Failed to delete trip:", error)
          }
        }
      }
    ]
  )

}

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
          <Text style={styles.listTitle}>{trip?.trip_name}</Text>

          <ScrollView>
            {loading ? (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text>Loading trip...</Text>
              </View>
            ) : entries.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Text>No campsites added yet</Text>
              </View>
            ) : (
              entries.map((entry) => (
                <View key={entry.trip_entry_id} style={styles.panel}>
                  <Text style={styles.listSub}>{entry.campsite_name}</Text>
                  <Text>{entry.begin_date} → {entry.end_date}</Text>
                  {entry.notes && (
                    <Text>Notes: {entry.notes}</Text>
                  )}
                </View>
              ))
            )}
          </ScrollView>

        </View>

        {/*Footer*/}
        <View style={[styles.buttonRow, { justifyContent: "center", gap: 10 }]}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSmall, { width: 100 }]}
            onPress={() => router.push(`/edit_trip?id=${id}`)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSmall, { width: 100 }]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>

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

export default TripDetails