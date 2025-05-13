// components/form/fields/text-field.tsx
import {Input} from "@/components/ui/input";
import {FieldProps} from "../../types/field-props";
import {getErrorMessage} from "../../utils/error-message";
import {Controller, ControllerRenderProps} from "react-hook-form";
import {cn} from "@/lib/utils";

export function InputField({
                               field,
                               control,
                               errors,
                           }: FieldProps & { getColorClass?: (index: number) => string }) {


    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: {onChange, value, ...fieldProps}}: { field: ControllerRenderProps }) => {
                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const inputValue = field && field.type && parseInputValue(e, field.type);
                    onChange(inputValue);
                };
                return (<div className={field.className}>

                        <Input
                            type={field.type}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            )}
                            placeholder={field.placeholder || field.label}
                            disabled={field.disabled}
                            onChange={handleChange}
                            {...fieldProps}

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


// utils/parseInputValue.ts

export function parseInputValue(e: React.ChangeEvent<HTMLInputElement>, fieldType: string) {
    switch (fieldType) {
        case 'number':
            return e.target.value === '' ? undefined : Number(e.target.value);
        case 'file':
            return e.target.files?.[0];
        default:
            return e.target.value;
    }
}
