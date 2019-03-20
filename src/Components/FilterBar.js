import React, { Component } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import '../styles/filterBar.css';

library.add(faSearch);

class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
  }
  // listening for user input, and updating state as user types
  handleSearchChange = event => {
    this.setState({
      searchQuery: event.target.value
    });
  };
  //calling onFilterSubmit from App and passing the userInput as an argument
  handleFormSubmit = event => {
    event.preventDefault();
    this.props.onFilterSubmit(this.state.searchQuery);

    this.setState({
      searchQuery: ""
    });
  };
  // call handleFormSubmit function on submit
  // when user types into filterbar value is updated
  render() {
    return (
      <div className="filterBar">
        <form onSubmit={this.handleFormSubmit}>
          <label htmlFor="userInput" className="visuallyHidden">
            Search for Movies
          </label>
          <input
            id="userInput"
            type="text"
            placeholder="Search for Movies"
            name="userInput"
            value={this.state.searchQuery}
            onChange={this.handleSearchChange}
          />
          
          <button type="submit" className="searchMovies">
            <FontAwesomeIcon icon="search"/>
          </button>
        </form>
      </div>
    );
  }
}

export default FilterBar;
