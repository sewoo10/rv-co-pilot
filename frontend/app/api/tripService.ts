// this api will fetch/send data from database to user (and vice versa) regarding trips/campsites

// using axios (HTTP library)
import { api } from "./axios";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// structures regarding trips //
export interface Trip {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    notes: string;
    campsites: CampsiteInTrip[];
}

export interface CampsiteInTrip {
    campsiteId: number;
    startDate: string;
    endDate: string;
}

export interface CreateEditTripRequest {
    name: string;
    startDate: string;
    endDate: string;
    notes: string;
    campsites: CampsiteInTrip[];
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// structures regarding campsites //
export interface Campsite {
    id: number;
    name: string;
    type: string;
    support: string;
    rvInfo: string;
    water: boolean;
    bathroom: boolean;
    campfire: boolean;
    hostRangerHours: string;
    pets: boolean;
    wifi: boolean;
    cell: boolean;
    nearby: string;
    comment: string;
}

export interface CreateEditCampsiteRequest {
    name: string;
    type: string;
    support: string;
    rvInfo: string;
    water: boolean;
    bathroom: boolean;
    campfire: boolean;
    hostRangerHours: string;
    pets: boolean;
    wifi: boolean;
    cell: boolean;
    nearby: string;
    comment: string;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// functions regarding trips //
// function that gets all trips for the logged-in user
export const getTrips = async () => {
    const trip = await api.get<Trip[]>('/trip');        // "trip" is endpoint
    return trip.data;
};

// function that creates or edit trip
export const createEditTrip = async (data: CreateEditTripRequest) => {
    const trip = await api.post<Trip>('/trip', data);       // "trip" is endpoint
    return trip.data;
};

// function to delete a trip
export const deleteTrip = async (id: number) => {
    const trip = await api.delete<Trip>(`/trip/${id}`);     // "trip" is endpoint
    return trip.data;
};

// function that fetches trip's details
export const getTripDetails = async (id: number) => {
    const trip = await api.get<Trip>(`/trip/${id}`);        // "trip" is endpoint
    return trip.data;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// functions regarding campsites // 
// function that gets the closest campsites based on location
export const getCampsites = async () => {
    const campsite = await api.get<Campsite[]>('/campsite');        // "campsite" is endpoint
    return campsite.data;
};

// function to create or edit a campsite
export const createEditCampsite = async (data: CreateEditCampsiteRequest) => {
    const campsite = await api.post<Campsite>('/campsite', data);       // "campsite" is endpoint
    return campsite.data;
}; 

// function to delete a campsite
export const deleteCampsite = async (id: number) => {
    const campsite = await api.delete<Campsite>(`/campsite/${id}`);     // "campsite" is endpoint
    return campsite.data;
};

// function that fetches campsite's details
export const getCampsiteDetails = async (id: number) => {
    const campsite = await api.get<Campsite>(`/campsite/${id}`);        // "campsite" is endpoint
    return campsite.data;
}; 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// functions regarding adding/removing campsites to trips
// function that adds a campsite to a trip
export const addCampsiteToTrip = async (tripId: number, campsiteId: number) => {  
    const campsite = await api.post<Trip>(`/trip/${tripId}/campsite`, { campsiteId });        // "campsite" and "trip" are endpoints  
    return campsite.data;
};

// function to remove a campsite from a trip
export const removeCampsiteFromTrip = async (tripId: number, campsiteId: number) => {  
    const campsite = await api.delete<Trip>(`/trip/${tripId}/campsite/${campsiteId}`);        // "campsite" and "trip" are endpoints    
    return campsite.data;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
