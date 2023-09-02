import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import React from "react";

const LOCATION_TRACKING = "location-tracking";

// Define task manager
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  // if (data) {
  //   const { locations } = data;
  //   latitude = locations[0].coords.latitude;
  //   longitude = locations[0].coords.longitude;
  //   userLocation = {
  //     latitude,
  //     longitude,
  //   }
  //   console.log(`${new Date(Date.now()).toLocaleString()}: ${latitude},${longitude}`);
  // }
});

export default function useLocation(props) {
  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 1000,

    });
    const hasStarted =
      await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
    console.log("tracking started?", hasStarted);
  };

  React.useEffect(() => {
    // Ask for permissions
    const config = async () => {
      const resf = await Location.requestForegroundPermissionsAsync();
      const resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };
    if(props.trackLocation) {
      config();
      startLocationTracking();

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      }, location => {
        console.log('location update', location)
        props.locationUpdate({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      })
    }

    if(!props.trackLocation) {
      stopLocation();
    }

  }, [props.trackLocation]);



  const stopLocation = () => {
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  }
}
