import React, { Component } from "react";

class NavBar extends Component {
  state = {};
  render() {
    return (
      <nav className="navbar navbar-expand-md">
        <img src="logo.svg" alt="EZ Weather" />
      </nav>
    );
  }
}

export default NavBar;
