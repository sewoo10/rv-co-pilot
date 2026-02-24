// This page displays the information associated with the user's account.

import { View, Text, Image, Pressable} from 'react-native'
import { styles } from "../styles"
import { router } from 'expo-router'
import React, {useEffect, useState} from 'react'
import { getUser } from '../api/userService'
import type { GetUserResponse } from '../api/userService'  


const Account = () => {

    //============================
    // State
    //============================

    const [user, setUser] = useState<GetUserResponse | null>(null)
    const user_id = 6; // TODO: Replace hardcoded test user ID with user ID for logged-in user


    //===========================
    // Handlers
    //===========================
    const handleGetUser = async () => {
        try {
            const response = await getUser(user_id);  // TODO: Replace hardcoded test user ID with user ID for logged-in user
            setUser(response);
        } catch (error) {
            console.error("Failed to get user:", error);
        }
    };
    useEffect(() => {handleGetUser();}, []);

    
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
                <Text style={styles.h2}>Account Details</Text>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>First Name: {user?.first_name || ""}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Last Name: {user?.last_name || ""}</Text>
                </View>
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Email: {user?.email || ""}</Text>
                </View>
                <View style={[styles.panel, {flexDirection: 'row' }, {margin: 5}]}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Bio: {user?.bio || ""}</Text>
                </View>                        
            </View>
            
            {/* Button */}
            <View style={styles.buttonRow}>
                <Pressable style={[styles.button, styles.buttonSmall, { width: 100 }]}
                    onPress={() => router.push('/edit_account')}
                    >
                    <Text style={styles.buttonText}>Edit</Text>
                </Pressable>
            </View>

            {/*Footer*/}
            <View style={styles.footer}>
                <Pressable style={styles.navBtn} onPress={() => router.push('/')}>
                    <Text style={styles.navBtnText}>Home</Text>
                </Pressable>
                <Pressable style={styles.navBtn} onPress={() => router.push('/trip')}>
                    <Text style={styles.navBtnText}>Trips</Text>
                </Pressable>
            </View>        
        </View>
        </View>
    )
}
export default Account
