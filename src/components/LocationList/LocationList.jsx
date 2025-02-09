import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

function LocationList() {
  const { data, isLoading } = useFetch("https://fern-harsh-texture.glitch.me/hotels");

  if (isLoading) <p> isloading</p>;
  return (
    <div className="nearbyLocation">
      <h2>Nearby Locations</h2>
      <div className="locationList">
      {data.map((item) => {
        return (
          <Link
              key={item.id}
              to={`/hotels/${item.id}?lat=${item.latitude}&lng=${item.longitude}`}
            >
          <div className="locationItem" key={item.id}>
            <img src={item.xl_picture_url} alt={item.name} />
            <div className="locationItemDesc">
              <p className="location">{item.smart_location}</p>
              <p className="name">{item.name}</p>
              <p className="price">
                €&nbsp;{item.price}&nbsp;
                <span>night</span>
              </p>
            </div>
          </div>
          </Link>
        );
      })}
      </div>
    </div>
  );
}

export default LocationList;
