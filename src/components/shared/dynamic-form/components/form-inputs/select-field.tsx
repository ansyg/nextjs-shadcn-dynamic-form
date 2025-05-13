// components/form/fields/select-field.tsx
'use client';

import {Controller, useFormContext} from 'react-hook-form';

import {useEffect, useState} from 'react';
import {FieldProps} from "@/components/shared/dynamic-form/types/field-props";
import {getErrorMessage} from "@/components/shared/dynamic-form/utils/error-message";
import DropDownSelect, {Option} from "@/components/shared/components/dropdown-select";
import {useQueryParams} from "@/components/shared/dynamic-form/hooks/use-query-params";

export function SelectField({field, control, errors}: FieldProps) {
    const {setValue, trigger} = useFormContext();
    const error = errors && errors[field.name];
    const errorMessage = error ? getErrorMessage(error) : undefined;
    const [isLoading, setIsLoading] = useState(false);
    const [apiOptions, setApiOptions] = useState<Option[]>([]);
    const queryParams = useQueryParams();

    // Load options from API when URL params or field config changes
    useEffect(() => {
        const loadOptions = async () => {
            if (!field.option?.apiUrl) return;

            try {
                setIsLoading(true);

                // Construct URL with query params
                const url = new URL(field.option.apiUrl);

                // Add URL params to API request
                if (field.option.urlParamMap) {
                    Object.entries(field.option.urlParamMap).forEach(([paramKey, queryKey]) => {
                        if (queryParams[queryKey]) {
                            url.searchParams.set(paramKey, queryParams[queryKey]);
                        }
                    });
                }

                // Add static query params
                if (field.option.queryParams) {
                    Object.entries(field.option.queryParams).forEach(([key, value]) => {
                        url.searchParams.set(key, String(value));
                    });
                }

                const response = await fetch(url.toString());
                const data = await response.json();

                // Transform API response if needed
                const options = field.option.transformResponse
                    ? field.option.transformResponse(data)
                    : data;

                setApiOptions(options);
            } catch (error) {
                console.error('Error loading options:', error);
                setApiOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadOptions();
    }, [queryParams, field.option?.apiUrl, field.option?.urlParamMap, field.option?.queryParams]);

    // Combine static and API-loaded options
    const allOptions = [
        ...(field.option?.options || []),
        ...apiOptions
    ];

    return (
        <div className={field.className}>

            <Controller
                name={field.name}
                control={control}
                render={({field: {value, ...fieldProps}}) => (
                    <DropDownSelect
                        {...fieldProps}
                        options={allOptions}
                        optionLabel={field.option?.optionLabel}
                        optionValue={field.option?.optionValue}
                        dataKey={field.option?.dataKey}
                        placeholder={field.placeholder || field.label}
                        defaultValue={value}
                        onValueChange={(selectedOption: Option) => {
                            setValue(field.name, selectedOption);
                            trigger(field.name);
                        }}
                        isSearchable={field.option?.filter || true}
                        isLoading={isLoading || field.isLoading}
                        disabled={field.disabled}
                        noResultText={field.option?.emptyMessage || 'No options found'}
                        className={field.inputClass}
                    />
                )}
            />
            {errorMessage && (
                <p className="text-sm text-red-500">{errorMessage}</p>
            )}
        </div>
    );
}