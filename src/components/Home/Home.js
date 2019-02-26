import React, { Component } from "react";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";

import "./Home.css";

class Home extends Component {
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: ""
  };

  componentDidMount() {
    //to retrieve local storage, first check if state object exists
    if (sessionStorage.getItem("HomeState")) {
      //retrieve state object
      const state = JSON.parse(sessionStorage.getItem("HomeState"));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });
      //const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&langauge=en-US&page=1`;
      this.fetchItems(this.createEndpoint("movie/popular", false, ""));
    }
  }

  createEndpoint = (type, loadMore, searchTerm) => {
    return `${API_URL}${type}?api_key=${API_KEY}&langauge=en-US&page=${loadMore &&
      this.state.currentPage + 1}&query=${searchTerm}`;
  };

  updateItems = (loadMore, searchTerm) => {
    this.setState(
      {
        movies: loadMore ? [...this.state.movies] : [],
        loading: true,
        searchTerm: loadMore ? this.state.searchTerm : searchTerm
      },
      () => {
        this.fetchItems(
          !this.state.searchTerm
            ? this.createEndpoint("movie/popular", loadMore, "")
            : this.createEndpoint(
                "search/movie",
                loadMore,
                this.state.searchTerm
              )
        );
      }
    );
  };

  //use of async await rather than nested .then statements before
  fetchItems = async endpoint => {
    const { movies, heroImage, searchTerm } = this.state;
    const result = await (await fetch(endpoint)).json();

    try {
      this.setState(
        {
          //to show previously loaded movies with new ones for "load more" functionality
          //use ES6 "spread" method with "..." to copy old movies and append to new ones.
          movies: [...movies, ...result.results],
          //if heroImage is not null return heroImage else return the first movie from fetch results.
          heroImage: heroImage || result.results[0],
          loading: false,
          currentPage: result.page,
          totalPages: result.total_pages
        },
        () => {
          //use browser local storage to store updated state so the app does not
          //make unnecessary fetch calls every time.
          //if searching...don't save to local storage.
          if (searchTerm === "") {
            sessionStorage.setItem("HomeState", JSON.stringify(this.state));
          }
        }
      );
    } catch (e) {
      console.log("There was an error; ", e);
    }
  };

  // fetchItems = endpoint => {
  //   //ES6 Destructuring the state
  //   const { movies, heroImage, searchTerm } = this.state;

  //   fetch(endpoint)
  //     .then(result => result.json())
  //     .then(result => {
  //       console.log(result);
  //       this.setState(
  //         {
  //           //to show previously loaded movies with new ones for "load more" functionality
  //           //use ES6 "spread" method with "..." to copy old movies and append to new ones.
  //           movies: [...movies, ...result.results],
  //           //if heroImage is not null return heroImage else return the first movie from fetch results.
  //           heroImage: heroImage || result.results[0],
  //           loading: false,
  //           currentPage: result.page,
  //           totalPages: result.total_pages
  //         },
  //         () => {
  //           //use browser local storage to store updated state so the app does not
  //           //make unnecessary fetch calls every time.
  //           //if searching...don't save to local storage.
  //           if (searchTerm === "") {
  //             localStorage.setItem("HomeState", JSON.stringify(this.state));
  //           }
  //         }
  //       );
  //     });
  // };

  // loadMoreItems = () => {
  //   //we need 2 different API URLs
  //   //one for searching and if not searching then we load popular movies
  //   let endpoint = "";
  //   this.setState({ loading: true });

  //   //if user is not searching
  //   if (this.state.searchTerm === "") {
  //     //load popular movies
  //     endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&langauge=en-US&page=${this
  //       .state.currentPage + 1}`;
  //   } else {
  //     //user is searching
  //     endpoint = `${API_URL}search/movie?api_key=${API_KEY}&langauge=en-US&query=${
  //       this.state.searchTerm
  //     }&page=${this.state.currentPage + 1}`;
  //   }
  //   this.fetchItems(endpoint);
  // };

  // searchItems = searchTerm => {
  //   console.log(searchTerm);
  //   //we need 2 different API URLs
  //   //one for searching and if not searching then we load popular movies
  //   let endpoint = "";
  //   this.setState({
  //     //clear movies array when enabling search
  //     movies: [],
  //     loading: true,
  //     searchTerm
  //   });

  //   //if user is not searching
  //   if (this.state.searchTerm === "") {
  //     //load popular movies
  //     endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&langauge=en-US&page=1}`;
  //   } else {
  //     //user is searching
  //     endpoint = `${API_URL}search/movie?api_key=${API_KEY}&langauge=en-US&query=${searchTerm}`;
  //   }
  //   this.fetchItems(endpoint);
  // };

  render() {
    //ES6 destructuring the state and props
    const {
      movies,
      heroImage,
      loading,
      currentPage,
      totalPages,
      searchTerm
    } = this.state;

    //const { props1, props2, props3 } = this.props;

    return (
      <div className="rmdb-home">
        {/* {this.state.heroImage ? ( */}
        {heroImage && !searchTerm ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${
                // this.state.heroImage.backdrop_path
                heroImage.backdrop_path
              }`}
              //title={this.state.heroImage.original_title}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
          </div>
        ) : null}
        <SearchBar callback={this.updateItems} />
        <div className="rmdb-home-grid">
          <FourColGrid
            //display heading depending on user is making a search or not
            header={searchTerm ? "Search Result" : "Popular Movies"}
            loading={loading}
          >
            {movies.map((element, i) => {
              return (
                <MovieThumb
                  //preparing props to send in FourColGrid component
                  key={i}
                  clickable={true}
                  //check if we have image or not
                  image={
                    element.poster_path
                      ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                      : "./images/no_image.jpg"
                  }
                  movieId={element.id}
                  movieName={element.original_title}
                />
              );
            })}
          </FourColGrid>
          {/* show spinner depending on whether we are loading or not */}
          {loading ? <Spinner /> : null}
          {/* show loading only when we are not on last page.
          check for last page, if we are not on last page and loading is false, show loadmore button*/}
          {currentPage < totalPages && !loading ? (
            <LoadMoreBtn text="Load More" onClick={this.updateItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
