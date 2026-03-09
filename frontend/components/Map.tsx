import React, { useRef } from 'react';
import { Platform, Text } from 'react-native';
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

const handleLongPress = (event: any) => {
  const { latitude, longitude } = event.nativeEvent.coordinate;
  router.push({ pathname: "/add_campsite", params: { latitude, longitude }});
};

const Map: React.FC<Props> = ({ region, campsites }) => {
  const markerRefs = useRef<{ [key: string]: any }>({});

  const handleMarkerPress = (campsiteId: string) => {
    if (markerRefs.current[campsiteId]) {
      markerRefs.current[campsiteId].showCallout();
    }
  };

  return (
    
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      onLongPress={handleLongPress}
    >
      {campsites.map(site => (
        <Marker
        ref={(marker) => {
          if (marker) markerRefs.current[site.id] = marker;
        }}
        key={site.id}
        coordinate={{
            latitude: site.latitude,
            longitude: site.longitude,
        }}
        title={Platform.OS === 'android' ? site.title : undefined}
        onPress={() => handleMarkerPress(site.id)}
        onCalloutPress={() =>  router.push({ pathname: "/campsite", params: { campsite_id: site.id }}) } 
        image={require('../assets/images/tent_icon.png')}
        >
          {Platform.OS === 'ios' && (
            <Callout onPress={() => router.push({ pathname: "/campsite", params: { campsite_id: site.id }})}>
              <Text>{site.title}</Text>
            </Callout>
          )}
        </Marker>
      ))}
    </MapView>
  );
};

export default Map;
