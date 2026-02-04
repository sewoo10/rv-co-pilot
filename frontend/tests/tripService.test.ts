// IMPORTANT - TEST CASES WAS CREATED VIA GENAI //
// uses vitest with a mocked version of axios
// to test in terminal: 1. "cd" to frontend location 2. run npx vitest tests/tripService.test.ts

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { api } from '../app/api/axios';
import {
    getTrips,
    createEditTrip,
    deleteTrip,
    getTripDetails,
    getCampsites,
    createEditCampsite,
    deleteCampsite,
    getCampsiteDetails,
    addCampsiteToTrip,
    removeCampsiteFromTrip,
    Trip,
    Campsite,
} from '../app/api/tripService';

// Mock the axios api
vi.mock('../app/api/axios', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
    getErrorMessage: vi.fn(),
}));

describe('tripService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ==================== TRIP TESTS ====================
    describe('Trip functions', () => {
        const mockTrip: Trip = {
            id: 1,
            name: 'Test Trip',
            startDate: '2024-02-03',
            endDate: '2024-02-10',
            campsites: [
                { campsiteId: 1, startDate: '2024-02-03', endDate: '2024-02-05' },
                { campsiteId: 2, startDate: '2024-02-05', endDate: '2024-02-10' },
            ],
            notes: 'Test notes',
        };

        const mockTrips: Trip[] = [
            mockTrip,
            {
                id: 2,
                name: 'Another Trip',
                startDate: '2024-03-01',
                endDate: '2024-03-06',
                campsites: [
                    { campsiteId: 3, startDate: '2024-03-01', endDate: '2024-03-06' },
                ],
                notes: 'More notes',
            },
        ];

        it('should fetch all trips', async () => {
            vi.mocked(api.get).mockResolvedValue({ data: mockTrips });

            const result = await getTrips();

            expect(api.get).toHaveBeenCalledWith('/trip');
            expect(result).toEqual(mockTrips);
        });

        it('should create a new trip', async () => {
            vi.mocked(api.post).mockResolvedValue({ data: mockTrip });

            const newTripData = {
                name: 'Test Trip',
                startDate: '2024-02-03',
                endDate: '2024-02-10',
                campsites: [
                    { campsiteId: 1, startDate: '2024-02-03', endDate: '2024-02-05' },
                    { campsiteId: 2, startDate: '2024-02-05', endDate: '2024-02-10' },
                ],
                notes: 'Test notes',
            };

            const result = await createEditTrip(newTripData);

            expect(api.post).toHaveBeenCalledWith('/trip', newTripData);
            expect(result).toEqual(mockTrip);
        });

        it('should edit an existing trip', async () => {
            vi.mocked(api.post).mockResolvedValue({ data: mockTrip });

            const editTripData = {
                name: 'Updated Trip',
                startDate: '2024-02-03',
                endDate: '2024-02-13',
                campsites: [
                    { campsiteId: 1, startDate: '2024-02-03', endDate: '2024-02-13' },
                ],
                notes: 'Updated notes',
            };

            const result = await createEditTrip(editTripData);

            expect(api.post).toHaveBeenCalledWith('/trip', editTripData);
            expect(result).toEqual(mockTrip);
        });

        it('should delete a trip', async () => {
            vi.mocked(api.delete).mockResolvedValue({ data: mockTrip });

            const result = await deleteTrip(1);

            expect(api.delete).toHaveBeenCalledWith('/trip/1');
            expect(result).toEqual(mockTrip);
        });

        it('should fetch trip details by id', async () => {
            vi.mocked(api.get).mockResolvedValue({ data: mockTrip });

            const result = await getTripDetails(1);

            expect(api.get).toHaveBeenCalledWith('/trip/1');
            expect(result).toEqual(mockTrip);
        });
    });

    // ==================== CAMPSITE TESTS ====================
    describe('Campsite functions', () => {
        const mockCampsite: Campsite = {
            id: 1,
            name: 'Test Campsite',
            type: 'RV',
            support: 'Full Hookup',
            rvInfo: '40ft max',
            water: true,
            bathroom: true,
            campfire: true,
            hostRangerHours: "9am-5pm, Monday - Friday",
            pets: true,
            wifi: false,
            cell: true,
            nearby: 'Lake, Store',
            comment: 'Great campsite',
        };

        const mockCampsites: Campsite[] = [
            mockCampsite,
            {
                id: 2,
                name: 'Another Campsite',
                type: 'Tent',
                support: 'Basic',
                rvInfo: 'No RV',
                water: true,
                bathroom: false,
                campfire: true,
                hostRangerHours: "9am-5pm, Sunday-Thursday",
                pets: false,
                wifi: false,
                cell: false,
                nearby: 'Trail',
                comment: 'Good for hiking',
            },
        ];

        it('should fetch all campsites', async () => {
            vi.mocked(api.get).mockResolvedValue({ data: mockCampsites });

            const result = await getCampsites();

            expect(api.get).toHaveBeenCalledWith('/campsite');
            expect(result).toEqual(mockCampsites);
        });

        it('should create a new campsite', async () => {
            vi.mocked(api.post).mockResolvedValue({ data: mockCampsite });

            const newCampsiteData = {
                name: 'Test Campsite',
                type: 'RV',
                support: 'Full Hookup',
                rvInfo: '40ft max',
                water: true,
                bathroom: true,
                campfire: true,
                hostRangerHours: "12pm-6pm",
                pets: true,
                wifi: false,
                cell: true,
                nearby: 'Lake, Store',
                comment: 'Great campsite',
            };

            const result = await createEditCampsite(newCampsiteData);

            expect(api.post).toHaveBeenCalledWith('/campsite', newCampsiteData);
            expect(result).toEqual(mockCampsite);
        });

        it('should edit an existing campsite', async () => {
            vi.mocked(api.post).mockResolvedValue({ data: mockCampsite });

            const editCampsiteData = {
                name: 'Updated Campsite',
                type: 'Tent',
                support: 'Basic',
                rvInfo: 'No RV',
                water: false,
                bathroom: false,
                campfire: true,
                hostRangerHours: "10am-3pm",
                pets: false,
                wifi: true,
                cell: true,
                nearby: 'Mountain',
                comment: 'Updated comment',
            };

            const result = await createEditCampsite(editCampsiteData);

            expect(api.post).toHaveBeenCalledWith('/campsite', editCampsiteData);
            expect(result).toEqual(mockCampsite);
        });

        it('should delete a campsite', async () => {
            vi.mocked(api.delete).mockResolvedValue({ data: mockCampsite });

            const result = await deleteCampsite(1);

            expect(api.delete).toHaveBeenCalledWith('/campsite/1');
            expect(result).toEqual(mockCampsite);
        });

        it('should fetch campsite details by id', async () => {
            vi.mocked(api.get).mockResolvedValue({ data: mockCampsite });

            const result = await getCampsiteDetails(1);

            expect(api.get).toHaveBeenCalledWith('/campsite/1');
            expect(result).toEqual(mockCampsite);
        });
    });

    // ==================== TRIP-CAMPSITE RELATIONSHIP TESTS ====================
    describe('Trip-Campsite relationship functions', () => {
        const mockTrip: Trip = {
            id: 1,
            name: 'Test Trip',
            startDate: '2024-02-03',
            endDate: '2024-02-10',
            campsites: [
                { campsiteId: 1, startDate: '2024-02-03', endDate: '2024-02-05' },
                { campsiteId: 2, startDate: '2024-02-05', endDate: '2024-02-10' },
            ],
            notes: 'Test notes',
        };

        it('should add a campsite to a trip', async () => {
            vi.mocked(api.post).mockResolvedValue({ data: mockTrip });

            const result = await addCampsiteToTrip(1, 2);

            expect(api.post).toHaveBeenCalledWith('/trip/1/campsite', {
                campsiteId: 2,
            });
            expect(result).toEqual(mockTrip);
        });

        it('should remove a campsite from a trip', async () => {
            vi.mocked(api.delete).mockResolvedValue({ data: mockTrip });

            const result = await removeCampsiteFromTrip(1, 2);

            expect(api.delete).toHaveBeenCalledWith('/trip/1/campsite/2');
            expect(result).toEqual(mockTrip);
        });
    });

    // ==================== ERROR HANDLING TESTS ====================
    describe('Error handling', () => {
        it('should handle API errors for getTrips', async () => {
            const error = new Error('Network error');
            vi.mocked(api.get).mockRejectedValue(error);

            await expect(getTrips()).rejects.toThrow('Network error');
        });

        it('should handle API errors for createEditTrip', async () => {
            const error = new Error('Validation error');
            vi.mocked(api.post).mockRejectedValue(error);

            const newTripData = {
                name: 'Test',
                startDate: '2024-02-03',
                endDate: '2024-02-08',
                campsites: [
                    { campsiteId: 1, startDate: '2024-02-03', endDate: '2024-02-08' },
                ],
                notes: 'Test',
            };

            await expect(createEditTrip(newTripData)).rejects.toThrow(
                'Validation error'
            );
        });

        it('should handle API errors for deleteTrip', async () => {
            const error = new Error('Not found');
            vi.mocked(api.delete).mockRejectedValue(error);

            await expect(deleteTrip(999)).rejects.toThrow('Not found');
        });
    });
});
