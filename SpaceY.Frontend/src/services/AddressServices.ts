import api from "@/services/api";
import { AddressDto, CreateAddressDto, UpdateAddressDto } from "@/types/address";

const addressService = {
    // Get all addresses for the current user
    getAll: async (): Promise<AddressDto[]> => {
        const response = await api.get<AddressDto[]>("/address");
        return response.data;
    },

    // Get a specific address by ID
    getById: async (id: number): Promise<AddressDto> => {
        const response = await api.get<AddressDto>(`/address/${id}`);
        return response.data;
    },

    // Create a new address
    create: async (createAddressDto: CreateAddressDto): Promise<AddressDto> => {
        const response = await api.post<AddressDto>("/address", createAddressDto);
        return response.data;
    },

    // Update an existing address
    update: async (id: number, updateAddressDto: UpdateAddressDto): Promise<AddressDto> => {
        const response = await api.put<AddressDto>(`/address/${id}`, updateAddressDto);
        return response.data;
    },

    // Delete an address
    delete: async (id: number): Promise<void> => {
        await api.delete(`/address/${id}`);
    },

    // Check if an address exists
    exists: async (id: number): Promise<boolean> => {
        try {
            await api.head(`/address/${id}`);
            return true;
        } catch (error: unknown) {
            const axiosError = error as { response: { status: number } };
            if (axiosError.response?.status === 404) {
                return false;
            }
            throw error;
        }
    }
};

export default addressService;