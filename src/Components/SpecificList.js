import React, { Component } from "react";
import firebase from "firebase";
import { Link } from "react-router-dom";
import NatLangForm from "./NatLangForm.js";
import Footer from "./Footer.js";
import "../styles/specificList.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMinusCircle } from "@fortawesome/free-solid-svg-icons";

library.add(faMinusCircle);

class SpecificList extends Component {
  constructor() {
    super();
    //setting state
    this.state = {
      listMovies: [],
      title: "",
      imageSize: 0
    };
  }

  componentDidMount() {
    this.updateImageSize();
    window.addEventListener("resize", this.updateImageSize.bind(this));
    const dbRef = firebase.database().ref();
    dbRef.on("value", res => {
      let tempArray = [];
      const response = res.val();
      //find which object in our database matches the name of the list we have clicked on
      for (let object in response) {
        if (this.props.match.params.listName === response[object].name) {
          for (let movie in response[object].movies) {
            tempArray.push(response[object].movies[movie]);
          }
        }
      }
      this.setState({
        listMovies: tempArray,
        title: this.props.match.params.listName.replace(/-/g, " ")
      });
    });
  }

  updateImageSize = () => {
    let imageSize = "342";
    if (window.innerWidth > 1600) {
      imageSize = "780";
    } else if (window.innerWidth > 1000) {
      imageSize = "500";
    }
    this.setState({
      imageSize: imageSize
    });
  };
  //remove movie from list
  removeMovie = movieId => {
    const dbRef = firebase.database().ref();
    let matchedObject = "";
    dbRef.on("value", res => {
      let response = res.val();
      //going through each object in database response, checking to see if list names match, once we get to the list name that is the same as the list name we clicked on, we go into the object to determine if it has a movie array already.
      for (let object in response) {
        if (response[object].name === this.props.match.params.listName) {
          matchedObject = object;
        }
      }
    });
    const listRef = dbRef.child(matchedObject);
    listRef
      .child("movies")
      .child(movieId)
      .remove();
  };

  render() {
    return (
      <div className="specificList">
        <div className="wrapper clearfix">
          <h2>{this.state.title}</h2>
          <nav className="bigNav clearfix">
            <Link className="buttonStyle" to="/results">
              Search Movies
            </Link>
            <Link className="buttonStyle" to="/lists">
              Lists
            </Link>
          </nav>
        </div>
        {this.state.listMovies.length === 0 ? (
          <div className="wrapper">
            <p className="empty">
              Looks like nobody has added any movies to this list yet!
            </p>
          </div>
        ) : (
          <div className="movieList">
            <div className="wrapper">
              <NatLangForm movieInfo={this.state.listMovies} />
            </div>
            <div className="listContainer">
              {this.state.listMovies.map(movieId => {
                let url = `http://image.tmdb.org/t/p/w${this.state.imageSize}//${
                  movieId.poster
                }`;
                return (
                  <div className="poster">
                    <img src={url} alt={`Poster of ${movieId.name}`} />
                    <div className="overlay">
                      <Link to={`/movies/${movieId.id}`}>More Info</Link>
                      <button
                        className="removeButton"
                        tooltip="Remove movie"
                        tooltip-position="bottom"
                        onClick={() => {
                          this.removeMovie(movieId.id);
                        }}
                      >
                        <FontAwesomeIcon icon="minus-circle"/>
                      </button>
                    </div>
                  </div>
                );
              })}
            
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

export default SpecificList;
