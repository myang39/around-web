import React from 'react';
import { Marker, InfoWindow } from "react-google-maps";
import blueMarkerUrl from '../assets/images/blue-marker.svg';


export class AroundMarker extends React.Component {
  state = {
    isOpen: false
  }

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));

    // this.setState(({isOpen}) => ({
    //   isOpen: !isOpen
    // }));
    // ths.setState(({isOpen})=> )
  }
  render() {
    const {user, location, message, url, type} = this.props.post;
    const isImagePost = type === 'image';
    const icon = isImagePost ? undefined : {
      url: blueMarkerUrl,
      scaledSize: new window.google.maps.Size(26, 41),
    };

    return (
      <Marker
        position = {{ lat: location.lat, lng: location.lon }}
        onMouseOver= {isImagePost ? this.toggleOpen: undefined}
        onMouseOut = {isImagePost ? this.toggleOpen: undefined}
        onClick =   {!isImagePost ? this.toggleOpen : undefined}
        icon = {icon}
      >
        {
          this.state.isOpen ?
            <InfoWindow onCloseClick={this.toggleOpen}>
              <div>
                {
                  isImagePost ? (
                    <img
                      alt={message}
                      src = {url}
                      className="around-marker-image"
                    />
                  ): (
                    <video
                      src={url}
                      controls
                      className="around-marker-video"
                    />
                  )
                }

                <p>{`${user} : ${message}`}</p>
              </div>
            </InfoWindow>
            :
            null
        }

      </Marker>
    );
  }
}