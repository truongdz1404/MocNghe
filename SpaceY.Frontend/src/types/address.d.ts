export interface AddressDto {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAddressDto {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    phoneNumber: string;
}

export interface UpdateAddressDto {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    phoneNumber: string;
}
