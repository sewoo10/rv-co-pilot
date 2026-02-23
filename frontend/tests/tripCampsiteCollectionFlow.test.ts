// test the collection and viewing of the trips

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { vi } from 'vitest';
import * as tripService from '../app/api/tripService';
import { api } from '../app/api/axios';

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// setting up the mocking of api

vi.mock('../app/api/axios', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

const mockedApi = api as unknown as {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// data sample

const sampleTrip1 = {       // perfect trip
    id: 1,
    name: 'Trip 1',
    campsites: [
        {
            campsiteId: 1,
            startDate: '2026-03-01',
            endDate: '2026-03-03',
            notes: 'Notes here',
        },
    ],
};

const sampleTrip2 = {       // trip with no campsites
    id: 2,
    name: 'Trip 2',
    campsites: [],
};

const sampleCampsite1 = {        // perfect campsite
    id: 1,
    name: 'Campsite 1',
    latitude: 45.72,
    longitude: -123.94,
    campsiteType: 'State Park',
    campsiteIdentifier: 'NB-12',
    isPublic: true,
    dumpAvailable: true,
    electricHookup: true,
    waterAvailable: true,
    restroomAvailable: true,
    showerAvailable: false,
    petsAllowed: true,
    wifiAvailable: false,
    cellCarrier: 'Verizon',
    cellQuality: 3,
    nearbyRecreation: 'Hiking',
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// runs before each test to reset HTTP methods
beforeEach(() => {
    mockedApi.get.mockReset();
    mockedApi.post.mockReset();
    mockedApi.delete.mockReset();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TEST CASES //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// test case to create trip
describe('create a trip', () => {
    it('should sucessfully create a trip', async () => {
        const payload = {
            name: sampleTrip1.name,
            campsites: sampleTrip1.campsites,
        };

        mockedApi.post.mockResolvedValueOnce({data: sampleTrip1});

        const result = await tripService.createEditTrip(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/trips', payload);
        expect(result).toEqual(sampleTrip1);
    });

    it('should create a trip with no campsites', async () => {
        const payload = {
            name: sampleTrip2.name,
            campsites: sampleTrip2.campsites
        };

        mockedApi.post.mockResolvedValueOnce({data: sampleTrip2});

        const result = await tripService.createEditTrip(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/trips', payload);
        expect(result).toEqual(sampleTrip2);
    });

    it('should not create a trip without name', async () => {
        const payload = {
            name: '',
            campsites: sampleTrip2.campsites
        };

        const result = await tripService.createEditTrip(payload);

        expect(mockedApi.post).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });
});


// test case to add campsite to trip
describe('add campsite to trip', () => {
    it('should add campsite to trip', async () => {
        const campsiteInfo = {
            campsiteId: 1,
            startDate: '2026-03-01',
            endDate: '2026-03-03',
            notes: 'Notes here',
        };
        const updatedTrip = {
            ...sampleTrip2,
            campsites: [...sampleTrip2.campsites, campsiteInfo]
        };

        mockedApi.get.mockResolvedValueOnce({data: sampleTrip2});
        mockedApi.post.mockResolvedValueOnce({data: updatedTrip});

        const result = await tripService.addCampsiteToTrip(
            sampleTrip2.id, campsiteInfo.campsiteId);

        expect(mockedApi.post).toHaveBeenCalled(); 
        expect(result).toEqual(updatedTrip);
    });

    it('should not add same campsite with same dates in a row to trip', async () => {
        const campsiteInfo = {
            campsiteId: 1,
            startDate: '2026-03-01',
            endDate: '2026-03-03',
            notes: 'Notes here',
        };

        mockedApi.get.mockResolvedValueOnce({data: sampleTrip1});

        const result = await tripService.addCampsiteToTrip(
            sampleTrip1.id, campsiteInfo.campsiteId);

        expect(mockedApi.post).not.toHaveBeenCalled();
        expect(result).toBeNull();
    });

    it('should add same campsite with different dates in a row to trip', async () => {
        const campsiteInfo = {
            campsiteId: 1,
            startDate: '2026-03-09',
            endDate: '2026-03-12',
            notes: 'Notes here',
        }; 
        const updatedTrip = {
            ...sampleTrip1,
            campsites: [...sampleTrip1.campsites, campsiteInfo]
        };

        mockedApi.get.mockResolvedValueOnce({data: sampleTrip2});
        mockedApi.post.mockResolvedValueOnce({data: updatedTrip});

        const result = await tripService.addCampsiteToTrip(
            sampleTrip2.id, campsiteInfo.campsiteId);

        expect(mockedApi.post).toHaveBeenCalled();
        expect(result).toEqual(updatedTrip);
    });
});


// test case to remove campsite to trip
describe('remove campsite from trip', () => {
    it('should remove campsite from trip', async () => {
        const expected = {
            id: 1,
            name: 'Trip 1',
            campsites: [],
        };

        mockedApi.delete.mockResolvedValueOnce({data: expected});

        const result = await tripService.removeCampsiteFromTrip(
            sampleTrip1.id, sampleCampsite1.id);

        expect(mockedApi.delete).toHaveBeenCalled();
        expect(result).toEqual(expected);
    });
});


// test case to delete trip
describe('delete trip', () => {
    it('should delete trip', async () => {
        mockedApi.delete.mockResolvedValueOnce({data: null});

        const result = await tripService.deleteTrip(sampleTrip1.id);

        expect(mockedApi.delete).toHaveBeenCalled();
        expect(result).toBeNull();
    });
});

3
// test case to check if trips persist correctly after app refresh
describe('trip persist correctly after app refresh', () => {
    it('should persist correctly after refresh', async () => {
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1, sampleTrip2]});

        const initialResult = await tripService.getTrips();

        expect(initialResult).toEqual([sampleTrip1, sampleTrip2]); 

        // "refreshes" Trip Page
        mockedApi.get.mockResolvedValueOnce({
            data: [sampleTrip1, sampleTrip2]});

        const refreshResult = await tripService.getTrips();

        expect(mockedApi.get).toHaveBeenCalledWith('/trips');
        expect(refreshResult).toEqual([sampleTrip1, sampleTrip2]);
    });

    it('should persist correctly with addition of trip after refresh', async () => { 
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1]});

        const initialResult = await tripService.getTrips();

        expect(initialResult).toEqual([sampleTrip1]);

        // add trip
        mockedApi.post.mockResolvedValueOnce({data: sampleTrip2});

        await tripService.createEditTrip({
            name: sampleTrip2.name, campsites: sampleTrip2.campsites});
        
        // "refreshes" Trip Page
        mockedApi.get.mockResolvedValueOnce({
            data: [sampleTrip1, sampleTrip2]});

        const refreshResult = await tripService.getTrips();

        expect(mockedApi.get).toHaveBeenCalledWith('/trips');
        expect(refreshResult).toEqual([sampleTrip1, sampleTrip2]);
    });

    it('should persist correctly with deletion of trip after refresh', async () => {
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1, sampleTrip2]});

        const initialResult = await tripService.getTrips();

        expect(initialResult).toEqual([sampleTrip1, sampleTrip2]);
        
        // deletes all trips
        mockedApi.delete.mockResolvedValueOnce({data: null});

        await tripService.deleteTrip(sampleTrip2.id);

        expect(mockedApi.delete).toHaveBeenCalled();

        // "refreshes" Trip Page
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1]});

        const refreshResult = await tripService.getTrips();

        expect(mockedApi.get).toHaveBeenCalledWith('/trips');
        expect(refreshResult).toEqual([sampleTrip1]); 
    });
});
