import {FieldProps} from "../../types/field-props";
import {Controller, ControllerRenderProps} from "react-hook-form";
import {Label} from "@radix-ui/react-select";
import {Textarea} from "@/components/ui/textarea";
import {getErrorMessage} from "@/components/shared/dynamic-form/utils/error-message";

export function TextAreaField({
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
                <div className="grid w-full gap-1.5">
                    <Label htmlFor={`${field.name}`}
                    >{field.label}</Label>
                    {errors[field.name] && (
                        <p className="text-sm text-red-500">
                            {getErrorMessage(errors[field.name])}
                        </p>
                    )}
                    <Textarea placeholder={field.placeholder || field.label || 'Type your message here .'}
                              id={`${field.name}`}
                              {...fieldProps}
                    />
                </div>

            )
            }
        />
    )
        ;
}
