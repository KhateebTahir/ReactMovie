import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import Navigation from "../elements/Navigation/Navigation";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import "./Movie.css";

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  };

  componentDidMount() {
    const { movieId } = this.props.match.params;

    if (localStorage.getItem(`${movieId}`)) {
      const state = JSON.parse(localStorage.getItem(`${movieId}`));
      this.setState({ ...state });
    } else {
      this.setState({ loading: true });

      //First fetch the movie...
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
      this.fetchItems(endpoint);
    }
  }

  fetchItems = async endpoint => {
    const { movieId } = this.props.match.params;
    try {
      const result = await (await fetch(endpoint)).json();

      if (result.status_code) {
        this.setState({ loading: false });
      } else {
        //grab desired info
        this.setState({ movie: result });

        const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;

        const creditsResult = await (await fetch(creditsEndpoint)).json();
        const directors = creditsResult.crew.filter(
          member => member.job === "Director"
        );
        this.setState(
          {
            actors: creditsResult.cast,
            directors,
            loading: false
          },
          () => {
            localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
          }
        );
      }
    } catch (e) {
      console.log("There was a n error: ", e);
    }
  };

  // fetchItems = endpoint => {
  //   fetch(endpoint)
  //     .then(result => result.json())
  //     .then(result => {
  //       console.log(result);
  //       //first check if movie does exist. if we get a status_code then movie does not exist
  //       if (result.status_code) {
  //         this.setState({ loading: false });
  //       } else {
  //         //grab desired info
  //         this.setState({ movie: result }, () => {
  //           //fetch actors in setState callback function
  //           const endpoint = `${API_URL}movie/${
  //             this.props.match.params.movieId
  //           }/credits?api_key=${API_KEY}`;

  //           fetch(endpoint)
  //             .then(result => result.json())
  //             .then(result => {
  //               console.log("CREW: ", result);
  //               //filter out everything except directors
  //               const directors = result.crew.filter(
  //                 member => member.job === "Director"
  //               );
  //               this.setState(
  //                 {
  //                   actors: result.cast,
  //                   directors,
  //                   loading: false
  //                 },
  //                 () => {
  //                   localStorage.setItem(
  //                     `${this.props.match.params.movieId}`,
  //                     JSON.stringify(this.state)
  //                   );
  //                 }
  //               );
  //             });
  //         });
  //       }
  //     })
  //     .catch(error => console.log("Error:", error));
  // };

  render() {
    return (
      <div className="rmdb-movie">
        {/* check if movie exist */}
        {this.state.movie ? (
          <div>
            <Navigation movie={this.props.location.moviename} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.movie.runtime}
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div>
        ) : null}
        {/* check if actors exist */}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {this.state.actors.map((element, i) => {
                return <Actor key={i} actor={element} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {/* check if state contains actors and it is loading something */}
        {!this.state.actors && !this.state.loading ? (
          <h1>No Movie Found</h1>
        ) : null}
        {/* show spinner if loading */}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}

export default Movie;
