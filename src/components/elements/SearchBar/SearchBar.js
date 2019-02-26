import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import "./SearchBar.css";

class SearchBar extends Component {
  state = {
    value: ""
  };

  timeout = null;

  doSearch = event => {
    const { callback } = this.props;

    //setting state for user search text
    this.setState({ value: event.target.value });
    //don't fire search method on every keystroke. make use of timeout function and wait for 1/2 sec.
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      callback(false, this.state.value);
    }, 500);
  };

  render() {
    return (
      <div className="rmdb-searchbar">
        <div className="rmdb-searchbar-content">
          <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
          <input
            type="text"
            className="rmdb-searchbar-input"
            placeholder="Search"
            onChange={this.doSearch}
            value={this.state.value}
          />
        </div>
      </div>
    );
  }
}

export default SearchBar;
