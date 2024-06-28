import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useUrlLocation from '../../hooks/useUrlLocation';
import axios from 'axios';
import Loader from '../Loader/Loader';
import ReactCountryFlag from 'react-country-flag';
import { useBookmark } from '../context/BookmarkListContext';

const BASE_GEOCODING_URL="https://api.bigdatacloud.net/data/reverse-geocode-client";

function AddNewBookmark() {
    const navigate=useNavigate();
    const [lat,lng]=useUrlLocation();
    const [cityName,setCityName]=useState("");
    const [country,setCountry]=useState("");
    const [countryCode,setCountryCode]=useState("");
    const [isLoadingGeoCoding,setIsLoadingGeoCoding]=useState(false);
    const [geoCodingError,setGeoCodingError]=useState(null);
    const {createBookmark}=useBookmark();

    useEffect(()=>{
        if(!lat || !lng) return;
        async function fetchLocationData(){
            setIsLoadingGeoCoding(true);
            setGeoCodingError(null);
            try {
                const {data}=await axios.get(`${BASE_GEOCODING_URL}?latitude=${lat}&longitude=${lng}`)
                if(!data.countryCode) throw new Error("This Location is not a City.Please Click SomeWhere else")
                setCityName(data.city || data.locality || "");
                setCountry(data.countryName);
                setCountryCode(data.countryCode);
            } catch (error) {
                setGeoCodingError(error.message);
            }finally{
                setIsLoadingGeoCoding(false);
            }
        }
        fetchLocationData();
    },[lat,lng])

    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(!cityName || !country) return;

        const newBookmark={
            cityName,
            country,
            countryCode,
            latitude: lat,
            longitude: lng,
            host_location: cityName + "" + country,
        }
        await createBookmark(newBookmark);
        navigate("/bookmark");
    }

    if(isLoadingGeoCoding) return <Loader/>;
    if(geoCodingError) return <p>{geoCodingError}</p>

  return (
    <div>
        <h2>Bookmark New Location</h2>
        <form onSubmit={handleSubmit} className="form">
            <div className="formControl">
                <label htmlFor="CityName">CityName</label>
                <input value={cityName} onChange={(e)=>setCityName(e.target.value)} type="text" name="CityName" id="CityName" />
            </div>
            <div className="formControl">
                <label htmlFor="Country">Country</label>
                <input onChange={(e)=>setCountry(e.target.value)} value={country} type="text" name="Country" id="Country" />
                <ReactCountryFlag className='flag' svg countryCode={countryCode}/>
            </div>
            <div className="buttons">
                <button onClick={(e)=>{
                    e.preventDefault();
                    navigate(-1);
                    }} className='btn btn--back'>&larr; Back</button>
                <button className='btn btn--primary'>&nbsp;Add&nbsp;</button>

            </div>
        </form>
    </div>
  )
}

export default AddNewBookmark