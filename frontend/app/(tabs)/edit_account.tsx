// This page enables the user to edit the information associated with their account, or delete the account entirely.

import { View, Text, Image, Pressable, TextInput} from 'react-native'
import { styles, theme } from "../styles"
import { router } from 'expo-router'
import React, {useEffect, useState} from 'react'
import { getUser, updateUser, deleteUser } from '../api/userService'
import Spacer from '../components/Spacer';
import type { GetUserResponse } from '../api/userService'   


const EditAccount = () => {
    //============================
    // State
    //============================

    const [user, setUser] = useState<GetUserResponse>(null);
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [bio, setBio] = useState('')
    const [error, setError] = useState<string | null>(null)
    const user_id = 6; // TODO: Replace hardcoded test user ID with user ID for logged-in user

    //===========================
    // Handlers
    //===========================
    const handleUpdateUser = async () => {
        try {
            setError(null)
            const updatedData = {
                email: user!.email,
                first_name: first_name || user!.first_name,
                last_name: last_name || user!.last_name,
                bio: bio || user.bio,
            };
            await updateUser( user_id, updatedData);
            router.replace("/account") 
        } catch (err: any) {
            setError("Account update failed.")
        }
    }

    const handleDeleteUser = async () => {
        try {
            setError(null)
            await deleteUser(user_id);
            router.replace("/")
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    }

    const handleGetUser = async () => {
        try {
            const response = await getUser(user_id);  
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
                
                {/*First Name Entry*/}
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>First Name: </Text>
                    <Pressable>
                        <View style={styles.updateAccountForm}>
                        <TextInput
                            onChangeText={setFirstName}
                            autoCapitalize='none'
                            autoComplete='given-name'
                            autoCorrect={false}
                            returnKeyType='next'
                            textContentType='givenName'
                            placeholder={user?.first_name}
                            placeholderTextColor={theme.COLORS.muted}
                        />
                        </View>
                    </Pressable>
                </View>

                {/*Last Name Entry*/}
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Last Name: </Text>
                    <Pressable>
                        <View style={styles.updateAccountForm}>
                        <TextInput
                            onChangeText={setLastName}
                            autoCapitalize='none'
                            autoComplete='given-name'
                            autoCorrect={false}
                            returnKeyType='next'
                            textContentType='givenName'
                            placeholder={user?.last_name}
                            placeholderTextColor={theme.COLORS.muted}
                        />
                        </View>
                    </Pressable>                                        
                </View>

                {/*Email (read-only)*/}
                <View style={styles.smallPanel}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Email: {user?.email || ""}</Text>
                </View>

                {/*Bio Entry*/}
                <View style={[styles.panel, {flexDirection: 'row' }, {margin: 5}]}>
                    <Text style={[styles.listSub, {textAlign: 'left'}]}>Bio: </Text>
                    <View style={[styles.updateAccountForm, {flex: 1}]}>
                        <TextInput style={{flex: 1} }
                            onChangeText={setBio}
                            autoCapitalize='none'
                            autoCorrect={false}
                            returnKeyType='next'
                            placeholder={user?.bio}
                            placeholderTextColor={theme.COLORS.muted}
                            textAlignVertical="top"
                            multiline
                            numberOfLines={5}
                        />
                    </View>                    
                </View>                        
            </View>


            {/*Error messages*/}
            {error && (<Text style={{ color: "red", textAlign: "center" }}>{error}</Text>)}
    

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <Pressable style={[styles.button, styles.buttonSmall]} onPress={handleUpdateUser}>
                    <Text style={styles.buttonText}>Submit Changes</Text>
                </Pressable>

                <Pressable style={[styles.button, styles.buttonSmall, { width: 100 }]}
                    onPress={() => router.push('/account')}
                    >
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>

                <Pressable style={[styles.button, styles.buttonSmall]} onPress={handleDeleteUser}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </Pressable>
            </View>
            <Spacer height={15} />


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
export default EditAccount
