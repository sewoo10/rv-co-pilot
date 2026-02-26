import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Callout } from 'react-native-maps';
import { router } from 'expo-router'
import { styles } from "../styles"

type Campsite = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
};

type Props = {
  region: Region;
  campsites: Campsite[];
};

const Map: React.FC<Props> = ({ region, campsites }) => {
  return (
    
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
    >
      {campsites.map(site => (
        <Marker
        key={site.id}
        coordinate={{
            latitude: site.latitude,
            longitude: site.longitude,
        }}
        image={require('../../assets/images/tent_icon.png')}
        >
        <Callout onPress={() => router.push(`/edit_campsite`)}> {/* TODO: Add view_campiste tab and route with site id. Route to edit_campsite for the time being */}
            <View style={{ padding: 5 }}>
            <Text>{site.title}</Text>
            </View>
        </Callout>
        </Marker>
      ))}
    </MapView>
  );
};

export default Map;
