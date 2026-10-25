import { Form } from "antd";
import { ETransType } from "@/lib/core/enum";
import { IPropAdminOpts } from "@/lib/interfaces/filter/ISearchOptions";
import { useAdminContext } from "@/lib/stored";
import { DesktopView } from "./DesktopView";
import { MobileView } from "./MobileView";
import { usePropertyFilter } from "./usePropertyFilter";

type Props = {
  model: IPropAdminOpts;
  onSubmit: (values: IPropAdminOpts) => void;
  mapMode?: boolean;
};

const PropertyFilter = ({ model, onSubmit, mapMode = false }: Props) => {
  const { smallScreen } = useAdminContext();
  const { form, handleRefresh } = usePropertyFilter(model, onSubmit, mapMode);

  return (
    <Form
      name="basic"
      onFinish={onSubmit}
      autoComplete="off"
      form={form}
      layout="vertical"
      initialValues={{
        TransType: ETransType.sell,
      }}
    >
      {smallScreen ? (
        <MobileView form={form} model={model} handleRefresh={handleRefresh} mapMode={mapMode} />
      ) : (
        <DesktopView
          form={form}
          model={model}
          handleRefresh={handleRefresh}
          mapMode={mapMode}
        />
      )}
    </Form>
  );
};

export default PropertyFilter;
