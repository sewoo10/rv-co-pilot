// This page displays information pertaining to a selected campsite.

import { View, Text, Image, Pressable, ScrollView, TextInput, Switch, Alert } from 'react-native'
import { styles, theme } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import { Campsites, getCampsiteDetails, editCampsite, deleteCampsite } from '../../api/tripCampsiteService'
import React, { useState, useEffect } from 'react'
import Spacer from '../../components/Spacer';


const EditCampsite =  () =>  {
  
  //============================
  // State
  //============================

  const [campsite, setCampsite] = useState<Campsites | null>(null)
  const campsite_id  = Number(useLocalSearchParams().campsite_id)
  const [campsite_name, setCampsiteName] = useState('')
  const [campsite_identifier, setIdentifier] = useState("")
  const [campsite_type, setCampsiteType] = useState('')
  const [cell_carrier, setCellCarrier] = useState('')
  const [cell_quality, setCellQuality] = useState('')
  const [nearby_recreation, setNearbyRecreation] = useState('')
  const [is_public, setIsPublic] = useState(false)
  const [dump_available, setDumpAvailable] = useState(false)
  const [electric_hookup_available, setElectricHookup] = useState(false)
  const [water_available, setWaterAvailable] = useState(false)
  const [restroom_available, setRestroomAvailable] = useState(false)
  const [shower_available, setShowerAvailable] = useState(false)
  const [pets_allowed, setPetsAllowed] = useState(false)
  const [wifi_available, setWifiAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)


  //===========================
  // Handlers
  //===========================
  const handleGetCampsite = async (campsite_id: number) => {
    try {
      const response = await getCampsiteDetails(campsite_id)
      setCampsite(response)
      setIsPublic(Boolean(response.is_public))
      setDumpAvailable(Boolean(response.dump_available))
      setElectricHookup(Boolean(response.electric_hookup_available))
      setWaterAvailable(Boolean(response.water_available))
      setRestroomAvailable(Boolean(response.restroom_available))
      setShowerAvailable(Boolean(response.shower_available))
      setPetsAllowed(Boolean(response.pets_allowed))
      setWifiAvailable(Boolean(response.wifi_available))

    } catch (error) {
     console.error("Failed to get user:", error)
    }
  };
   useEffect(() => {handleGetCampsite(campsite_id);}, []);

  
  const handleUpdateCampsite = async () => {
    try {

      if (!campsite) return

      const updatedData = {
        campsite_id,
        campsite_name: campsite_name || campsite!.campsite_name,
        latitude: campsite.latitude,
        longitude: campsite.longitude,
        campsite_type: campsite_type || campsite!.campsite_type,
        campsite_identifier,
        is_public,
        dump_available,
        electric_hookup_available,
        water_available,
        restroom_available,
        shower_available,
        pets_allowed,
        wifi_available,
        cell_carrier: cell_carrier || campsite.cell_carrier,
        cell_quality: Number(cell_quality) || campsite.cell_quality,
        nearby_recreation: nearby_recreation || campsite.nearby_recreation
      }

      await editCampsite(updatedData)
      Alert.alert('Edit Successful!', 'Your update is complete.', [{text: 'Continue'}])
      router.replace({ pathname: "/campsite", params: { campsite_id: campsite_id }})

    } catch (err) {
      setError("Failed to update campsite.")
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
          } catch (err) {
            setError("Failed to delete campsite.")
          }
        }
      }
    ]
  )
}
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
              <Text style={styles.h2}>Campsite Details</Text>
              <ScrollView>
              
                {/*Campsite Name Entry*/}
                <View style={styles.smallPanel}>
                  <Text style={[styles.listSub, {textAlign: 'left'}]}>Campsite Name: </Text>
                  <View style={styles.updateCampsiteForm}>
                    <TextInput style={styles.campsiteInput}
                        onChangeText={setCampsiteName}
                        autoCapitalize='none'
                        autoCorrect={false}
                        returnKeyType='next'
                        placeholder={campsite?.campsite_name}
                        placeholderTextColor={theme.COLORS.muted}
                    />
                  </View>
                </View>

                {/* Type */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Campsite Type:   </Text>
                  <View style={styles.updateCampsiteForm}>
                    <TextInput style={styles.campsiteInput}
                      onChangeText={setCampsiteType}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='next'
                      placeholder={campsite?.campsite_type || "N/A"}
                      placeholderTextColor={theme.COLORS.muted}
                    /> 
                  </View>
                </View>

                {/* Public */}
                <View style={styles.smallPanel}>
                  <Text style={[styles.listSub, {textAlign: 'left'}]}>Public: </Text>
                  <Switch style = {{marginLeft: 20}} value={is_public} onValueChange={setIsPublic}/>
                </View>

                {/* Dumpt */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Dump Facilities: </Text>
                  <Switch style = {{marginLeft: 20}} value={dump_available} onValueChange={setDumpAvailable}/>
                </View>

                {/* Electric */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Electric Hookup: </Text>
                  <Switch style = {{marginLeft: 20}} value={electric_hookup_available} onValueChange={setElectricHookup}/>
                </View>

                {/* Water */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Water Available:</Text>
                  <Switch style = {{marginLeft: 20}} value={water_available} onValueChange={setWaterAvailable}/>
                </View>

                {/* Restrooms */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Restrooms: </Text>
                  <Switch style = {{marginLeft: 20}} value={restroom_available} onValueChange={setRestroomAvailable}/>
                </View>

                {/* Shower */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Showers: </Text>
                  <Switch style = {{marginLeft: 20}} value={shower_available} onValueChange={setShowerAvailable}/>
                </View>

                {/* Pets */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Pets Allowed: </Text>
                  <Switch style = {{marginLeft: 20}} value={pets_allowed} onValueChange={setPetsAllowed}/>
                </View>

                {/* Wifi */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>WiFi: </Text>
                  <Switch style = {{marginLeft: 20}} value={wifi_available} onValueChange={setWifiAvailable}/>
                </View>

                {/* Cell Carrier */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Cell Carrier:           </Text>
                  <View style={styles.updateCampsiteForm}>
                    <TextInput style={styles.campsiteInput}
                      onChangeText={setCellCarrier}
                      autoCapitalize='none'
                      autoCorrect={false}
                      returnKeyType='next'
                      placeholder={campsite?.cell_carrier || "N/A"}
                      placeholderTextColor={theme.COLORS.muted}
                    />
                  </View>
                </View>

                {/* Cell Quality */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Cell Quality (0-5):  </Text>
                  <View style={styles.updateCampsiteForm}>
                    <TextInput style={styles.campsiteInput}
                      onChangeText={setCellQuality}
                      keyboardType="numeric"
                      returnKeyType='next'
                      placeholder={String(campsite?.cell_quality ?? "N/A")}
                      placeholderTextColor={theme.COLORS.muted}
                    />
                  </View>
                </View>

                  {/* Recreation */}
                  <View style={[styles.panel, {flexDirection: 'row' }, {margin: 5}]}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Nearby Recreation: </Text>
                    <View style={[styles.updateAccountForm, {flex: 1}]}>
                        <TextInput style={{flex: 1} }
                            onChangeText={setNearbyRecreation}
                            autoCapitalize='none'
                            autoCorrect={false}
                            returnKeyType='next'
                            placeholder={campsite?.nearby_recreation || "N/A"}
                            placeholderTextColor={theme.COLORS.muted}
                            textAlignVertical="top"
                            multiline
                            numberOfLines={5}
                        />
                    </View>
                </View>

              </ScrollView>                   
          </View>

          {/* Error message area */}
          {error && <Text style={{color:"red",textAlign:"center"}}>{error}</Text>}

          {/* Buttons */}
          <View style={styles.buttonRow}>

            <Pressable
              style={[styles.button, styles.buttonSmall]}
              onPress={handleUpdateCampsite}
            >
              <Text style={styles.buttonTextSmall}>Submit Changes</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSmall]}
              onPress={() =>
                router.push({
                  pathname: "/campsite",
                  params: { campsite_id: campsite_id }
                })
              }
            >
              <Text style={styles.buttonTextSmall}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSmall]}
              onPress={handleDeleteCampsite}
            >
              <Text style={styles.buttonTextSmall}>Delete</Text>
            </Pressable>

          </View>


        {/*Footer*/}
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
export default EditCampsite