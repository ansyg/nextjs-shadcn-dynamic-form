'use client'
import {FormField, VisibilityCondition} from "@/components/shared/dynamic-form/types/form";
import {useCallback, useEffect, useState} from "react";
import {useFormContext} from "react-hook-form";

export const useVisibilityEvaluator = (fields: FormField[]) => {
    const {watch} = useFormContext();
    const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

    const evaluateCondition = useCallback(
        (condition: VisibilityCondition, formValues: any): boolean => {
            const {parentFieldName, conditions, conditionsRule = 'all'} = condition;

            const results = conditions.map((cond) => {
                const fieldValue = cond.objectKey
                    ? parentFieldName && formValues[parentFieldName]?.[cond.objectKey]
                    : parentFieldName && formValues[parentFieldName];

                switch (cond.expression) {
                    case 'exists':
                    case 'answered':
                        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
                    case 'not_answered':
                        return fieldValue === undefined || fieldValue === null || fieldValue === '';
                    case '=':
                        return fieldValue === cond.value;
                    case '!=':
                        return fieldValue !== cond.value;
                    case '>':
                        return fieldValue > cond.value;
                    case '>=':
                        return fieldValue >= cond.value;
                    case '<':
                        return fieldValue < cond.value;
                    case '<=':
                        return fieldValue <= cond.value;
                    default:
                        return false;
                }
            });

            return conditionsRule === 'all'
                ? results.every((r) => r)
                : results.some((r) => r);
        },
        []
    );

    useEffect(() => {
        const subscription = watch((formValues) => {
            const newVisibleFields = new Set<string>();

            fields.forEach((field) => {
                const visibility = field.visibilityConditions;

                if (!visibility) {
                    newVisibleFields.add(field.name);
                    return;
                }

                if ('visibilities' in visibility) {
                    const visible =
                        visibility.visibleConditions === 'all'
                            ? visibility.visibilities.every((vc) =>
                                evaluateCondition(vc, formValues)
                            )
                            : visibility.visibilities.some((vc) =>
                                evaluateCondition(vc, formValues)
                            );
                    if (visible) newVisibleFields.add(field.name);
                } else {
                    if (evaluateCondition(visibility, formValues)) {
                        newVisibleFields.add(field.name);
                    }
                }
            });

            setVisibleFields(newVisibleFields);
        });

        return () => subscription.unsubscribe();
    }, [fields, watch, evaluateCondition]);

    return {
        visibleFields,
        isVisible: (fieldName: string) => visibleFields.has(fieldName),
    };
};
