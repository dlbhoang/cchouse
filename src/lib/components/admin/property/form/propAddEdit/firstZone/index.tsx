import {
  Checkbox,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TransStatusConfirm } from "@/lib/components/shared/MyConfirm";
import {
  LocationFeatureSelect,
  LocationSelect,
  PropTypeSelect,
  TransStatusSelect,
  UsageLawSelect,
} from "@/lib/components/shared/MySelect";
import { IPropResponse } from "@/lib/interfaces/Property/IProp";

type Props = {
  form: FormInstance;
  model?: IPropResponse;
  isFull: boolean;
};

const colFullResponsive = {
  xs: 24,
  lg: 12,
};

const colQuickResponsive = {
  xs: 24,
};

const FirstZone = ({ model, form, isFull }: Props) => {
  const router = useRouter();
  const LocationWatch = Form.useWatch(["PropAddress", "Location"], form);

  const transType = form.getFieldValue("TransType");
  const [alleyTurns, setAlleyTurns] = useState<number | null>(
    model?.PropAddress.AlleyTurns ?? null
  );
  const [showPropName, setShowPropName] = useState(
    !!model?.PropAddress.PropName
  );

  // const { data } = apartmentApi.useGet({ pageIndex: 1, pageSize: 100 });

  useEffect(() => {
    form.setFieldValue(
      ["PropAddress", "AlleyValues"],
      Array(alleyTurns).fill(null)
    );
  }, [alleyTurns, form]);

  if (isFull)
    return (
      <Row gutter={12}>
        <Col lg={8} xl={8} xs={24}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                <Typography.Text>Loại BĐS</Typography.Text>

                <Checkbox
                  defaultChecked={model?.RootId === 3}
                  onChange={(e) =>
                    form.setFieldValue("RootId", e.target.checked ? 3 : 0)
                  }
                >
                  Độc quyền
                </Checkbox>
              </div>
            }
            name={["PropAddress", "PropTypeId"]}
            rules={[{ required: true, message: "Loại BĐS không để trống!" }]}
          >
            <PropTypeSelect
              onChange={(val) => {
                if (["3", "4", "5", "6", "8", "9"].includes(val?.toString())) {
                  setShowPropName(true);
                } else {
                  setShowPropName(false);
                }
              }}
            />
          </Form.Item>
        </Col>
        {showPropName && (
          <Col lg={8} xl={8} xs={24}>
            <Form.Item
              label="Tên bất động sản"
              name={["PropAddress", "PropName"]}
            >
              <Input placeholder="Tên gọi khác (nếu có)" />
            </Form.Item>
          </Col>
        )}
        <Col lg={8} xl={8} xs={12}>
          <Form.Item
            label="Trạng thái giao dịch"
            name="Status"
            rules={[{ required: true }]}
          >
            {model?.Id ? (
              <TransStatusConfirm
                propId={model.Id}
                transType={Number(model.TransType)}
                transStatus={model.Status}
                handleOkClick={(status, reason) => {
                  form.setFieldValue("Status", status);
                  if (reason && reason !== "")
                    form.setFieldValue("Note", reason);
                }}
              />
            ) : (
              <TransStatusSelect transType={transType} disabled={!model?.Id} />
            )}
          </Form.Item>
        </Col>

        <Col lg={8} xl={8} xs={12}>
          <Form.Item
            label="Mục đích sử dụng"
            name={["PropAddress", "UsageLaw"]}
          >
            <UsageLawSelect />
          </Form.Item>
        </Col>

        <Col lg={8} xl={8} xs={12}>
          <Form.Item
            label={
              <div className="form-item-checkbox">
                <Typography.Text>Vị trí</Typography.Text>
                <Checkbox
                  defaultChecked={model?.PropAddress.IsOneWay}
                  onChange={(e) =>
                    form.setFieldValue(
                      ["PropAddress", "IsOneWay"],
                      e.target.checked
                    )
                  }
                >
                  1 Chiều
                </Checkbox>
              </div>
            }
            name={["PropAddress", "Location"]}
            rules={[{ required: true, message: "Vị trí không để trống!" }]}
          >
            <LocationSelect />
          </Form.Item>
        </Col>
        <Col lg={8} xl={8} xs={12}>
          <Form.Item
            label="Đặc điểm vị trí"
            name={["PropAddress", "LocationFeature"]}
          >
            <LocationFeatureSelect />
          </Form.Item>
        </Col>
        <Col lg={8} xl={8} xs={24}>
          {LocationWatch === 2 ? (
            <Form.Item
              label="Cách mặt tiền (m)"
              name={["PropAddress", "DistanceToFont"]}
            >
              <InputNumber />
            </Form.Item>
          ) : (
            <Form.Item
              label="Độ rộng đường(m)"
              name={["PropAddress", "StreetWidth"]}
            >
              <InputNumber />
            </Form.Item>
          )}
        </Col>

        {LocationWatch === 2 && (
          <>
            <Col xs={12} lg={8} xl={6}>
              <Form.Item label="Số lần rẽ" name={["PropAddress", "AlleyTurns"]}>
                <InputNumber max={5} onChange={setAlleyTurns} />
              </Form.Item>
            </Col>
            {alleyTurns && alleyTurns > 0 && (
              <Form.List name={["PropAddress", "AlleyValues"]}>
                {(fields) => (
                  <>
                    {fields.map((field, index) => (
                      <Col xs={12} lg={8} xl={6} key={field.key}>
                        <Form.Item
                          name={[field.name]}
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                          label={`Lần rẽ ${index + 1} (m)`}
                        >
                          <InputNumber />
                        </Form.Item>
                      </Col>
                    ))}
                  </>
                )}
              </Form.List>
            )}
          </>
        )}
      </Row>
    );

  return (
    <Row gutter={12}>
      <Col lg={8} xl={8} xs={12}>
        <Form.Item
          label="Trạng thái giao dịch"
          name="Status"
          rules={[{ required: true }]}
        >
          {model?.Id ? (
            <TransStatusConfirm
              propId={model.Id}
              transType={Number(model.TransType)}
              transStatus={model.Status}
              handleOkClick={(status, reason) => {
                form.setFieldValue("Status", status);
                if (reason && reason !== "") form.setFieldValue("Note", reason);
              }}
            />
          ) : (
            <TransStatusSelect transType={transType} disabled={!model?.Id} />
          )}
        </Form.Item>
      </Col>

      <Col lg={8} xl={8} xs={24}>
        <Form.Item
          label={
            <div className="form-item-checkbox">
              <Typography.Text>Loại BĐS</Typography.Text>

              <Checkbox
                defaultChecked={model?.RootId === 3}
                onChange={(e) =>
                  form.setFieldValue("RootId", e.target.checked ? 3 : 0)
                }
              >
                Độc quyền
              </Checkbox>
            </div>
          }
          name={["PropAddress", "PropTypeId"]}
          rules={[{ required: true, message: "Loại BĐS không để trống!" }]}
        >
          <PropTypeSelect
            onChange={(val) => {
              if (["3", "4", "5", "6", "8", "9"].includes(val?.toString())) {
                setShowPropName(true);
              } else {
                setShowPropName(false);
              }
            }}
          />
        </Form.Item>
      </Col>
      {showPropName && (
        <Col lg={8} xl={8} xs={24}>
          <Form.Item
            label="Tên bất động sản"
            name={["PropAddress", "PropName"]}
          >
            <Input placeholder="Tên gọi khác (nếu có)" />
          </Form.Item>
        </Col>
      )}

      <Col lg={8} xl={8} xs={12}>
        <Form.Item
          label={
            <div className="form-item-checkbox">
              <Typography.Text>Vị trí</Typography.Text>
              <Checkbox
                defaultChecked={model?.PropAddress.IsOneWay}
                onChange={(e) =>
                  form.setFieldValue(
                    ["PropAddress", "IsOneWay"],
                    e.target.checked
                  )
                }
              >
                1 Chiều
              </Checkbox>
            </div>
          }
          name={["PropAddress", "Location"]}
          rules={[{ required: true, message: "Vị trí không để trống!" }]}
        >
          <LocationSelect />
        </Form.Item>
      </Col>

      {LocationWatch === 2 && (
        <>
          <Col xs={12} lg={8} xl={6}>
            <Form.Item label="Số lần rẽ" name={["PropAddress", "AlleyTurns"]}>
              <InputNumber max={5} onChange={setAlleyTurns} />
            </Form.Item>
          </Col>
          {alleyTurns && alleyTurns > 0 && (
            <Form.List name={["PropAddress", "AlleyValues"]}>
              {(fields) => (
                <>
                  {fields.map((field, index) => (
                    <Col xs={12} lg={8} xl={6} key={field.key}>
                      <Form.Item
                        name={[field.name]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        label={`Lần rẽ ${index + 1} (m)`}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Col>
                  ))}
                </>
              )}
            </Form.List>
          )}
        </>
      )}
    </Row>
  );
};

export default FirstZone;
