import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { MapContainer, Marker, Polygon, Popup, useMap } from "react-leaflet";

import { IPropAdminMap } from "@/lib/interfaces/Property/IProp";
import { hasMapCoordinates } from "@/lib/core/utils/map-coordinates";

const propertyPin = (label?: string, selected = false) => {
  const safeLabel = String(label ?? "BĐS")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return L.divIcon({
    className: `admin-map-property-pin-wrapper${selected ? " is-selected" : ""}`,
    html: `<span class="admin-map-property-pin" title="${safeLabel}">${safeLabel}</span>`,
    iconSize: [72, 28],
    iconAnchor: [36, 28],
  });
};

type Props = {
  data: IPropAdminMap[];
  polygon?: any;
  focusedProperty?: IPropAdminMap;
  resultsOpen?: boolean;
};

const hcmPosition = { lat: 10.845, lng: 106.675 };

function MyComponent({ data, polygon, focusedProperty, resultsOpen = false }: Props) {
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
      },
    );
    osm.addTo(map);
    map.invalidateSize();
    return () => {
      osm.remove();
    };
  }, [map]);

  useEffect(() => {
    const positions = properties.flatMap(({ PropAddress }) =>
      hasMapCoordinates(PropAddress)
        ? [L.latLng(PropAddress.Lat, PropAddress.Lng)]
        : [],
    );
    if (!positions.length) return;
    const size = map.getSize();
    const desktop = size.x > 768;
    map.fitBounds(L.latLngBounds(positions), {
      paddingTopLeft: [desktop && resultsOpen ? 380 : 24, 24],
      paddingBottomRight: [24, desktop ? 24 : Math.round(size.y * 0.5)],
      maxZoom: 14,
    });
  }, [properties, map, resultsOpen]);

  useEffect(() => {
    if (!hasMapCoordinates(focusedProperty?.PropAddress)) return;
    const { Lat, Lng } = focusedProperty.PropAddress;
    const zoom = 17;
    const size = map.getSize();
    const offset =
      size.x > 768 && resultsOpen
        ? L.point(-190, 0)
        : size.x > 768
          ? L.point(0, 0)
          : L.point(0, size.y * 0.22);
    const center = map.unproject(
      map.project([Lat, Lng], zoom).add(offset),
      zoom,
    );
    map.flyTo(center, zoom, { duration: 0.45 });
  }, [focusedProperty, map, resultsOpen]);

  const markerProperties =
    focusedProperty && hasMapCoordinates(focusedProperty.PropAddress)
      ? [
          ...properties.filter((item) => item.Id !== focusedProperty.Id),
          focusedProperty,
        ]
      : properties;
  const markers = markerProperties
    .filter((x) => hasMapCoordinates(x?.PropAddress))
    .map((e) => (
      <Marker
        icon={propertyPin(e.DisplayPrice, focusedProperty?.Id === e.Id)}
        zIndexOffset={focusedProperty?.Id === e.Id ? 1000 : 0}
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
              const params = new URLSearchParams(
                searchParams?.toString() ?? "",
              );
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

  // GIS files may contain either Polygon ([ring]) or MultiPolygon
  // ([polygon [ring]]) coordinates. Leaflet expects one or more lat/lng rings.
  const firstBoundary = Array.isArray(polygon?.[0]?.[0]?.[0])
    ? polygon.flatMap((part: number[][][]) => part)
    : Array.isArray(polygon?.[0]?.[0])
      ? polygon
      : [polygon];
  const boundaryPositions = firstBoundary
    .filter((ring: unknown) => Array.isArray(ring))
    .map((ring: number[][]) =>
      ring
        .filter(
          (coords) =>
            Array.isArray(coords) &&
            Number.isFinite(coords[0]) &&
            Number.isFinite(coords[1]),
        )
        .map(([lng, lat]) => [lat, lng]),
    );

  return (
    <>
      <Polygon
        pathOptions={{
          color: "#13b7c5",
          weight: 2,
          opacity: 0.95,
          fillColor: "#13b7c5",
          fillOpacity: 0.06,
          lineJoin: "round",
        }}
        positions={boundaryPositions}
        eventHandlers={{
          click: () => {
            if (boundaryPositions.length) map.fitBounds(boundaryPositions);
          },
        }}
      />
      {markers.length > 0 && (
        <MarkerClusterGroup
          showCoverageOnHover={false}
          iconCreateFunction={(cluster: { getChildCount: () => number }) =>
            L.divIcon({
              className: "marker-cluster marker-cluster-small",
              html: `<div><span>${cluster.getChildCount()}</span></div>`,
              iconSize: [36, 36],
            })
          }
        >
          {markers.filter(
            (marker) => marker.key !== focusedProperty?.Id.toString(),
          )}
        </MarkerClusterGroup>
      )}
      {markers.find((marker) => marker.key === focusedProperty?.Id.toString())}
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

const Leaflet = ({ data, polygon, focusedProperty, resultsOpen = false }: Props) => {
  return (
    <MapContainer
      center={hcmPosition}
      zoom={14}
      maxZoom={19}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <MapSizeObserver />
      <MyComponent
        data={data}
        polygon={polygon}
        focusedProperty={focusedProperty}
        resultsOpen={resultsOpen}
      />
    </MapContainer>
  );
};

export default Leaflet;
