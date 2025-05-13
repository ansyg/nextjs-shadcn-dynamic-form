// components/form/fields/text-field.tsx
import {Input} from "@/components/ui/input";
import {FieldProps} from "../../types/field-props";
import {getErrorMessage} from "../../utils/error-message";
import {Controller, ControllerRenderProps} from "react-hook-form";
import {cn} from "@/lib/utils";

export function NumberField({
                                field,
                                control,
                                errors,
                            }: FieldProps & { getColorClass?: (index: number) => string }) {

    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: {onChange, value, ...fieldProps}}: { field: ControllerRenderProps }) => (

                <div className={field.className}>
                    <Input
                        type="text"
                        className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        )}
                        placeholder={field.placeholder || field.label}
                        {...fieldProps}
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
        />
    )
        ;
}