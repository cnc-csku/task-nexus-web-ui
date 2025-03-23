import { AttributeType } from "@/enums/Project";
import { AttributeTemplate } from "@/interfaces/Project";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { DatePicker } from "@heroui/date-picker";
import { fromDate } from "@internationalized/date";
import { IoMdClose } from "react-icons/io";
import { browserTimezone } from "@/utils/timeUtils";

export interface CustomAttributeEditorProps {
  attribute: AttributeTemplate;
  data: any;
}

export default function CustomAttributeEditor({ attribute, data }: CustomAttributeEditorProps) {
  return (
    <div className="w-full">
      {attribute.type === AttributeType.String && (
        <Input
          type="text"
          size="sm"
          key={attribute.name}
          defaultValue={data}
        />
      )}
      {attribute.type === AttributeType.Number && (
        <Input
          type="number"
          size="sm"
          key={attribute.name}
          defaultValue={data}
        />
      )}
      {attribute.type === AttributeType.Boolean && (
        <label className="bg-gray-100 hover:bg-gray-200 flex justify-start gap-2 px-3 rounded-lg h-12 items-center">
          <Checkbox
            size="sm"
            defaultSelected={data}
          >
            <div className="text-gray-600">{attribute.name}</div>
          </Checkbox>
        </label>
      )}
      {attribute.type === AttributeType.Date && (
        <div className="flex items-center gap-2">
          <DatePicker
            granularity="day"
            value={data ? fromDate(new Date(data), browserTimezone()) : null}
            selectorButtonPlacement="start"
            endContent={
              <button
                type="button"
                color="danger"
                className="hover:bg-red-300 rounded-lg p-2 hover:text-red-500"
              >
                <IoMdClose />
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}
