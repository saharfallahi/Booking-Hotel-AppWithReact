import { useParams } from "react-router-dom";
import { useHotels } from "../context/HotelsProvider";
import { useEffect } from "react";
import Loader from "../Loader/Loader";

function SingleHotel() {
  const { id } = useParams();
  const { getHotel, isLoadingCurrHotel, currentHotel } = useHotels();

  useEffect(() => {
    getHotel(id);
  }, [id]);

  if(isLoadingCurrHotel) return <Loader/>
  return (
    <div className="room">
      <div className="roomDetail">
        <h2>{currentHotel.name}</h2>
        <div>{currentHotel.number_of_reviews} reviews &bull; {currentHotel.smart_location}</div>
        <img src={currentHotel.xl_picture_url} alt={currentHotel.name}/>
      </div>
    </div>
  );
}

export default SingleHotel;
