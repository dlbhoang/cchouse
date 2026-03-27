"use client";
import { AimOutlined } from "@ant-design/icons";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import { Button } from "antd";
import L from "leaflet";

import "leaflet-boundary-canvas";
import "leaflet/dist/leaflet.css";
import { ReactNode, useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  MapContainerProps,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

const hcmPosition = { lat: 10.823099, lng: 106.629662 };

const PositionButton = () => {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  return (
    <div className={POSITION_CLASSES.topright}>
      <div className="leaflet-control">
        <Button
          onClick={() => {
            map.locate();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 3000);
          }}
          icon={<AimOutlined />}
          loading={loading}
        />
      </div>
    </div>
  );
};

const VNMap = ({
  position,
  onPositionChange,
}: {
  position?: L.LatLng;
  onPositionChange?: (position: L.LatLng) => void;
}) => {
  const map = useMap();
  useMapEvents({
    locationfound(e) {
      onPositionChange?.(e.latlng);
      map.flyTo(e.latlng, 16);
    },
  });

  useEffect(() => {
    if (position) map.flyTo(position, 16);
  }, [position]);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      const response = await fetch("/data/vnm.geo.json");
      const geoJSON = await response.json();

      const osm = L.TileLayer.boundaryCanvas(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          boundary: geoJSON,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Vietnam shape <a href="https://github.com/johan/world.geo.json">johan/word.geo.json</a>',
        }
      );
      map.addLayer(osm);
    };

    fetchGeoJSON();
  }, []);

  return !position || position === null ? (
    <></>
  ) : (
    <Circle radius={100} center={position}>
      <Popup>Bạn đang ở đây</Popup>
    </Circle>
  );
};

type Props = {
  position?: { lat: number; lng: number };
  onPositionChange?: (position: L.LatLng) => void;
  searchItem?: ReactNode;
  children?: ReactNode;
} & MapContainerProps;

const BaseMap = ({
  position,
  onPositionChange,
  searchItem,
  children,
  style = { height: 400 },
  ...props
}: Props) => {
  console.log(position);
  return (
    <MapContainer
      center={hcmPosition}
      zoom={16}
      style={style}
      zoomControl={false}
      {...props}
    >
      {searchItem && (
        <div className={POSITION_CLASSES.topleft}>
          <div className="leaflet-control ">{searchItem}</div>
        </div>
      )}
      {children}
      <VNMap
        position={position ? L.latLng(position) : undefined}
        onPositionChange={onPositionChange}
      />
      {onPositionChange && <PositionButton />}
    </MapContainer>
  );
};

export default BaseMap;
