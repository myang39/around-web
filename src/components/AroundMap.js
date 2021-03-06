import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"
import {AroundMarker} from "./AroundMarker"
import {POS_KEY} from "../constants";

class NormalAroundMap extends React.Component {
  reloadMarkers = () => {

    const center = this.getCenter();
    const radius = this.getRadius();

    this.props.updatePosts({
        center,
        radius
      }
    );
  }

  getRadius = () => {
    const center = this.map.getCenter();
    const bounds = this.map.getBounds();
    if (center && bounds) {
      const ne = bounds.getNorthEast();
      const right = new window.google.maps.LatLng(center.lat(), ne.lng());
      return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right); 
    }
  }

  getCenter = () => {
    if (!this.map) return;
    const center = this.map.getCenter();
    return {
      lat: center.lat(),
      lon: center.lng()
    };
  }
  getMapRef = (mapInstance) => {
    this.map = mapInstance;
  }
  render() {
    const {lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
    const { posts } = this.props;
    return (
      <GoogleMap
        ref = {this.getMapRef}
        defaultZoom={10}
        defaultCenter={{ lat: lat, lng: lon }}
        onDragEnd = {this.reloadMarkers}
        onZoomChanged = {this.reloadMarkers}
      >
        {
          posts && posts.length > 0
          && posts.map(
            post => <AroundMarker post={post} key={post.url}/>
          )
        }
      </GoogleMap>
    );
  }
}

export const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));