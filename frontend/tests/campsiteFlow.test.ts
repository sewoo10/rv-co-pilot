///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// test the collection and viewing of the campsites 

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as campsiteService from '../app/api/tripCampsiteService';
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
// TEST CASES FOR CAMPSITES //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// test case to get campsite(s)
describe('get campsite(s)', () => {
    it('should sucessfully get campsites', async () => {

        const expectedResult = [
    {
        campsite_id: '1',
        campsite_name: 'Campsite 1',
        user_id: '1',
        latitude: 42.9446,
        longitude: -122.1090,
        campsite_type: 'RV Park',
        campsite_identifier: 'CS 1',
        is_public: false,
        dump_available: true,
        electric_hookup_available: true,
        water_available: true,
        restroom_available: true,
        shower_available: true,
        pets_allowed: true,
        wifi_available: true,
        cell_carrier: 'Verizon',
        cell_quality: 3,
        nearby_recreation: ['Hiking', 'Fishing', 'Photography']
    },
    {
        campsite_id: '2',
        campsite_name: 'Campsite 2',
        user_id: null,
        latitude: 44.2861,
        longitude: -121.3205,
        campsite_type: 'State Park',
        campsite_identifier: 'CS 2',
        is_public: true,
        dump_available: false,
        electric_hookup_available: false,
        water_available: true,
        restroom_available: true,
        shower_available: false,
        pets_allowed: true,
        wifi_available: false,
        cell_carrier: 'AT&T',
        cell_quality: 5,
        nearby_recreation: ['Rock Climbing', 'Hiking', 'Picnicking']
    }
    ];
        
        mockedApi.get.mockResolvedValueOnce({data: expectedResult});

        const result = await campsiteService.getCampsites();

        expect(mockedApi.get).toHaveBeenCalledWith('/campsites');
        expect(result).toEqual(expectedResult);
    });

    it('should sucessfully get campsite details', async () => {

        const expectedResult = {
        campsite_id: '1',
        campsite_name: 'Campsite 1',
        user_id: '1',
        latitude: 42.9446,
        longitude: -122.1090,
        campsite_type: 'RV Park',
        campsite_identifier: 'CS 1',
        is_public: false,
        dump_available: true,
        electric_hookup_available: true,
        water_available: true,
        restroom_available: true,
        shower_available: true,
        pets_allowed: true,
        wifi_available: true,
        cell_carrier: 'Verizon',
        cell_quality: 3,
        nearby_recreation: 'Hiking, Fishing, Photography'
    };

        mockedApi.get.mockResolvedValueOnce({data: expectedResult});

        const result = await campsiteService.getCampsiteDetails(1);

        expect(mockedApi.get).toHaveBeenCalledWith('/campsites/1');
        expect(result).toEqual(expectedResult);
    });
});


// test case to create campsite
describe('create campsite', () => {
    it('should sucessfully create campsite', async () => {

        const payload = {
        name: 'Campsite 1',
        latitude: 42.9446,
        longitude: -122.1090,
        campsiteType: 'RV Park',
        campsiteIdentifier: 'CS 1',
        isPublic: false,
        dumpAvailable: true,
        electricHookup: true,
        waterAvailable: true,
        restroomAvailable: true,
        showerAvailable: true,
        petsAllowed: true,
        wifiAvailable: true,
        cellCarrier: 'Verizon',
        cellQuality: 3,
        nearbyRecreation: 'Hiking, Fishing, Photography'
    };
        
        mockedApi.post.mockResolvedValueOnce({data: 1});

        const result = await campsiteService.createEditCampsite(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/campsites', payload);
        expect(result).toEqual(1);
    });

    it('should sucessfully edit campsite details', async () => {

        const payload = {
        name: 'Campsite One',
        latitude: 42.9446,
        longitude: -122.1090,
        campsiteType: 'RV Park',
        campsiteIdentifier: 'CS One',
        isPublic: false,
        dumpAvailable: true,
        electricHookup: true,
        waterAvailable: true,
        restroomAvailable: true,
        showerAvailable: true,
        petsAllowed: true,
        wifiAvailable: true,
        cellCarrier: 'Verizon',
        cellQuality: 4,
        nearbyRecreation: 'Hiking, Fishing, Photography'
    };

        mockedApi.post.mockResolvedValueOnce({data: 1});

        const result = await campsiteService.createEditCampsite(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/campsites', payload);
        expect(result).toEqual(1);
    });
});

// test case to delete campsite
describe('delete campsite', () => {
    it('should sucessfully delete campsite', async () => {

        mockedApi.delete.mockResolvedValueOnce({data: 1});

        const result = await campsiteService.deleteCampsite(1);

        expect(mockedApi.delete).toHaveBeenCalledWith('/campsites/1');
        expect(result).toEqual(1);
    });
});
