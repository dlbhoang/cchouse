import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";

import { IPropAdminMap } from "@/lib/interfaces/Property/IProp";
import { hasMapCoordinates } from "@/lib/core/utils/map-coordinates";

const propertyPin = (label?: string) => {
  const safeLabel = String(label ?? "BĐS")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return L.divIcon({
    className: "admin-map-property-pin-wrapper",
    html: `<span class="admin-map-property-pin" title="${safeLabel}">${safeLabel}</span>`,
    iconSize: [72, 28],
    iconAnchor: [36, 28],
  });
};

type Props = {
  data: IPropAdminMap[];
  polygon?: any;
};

const hcmPosition = { lat: 10.845, lng: 106.675 };

function MyComponent({
  data,
  polygon,
}: Props) {
  const map = useMap();
  const searchParams = useSearchParams();
  const properties = Array.isArray(data) ? data : [];

  useEffect(() => {
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
      {
        subdomains: "abc",
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    osm.addTo(map);
    map.invalidateSize();
    return () => {
      osm.remove();
    };
  }, [map]);

  useEffect(() => {
    const positions = properties.flatMap(({ PropAddress }) =>
      hasMapCoordinates(PropAddress) ? [L.latLng(PropAddress.Lat, PropAddress.Lng)] : []
    );
    if (!positions.length) return;
    const size = map.getSize();
    const desktop = size.x > 768;
    map.fitBounds(L.latLngBounds(positions), {
      paddingTopLeft: [desktop ? 380 : 24, 24],
      paddingBottomRight: [24, desktop ? 24 : Math.round(size.y * 0.5)],
      maxZoom: 14,
    });
  }, [properties, map]);

  const markers = properties
    .filter((x) => hasMapCoordinates(x?.PropAddress))
    .map((e) => (
      <Marker
        icon={propertyPin(e.DisplayPrice)}
        key={e.Id}
        position={[e.PropAddress.Lat ?? 0, e.PropAddress.Lng ?? 0]}
      >
        <Popup
          className="admin-map-property-popup"
          closeButton={false}
          maxWidth={330}
          minWidth={300}
          offset={[0, -12]}
        >
          <Link
            className="admin-map-property-card"
            href={`?${(() => {
              const params = new URLSearchParams(searchParams?.toString() ?? "");
              params.set("PropertyId", e.Id.toString());
              return params.toString();
            })()}`}
          >
            <div className="admin-map-property-card-heading">
              <span className="admin-map-property-card-id">Mã: {e.Id}</span>
              <strong>{e.PropAddress.DisplayAddress}</strong>
            </div>
            <div className="admin-map-property-card-line">
              <span>Kết cấu:</span> {e.CustomDisplayStructures || "—"}
            </div>
            {e.PropAddress.PropTypeName && (
              <div className="admin-map-property-card-line">
                <span>Loại:</span> {e.PropAddress.PropTypeName}
              </div>
            )}
            <div className="admin-map-property-card-footer">
              <span>
                <span className="admin-map-property-card-muted">DTTT:</span>{" "}
                {e.Area?.toLocaleString("vi-VN")}m²
                {e.Width && e.Length ? ` (${e.Width}x${e.Length}m)` : ""}
              </span>
              <span className="admin-map-property-card-price">
                <span className="admin-map-property-card-muted">Giá:</span>{" "}
                <b>{e.DisplayPrice || "—"}</b>
                {e.PricePerSquareMeter && (
                  <small>{e.PricePerSquareMeter}</small>
                )}
              </span>
            </div>
          </Link>
        </Popup>
      </Marker>
    ));

  const swappedCoordsArray =
    polygon?.[0]?.map((coords: number[]) => [coords?.[1], coords?.[0]]) ?? [];

  return (
    <>
      <Polygon
        pathOptions={{
          color: "lime",
          dashArray: [5, 5],
        }}
        positions={swappedCoordsArray}
        eventHandlers={{
          click: () => {
            map.fitBounds(swappedCoordsArray);
          },
        }}
      />
      {markers.length > 0 && (
        <MarkerClusterGroup
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: { getChildCount: () => number }) => L.divIcon({
            className: "marker-cluster marker-cluster-small",
            html: `<div><span>${cluster.getChildCount()}</span></div>`,
            iconSize: [36, 36],
          })}
        >{markers}</MarkerClusterGroup>
      )}
    </>
  );
}

const MapSizeObserver = () => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    map.invalidateSize();
    return () => observer.disconnect();
  }, [map]);

  return null;
};

const Leaflet = ({ data, polygon }: Props) => {
  return (
    <MapContainer
      center={hcmPosition}
      zoom={14}
      maxZoom={19}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <MapSizeObserver />
      <MyComponent data={data} polygon={polygon} />
    </MapContainer>
  );
};

export default Leaflet;
