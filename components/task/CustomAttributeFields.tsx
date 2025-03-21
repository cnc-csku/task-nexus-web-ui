import { AttributeType } from "@/enums/Project";
import { AttributeTemplate } from "@/interfaces/Project";
import { CreateTaskRequestType } from "@/interfaces/Task";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Control, Controller, UseFormRegister, UseFormResetField } from "react-hook-form";
import { DatePicker } from "@heroui/date-picker";
import { fromDate } from "@internationalized/date";
import { IoMdClose } from "react-icons/io";

export interface CustomAttributeFieldsProps {
  control: Control<CreateTaskRequestType>;
  attributes: AttributeTemplate[];
  register: UseFormRegister<CreateTaskRequestType>;
  resetField: UseFormResetField<CreateTaskRequestType>;
}

export default function CustomAttributeFields({
  control,
  attributes,
  register,
  resetField,
}: CustomAttributeFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {attributes.map((attribute) => (
        <div
          key={attribute.name}
          className="w-full"
        >
          {attribute.type === AttributeType.String && (
            <Input
              label={attribute.name}
              type="text"
              size="sm"
              key={attribute.name}
              {...register(`additionalFields.${attribute.name}`)}
            />
          )}
          {attribute.type === AttributeType.Number && (
            <Input
              label={attribute.name}
              type="number"
              size="sm"
              key={attribute.name}
              {...register(`additionalFields.${attribute.name}`, {
                valueAsNumber: true,
              })}
            />
          )}
          {attribute.type === AttributeType.Boolean && (
            <label className="bg-gray-100 hover:bg-gray-200 flex justify-start gap-2 px-3 rounded-lg h-full items-center">
              <Checkbox
                size="sm"
                {...register(`additionalFields.${attribute.name}`)}
              >
                <div className="text-gray-600">{attribute.name}</div>
              </Checkbox>
            </label>
          )}
          {attribute.type === AttributeType.Date && (
            <Controller
              name={`additionalFields.${attribute.name}`}
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <DatePicker
                    label={attribute.name}
                    granularity="day"
                    value={field.value ? fromDate(field.value, "UTC") : null}
                    onChange={(dateValue) => {
                      field.onChange(dateValue ? dateValue.toDate() : null);
                    }}
                    selectorButtonPlacement="start"
                    endContent={
                      <button
                        type="button"
                        color="danger"
                        className="hover:bg-red-300 rounded-lg p-2 hover:text-red-500"
                        onClick={() =>
                          resetField(`additionalFields.${attribute.name}`, { defaultValue: null })
                        }
                      >
                        <IoMdClose />
                      </button>
                    }
                  />
                </div>
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
