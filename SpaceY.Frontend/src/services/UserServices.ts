import { User } from "@/types/user"
import api from "./api"

const GetProfile = async (email: string) : Promise<User> => {
    const response = await api.get(`/user/profile?email=${email}`)
    return response.data.data   
}

const UserServices = {
    GetProfile,
}
export default UserServices