import { Text, View } from "react-native"
import { Link } from "expo-router"

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/*Here for testing; to access different pages*/}
      <Link href="/(tabs)/welcome">Welcome</Link>
      <Link href="/(tabs)/trip">Trip List</Link>
      <Link href="/(tabs)/trip_details">Trip Details</Link>
      <Link href="/(tabs)/create_trip">Create Trip</Link>
      <Link href="/(tabs)/edit_trip">Edit Trip</Link>
      <Link href="/(tabs)/campsite_list">Campsite List</Link>
      <Link href="/(tabs)/campsite_map">Campsite Map</Link>
      <Link href="/(tabs)/edit_campsite">Edit Campsite</Link>
      <Link href="/(tabs)/add_campsite">Add Campsite</Link>
    </View>
  );
}
