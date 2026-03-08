// this api will fetch/send data from database to user (and vice versa) regarding trips/campsites

// using axios (HTTP library)
import { api } from "./axios";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// structures regarding trips //
export interface Trips {
    trip_id: number;
    trip_name: string;
    date_created: string;
}

export interface CampsiteInTrip {
    campsite_id: number;
    begin_date: string;
    end_date: string;
    notes: string;
}

export interface CreateEditTripRequest {
  trip_id?: number
  trip_name: string
}

export interface CreateTripResponse {
    trip_id: number;
}

export interface DeleteResponse {
    message: string;
}

export interface AddTripEntryResponse {
    trip_entry_id: number;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// structures regarding campsites //
export interface Campsites {
    campsite_id: number;
    campsite_name: string;
    latitude: number;
    longitude: number;
    campsite_type: string;
    campsite_identifier: string;
    is_public: boolean;
    dump_available: boolean;
    electric_hookup_available: boolean;
    water_available: boolean;
    restroom_available: boolean;
    shower_available: boolean;
    pets_allowed: boolean;
    wifi_available: boolean;
    cell_carrier: string;
    cell_quality: number;
    nearby_recreation: string;
    distance?: number;
}

export interface CreateEditCampsiteRequest {
    campsite_name: string;
    latitude: number;
    longitude: number;
    campsite_type: string;
    campsite_identifier: string;
    is_public: boolean;
    dump_available: boolean;
    electric_hookup_available: boolean;
    water_available: boolean;
    restroom_available: boolean;
    shower_available: boolean;
    pets_allowed: boolean;
    wifi_available: boolean;
    cell_carrier: string;
    cell_quality: number;
    nearby_recreation: string;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// functions regarding trips //
// function that gets all trips for the logged-in user
export const getTrips = async () => {
    const trip = await api.get<Trips[]>('/trips');        // "trips" is endpoint
    return trip.data;
};

// function that creates or edit trip
export const createEditTrip = async (data: CreateEditTripRequest) => {

  if (data.trip_id) {
    const trip = await api.put(`/trips/${data.trip_id}`, data)
    return trip.data
  }

  const trip = await api.post('/trips', data)
  return trip.data
};

// function to delete a trip
export const deleteTrip = async (id: number) => {
    const trip = await api.delete<DeleteResponse>(`/trips/${id}`);
    return trip.data;
};

// function that fetches trip's details
export const getTripDetails = async (id: number) => {
    const trip = await api.get<Trips>(`/trips/${id}`);        // "trips" is endpoint
    return trip.data;
};

// function that adds an entry to a trip
export const addTripEntry = async (tripId: number, data: any) => {
  const res = await api.post(`/trips/${tripId}/entries`, data)
  return res.data
}

// function that gets all entries for a trip
export const getTripEntries = async (tripId: number) => {
  const res = await api.get(`/trips/${tripId}/entries`)
  return res.data
}

// function that deletes an entry from a trip
export const deleteTripEntry = async (
  tripId: number,
  entryId: number
) => {
  const res = await api.delete(`/trips/${tripId}/entries/${entryId}`)
  return res.data
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// functions regarding campsites // 
// function that gets the closest campsites based on location
export const getCampsites = async () => {
    const campsites = await api.get<Campsites[]>('/campsites');        // "campsites" is endpoint
    return campsites.data;
};

// function to create or edit a campsite
export const createEditCampsite = async (data: CreateEditCampsiteRequest) => {
    const campsite = await api.post<Campsites>('/campsites', data);       // "campsites" is endpoint
    return campsite.data;
}; 

// function to delete a campsite
export const deleteCampsite = async (id: number) => {
    const campsite = await api.delete<DeleteResponse>(`/campsites/${id}`);
    return campsite.data;
};

// function that fetches campsite's details
export const getCampsiteDetails = async (id: number) => {
    const campsite = await api.get<Campsites>(`/campsites/${id}`);        // "campsites" is endpoint
    return campsite.data;
}; 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// functions regarding adding/removing campsites to trips
// function that adds a campsite to a trip
export const addCampsiteToTrip = async (tripId: number, campsiteId: number) => {  
    const campsite = await api.post<AddTripEntryResponse>(`/trips/${tripId}/entries`, { campsiteId });        // "entries" and "trips" are endpoints  
    return campsite.data;
};

// function to remove a campsite from a trip
export const removeCampsiteFromTrip = async (tripId: number, tripEntryId: number) => {  
    const campsite = await api.delete<DeleteResponse>(`/trips/${tripId}/entries/${tripEntryId}`);
    return campsite.data;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function that fetches campsites within 50 miles of a location
export const getNearbyCampsites = async (
    latitude: number,
    longitude: number
) => {
    const campsites = await api.get<Campsites[]>(
        `/campsites?latitude=${latitude}&longitude=${longitude}`
    );

    return campsites.data;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
