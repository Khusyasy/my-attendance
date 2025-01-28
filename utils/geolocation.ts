export const getGeolocation = (): Promise<GeolocationPosition> => {
  if (!import.meta.client)
    throw new Error(
      "function getGeolocation is only available in the client / browser",
    );
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by the client / browser");
  }

  return new Promise(
    (resolve: PositionCallback, reject: PositionErrorCallback) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    },
  );
};
