// This page allows the user to create a trip

import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { createTrip, addCampsiteToTrip } from '../../api/tripCampsiteService'
import { Picker } from '@react-native-picker/picker'
import { getCampsites } from '../../api/tripCampsiteService'

  //============================
  // Helper Functions
  //============================

const CreateTrip = () => {

const formatDateForAPI = (date: string) => {
  if (!date) return ""
  const [month, day, year] = date.split("-")
  return `${year}-${month}-${day}`
}

  //============================
  // State
  //============================

  const [campsites, setCampsites] = useState([])
  const [tripName, setTripName] = useState("")
  const [entries, setEntries] = useState([
    { campsite_id: "", begin_date: "", end_date: "", notes: "" }
  ])
  
  //============================
  // Handlers
  //============================

  const addEntry = () => {
    setEntries([
      ...entries,
      { campsite_id: "", begin_date: "", end_date: "", notes: "" }
    ])
  }

  const removeEntry = (index: number) => {
    const updated = [...entries]
    updated.splice(index, 1)
    setEntries(updated)
  }

  const updateEntry = (index: number, field: string, value: string) => {
    const updated = [...entries]
    updated[index][field] = value
    setEntries(updated)
  }

  //============================
  // Create Trip
  //============================

  const handleCreate = async () => {
    try {
      if (!tripName.trim()) {
        alert("Trip name required")
        return
      }
      const trip = await createTrip({
        trip_name: tripName
      })
      const tripId = trip.trip_id

      // add campsite entries
      for (const entry of entries) {
        if (!entry.campsite_id) continue
        await addCampsiteToTrip(tripId, {
          campsite_id: Number(entry.campsite_id),
          begin_date: formatDateForAPI(entry.begin_date),
          end_date: formatDateForAPI(entry.end_date),
          notes: entry.notes
        })
      }

      router.push('/trip')
    } catch (error) {
      console.error("Failed to create trip:", error)
    }
  }

  //============================
  // Fetch campsite list
  //============================

  useEffect(() => {

    const loadCampsites = async () => {
      try {
        const data = await getCampsites()
        setCampsites(data)
      } catch (error) {
        console.error("Failed to load campsites:", error)
      }
    }

    loadCampsites()

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
          <Text style={styles.listTitle}>Create Trip</Text>

          <ScrollView>
            <View style={styles.panel}>
              <Text style={styles.listSub}>Trip Name</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  padding: 10,
                  marginTop: 10
                }}
                value={tripName}
                onChangeText={setTripName}
                placeholder="Enter trip name"
              />
            </View>
            {entries.map((entry, index) => (
              <View key={index} style={styles.panel}>
                <Text style={styles.listSub}>Campsite Name</Text>
                <Picker
                  selectedValue={entry.campsite_id}
                  onValueChange={(value) => updateEntry(index, "campsite_id", value)}
                >
                  <Picker.Item label="Select Campsite" value="" />
                  {campsites.map((site) => (
                    <Picker.Item
                      key={site.campsite_id}
                      label={site.campsite_name}
                      value={site.campsite_id}
                    />
                  ))}
                </Picker>
                <Text style={styles.listSub}>Begin Date</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: "#ccc", padding: 8 }}
                  value={entry.begin_date}
                  onChangeText={(text) => updateEntry(index, "begin_date", text)}
                  placeholder="MM-DD-YYYY"
                />
                <Text style={styles.listSub}>End Date</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: "#ccc", padding: 8 }}
                  value={entry.end_date}
                  onChangeText={(text) => updateEntry(index, "end_date", text)}
                  placeholder="MM-DD-YYYY"
                />
                <Text style={styles.listSub}>Notes</Text>
                <TextInput
                  style={{ borderWidth: 1, borderColor: "#ccc", padding: 8 }}
                  value={entry.notes}
                  onChangeText={(text) => updateEntry(index, "notes", text)}
                  placeholder="Optional notes"
                />
                <TouchableOpacity
                  onPress={() => removeEntry(index)}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: "red" }}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={addEntry}
            >
              <Text style={styles.buttonText}>Add Campsite</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={handleCreate}
          >
            <Text style={styles.buttonText}>Create Trip</Text>
          </TouchableOpacity>
        </View> 

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/account')}
          >
            <Text style={styles.navBtnText}>Account</Text>
          </TouchableOpacity>

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

export default CreateTrip