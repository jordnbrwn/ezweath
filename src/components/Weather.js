import React, { Component } from "react";

class Weather extends Component {
  render() {
    return (
      <div className="weather">
        <h1>
          {Math.round(
            ((parseFloat(this.props.temperature) - 273.15) * 9) / 5 + 32
          )}
          <sup>&deg;</sup>
        </h1>
        <p>{this.props.conditions.toString().replace(/-/g, " ")}</p>
      </div>
    );
  }
}

export default Weather;
