import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Link, Stack, router } from 'expo-router';
import { styles } from "./styles"

export default function NotFoundScreen() {
  return (
    <>
    
      <Stack.Screen options={{ title: 'Page Not Found!' }} />
        <View style={styles.screen}>
            <View style={styles.phoneFrame}>

                {/*Logo*/}
                <View style={[styles.logoContainer, {marginVertical: 20}]}>       
                    <Text style={styles.appTitleBig}>RV COPILOT</Text>
                </View>
                <View style = {styles.header_divider}/>

                {/*Body*/}
                <View style={styles.body}>
                <Text style={styles.h1}>Page not found!</Text> 
                <TouchableOpacity style={[styles.button, { width: 200, marginVertical: 50, alignSelf: 'center'}]}
                                            onPress={() => router.push('/(tabs)/login')}>
                    <Text style={styles.buttonText}>Return Home</Text>
                </TouchableOpacity>
                </View>

            </View>
        </View>
    </>
  );
}
