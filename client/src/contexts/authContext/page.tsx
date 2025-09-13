import React, { useEffect , useState , useContext, type ReactNode } from "react";
import {auth} from "../../firebase/Firebase"
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export interface AuthContextProp {
    currentUser : User | null,
    isUserLoggedin : boolean
}
const AuthContext = React.createContext<AuthContextProp | null>(null);
export const useAuth = () =>{
    const context =  useContext(AuthContext);
    if(!context){
        throw new Error("Error with auth");
        
    }
    return context;
}
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider : React.FC<AuthProviderProps> = ({children}) =>{

        const [currentUser , setCurrentuser] = useState(null);
        const [isUserLoggedin , setuserLoggedin] = useState(false);

        useEffect(()=>{
                const unsubscribed = onAuthStateChanged(auth , initialzeUser);
                return unsubscribed; 
        } , [])

            async function initialzeUser (user : any){

                    if(user){
                        setCurrentuser({...user});
                        setuserLoggedin(true);
                    }
            }

            const Value = {
                currentUser,
                isUserLoggedin
            }
            return (
                <AuthContext.Provider value={Value} >
                        {children}
                </AuthContext.Provider>
            )

} 
