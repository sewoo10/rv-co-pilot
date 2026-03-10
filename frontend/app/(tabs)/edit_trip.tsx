// This page allows the user to edit a trip

import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert, Pressable } from 'react-native'
import { styles } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import {
  getTripDetails,
  editTrip,
  deleteTrip,
  getTripEntries,
  getCampsites,
  addCampsiteToTrip,
  removeCampsiteFromTrip,
  updateTripEntry
} from '../../api/tripCampsiteService'

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

const formatDateForAPI = (date: string) => {
  if (!date) return ""

  // if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  // if MM-DD-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const [month, day, year] = date.split("-")
    return `${year}-${month}-${day}`
  }

  // if "Wed Jan 01 2025"
  const parsed = new Date(date)

  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear()
    const month = String(parsed.getMonth() + 1).padStart(2, "0")
    const day = String(parsed.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  return date
}

const EditTrip = () => {

  //============================
  // Params and States
  //============================

  const { id } = useLocalSearchParams<{ id: string }>()
  const [tripName, setTripName] = useState("")
  const [entries, setEntries] = useState<any[]>([])
  const [campsites, setCampsites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  //============================
  // Load trip and entries
  //============================

  useEffect(() => {

    const loadData = async () => {
      try {
        if (!id) return

        const trip = await getTripDetails(Number(id))
        setTripName(trip.trip_name)

        const entryData = await getTripEntries(Number(id))
        setEntries(
          (entryData || []).map((entry: any) => ({
            ...entry,
            begin_date: formatDateForDisplay(entry.begin_date),
            end_date: formatDateForDisplay(entry.end_date)
          }))
        )

        const campsiteData = await getCampsites()
        setCampsites(campsiteData)

      } catch (error) {
        console.error("Failed loading trip:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  //============================
  // Entry handlers
  //============================

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...entries]
    updated[index][field] = value
    setEntries(updated)
  }

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        trip_entry_id: null,
        campsite_id: "",
        begin_date: "",
        end_date: "",
        notes: ""
      }
    ])
  }

  const removeEntry = async (index: number) => {
    const entry = entries[index]

    if (entry.trip_entry_id) {
      await removeCampsiteFromTrip(Number(id), entry.trip_entry_id)
    }

    const updated = [...entries]
    updated.splice(index, 1)
    setEntries(updated)
  }

  //============================
  // Save changes
  //============================

  const handleConfirm = async () => {
    try {

      if (!tripName.trim()) {
        alert("Trip name required")
        return
      }

      // update trip name
      await editTrip(Number(id), {
        trip_name: tripName
      })

      // process campsite entries
      for (const entry of entries) {

        if (!entry.campsite_id) continue

        // prevent invalid requests
        if (!entry.begin_date || !entry.end_date) {
          Alert.alert("Invalid entry", "Begin and end dates are required for each campsite.")
          return
        }

        const payload = {
          campsite_id: Number(entry.campsite_id),
          begin_date: formatDateForAPI(entry.begin_date),
          end_date: formatDateForAPI(entry.end_date),
          notes: entry.notes || ""
        }

        // update existing entry
        if (entry.trip_entry_id) {
          await updateTripEntry(
            Number(id),
            entry.trip_entry_id,
            payload
          )
        }

        // create new entry
        else {
          await addCampsiteToTrip(
            Number(id),
            payload
          )
        }
      }

      Alert.alert(
        "Edit Successful!",
        "Your trip update is complete.",
        [
          {
            text: "Continue",
            onPress: () =>
              router.replace({
                pathname: "/trip_details",
                params: { id: id }
              })
          }
        ]
      )

    } catch (error) {
      console.error("Failed to update trip:", error)
    }
  }

  const handleDelete = async () => {
    try {
      Alert.alert(
        "Are you sure you want to delete this trip?",
        "This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteTrip(Number(id))
              router.replace('/trip')
            }
          }
        ]
      )

    } catch (error) {
      console.error("Failed to delete trip:", error)
    }
  }

  const handleCancel = () => {
    Alert.alert(
      "Cancel Edits",
      "Are you sure you want to discard your changes?",
      [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () =>
            router.replace({
              pathname: "/trip_details",
              params: { id: id }
            })
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
          <Text style={styles.listTitle}>Edit Trip</Text>

          <ScrollView>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <>
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
                  />
                </View>
                {entries.map((entry, index) => (
                  <View key={index} style={styles.panel}>
                    <Text style={styles.listSub}>Campsite</Text>
                    <Picker
                      selectedValue={entry.campsite_id}
                      onValueChange={(value) =>
                        updateEntry(index, "campsite_id", value)
                      }
                    >
                      <Picker.Item label="Select Campsite" value="" />
                      {campsites.map((site: any) => (
                        <Picker.Item
                          key={site.campsite_id}
                          label={site.campsite_name}
                          value={site.campsite_id}
                        />
                      ))}
                    </Picker>
                    <Text style={styles.listSub}>Begin Date</Text>
                    <TextInput
                      value={entry.begin_date}
                      onChangeText={(text) =>
                        updateEntry(index, "begin_date", text)
                      }
                      placeholder="MM-DD-YYYY"
                    />
                    <Text style={styles.listSub}>End Date</Text>
                    <TextInput
                      value={entry.end_date}
                      onChangeText={(text) =>
                        updateEntry(index, "end_date", text)
                      }
                      placeholder="MM-DD-YYYY"
                    />
                    <Text style={styles.listSub}>Notes</Text>
                    <TextInput
                      value={entry.notes}
                      onChangeText={(text) =>
                        updateEntry(index, "notes", text)
                      }
                      placeholder="Optional notes"
                    />
                    <TouchableOpacity
                      onPress={() => removeEntry(index)}
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
              </>
            )}
          </ScrollView>
        </View>

        {/*Footer*/}
        <View style={[styles.buttonRow, { justifyContent: "center", gap: 10, flexWrap: "wrap" }]}>

          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonTextSmall}>Submit Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonTextSmall}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonTextSmall}>Delete</Text>
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

export default EditTrip
