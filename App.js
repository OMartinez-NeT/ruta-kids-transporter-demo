import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import useLocation from './useLocation';
import React, { useEffect, useState } from 'react';
import haversine from 'haversine-distance'
export default function App() {

  console.log('Opening')

  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [trackLocation, setTrackLocation] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [targetPoint, setTargetPoint] = useState(null);
  useLocation({ locationUpdate: setCoordinates, trackLocation: trackLocation })


  // It only updates when coordinates change
  useEffect(() => {

    if(activeRoute == null){
      axios.get('http://localhost:3000/api/routes/active-route', {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI'
        }
      })
      .then(res => {
        console.log('Active route', res.data)
        setActiveRoute(res.data)
        setRoutePoints(res.data.points)
        setTrackLocation(true)
      })
      .catch(e => {
        console.log('Error getting active route')
        console.log(e)
      })
    }
  }, [activeRoute])
    

  useEffect(() => {
      console.log('App coordinates', coordinates)

      if(coordinates.latitude !== 0 && coordinates.longitude !== 0) {
      // Update active route position (This endpoint will fail if there is no active route)
        axios.put('http://localhost:3000/api/routes/update-position', {
          coordinates
        }, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI'
          }
        }).catch(e => {
          console.log('Error updating position')
          console.log(e)
        })
    }
  }, [coordinates.latitude, coordinates.longitude])


  console.log('App coordinates', coordinates)
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      {/* add button that call to {{baseUrl}}/api/start-route using bearer token  Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI*/}
     
      {activeRoute === null &&  <Button title="Start Route" onPress={() => {
        console.log('Coordinates to send', coordinates)
        axios.post('http://localhost:3000/api/routes/start-route', {
          dayId: 1,
          timeSlotId: 1,
          coordinates,
        }, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI'
          }}
        ).then((res) => {
          console.log('Route started ', res.data);
          setRoutePoints(res.data.points)
          setTrackLocation(true);
          setActiveRoute(res.data.points);
          console.log('Target point', res.data.target)
          setTargetPoint(res.data.target);
        }).catch(err => {
          console.log(err)
          console.log(err.data)
          console.log('Error starting route');
        })

      }} /> } 
      {!!activeRoute && <Button title="Stop Route" onPress={ () => {

          axios.put('http://localhost:3000/api/routes/finish-route', {}, {
            headers: {
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI'
            }
          }).then((res) => {
            console.log('Route finished ', res.data);
            setRoutePoints([]);
            setTargetPoint(null);
            setTrackLocation(false);
            setActiveRoute(null);
          }).catch(err => {
            console.log(err)
            console.log(err.data)
            console.log('Error starting route');
          })

      } }/>}
      {/* Show current location lat and long */}
      <Text>Latitude: {coordinates.latitude}</Text>
      <Text>Longitude: {coordinates.longitude}</Text>

      {/* Show list of route points the transporter has to pick with a button that says: PICK UP */}

      {/* Show list of route points the transporter has to drop with a button that says: DROP OFF */}
      <Text style={{fontWeight: 'bold'}}>Route Points</Text>


      {targetPoint !== null && <View> 

        <Text>Target Point</Text>
        <Text>{targetPoint.name} {targetPoint.lastName}</Text>
        </View>}


      {routePoints.map((routePoint) => {
        console.log('Route point', routePoint)
        console.log('My coordinates', coordinates)
        return (
          // Route point {"id": 31, "status": "WAITING", "student": {"address": {"address": "Union Latino Americana", "coordinates": [Object], "createdAt": "2023-09-02T21:36:13.928Z", "deletedAt": null, "id": 1, "name": "Casa", "updatedAt": "2023-09-02T21:36:13.928Z"}, "lastName": "Martinez", "name": "Amy"}}


          <View key={routePoint.id}>
            <Text>{routePoint.student.name} {routePoint.student.lastName}</Text>
            <Text>{routePoint.student.address.address}</Text>
            <Text>{routePoint.student.address.coordinates.latitude}</Text>
            <Text>{routePoint.student.address.coordinates.longitude}</Text>
            <Text>Status:</Text>
           <Text>Distance: {haversine(
              // Student coordinates
              { latitude: routePoint.student.address.coordinates.latitude, longitude: routePoint.student.address.coordinates.longitude },
              // Transporter coordinates
              { latitude: coordinates.latitude, longitude: coordinates.longitude }
           )}  mts</Text>
     
            {routePoint.status === 'WAITING' &&        <Button title="Pick Up" onPress={() => {
                axios.put(`http://localhost:3000/api/routes/route-points/${routePoint.id}/pick-up`, {
              }, { headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI'
              }}).then((res) => {
                routePoints.find((rp) => rp.id === routePoint.id).status = 'PICKED_UP';
                setRoutePoints([...routePoints]);
                console.log('NEW TARGET POINT', res.data.target)
                setTargetPoint(res.data.target);
              }).catch(err => {
                console.log(err)
                debugger
                console.log(err.data)
                console.log('Error picking up');
              })
              }} /> 
            }

            {!routePoint.arrivalNotified &&  <Button title="Notify arrival" onPress={() => {
                console.log('Notifying arrival')
                axios.put(`http://localhost:3000/api/routes/route-points/${routePoint.id}/arrive`, {
              },{
                headers: {
                  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0cmFuc3BvcnRlckB0ZXN0LmNvbSIsImlhdCI6MTY5MzU3OTI1MiwiZXhwIjoxNzc5OTc5MjUyfQ.iOQItVGtF5FHi3c6AGwSHAM87IrcPw2fA6T9GpIXHkI'
                }
              }).then((res) => {
                routePoints.find((rp) => rp.id === routePoint.id).arrivalNotified = true;
                setRoutePoints([...routePoints]);
              }).catch(err => {
                console.log(err)
                debugger
                console.log(err.data)
                console.log('Error notifying arrival');
              })
            }} /> }
          
          
          </View>
        )
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


