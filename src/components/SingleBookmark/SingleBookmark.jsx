import { useNavigate, useParams } from "react-router-dom";
import { useBookmark } from "../context/BookmarkListProvider";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";

function SingleBookmark() {
  const { id } = useParams();
  const { getBookmark,isLoading, currentBookmark } = useBookmark();
  const navigate = useNavigate();
  useEffect(() => {
    getBookmark(id);
  }, [id]);

  if (isLoading || !currentBookmark) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn--back">
        &larr; Back
      </button>
      <h2 style={{marginTop:"1rem"}}>{currentBookmark.cityName}</h2>
      <div style={{marginTop:"1rem"}} className="bookmarkItem">
        <div >
          <ReactCountryFlag svg countryCode={currentBookmark.countryCode} />
          &nbsp; <strong >{currentBookmark.cityName}</strong> &nbsp;
        </div>
        <span>{currentBookmark.country}</span>
      </div>
    </div>
  );
}

export default SingleBookmark;
