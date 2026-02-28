// test the collection and viewing of the trips 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as tripService from '../app/api/tripCampsiteService';
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

// runs before each test to reset HTTP methods
beforeEach(() => {
    mockedApi.get.mockReset();
    mockedApi.post.mockReset();
    mockedApi.delete.mockReset();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TEST CASES FOR TRIPS //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// test case to create trip
describe('create a trip', () => {
    it('should sucessfully create a trip', async () => {
        const payload = {
            name: 'Trip 1',
        };

        const expectedResult = {
            trip_id : '1'
        }

        mockedApi.post.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.createEditTrip(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/trips', payload);
        expect(result).toEqual(expectedResult);
    });

    it('should not create a trip without name', async () => {
        const payload = {
            name: '',
        };

        mockedApi.post.mockRejectedValueOnce(new Error("Missing required fields"));

        await expect(tripService.createEditTrip(payload)).rejects.toThrow("Missing required fields");

        expect(mockedApi.post).toHaveBeenCalledWith('/trips', payload);

    });
});


// test case to add campsite to trip
describe('add campsite to trip', () => {
    it('should add campsite to trip', async () => {

        const expectedResult = '1';

        mockedApi.post.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.addCampsiteToTrip(1, 1);

        expect(mockedApi.post).toHaveBeenCalledWith(`/trips/${1}/campsites`, {campsiteId: 1}); 
        expect(result).toEqual(expectedResult);
    });
});


// test case to remove campsite to trip
describe('remove campsite from trip', () => {
    it('should remove campsite from trip', async () => {
        const expectedResult = {
            message: 'Trip entry removed'
        };

        mockedApi.delete.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.removeCampsiteFromTrip(1,1);

        expect(mockedApi.delete).toHaveBeenCalledWith(`/trips/${1}/campsites/${1}`);
        expect(result).toEqual(expectedResult);
    });
});


// test case to delete trip
describe('delete trip', () => {
    it('should delete trip', async () => {

        const expectedResult = {
            message : 'Trip deleted'
        };

        mockedApi.delete.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.deleteTrip(1);

        expect(mockedApi.delete).toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
    });
});


// test case to list trips
describe('list trip(s)', () => {
    it('should get all trips for user', async () => {
        const expectedResult = [
            {
                trip_id: '1',
                trip_name: 'Trip 1',
                date_created: '2026-02-27'
            },
            {
                trip_id: '2',
                trip_name: 'Trip 2',
                date_created: '2026-02-15'
            }
        ]; 

        mockedApi.get.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.getTrips();

        expect(mockedApi.get).toHaveBeenCalledWith('/trips');
        expect(result).toEqual(expectedResult);
    });

    it('should get trip details for user', async () => {
        const expectedResult = {
                trip_id: '1',
                trip_name: 'Trip 1',
                date_created: '2026-02-27'
            };

        mockedApi.get.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.getTripDetails(1);

        expect(mockedApi.get).toHaveBeenCalledWith('/trips/1');
        expect(result).toEqual(expectedResult);
    });
});

// test case to update trips
describe('update trip', () => {
    it('should update trip details', async () => {
        const tripId = 1;
        const payload = {
            name: 'Trip One'
        };

        const expectedResult = {
            trip_id: '1',
            trip_name: 'Trip One'
        };

        mockedApi.post.mockResolvedValueOnce({data: expectedResult});

        const result = await tripService.createEditTrip(payload);

        expect(mockedApi.post).toHaveBeenCalledWith(`/trips`, payload);
        expect(result).toEqual(expectedResult);
    });
});
