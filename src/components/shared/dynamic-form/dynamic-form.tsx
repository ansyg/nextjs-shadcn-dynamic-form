// components/dynamic-form.tsx
'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	FormControl,
	FormDescription,
	FormField as ShadcnFormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/shared/dynamic-form/types/form';
import { SelectField } from '@/components/shared/dynamic-form/components/form-inputs/select-field';
import { CheckboxField } from '@/components/shared/dynamic-form/components/form-inputs/checkbox-field';
import { RadioField } from '@/components/shared/dynamic-form/components/form-inputs/radio-field';
import { DateField } from '@/components/shared/dynamic-form/components/form-inputs/date-field';
import { TextAreaField } from '@/components/shared/dynamic-form/components/form-inputs/text-area-field';
import { TextEditorField } from '@/components/shared/dynamic-form/components/form-inputs/text-editor-field';
import { MultiSelectField } from '@/components/shared/dynamic-form/components/form-inputs/multi-select-field';
import { useVisibilityEvaluator } from '@/components/shared/dynamic-form/hooks/field-visibility';
import { InputField } from '@/components/shared/dynamic-form/components/form-inputs/input-field';
import { cn } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';

interface DynamicFormProps {
	fields: FormField[];
	onSubmit: (values: any) => void;
	defaultValues?: any;
	submitText?: string;
	className?: string;
}

export function DynamicForm({
	fields,
	onSubmit,
	defaultValues,
	submitText = 'Submit',
	className = '',
}: DynamicFormProps) {
	// Generate Zod schema
	const schemaFields: Record<string, any> = {};

	fields.forEach((field: FormField) => {
		let fieldValidator: z.ZodTypeAny = z.any();

		if (field.validationRules?.required) {
			fieldValidator = fieldValidator.refine(
				(val: any) => {
					if (val === undefined || val === null) return false;
					if (typeof val === 'string' && val.trim() === '') return false;
					if (Array.isArray(val) && val.length === 0) return false;
					return true;
				},
				{
					message: `${field.label || field.name} is required`,
				}
			);
		}

		if (field.type === 'number') {
			fieldValidator = z.number();
			if (field.validationRules?.min !== undefined) {
				fieldValidator = fieldValidator.min(field.validationRules.min, {
					message: `Must be at least ${field.validationRules.min}`,
				});
			}
			if (field.validationRules?.max !== undefined) {
				fieldValidator = fieldValidator.max(field.validationRules.max, {
					message: `Must be at most ${field.validationRules.max}`,
				});
			}
		}

		// @ts-ignore
		if (field.type === 'text' || field.type === 'textarea') {
			fieldValidator = z.string();
			if (field.validationRules?.minLength !== undefined) {
				fieldValidator = fieldValidator.min(field?.validationRules?.minLength, {
					message: `Must be at least ${field.validationRules?.minLength} characters`,
				});
			}
			if (field.validationRules?.maxLength !== undefined) {
				fieldValidator = fieldValidator.max(field.validationRules.maxLength, {
					message: `Must be at most ${field.validationRules.maxLength} characters`,
				});
			}
			if (field.validationRules?.pattern !== undefined) {
				fieldValidator = fieldValidator.regex(
					new RegExp(field.validationRules.pattern),
					{
						message: 'Invalid format',
					}
				);
			}
		}

		// @ts-ignore
		if (field.type === 'email') {
			fieldValidator = z.string().email({
				message: 'Invalid email address',
			});
		}

		schemaFields[field.name] = fieldValidator;
	});

	const formSchema = z.object(schemaFields);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {},
		mode: 'onChange',
	});

	return (
		<Card className='w-full min-w-xl p-5'>
			<CardHeader>
				<CardTitle>
					Responsive Nextjs Dynamic Form build with shadcn ui components{' '}
				</CardTitle>
				<CardDescription>
					This dynamic form is a nextjs , built with shadcn ui components , with
					form hooks and zod builders. Form is simulated into ui from
					standardized json schema definition
				</CardDescription>
			</CardHeader>
			<Separator orientation='horizontal' className='flex w-full' />
			<CardContent>
				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						{/* <FormFields fields={fields.filter((f:FormField)=>f.render)} form={form}/> */}
						<FormFields fields={fields} form={form} />

						<Button type='submit' className='w-full md:w-auto gap-4 my-3'>
							{submitText}
						</Button>
					</form>
				</FormProvider>
			</CardContent>
		</Card>
	);
}

// Extract the fields rendering to a separate component that can access the form context
function FormFields({ fields, form }: { fields: FormField[]; form: any }) {
	const { isVisible } = useVisibilityEvaluator(fields);

	return (
		<div className='grid  grid-cols-12 gap-y-3 gap-x-2 '>
			{fields?.map((field: FormField) => {
				// if (!isVisible(field.name)) return null;

				return (
					<ShadcnFormField
						key={field.name}
						control={form.control}
						name={field.name}
						render={({
							field: FormField,
							fieldState,
						}: {
							field: FormField;
							fieldState: any;
						}) => (
							<FormItem className={cn(' col-span-12 ', field.className)}>
								<div className='space-y-2'>
									{field.label && (
										<FormLabel>
											{field.label}
											{field.validationRules?.required && (
												<span className='text-red-500 ml-1'>*</span>
											)}
										</FormLabel>
									)}

									<FormControl>
										{(() => {
											switch (field && field.type && field.type) {
												case 'text':
												case 'number':
												case 'email':
												case 'file':
													return (
														<InputField
															field={field}
															register={form.register}
															errors={fieldState.error}
															control={form.control}
														/>
													);

												case 'options':
													return (
														<SelectField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);
												case 'checkbox':
													return (
														<CheckboxField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);
												case 'radio':
													return (
														<RadioField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);
												case 'date':
													return (
														<DateField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);
												case 'text-area':
													return (
														<TextAreaField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);

												case 'multi-select':
													return (
														<MultiSelectField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);
												case 'text-editor':
													return (
														<TextEditorField
															field={field}
															control={form.control}
															errors={fieldState.error}
															register={form.register}
														/>
													);
												default:
													return (
														<div>Unsupported field type: {field.type}</div>
													);
											}
										})()}
									</FormControl>
									{field.description && (
										<FormDescription>{field.description}</FormDescription>
									)}
									<FormMessage className='text-xs text-red-500 mt-1 ' />
								</div>
							</FormItem>
						)}
					/>
				);
			})}
		</div>
	);
}
