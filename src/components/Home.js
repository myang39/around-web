import React from 'react';

import { Tabs, Button, Spin } from 'antd';
import {API_ROOT, TOKEN_KEY, AUTH_HEADER, POS_KEY, GEO_OPTIONS} from "../constants";
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import {AroundMap} from "./AroundMap"


export const TabPane = Tabs.TabPane;

export class Home extends React.Component {
  state = {
    isLoadingGeoLocation: false,
    isLoadingPosts: false,
    error: '',
    posts: []
  }

  componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition (
        this.onSuccessLoadGeoLocation,
        this.onFailLoadGeoLocation,
        GEO_OPTIONS
      );
      this.setState({ isLoadingGeoLocation : true});
    } else {
      this.setState({ error : 'Your browser does not support geolocation!'});
    }
  }

  onSuccessLoadGeoLocation = (position) => {
    console.log(position);
    const { latitude, longitude } = position.coords;
    localStorage.setItem(POS_KEY, JSON.stringify({
      lat: latitude,
      lon: longitude
    }));
    this.setState({ isLoadingGeoLocation: false});
    this.loadNearbyPosts();
  }

  onFailLoadGeoLocation = () => {
    this.setState({
      isLoadingGeoLocation: false,
      error: 'Failed to load geolocation.'
    })
  }

  loadNearbyPosts = (center, radius) => {
    // TODO:
    // 1. read location: lat, lon
    // 2. request posts from API
    // 3. setState, put returned posts into state
    const {lat, lon} = center || JSON.parse(localStorage.getItem(POS_KEY));
    const range = radius || 20;
    const token = localStorage.getItem(TOKEN_KEY);
    // console.log(lat, lon);
    this.setState({isLoadingPosts: true});
    fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`,
      {
        method: 'GET',
        headers: {
          Authorization: `${AUTH_HEADER} ${token}`
        }
      }
      )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
    }).then((response)=> {
      console.log('response', response);
      if (response == null) {
        console.log('response is null');
        this.setState({
          isLoadingPosts: false
        })
      } else {
        this.setState({
          isLoadingPosts: false,
          posts: response
        })
      }
    })
      .catch((error) => {
        this.setState({
          isLoadingPosts: false,
          error: error.message
        })
      });
  }

  getImagePosts = () => {
    if (this.state.error) {
      return <div>{this.state.error}</div>;
    }
    if (this.state.isLoadingGeoLocation) {
      return <Spin tip="Loading geo location..." />;
    }
    if (this.state.isLoadingPosts) {
      return <Spin tip="Loading posts..." />;
    }

    // debugger;
    if (this.state.posts && this.state.posts.length > 0) {
      const images=this.state.posts.map((post) =>({
        user: post.user,
        src: post.url,
        thumbnail: post.url,
        caption: post.message,
        thumbnailWidth: 400,
        thumbnailHeight: 300
        })
      );
      return <Gallery images={images}/>;
    }
    return 'No nearby posts.';

    // TODO: Render Posts from API

  }

  render() {
    const operations = <CreatePostButton loadNearbyPosts = {this.loadNearbyPosts}/>;

    return (
      <Tabs tabBarExtraContent={operations} className="main-tabs">
        <TabPane tab="Posts" key="1">
          {this.getImagePosts()}
        </TabPane>
        <TabPane tab="Map" key="2">
          <AroundMap
            isMarkerShown
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `600px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            posts={this.state.posts}
            loadNearbyPosts = {this.loadNearbyPosts}
          />
        </TabPane>
      </Tabs>
    );
  }
}