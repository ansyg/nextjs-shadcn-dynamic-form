// components/form/fields/text-field.tsx
import {FieldProps} from "../../types/field-props";
import {getErrorMessage} from "../../utils/error-message";
import {Controller, ControllerRenderProps} from "react-hook-form";
import RichTextEditor from "@/components/shared/components/rich-text-input";

export function TextEditorField({
                                    field,
                                    control,
                                    errors,
                                }: FieldProps & { getColorClass?: (index: number) => string }) {
    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: {onChange, value, ...fieldProps}}: { field: ControllerRenderProps }) => {


                return (

                    <div className={field.className}>


                        <RichTextEditor
                            placeholder={field.placeholder || field.label}
                            label={field.placeholder || field.label}
                            val={field.value}
                            {...fieldProps}
                            onChange={onChange}
                            disabled={field.disabled}

                        />
                        {errors && errors[field.name] && (
                            <p className="text-sm text-red-500">
                                {getErrorMessage(errors[field.name])}
                            </p>
                        )}
                    </div>


                )

            }
            }
        />
    )
        ;
}