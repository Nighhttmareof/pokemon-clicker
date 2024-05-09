import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NextPage } from "next";
import { useLazyGetUserQuery } from "@/redux/userDataApi";
import { setUser } from "@/redux/userSlice";



  
  const Global = ( Component: NextPage) => (props:any) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [getUserData, {data: user}] = useLazyGetUserQuery();

    

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = JSON.parse(atob(token.split('.')[1]));
          getUserData(userData.id);
        }
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      if(user) {
        dispatch(setUser(user))
      }
    }, [user])





  
    return (
      <>
        {loading ? <></> : <Component {...props} />}
      </>
    );
  };
  
  export default Global;