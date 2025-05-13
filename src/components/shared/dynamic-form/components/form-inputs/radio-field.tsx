import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {FieldProps} from "../../types/field-props";
import {Controller, ControllerRenderProps} from "react-hook-form";
import {getErrorMessage} from "../../utils/error-message";

export function RadioField({
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


                <>
                    <div className="flex-wrap items-center justify-center gap-x-2">

                        <RadioGroup
                            onValueChange={onChange}
                            value={value}
                            className="flex  space-y-2">
                            {field?.radio?.options?.map((option, index) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value={option.value}
                                        id={`${field.name}-${option.value}`}
                                        {...fieldProps}
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
                    </div>
                </>
            )}
        />
    );
}
