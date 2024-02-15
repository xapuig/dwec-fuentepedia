'use client'
import {
    useLoadScript,
    GoogleMap,
    MarkerF,
    InfoWindow,
  } from '@react-google-maps/api';
import { useMemo, useState } from 'react';
import styles from '../../ui/home.module.css';
import { FuenteField, UbicacionField } from '@/app/lib/definitions';
import { useFormState } from 'react-dom';
import { createFuente } from '@/app/lib/actions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { number } from 'zod';


  export default function MapCreateMarker({ ubicacion, fuentes}: { ubicacion: UbicacionField[], fuentes: FuenteField[] }) {
    
    const [activeMarker, setActiveMarker] = useState(null);
    const [Latitud, setLatitud] = useState(0);
    const [Longitud, setLongitud] = useState(0);
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createFuente, initialState);
    

    const handleActiveMarker = (marker: any) => {
      if (marker === activeMarker) {
        return;
      }
      setActiveMarker(marker);
    };

    const handleClickOnMap = () => {
      setActiveMarker(null)
      
    }

  
  const [lat, setLat] = useState(Number(ubicacion[0].lat));
  const [lng, setLng] = useState(Number(ubicacion[0].lng));

  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);
  const myStyles = useMemo(() => [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [
            { visibility: "off" }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ], []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      styles: myStyles,
      minZoom: 15,
    }),
    [myStyles]
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

 
  
  return (
    
    <div className={styles.homeWrapper}>
      <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
      <input type ="hidden" name="ubicacionId" id="ubicacionId" value={ubicacion[0].id} />
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Escribe el nombre de la fuente"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
          </div>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.name &&
            state.errors.name.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
            </p>
            ))}
          </div>
        </div>
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="lat" className="mb-2 block text-sm font-medium">
            Latitud
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                required
                placeholder="Escribe la latitud para el marcador de la fuente"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="lat-error"
                onChange={e => setLatitud(e.target.valueAsNumber)}
                value={Latitud || ""}
              />
            </div>
          </div>
          <div id="lat-error" aria-live="polite" aria-atomic="true">
            {state.errors?.lat &&
            state.errors.lat.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
            </p>
            ))}
          </div>
        </div>
        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="lng" className="mb-2 block text-sm font-medium">
            Longitud
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                required
                placeholder="Escribe la longitud para el marcador de la fuente"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="lng-error"
                onChange={e => setLongitud(e.target.valueAsNumber)}
                value={Longitud || ""}
              />
            </div>
          </div>
          <div id="lng-error" aria-live="polite" aria-atomic="true">
            {state.errors?.lng &&
            state.errors.lng.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
            </p>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={'/dashboard/fuentes/' + ubicacion[0].id}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear fuente</Button>
      </div>
    </form>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '50%', height: '50vh' }}
        onLoad={(map) => console.log('Map Loaded')}
        onClick={ev => {
          if (ev.latLng) {
            handleClickOnMap();
            setLatitud(ev.latLng.lat());
            setLongitud(ev.latLng.lng());
          }
        }}
      >
         {fuentes.map((fuente) => (
              <MarkerF 
              key={fuente.id} 
              position={{ lat: Number(fuente.lat), lng: Number(fuente.lng) }} 
              onLoad={() => console.log('Marker Loaded')}
              icon={{
                url: 'https://i.imgur.com/HY488rK.png',
              }}
              onClick={() => handleActiveMarker(fuente.id)}                
              >
                {activeMarker === fuente.id ? (
                  <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                    <div>
                      {fuente.name}
                    </div>
                  </InfoWindow>
                ) : null}
              </MarkerF>
            ))}
      </GoogleMap>
    </div>
  );
  }