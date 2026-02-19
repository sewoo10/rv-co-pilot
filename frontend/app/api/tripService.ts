// this api will fetch/send data from database to user (and vice versa) regarding trips/campsites

// using axios (HTTP library)
import { api } from "./axios";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// structures regarding trips //
export interface Trips {
    id: number;
    name: string;
    campsites: CampsiteInTrip[];
}

export interface CampsiteInTrip {
    campsiteId: number;
    startDate: string;
    endDate: string;
    notes: string;
}

export interface CreateEditTripRequest {
    name: string;
    campsites: CampsiteInTrip[];
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// structures regarding campsites //
export interface Campsites {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    campsiteType: string;
    campsiteIdentifier: string;
    isPublic: boolean;
    dumpAvailable: boolean;
    electricHookup: boolean;
    waterAvailable: boolean;
    restroomAvailable: boolean;
    showerAvailable: boolean;
    petsAllowed: boolean;
    wifiAvailable: boolean;
    cellCarrier: string;
    cellQuality: number;
    nearbyRecreation: string;
}

export interface CreateEditCampsiteRequest {
    name: string;
    latitude: number;
    longitude: number;
    campsiteType: string;
    campsiteIdentifier: string;
    isPublic: boolean;
    dumpAvailable: boolean;
    electricHookup: boolean;
    waterAvailable: boolean;
    restroomAvailable: boolean;
    showerAvailable: boolean;
    petsAllowed: boolean;
    wifiAvailable: boolean;
    cellCarrier: string;
    cellQuality: number;
    nearbyRecreation: string;
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
    // validate that trip name is not empty
    if (!data.name || data.name.trim() === '') {
        return null;
    }
    const trip = await api.post<Trips>('/trips', data);       // "trips" is endpoint
    return trip.data;
};

// function to delete a trip
export const deleteTrip = async (id: number) => {
    const trip = await api.delete<Trips>(`/trips/${id}`);     // "trips" is endpoint
    return trip.data;
};

// function that fetches trip's details
export const getTripDetails = async (id: number) => {
    const trip = await api.get<Trips>(`/trips/${id}`);        // "trips" is endpoint
    return trip.data;
};

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
    const campsite = await api.delete<Campsites>(`/campsites/${id}`);     // "campsites" is endpoint
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
    // fetch the trip to check if campsite already exists
    const trip = await getTripDetails(tripId);
    
    // check if campsite already exists in the trip
    if (trip.campsites.some(c => c.campsiteId === campsiteId)) {
        return null;  // campsite already in trip, cannot add duplicate
    }
    
    const campsite = await api.post<Trips>(`/trips/${tripId}/campsites`, { campsiteId });        // "campsites" and "trips" are endpoints  
    return campsite.data;
};

// function to remove a campsite from a trip
export const removeCampsiteFromTrip = async (tripId: number, campsiteId: number) => {  
    const campsite = await api.delete<Trips>(`/trips/${tripId}/campsites/${campsiteId}`);        // "campsites" and "trips" are endpoints    
    return campsite.data;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
