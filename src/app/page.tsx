'use client'
import {DynamicForm} from "@/components/shared/dynamic-form/dynamic-form";
import {FormField} from "@/components/shared/dynamic-form/types/form";

const fields: FormField[] = [
    {
        name: 'ctcClientId',
        label: 'CTC Client ID',
        type: 'text',
        className: 'col-span-12 md:col-span-6',
        value: '',
        render: false,
        validationRules: {
            required: true,
        },
    },
    {
        name: 'cd4Count',
        type: 'number',
        label: 'CD4 Count',
        render: true,
        value: '',
        parentId: 'cd4Count',
        className: 'col-span-12 md:col-span-6',
        validationRules: {
            required: false,
        },
    },
    {
        name: 'cragTest',
        type: 'options',
        label: 'Craig Test',
        option: {
            options: [{name: 'Negative'}, {name: 'Positive'}],
            optionLabel: 'name',
            optionValue: 'name',
        },
        render: true,
        value: '',
        parentId: 'cd4Count',
        className: 'col-span-12 md:col-span-4',
        validationRules: {
            required: true,
        },
        visibilityConditions: {
            visibleConditions: 'any',
            visibilities: [
                {
                    parentFieldName: 'cd4Count',
                    conditionsRule: 'any',
                    conditions: [{expression: '<', value: 200}],
                },
                {
                    parentFieldName: 'whoStage',
                    conditionsRule: 'any',
                    conditions: [
                        {expression: '=', value: 3},
                        {expression: '=', value: 4},
                    ],
                },
                {
                    parentFieldName: 'age',
                    conditionsRule: 'any',
                    conditions: [{expression: '>=', value: 5}],
                },
            ],
        },
    },
    {
        name: 'weight',
        type: 'number',
        label: 'Client Weight (Kg)',
        placeholder: 'Weight',
        number: {
            minFractionDigits: 0,
            maxFractionDigits: 2,
            suffix: ' (Kg)',
        },
        render: true,
        value: '',
        parentId: 'cd4Count',
        className: 'col-span-12 md:col-span-4',
        validationRules: {
            required: true,
        },
    },
    {
        name: 'whoStage',
        type: 'options',
        option: {
            options: [{id: 1, order: 'Order 1'}, {id: 2, order: 'Order 2'}],
            optionLabel: 'order',
            optionValue: 'id',
        },
        label: 'WHO Stage',
        placeholder: 'Stage',
        render: true,
        value: '',
        parentId: 'cd4Count',
        className: 'col-span-12 md:col-span-3',
        validationRules: {
            required: true,
        },
    },
    {
        name: 'isPregrant',
        type: 'radio',
        label: 'Is Pregnant',
        radio: {
            options: [
                {label: 'Yes', value: true},
                {label: 'No', value: false},
            ],
        },
        render: true,
        value: '',
        className: 'col-span-12 md:col-span-6',
        validationRules: {
            required: true,
        },
    },
    {
        name: 'breastFeeding',
        type: 'radio',
        label: 'Breast Feeding',
        radio: {
            options: [
                {label: 'Yes', value: true},
                {label: 'No', value: false},
            ],
        },
        render: true,
        value: '',
        className: 'col-span-12 md:col-span-6',
        validationRules: {
            required: true,
        },
    },
    {
        name: 'familyPlanning',
        type: 'options',
        option: {
            optionLabel: 'name',
            optionValue: 'name',
            options: [
                {name: 'Not Using'},
                {name: 'Depo Injection'},
                {name: 'Sterilization'},
                {name: 'Traditional/Withdrawal'},
                {name: 'Pills'},
                {name: 'Implants'},
                {name: 'Condom'},
                {name: 'IUCD'},
                {name: 'Pregnant/Child'},
                {name: 'Others (specify)'},
            ],
        },
        label: 'Family Planning info',
        render: true,
        value: '',
        className: 'col-span-12',
        validationRules: {
            required: true,
        },
    },
    {
        name: 'otherFamilyPlanning',
        type: 'text-editor',
        label: 'Other family planning',
        render: true,
        parentId: 'familyPlanning',
        className: 'col-span-12',
        validationRules: {
            required: true,
        },
        visibilityConditions: {
            parentFieldName: 'familyPlanning',
            conditionsRule: 'any',
            conditions: [{expression: '=', value: 'Others (specify)'}],
        },
    },

    {
        name: 'familyPlanningOpts',
        type: 'multi-select',
        option: {
            optionLabel: 'name',
            optionValue: 'name',
            dataKey: 'name',
            options: [
                {name: 'Depo Injection'},
                {name: 'Sterilization'},
                {name: 'Traditional/Withdrawal'},
                {name: 'Pills'},
                {name: 'Implants'},
                {name: 'Condom'},
                {name: 'IUCD'},
            ],
        },
        label: 'Family Planning info Multiples',

        render: true,
        value: '',
        className: 'col-span-12',
        validationRules: {
            required: true,
        },
    },
];

export default function Home() {
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <DynamicForm fields={fields} onSubmit={(values: any) => {
                    console.log('form-data', values);
                }}/>
            </main>

        </div>
    );
}
