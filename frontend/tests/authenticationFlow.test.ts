// test the authentication process for user

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as authService from '../app/api/authService';
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
// TEST CASES  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe('register new user', () => {
    it('should sucessfully register new user', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe123@gmail.com',
            password: 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"token": "123"}});

        const result = await authService.register(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/register', payload);     
        expect(result).toEqual({'token': '123'});     
        });

    it('should not sucessfully register new user with invaild email', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe123',
            password: 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "Invaild Email"}});

        const result = await authService.register(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/register', payload);
        expect(result).toEqual({"error": "Invaild Email"});  
        });

    it('should not sucessfully register new user with weak password', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe123@gmail.com',
            password: 'password123'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "Invaild Password"}});

        const result = await authService.register(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/register', payload);
        expect(result).toEqual({"error": "Invaild Password"});      
        });

    it('should not sucessfully register new user with no email', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: '',
            password: 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "Email and password required"}});

        const result = await authService.register(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/register', payload);
        expect(result).toEqual({"error": "Email and password required"}); 
        });

    it('should not sucessfully register new user with no password', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe123@gmail.com',
            password: ''
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "Email and password required"}});

        const result = await authService.register(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/register', payload);
        expect(result).toEqual({"error": "Email and password required"});     
        });

    it('should not sucessfully register new user with email already registered', async () => {
        const payload = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe123@gmail.com',
            password: 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "User already exists"}});

        const result = await authService.register(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/register', payload);
        expect(result).toEqual({"error": "User already exists"});     
        });
    }); 

describe('login new user', () => {
    it('should sucessfully login user', async () => {
        const payload = {
            email: 'johndoe123@gmail.com',
            password: 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        };
 
        mockedApi.post.mockResolvedValueOnce({data:{"token": "123"}});

        const result = await authService.login(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/login', payload);     
        expect(result).toEqual({'token': '123'});
        });

    it('should not sucessfully login user with invaild email', async () => {
        const payload = {
            email: 'johndoe321@gmail.com',
            password: 'K#9mPx@2vL$4nQ&8wR!jBc5yT6hF*3sE'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "Invaild Email"}});

        const result = await authService.login(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/login', payload);
        expect(result).toEqual({"error": "Invaild Email"}); 
        });

    it('should not sucessfully login user with invaild password', async () => {
        const payload = {
            email: 'johndoe123@gmail.com',
            password: 'password321'
        };

        mockedApi.post.mockResolvedValueOnce({data:{"error": "Invaild Password"}});

        const result = await authService.login(payload);

        expect(mockedApi.post).toHaveBeenCalledWith('/login', payload);
        expect(result).toEqual({"error": "Invaild Password"}); 
        });
    });
