import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Navbar from "./navbar";
import { Link, useNavigate} from 'react-router-dom';
import { getAuth } from "firebase/auth";
import './styles/search.css'

export default function SearchResults() {
    //Used to authenticate if the user is logged in before making any api request
    const auth = getAuth();
    const user = auth.currentUser;
    //Used to redirect users if not logged in
    const nav = useNavigate();
    //Holds movie json objects
    var [movies, setMovies] = useState<Array<any>>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;
    
    const totalPages = Math.ceil(movies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = movies.slice(startIndex, endIndex);
    // Does request to backend to get movies that match the search query
    //List of favorite movies of user
    var [favoritesList, setFavorites] = useState<Array <Number> >([]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
    
    useEffect(() => {
        const getFavorites=async ()=>{
            let uid=localStorage.getItem('uid')
            let res= await axios.get('http://44.211.40.0:5678/getFavorites/'+uid)
            let data= res.data.map((movie:any) => movie.movieID);
            console.log(data)
            console.log(res)
            setFavorites(data)
           }
        const fetchData = async () => {
            const currentURL = window.location.href;
            console.log(currentURL);
            const result = currentURL.slice(31);
            console.log(result)
            var url = 'http://44.211.40.0:5678/search/'+result;
            let res=await axios.get(url)
            //var filteredRes = res.data.results.filter(function (movie) { return movie.original_language === 'en' })
            console.log(res.data.results.filter(function (movie:any) { return movie.original_language === 'en' }))
            setMovies(res.data.results.filter(function (movie:any) { return movie.original_language === 'en' && movie.backdrop_path != "https://image.tmdb.org/t/p/originalnull" }));
        };
        fetchData();
        getFavorites();
    }, []);

    

    /**
    * Removes movie id from favorites list in mongodb and frontend copy.
    * @constructor
    * @param {value} - Variable that holds the integer value of the movie id of the user wishes to add.
    * @param {favoritesList} - Variable that holds the movie ids of that the user has added to their favorite lists. 
    * @param {user} - This variable verifies if the user is logged in or not, if it is null, the user is not logged in
    *  and therefore, no api requests will be allowed.
    */
    function removeFavLists(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        const value = parseInt(e.currentTarget.value);
        
        let deleteHandler=async ()=>{
    
            let uid=localStorage.getItem('uid')
    
            let data={
                uid:uid,
                movieID:value
            }
    
            const response = await axios.post('http://44.211.40.0:5678/deleteFavorites', data);
    
        }
        setFavorites(favoritesList.filter(item => item !== value));
        deleteHandler();
        //Axios call to remove from backend list
    }

     /**
    * Adds movie IDs to the favorite list in mongodb.
    * @constructor
    * @param {value} - Variable that holds the integer value of the movie id of the user wishes to add.
    * @param {favoritesList} - Variable that holds the movie ids of that the user has added to their favorite lists.
    * @param {user} - This variable verifies if the user is logged in or not, if it is null, the user is not logged in
    *  and therefore, no api requests will be allowed.
    */
      let postHandler=async (value: number, item:any)=>{
    
        let uid=localStorage.getItem('uid')
    
        let data={
            movie:{
                movieID:value,
                movieDetails:item
            },
            uid:uid
        }
    
        const response = await axios.post('http://44.211.40.0:5678/favorites', data);
        setFavorites([...favoritesList,value]);
    
      }
      function addFavLists(e: React.MouseEvent<HTMLButtonElement>, item:any){
        e.preventDefault();
        console.log(item)
        const value = parseInt(e.currentTarget.value);
        postHandler(value, item);        
      }
     

    return(
        <React.Fragment>
    <Navbar/>
    
    <div className="bg-gray-950 h-screen">
    <div>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&family=Bungee+Shade&display=swap" rel="stylesheet" />
  
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white font-bungee-shade">Search Results</h1>
      </div>
       
    <div id='moviecontainer'>
    <ul className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-5 gap-5">
      {movies
        .filter((movie) => movie.backdrop_path)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((item, index) => (
          <div key={index} className="relative">
        {favoritesList.map((fav) => fav).includes(item.id) ?(
      <button
        value={item.id}
        onClick={removeFavLists}
        className="bg-red-500 text-center mt-2 h-2/12 text-black justify-center border border-solid border-black hover:ease-in z-10 absolute rounded-md hover:bg-white w-4/12 flex"
      >
        Unfavorite
      </button>
    ) : (
      <button
        value={item.id}
        onClick={(e) => addFavLists(e, item)}
        className="bg-white h-2/12 text-center text-black justify-center mt-2 border border-solid border-black hover:ease-in z-10 absolute rounded-md hover:bg-red-500 hover:text-black w-3/12 flex"
      >
        Favorite
      </button>
    )}
    <Link to={`/details?id=${item.id}`}>
      <img
        src={`https://image.tmdb.org/t/p/w300/${item.backdrop_path}`}
        alt={item.title}
        className="photo"
      />
      <div className="absolute bottom-3 left-3 right-3 bg-gray-900 bg-opacity-50 py-10 px-10 text-white transition-opacity duration-300 opacity-0 hover:opacity-100">
        <p className="text-xl font-bold">{item.title}</p>
        <p className="text-sm">{item.release_date}</p>
      </div>
    </Link>
  
  </div>
  
        ))
      }
    </ul>
    <div className='pagination bg-gray-950 mb-24'>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`${
      currentPage === index + 1 ? 'active bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'
    } text-white px-12 py-4 rounded mx-2`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  
    </div>
  </div>
  
  
  </React.Fragment>
    )
}