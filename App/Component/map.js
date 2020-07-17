import Geolocation from '@react-native-community/geolocation';
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
var polyline = require('@mapbox/polyline');

class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: 20.4843341,
            longitude: 85.8290394,
            error: null,
            isLoading: false,
            coords: [],
            concat: 0.0000,
            destinationLat: 20.492862696697237,
            destinationLong: 85.83784326910971,
            concatLot2: 0.000000
        };
    }

    mergeLot = () => {
        const { latitude, longitude, destinationLat, destinationLong } = this.state;
        if (latitude != null && longitude != null && destinationLat != null && destinationLong != null) {
            let concatLot = `${latitude},${longitude}`
            let concatLot2 = `${destinationLat},${destinationLong}`
            this.setState({
                concat: concatLot,
                concatLot2: concatLot2
            }, () => {
                const distance = this.getDistanceFromLatLonInKm(latitude.toString(), longitude.toString(), destinationLat.toString(), destinationLong.toString(), "K")
                Alert.alert(`${Math.round(distance * 10000) / 10000} km.`)
                this.getDirections(concatLot, concatLot2);
            });
        }

    }


    getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2, unit) => {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit == "K") { dist = dist * 1.609344 }
            if (unit == "N") { dist = dist * 0.8684 }
            return dist;
        }
    }



    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=AIzaSyDq8HUBXjUo5p21LehM0TeUYDxpurX-iPs`)
            let respJson = await resp.json();

            let points = polyline.decode(respJson.routes[0].overview_polyline.points);

            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            this.setState({ coords: coords })
            return coords
        } catch (error) {
            alert(error)
            return error
        }
    }

    componentDidMount = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    onMapPress = (coord) => {
        this.setState({
            destinationLat: coord.latitude,
            destinationLong: coord.longitude
        }, () => this.mergeLot());
    }

    render() {
        const { latitude, longitude, cordLatitude, cordLongitude, x, coords, destinationLat, destinationLong } = this.state;
        return (
            <View style={style.mapContainer}>
                <MapView provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={style.map}
                    region={{
                        latitude: 20.4843341,
                        longitude: 85.8290394,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    onPress={(event) => { event.stopPropagation(); this.onMapPress(event.nativeEvent.coordinate) }}
                    zoomEnabled={true}
                    showsUserLocation={true}
                    showsCompass={true}
                    showsPointsOfInterest={true}
                >

                    <Marker
                        coordinate={{ latitude: latitude, longitude: longitude }}
                        title={"Your Location"}
                    />

                    <Marker
                        coordinate={{ latitude: destinationLat, longitude: destinationLong }}
                        title={"Your Destination"}
                    />

                    <Polyline
                        coordinates={coords}
                        strokeWidth={2}
                        strokeColor="red" />
                </MapView>
            </View>
        );
    }
}

export default MapScreen;


const style = StyleSheet.create({

    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
})
