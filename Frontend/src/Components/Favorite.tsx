import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import { getAuth } from "firebase/auth";
import { Link, useNavigate} from 'react-router-dom';


interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  _id:string
}

const Favorite=()=>{
  const auth = getAuth();
  var user = auth.currentUser;
  const nav = useNavigate();
  let [favoritesList, setFavoritesList]=useState<Movie[]>([])
  let [favortitesIDList,setFavoritesIDList]=useState<Array <Number> >([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(favoritesList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = favoritesList.slice(startIndex, endIndex);

  function removeFavLists(e: React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();
    // if(!user){
    //     alert('Connection Expired, Please Log Back In');
    //     nav('/');
    //     return;
    // }
    const value = parseInt(e.currentTarget.value);
    
    let deleteHandler=async ()=>{

        let uid=localStorage.getItem('uid')

        let data={
            uid:uid,
            movieID:value
        }

        const response = await axios.post('http://44.211.151.177:5678/deleteFavorites', data);

    }
    setFavoritesIDList(favortitesIDList.filter(item => item !== value));
    setFavoritesList(favoritesList.filter((item:Movie) => item.id !== value));
    deleteHandler();
    //Axios call to remove from backend list
}
let postHandler=async (value: number, item:any)=>{
  let uid=localStorage.getItem('uid')

  let data={
      movie:{
          movieID:value,
          movieDetails:item
      },
      uid:uid
  }

  const response = await axios.post('http://44.211.151.177:5678/favorites', data);
  setFavoritesIDList([...favortitesIDList,value]);

}
function addFavLists(e: React.MouseEvent<HTMLButtonElement>, item:any){
  e.preventDefault();
  if(!user){
      alert('Connection Expired, Please Log Back In');
      nav('/');
      return;
  }
  console.log(item)
  const value = parseInt(e.currentTarget.value);
  postHandler(value, item);        
}

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(()=>{
    let uid=localStorage.getItem('uid')
    let getFavoriteHandler=async()=>{
      let res = await axios.get('http://44.211.151.177:5678/getFavorites/'+uid);
      let data:any= []
      let IDList=[]
      res.data.map((movie:any)=>{
        data.push(movie.otherModelField)
        IDList.push(movie.movieID)
      })
      setFavoritesList(data);
      // console.log(favoritesList)
      console.log(data)
    }
    getFavoriteHandler()
  },[])

  return(
    <React.Fragment>
    <Navbar/>
    
    <div className="bg-gray-950 h-screen">
    <div>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&family=Bungee+Shade&display=swap" rel="stylesheet" />
  
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white font-bungee-shade">Favorite Movies</h1>
      </div>
       
    <div id='moviecontainer'>
    <ul className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-5 gap-5">
      {favoritesList
        .filter((movie:Movie) => movie.backdrop_path)
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((item:Movie, index) => (
          <div key={index} className="relative">
        {favoritesList.map((fav: Movie) => fav.id).includes(item.id) ?(
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
);
};

export default Favorite