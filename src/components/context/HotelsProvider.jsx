import { createContext, useContext, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const HotelContext = createContext();
const BASE_URL = "http://localhost:5000";

function HotelsProvider({ children }) {
  const [currentHotel, setCurrentHotel] = useState({});
  const [isLoadingCurrHotel, setIsLoadingCurrHotel] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  const room = JSON.parse(searchParams.get("options"))?.room;
  const { isLoading, data: hotels } = useFetch(
    `${BASE_URL}/hotels`,
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );

  async function getHotel(id) {
    setIsLoadingCurrHotel(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/hotels/${id}`);
      setCurrentHotel(data);
      setIsLoadingCurrHotel(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoadingCurrHotel(false);
    }
  }

  return (
    <HotelContext.Provider value={{ isLoading, hotels,currentHotel,getHotel,isLoadingCurrHotel }}>
      {children}
    </HotelContext.Provider>
  );
}

export default HotelsProvider;

export function useHotels() {
  return useContext(HotelContext);
}
