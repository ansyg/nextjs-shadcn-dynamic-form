import {RadioGroup} from "@/components/ui/radio-group";
import {FieldProps} from "../../types/field-props";
import {Controller, ControllerRenderProps} from "react-hook-form";
import {getErrorMessage} from "../../utils/error-message";
import {Checkbox} from "@/components/ui/checkbox";
import {cn} from "@/lib/utils";

export function CheckboxField({
                                  field,
                                  control,
                                  errors,
                                  getColorClass,
                              }: FieldProps & { getColorClass?: (index: number) => string }) {
    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: {onChange, value, ...fieldProps}}: { field: ControllerRenderProps }) => (
                <RadioGroup
                    onValueChange={onChange}
                    value={value}
                    className="flex flex-col space-y-2">
                    {field?.checkbox?.options?.map((option, index) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                                checked={option.value}
                                id={`${field.name}-${option.value}`}
                                onCheckedChange={field?.checkbox?.onChange}
                                {...fieldProps}
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                            />
                            <label
                                htmlFor={`${field.name}-${option.value}`}
                                className={getColorClass?.(index) || "text-gray-700"}>
                                {option.label}
                            </label>

                            {errors && errors[field.name] && (
                                <p className="text-sm text-red-500">
                                    {getErrorMessage(errors[field.name])}
                                </p>
                            )}
                        </div>
                    ))}
                </RadioGroup>
            )}
        />
    );
}
