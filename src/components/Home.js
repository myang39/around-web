import React from 'react';

import { Tabs, Spin, Row, Col, Radio} from 'antd';
import {API_ROOT, TOKEN_KEY, AUTH_HEADER, POS_KEY, GEO_OPTIONS} from "../constants";
import { Gallery } from './Gallery';
import { CreatePostButton } from './CreatePostButton';
import {AroundMap} from "./AroundMap"



const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

export class Home extends React.Component {
  state = {
    isLoadingGeoLocation: false,
    isLoadingPosts: false,
    error: '',
    posts: [],
    topic: 'around'
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

  getPanelContent = (type) => {
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
      return type === "image" ? this.getImagePosts() : this.getVideoPosts();
    }
    return 'No nearby posts.';

  }

    getVideoPosts = () => {

      return (
        <Row gutter={32}>
          {
            this.state.posts
              .filter((post) => post.type === "video")
              .map((post) => (
                <Col span={6} key={post.url}>
                  <video src = {post.url} controls className="video-block"/>
                  <p>{`${post.user} : ${post.message}`}</p>
                </Col>
                ))
          }
        </Row>
      );
    }

    getImagePosts = () => {
      const images=this.state.posts
        .filter((post) => post.type === "image")
        .map((post) =>({
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

    onTopicChange = (e) => {
        const topic = e.target.value;
        this.setState({topic});
        this.updatePosts({topic});
    }

    loadFacesAroundTheWorld = () => {
      const token = localStorage.getItem(TOKEN_KEY);
      this.setState({isLoadingPosts: true});
      fetch(`${API_ROOT}/cluster?term=face`,
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
        })
        .then((response)=> {
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

    updatePosts = ({topic, center, radius}) => {
        topic = topic || this.state.topic;
        if (topic === 'around') {
          this.loadNearbyPosts(center, radius);
        } else {
          this.loadFacesAroundTheWorld();
        }
    }


  render() {
    const operations = <CreatePostButton loadNearbyPosts = {this.loadNearbyPosts}/>;

    return (
      <div>
        <RadioGroup onChange={this.onTopicChange} value={this.state.topic}
        className="topic-radio-group">
          <Radio value ="around">Posts Around Me</Radio>
          <Radio value ="face">Faces Around The World</Radio>
        </RadioGroup>
        <Tabs tabBarExtraContent={operations} className="main-tabs">
          <TabPane tab="Image Posts" key="1">
            {this.getPanelContent("image")}
          </TabPane>
          <TabPane tab="Video Posts" key="2">
            {this.getPanelContent("video")}
          </TabPane>
          <TabPane tab="Map" key="3">
            <AroundMap
              isMarkerShown
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `600px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              posts={this.state.posts}
              updatePosts={this.updatePosts}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
