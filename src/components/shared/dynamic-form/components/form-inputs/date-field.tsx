// components/form/fields/date-field.tsx
"use client";

import {Controller, ControllerRenderProps} from "react-hook-form";
import DateTimePicker from "@/components/shared/components/date-time-picker";
import {getErrorMessage} from "../../utils/error-message";
import {FieldProps} from "../../types/field-props";

export function DateField({field, control, errors}: FieldProps) {
    const error = errors[field.name];
    const errorMessage = error ? getErrorMessage(error) : undefined;

    return (
        <div className={field.className}>
            <Controller
                name={field.name}
                control={control}
                render={({field: {onChange, value, ...fieldProps}}: { field: ControllerRenderProps }) => (
                    <DateTimePicker
                        date={value}
                        setDate={onChange}
                        disablePastDates={field.date?.disablePastDates}
                        disableFutureDates={field.date?.disableFutureDates}
                        includeTime={field.date?.showTime}
                        formatStr={field.date?.dateFormat || "yyyy-MM-dd"}
                        placeholder={field.placeholder || field.label}
                        disabledDates={field.date?.disabledDates}
                        onDateChange={onChange}
                        {...fieldProps}

                    />
                )}
            />
            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
}
