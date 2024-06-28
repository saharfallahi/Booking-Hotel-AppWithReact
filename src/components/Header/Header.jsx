import {MdLocationOn} from "react-icons/md";
import {HiCalendar, HiLogout, HiMinus, HiPlus, HiSearch} from "react-icons/hi";
import { useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import { format } from "date-fns";
import { Link, NavLink, createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Header() {
    const [searchParams,setSearchParams]=useSearchParams();
    const [destination,setDestination]=useState(searchParams.get("destination")|| "");
    const [openOptions,setOpenOptions]=useState(false);
    const [options,setOptions]=useState({
        adult:1,
        children:0,
        room:1
    })

    const [date,setDate]=useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        }
    ])

    const [openDate,setOpenDate]=useState(false);
    const navigate=useNavigate();

    const handleOptions=(name,operation)=>{
        setOptions(prev=>{
            return {
                ...prev,
                [name]:operation==="inc" ? options[name] +1 :options[name] -1
            }
        })
    }

    const handleSearch=()=>{
        // setSearchParams({options,date,destination});
        const encodedParams=createSearchParams({
            date:JSON.stringify(date),
            destination,
            options:JSON.stringify(options)
        })
        navigate({
            pathname:"/hotels",
            search:encodedParams.toString(),
        })
    }

  return (
    <div className="header">
        <NavLink to="/bookmark">Bookmarks</NavLink>
        <div className="headerSearch">
            <div className="headerSearchItem">
                <MdLocationOn className="headerIcon locationIcon"/>
                <input value={destination} onChange={(e)=>setDestination(e.target.value)} type="text" placeholder="where to go?" className="headerSearchInput" name="destination" id="destination"/>
                <span className="seperator"></span>
            </div>
            <div className="headerSearchItem">
                <HiCalendar className="headerIcon dateIcon"/>
                <div onClick={()=>setOpenDate(!openDate)} className="dateDropDown">
                    {`${format(date[0].startDate,"MM/dd/yyyy")} to ${format(date[0].endDate,"MM/dd/yyyy")}`}
                </div>
                {openDate && <DateRange onChange={(item)=>setDate([item.selection])} ranges={date} className="date" minDate={new Date()} moveRangeOnFirstSelection={true}/>}
                <span className="seperator"></span>
            </div>
            <div className="headerSearchItem">
                <div onClick={()=>setOpenOptions(!openOptions)} id="optionDropDown">{options.adult} adult &bull; {options.children} children &bull; {options.room} room</div>
                {openOptions && <GuestOptionList  options={options} handleOptions={handleOptions} setOpenOptions={setOpenOptions}/>}
                <span className="seperator"></span>
            </div>
            <div className="headerSearchItem">
                <button className="headerSearchBtn" onClick={handleSearch}>
                    <HiSearch className="headerIcon"/>
                </button>
            </div>
        </div>
        <User/>
    </div>
  )
}

export default Header


function GuestOptionList({options,handleOptions,setOpenOptions}){
    const optionsRef=useRef();
    useOutsideClick(optionsRef,"optionDropDown",()=>setOpenOptions(false));
    return(
        <div className="guestOptions" ref={optionsRef}>
            <OptionItem type="adult" options={options} minLimit={1} handleOptions={handleOptions} />
            <OptionItem type="children" options={options} minLimit={0} handleOptions={handleOptions}/>
            <OptionItem type="room" options={options} minLimit={1} handleOptions={handleOptions}/>
        </div>
    )
}

function OptionItem({options,type,minLimit,handleOptions}){
    return(
        <div className="guestOptionItem">
            <span className="optionText">{type}</span>
            <div className="optionCounter">
                <button className="optionCounterBtn" disabled={options[type]<=minLimit} onClick={()=>handleOptions(type,"dec")}>
                    <HiMinus className="icon"/>
                </button>
                <span className="optionCounterNumber">{options[type]}</span>
                <button className="optionCounterBtn" onClick={()=>handleOptions(type,"inc")}>
                    <HiPlus className="icon"/>
                </button>
            </div>
        </div>
    )
}

export function User(){
    const navigate=useNavigate();
    const {user,isAuthenticated,logout}=useAuth();
    const handleLogout=()=>{
        logout();
        navigate("/");
    }
    return <div>
        {isAuthenticated ? (
            <div>
                <span>{user.name}<button>&nbsp;<HiLogout onClick={handleLogout} className="icon"/></button></span>
            </div>
        ): (
            <NavLink to="/login">login</NavLink>
        )
        }
    </div>
}