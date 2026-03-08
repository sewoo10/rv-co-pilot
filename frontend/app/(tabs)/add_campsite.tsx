// This page will allow the user to edit a campsite

import { View, Text, Image, Pressable, ScrollView, TextInput, Switch, Alert } from 'react-native'
import { styles, theme } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState, useEffect} from 'react'
import { Campsites, createCampsite } from '../../api/tripCampsiteService'
import Spacer from '../../components/Spacer';


const AddCampsite  =  () =>  {
 
  //============================
  // State
  //============================

  const latitude = Number(useLocalSearchParams().latitude)
  const longitude = Number(useLocalSearchParams().longitude)
  const campsite_identifier = ""
  const [campsite_name, setCampsiteName] = useState('')
  const [campsite_type, setCampsiteType] = useState('')
  const [cell_carrier, setCellCarrier] = useState('')
  const [cell_quality, setCellQuality] = useState(0)
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
  
  const handleCreateCampsite = async () => {
    
    // Validate required fields
    if (!campsite_name || !campsite_type) {
      setError("Campsite name and type are required.")
      return
    }
    try {
      const campsiteData = {
        campsite_name,
        latitude: latitude,
        longitude: longitude,
        campsite_type: campsite_type,
        campsite_identifier,
        is_public,
        dump_available,
        electric_hookup_available,
        water_available,
        restroom_available,
        shower_available,
        pets_allowed,
        wifi_available,
        cell_carrier,
        cell_quality: cell_quality ? Number(cell_quality) : null,
        nearby_recreation
      }

      await createCampsite(campsiteData)
      Alert.alert(' Success!', 'Your campsite has been added.', [{text: 'Continue'}])
      router.replace('/campsite_map')

    } catch (err) {
      setError("Failed to create campsite.")
    }
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
            <Text style={styles.headerTitle}>RV COPILOT</Text>
          </View>
        </View>

          {/*Body*/}
          <View style={styles.body}>
              <Text style={styles.h2}>Add Campsite Details</Text>
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
                        placeholder={"Campsite Name"}
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
                      placeholder={ "RV, Tent, Backcountry, etc"}
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
                      placeholder={"Carrier"}
                      placeholderTextColor={theme.COLORS.muted}
                    />
                  </View>
                </View>

                {/* Cell Quality */}
                <View style={styles.smallPanel}>
                  <Text style={styles.listSub}>Cell Quality (0-5):  </Text>
                  <View style={styles.updateCampsiteForm}>
                    <TextInput style={styles.campsiteInput}
                      onChangeText={(text) => setCellQuality(Number(text))}
                      keyboardType="numeric"
                      returnKeyType='next'
                      placeholder={"0"}
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
                            placeholder={"Nearby Recreation"}
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
              <Pressable style={[styles.button, styles.buttonSmall]} onPress={handleCreateCampsite}>
                  <Text style={styles.buttonTextSmall}>Add</Text>
              </Pressable>

              <Pressable style={[styles.button, styles.buttonSmall]}
                  onPress={() => router.push('/campsite_map')}>
                  <Text style={styles.buttonTextSmall}>Cancel</Text>
              </Pressable>
          </View>
          <Spacer height={15} />


        {/*Footer*/}

        <View style={styles.footer}>
          <View style={styles.navBtn}>
            <Text style={styles.navBtnText}>Account</Text>    
          </View>
          <Pressable style={styles.navBtn} onPress={() => router.push('/campsite_map')}>
            <Text style={styles.navBtnText}>Campsites</Text>
          </Pressable>
          </View>      
        </View>

      </View>

  )
}
export default AddCampsite