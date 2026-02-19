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
    it('should sucessfully create a trip', () => {
        // creates payload to send 
        const payload = {
            name: sampleTrip1.name,
            campsites: sampleTrip1.campsites,
        };
        // simulate sucessful HTTP POST, telling mocked API to return data next time POST is called 
        mockedApi.post.mockResolvedValueOnce({data: sampleTrip1});
        // executes 
        return tripService.createEditTrip(payload).then((result) => {
            expect(mockedApi.post).toHaveBeenCalledWith('/trips', payload);     // expects POST was made to correct endpoint with correct payload
            expect(result).toEqual(sampleTrip1);     // expects returned data to be same as expected data
        });
    });

    it('should create a trip with no campsites', () => {
        // creates payload to send 
        const payload = {
            name: sampleTrip2.name,
            campsites: sampleTrip2.campsites
        };
        // simulate sucessful HTTP POST, telling mocked API to return data next time POST is called 
        mockedApi.post.mockResolvedValueOnce({data: sampleTrip2});
        // executes 
        return tripService.createEditTrip(payload).then((result) => {
            expect(mockedApi.post).toHaveBeenCalledWith('/trips', payload);     // expects POST was made to correct endpoint with correct payload
            expect(result).toEqual(sampleTrip2);     // expects returned data to be same as expected data
        });
    });

    it('should not create a trip without name', () => {
        // creates payload to send 
        const payload = {
            name: '',
            campsites: sampleTrip2.campsites
        };
        // executes 
        return tripService.createEditTrip(payload).then((result) => {
            expect(mockedApi.post).not.toHaveBeenCalled();     // expects POST was not made due to validation failure
            expect(result).toBeNull();     // expects null to be returned
        });
    });
});


// test case to add campsite to trip
describe('add campsite to trip', () => {
    it('should add campsite to trip', () => {
        // campsite info data of sampleCampsite1
        const campsiteInfo = {
            campsiteId: 1,
            startDate: '2026-03-01',
            endDate: '2026-03-03',
            notes: 'Notes here',
        };
        // takes sampleTrip2 and adds the sampleCampsite1 to it as payload to send 
        const updatedTrip = {
            ...sampleTrip2,
            campsites: [...sampleTrip2.campsites, campsiteInfo]
        };
        // simulate sucessful HTTP GET, telling mocked API to get data details on sampleTrip2
        mockedApi.get.mockResolvedValueOnce({data: sampleTrip2});
        // simulate sucessful HTTP POST, telling mocked API to return data next time POST is called 
        mockedApi.post.mockResolvedValueOnce({data: updatedTrip});
        // Execute
        return tripService.addCampsiteToTrip(sampleTrip2.id, campsiteInfo.campsiteId).then((result) => {
            expect(mockedApi.post).toHaveBeenCalled(); // expects POST was made correctly
            expect(result).toEqual(updatedTrip);    // expects returned data to be same as expected data
        });
    });

    it('should not add same campsite with same dates in a row to trip', () => {
        // campsite info data of sampleCampsite1
        const campsiteInfo = {
            campsiteId: 1,
            startDate: '2026-03-01',
            endDate: '2026-03-03',
            notes: 'Notes here',
        };
        // simulate sucessful HTTP GET, telling mocked API to get data details on sampleTrip1
        mockedApi.get.mockResolvedValueOnce({data: sampleTrip1});
        // executes 
        return tripService.addCampsiteToTrip(sampleTrip1.id, campsiteInfo.campsiteId).then((result) => {
            expect(mockedApi.post).not.toHaveBeenCalled();     // expects POST was not made due to validation failure
            expect(result).toBeNull();     // expects null to be returned
        });
    });

    it('should add same campsite with different dates in a row to trip', () => {
        // campsite info data of sampleCampsite1 but with different dates
        const campsiteInfo = {
            campsiteId: 1,
            startDate: '2026-03-09',
            endDate: '2026-03-12',
            notes: 'Notes here',
        };
        // takes sampleTrip1 that has sampleCampsite1 already and adds it again with new dates as payload to send 
        const updatedTrip = {
            ...sampleTrip1,
            campsites: [...sampleTrip1.campsites, campsiteInfo]
        };
        // simulate sucessful HTTP GET, telling mocked API to get data details on sampleTrip2
        mockedApi.get.mockResolvedValueOnce({data: sampleTrip2});
        // simulate sucessful HTTP POST, telling mocked API to return data next time POST is called 
        mockedApi.post.mockResolvedValueOnce({data: updatedTrip});
        // Execute
        return tripService.addCampsiteToTrip(sampleTrip2.id, campsiteInfo.campsiteId).then((result) => {
            expect(mockedApi.post).toHaveBeenCalled(); // expects POST was made correctly
            expect(result).toEqual(updatedTrip);    // expects returned data to be same as expected data
        });
    });
});


// test case to remove campsite to trip
describe('remove campsite from trip', () => {
    it('should remove campsite from trip', () => {
        // expected value by end
        const expected = {
            id: 1,
            name: 'Trip 1',
            campsites: [],
        };
        // simulate sucessful HTTP DELETE, telling mocked API to return data next time DELETE is called 
        mockedApi.delete.mockResolvedValueOnce({data: expected});
        // Execute
        return tripService.removeCampsiteFromTrip(sampleTrip1.id, sampleCampsite1.id).then((result) => {
            expect(mockedApi.delete).toHaveBeenCalled(); // expects DELETE was made correctly
            expect(result).toEqual(expected);    // expects returned data to be same as expected data
        });
    });
});


// test case to delete trip
describe('delete trip', () => {
    it('should delete trip', () => {
        // simulate sucessful HTTP DELETE, telling mocked API to return data next time DELETE is called 
        mockedApi.delete.mockResolvedValueOnce({data: null});
        // Execute
        return tripService.deleteTrip(sampleTrip1.id).then((result) => {
            expect(mockedApi.delete).toHaveBeenCalled(); // expects DELETE was made correctly
            expect(result).toBeNull();    // expects data to be deleted
        });
    });
});

3
// test case to check if trips persist correctly after app refresh
describe('trip persist correctly after app refresh', () => {
    it('should persist correctly after refresh', () => {
        // simulate sucessful HTTP GET, telling mocked API to return data next time GET is called 
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1, sampleTrip2]});
        // get trips initially
        return tripService.getTrips().then((initialResult) => {
            expect(initialResult).toEqual([sampleTrip1, sampleTrip2]);
            // simulate sucessful HTTP GET, telling mocked API to return data next time GET is called 
            mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1, sampleTrip2]});
            // this "refreshes" by getting trips again
            return tripService.getTrips().then((refreshResult) => {
                expect(mockedApi.get).toHaveBeenCalledWith('/trips');
                expect(refreshResult).toEqual([sampleTrip1, sampleTrip2]);  // Same data after refresh
            });
        });
    });

    it('should persist correctly with addition of trip after refresh', () => {
    // simulate sucessful HTTP GET, telling mocked API to return data next time GET is called 
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1]});
        // get trips initially
        return tripService.getTrips().then((initialResult) => {
            expect(initialResult).toEqual([sampleTrip1]);
            // simulate sucessful HTTP POST for creating new trip
            mockedApi.post.mockResolvedValueOnce({data: sampleTrip2});
            // add trip 2 
            return tripService.createEditTrip({name: sampleTrip2.name, campsites: sampleTrip2.campsites}).then(() => {
                // simulate sucessful HTTP GET, telling mocked API to return data next time GET is called 
                mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1, sampleTrip2]});
                // this "refreshes" by getting trips again
                return tripService.getTrips().then((refreshResult) => {
                    expect(mockedApi.get).toHaveBeenCalledWith('/trips');
                    expect(refreshResult).toEqual([sampleTrip1, sampleTrip2]);  // Same data after refresh
                });
            });
        });
    });

    it('should persist correctly with deletion of trip after refresh', () => {
    // simulate sucessful HTTP GET, telling mocked API to return data next time GET is called 
        mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1, sampleTrip2]});
        // get trips initially
        return tripService.getTrips().then((initialResult) => {
            expect(initialResult).toEqual([sampleTrip1, sampleTrip2]);
            // simulate sucessful HTTP DELETE for deleting trip 2
            mockedApi.delete.mockResolvedValueOnce({data: null});
            // delete trip 2 
            return tripService.deleteTrip(sampleTrip2.id).then(() => {
                // expects DELETE was made correctly
                expect(mockedApi.delete).toHaveBeenCalled();
                // simulate sucessful HTTP GET, telling mocked API to return data next time GET is called 
                mockedApi.get.mockResolvedValueOnce({data: [sampleTrip1]});
                // this "refreshes" by getting trips again
                return tripService.getTrips().then((refreshResult) => {
                    expect(mockedApi.get).toHaveBeenCalledWith('/trips');
                    expect(refreshResult).toEqual([sampleTrip1]);  // only trip 1 remains after deletion
                });
            });
        });
    });
});

