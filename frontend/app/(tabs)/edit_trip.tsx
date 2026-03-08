// This page allows the user to edit a trip

import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { styles } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import {
  getTripDetails,
  createEditTrip,
  deleteTrip,
  getTripEntries,
  addTripEntry,
  deleteTripEntry,
  getCampsites
} from '../../api/tripCampsiteService'

  //============================
  // Helper Functions
  //============================

const formatDateForAPI = (date: string) => {
  if (!date) return ""
  const [month, day, year] = date.split("-")
  return `${year}-${month}-${day}`
}

const EditTrip = () => {

  //============================
  // Params and States
  //============================

  const { id } = useLocalSearchParams<{ id: string }>()
  const [tripName, setTripName] = useState("")
  const [entries, setEntries] = useState<any[]>([])
  const [campsites, setCampsites] = useState([])
  const [loading, setLoading] = useState(true)

  //============================
  // Load trip + entries
  //============================

  useEffect(() => {

    const loadData = async () => {
      try {
        if (!id) return

        const trip = await getTripDetails(Number(id))
        setTripName(trip.trip_name)

        const entryData = await getTripEntries(Number(id))
        setEntries(entryData)

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
      { trip_entry_id: null, campsite_id: "", begin_date: "", end_date: "", notes: "" }
    ])
  }

  const removeEntry = async (index: number) => {
    const entry = entries[index]
    if (entry.trip_entry_id) {
      await deleteTripEntry(Number(id), entry.trip_entry_id)
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
      await createEditTrip({
        trip_id: Number(id),
        trip_name: tripName
      })

      // rebuild entries
      for (const entry of entries) {

        if (!entry.campsite_id) continue

        const payload = {
          campsite_id: Number(entry.campsite_id),
          begin_date: formatDateForAPI(entry.begin_date),
          end_date: formatDateForAPI(entry.end_date),
          notes: entry.notes
        }

        // if entry existed, remove it first
        if (entry.trip_entry_id) {
          await deleteTripEntry(Number(id), entry.trip_entry_id)
        }

        // add the updated entry
        await addTripEntry(Number(id), payload)

      }

      router.push(`/trip_details?id=${id}`)

    } catch (error) {
      console.error("Failed to update trip:", error)
    }

  }
  const handleDelete = async () => {
    try {
      await deleteTrip(Number(id))
      router.push('/trip')
    } catch (error) {
      console.error("Failed to delete trip:", error)
    }
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
            <Text style={styles.headerTitle}>RV COPILOT</Text>
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
        <View style={styles.centerToggleWrap}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSmall]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete</Text>
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

export default EditTrip
