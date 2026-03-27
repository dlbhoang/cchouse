import MarkerClusterGroup from "@changey/react-leaflet-markercluster";
import "@changey/react-leaflet-markercluster/dist/styles.min.css";
import { Col, GlobalToken, Row, Tag, Typography, theme } from "antd";
import L from "leaflet";
import "leaflet-boundary-canvas";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { appConst } from "@/lib/core/configs/appConst";
import { IPropAdminMap } from "@/lib/interfaces/Property/IProp";
import { useAdminContext } from "@/lib/stored";
import RenderArea from "../shared/CustomRender/RenderArea";

const { Text, Paragraph, Title } = Typography;

const { useToken } = theme;

const icons = new L.Icon({
  iconUrl: "/home-removebg-preview.png",
  iconSize: [50, 50],
});

const curPosition = new L.Icon({
  iconUrl: "/my_location.png",
  iconSize: [40, 40],
});

type Props = {
  data: IPropAdminMap[];
  geo: any;
  polygon?: any;
};

const hcmPosition = { lat: 10.823099, lng: 106.629662 };

function MyComponent({
  geo,
  data,
  token,
  polygon,
}: { token: GlobalToken } & Props) {
  const map = useMap();

  const osm = L.TileLayer.boundaryCanvas(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      boundary: geo,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Vietnam shape <a href="https://github.com/johan/world.geo.json">johan/word.geo.json</a>',
    }
  );
  map.addLayer(osm);
  // map.fitBounds(L.geoJSON(geo).getBounds());

  if (data.length === 1 && data[0].PropAddress.Lat && data[0].PropAddress.Lng) {
    map.setView({ lat: data[0].PropAddress.Lat, lng: data[0].PropAddress.Lng });
  }

  const markers = data
    .filter((x) => (x.PropAddress.Lat ?? 0) > 0 && (x.PropAddress.Lng ?? 0) > 0)
    .map((e) => (
      <Marker
        icon={icons}
        key={e.Id}
        position={[e.PropAddress.Lat ?? 0, e.PropAddress.Lng ?? 0]}
      >
        <Popup maxWidth={300} maxHeight={250}>
          <Row gutter={[12, 12]} align="middle" justify="space-between">
            <Col span={24}>
              <Paragraph style={{ margin: 0 }} ellipsis={{ rows: 2 }}>
                <Tag
                  style={{
                    color: "#ffffff",
                    backgroundColor: appConst.PROP_STATUS_COLORS[e.Status - 1],
                  }}
                >
                  {`Mã: ${e?.Id}`}
                </Tag>
                {e.PropAddress.DisplayAddress}
              </Paragraph>
            </Col>
            <Col span={24}>
              <RenderArea
                area={e.Area}
                length={e.Length}
                width={e.Width}
                title="DTTT: "
              />
            </Col>

            <Col span={24}>
              <b>Kêt cấu:</b> {e.CustomDisplayStructures}
            </Col>
            <Col>
              <Title style={{ margin: 0, color: token["blue-7"] }} level={5}>
                {e.DisplayPrice}
              </Title>
            </Col>
            <Col>
              <Link href={`?PropertyId=${e.Id}`}>Chi tiết</Link>
            </Col>
          </Row>
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
        <MarkerClusterGroup>{...markers}</MarkerClusterGroup>
      )}
    </>
  );
}

const LocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng>();
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return !position || position === null ? null : (
    <Marker position={position} icon={curPosition}>
      <Popup>Bạn đang ở đây</Popup>
    </Marker>
  );
};

const Leaflet = ({ data, geo, polygon }: Props) => {
  const { token } = useToken();
  const { smallScreen } = useAdminContext();

  return (
    <MapContainer
      center={hcmPosition}
      zoom={12}
      style={{ height: smallScreen ? "100vh" : "85vh" }}
      zoomControl={false}
    >
      <MyComponent geo={geo} data={data} token={token} polygon={polygon} />
      {/* <LocationMarker /> */}
    </MapContainer>
  );
};

export default Leaflet;
