import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, Callout } from 'react-native-maps';
import { router } from 'expo-router'
import { styles } from "../app/styles"

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
        title={site.title}
        onCalloutPress={() => router.push(`/edit_campsite`)}
        image={require('../assets/images/tent_icon.png')}
        />
      ))}
    </MapView>
  );
};

export default Map;
