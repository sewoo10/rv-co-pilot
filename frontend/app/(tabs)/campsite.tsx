import { View, Text, Image, Pressable, ScrollView, Alert } from 'react-native'
import { styles } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import { Campsites, getCampsiteDetails, deleteCampsite } from '../../api/tripCampsiteService'
import React, { useState, useEffect } from 'react'

const Campsite = () => {

  const [campsite, setCampsite] = useState<Campsites | null>(null)
  const campsite_id = Number(useLocalSearchParams().campsite_id)

  const convertBool = (value: number | boolean | null | undefined) => {
    if (value === null || value === undefined) return "N/A"
    return value ? "Yes" : "No"
  }

  const handleGetCampsite = async (campsite_id: number) => {
    try {
      const response = await getCampsiteDetails(campsite_id)
      setCampsite(response)
    } catch (error) {
      console.error("Failed to get user:", error)
    }
  }

  const handleDeleteCampsite = async () => {
  Alert.alert(
    "Delete Campsite",
    "Are you sure you want to delete this campsite?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCampsite(campsite_id)
            router.replace('/campsite_map')
          } catch (error) {
            console.error("Failed to delete campsite:", error)
          }
        }
      }
    ]
  )
}

  useEffect(() => {
    handleGetCampsite(campsite_id)
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.phoneFrame}>

        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.headerLeftIcon}
          />
          <View style={styles.headerTitleWrap}>
            <Text style={styles.appTitleSmall}>RV COPILOT</Text>
          </View>
        </View>

        <View style={[styles.body, { flex: 1 }]}>
          <Text style={styles.h2}>Campsite Details</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Campsite Name: {campsite?.campsite_name || "N/A"}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Campsite Type: {campsite?.campsite_type || "N/A"}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Public: {convertBool(campsite?.is_public)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Dump Facilites: {convertBool(campsite?.dump_available)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Electric Hookup: {convertBool(campsite?.electric_hookup_available)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Water Available: {convertBool(campsite?.water_available)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Restrooms Available: {convertBool(campsite?.restroom_available)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Shower Available: {convertBool(campsite?.shower_available)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Wifi Available: {convertBool(campsite?.wifi_available)}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Cell Carrier: {campsite?.cell_carrier || "N/A"}
              </Text>
            </View>

            <View style={styles.smallPanel}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Cell Quality: {campsite?.cell_quality || "N/A"}
              </Text>
            </View>

            <View style={[styles.panel, { flexDirection: 'row', margin: 5 }]}>
              <Text style={[styles.listSub, { textAlign: 'left' }]}>
                Nearby Recreation: {campsite?.nearby_recreation || "N/A"}
              </Text>
            </View>

          </ScrollView>
        </View>

        <View style={[styles.centerToggleWrap, { flexDirection: "row", justifyContent: "center", gap: 10 }]}>
          <Pressable
            style={[styles.button, styles.buttonSmall]}
            onPress={() =>
              router.push({
                pathname: "/edit_campsite",
                params: { campsite_id: campsite_id }
              })
            }
          >
            <Text style={styles.buttonText}>Edit</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.buttonSmall]}
            onPress={handleDeleteCampsite}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
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

export default Campsite