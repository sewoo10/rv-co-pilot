// This page displays information pertaining to a selected campsite.

import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { styles } from "../styles"
import { router, useLocalSearchParams } from 'expo-router'
import { Campsites, getCampsiteDetails } from '../../api/tripCampsiteService'
import React, { useState, useEffect, use } from 'react'

const Campsite =  () =>  {
  
  //============================
  // State
  //============================

  const [campsite, setCampsite] = useState<Campsites | null>(null)
  const campsite_id  = Number(useLocalSearchParams().campsite_id);

  const convertBool = (value: number | boolean | null | undefined) => {
    if (value === null || value === undefined) return "N/A";
    return value ? "Yes" : "No";
  };

  //===========================
  // Handlers
  //===========================
  const handleGetCampsite = async (campsite_id: number) => {
      try {
          const response = await getCampsiteDetails(campsite_id)
          setCampsite(response)
      } catch (error) {
          console.error("Failed to get user:", error)
      }
  };
   useEffect(() => {handleGetCampsite(campsite_id);}, []);

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
              <Text style={styles.h2}>Campsite Details</Text>
              <ScrollView>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Campsite Name: {campsite?.campsite_name || "N/A"}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Campsite Type: {campsite?.campsite_type || "N/A"}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Public: {convertBool(campsite?.is_public)}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Dump Facilites: {convertBool(campsite?.dump_available)}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Electric Hookup: {convertBool(campsite?.electric_hookup_available)}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Water Available: {convertBool(campsite?.water_available)}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Restrooms Available: {convertBool(campsite?.restroom_available)}</Text>
                </View>
                                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Shower Available: {convertBool(campsite?.shower_available)}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Wifi Available: {convertBool(campsite?.wifi_available)}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Cell Carrier: {campsite?.cell_carrier || "N/A"}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Cell Quality: {campsite?.cell_quality || "N/A"}</Text>
                </View>
                <View style={[styles.panel, {flexDirection: 'row' }, {margin: 5}]}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Nearby Recreation: {campsite?.nearby_recreation || "N/A"}</Text>
                </View>  
              </ScrollView>                   
          </View>

        {/*Footer*/}
        <View style={styles.centerToggleWrap}>
            <View style={[styles.button, styles.buttonSmall]}>
            <Text style={styles.navBtnText}>Edit</Text>   
            </View>

        </View> 

        <View style={styles.footer}>
          <View style={styles.navBtn}>
            <Text style={styles.navBtnText}>Account</Text>    
          </View>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => router.push('/campsite_map')}
            >
              <Text style={styles.navBtnText}>Campsites</Text>
            </TouchableOpacity>
          </View>        
        </View>
      </View>
  )
}
export default Campsite