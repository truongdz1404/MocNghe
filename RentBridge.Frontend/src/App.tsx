import { useEffect, useState } from "react"
import { User } from "./types/user"
import UserServices from "./services/UserServices";

function App() {
  const [user, setUser] = useState<User | null>();
   const [email, setEmail] = useState<string>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserServices.GetProfile(email || "");
        setUser(data);
        console.log(data);
        console.log(email);
        
        
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    }
    fetchUser();
  },[email])
  return (
    <div>
      <p>{user?.fullName}</p>
      <p>{user?.email}</p>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>
  )
}

export default App
