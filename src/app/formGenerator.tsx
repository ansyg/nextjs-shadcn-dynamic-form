import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { FormField } from '@/components/shared/dynamic-form/types/form';
import { DynamicForm } from '@/components/shared/dynamic-form/dynamic-form';

const inputTypes = [
	'text',
	'password',
	'email',
	'number',
	'date',
	'checkbox',
	'options',
	'radio',
	'file',
	'multi-select',
	'text-editor',
];

const validations = [
	'required',
	'minLength',
	'maxLength',
	'pattern',
	'email',
	'min',
	'max',
	'date',
];

type ValidationRule = {
	key: string;
	value: string;
};

type FormValues = {
	parentId: string;
	name: string;
	label: string;
	className: string;
	type: string;
	defaultValue: string;
	render: boolean;
	hasValidationRules: string; // 'yes' or 'no'
	validationRules: ValidationRule[];
	radioOptions: { label: string; value: string }[];
	optionItems: { value: string }[];
};

export default function FormGenerator() {
	const fields: any[] = [];
	const {
		register,
		handleSubmit,
		setValue,
		control,
		clearErrors,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			parentId: '',
			name: '',
			label: '',
			className: '',
			type: '',
			defaultValue: '',
			render: true,
			hasValidationRules: 'no',
			validationRules: [],
			radioOptions: [],
			optionItems: [],
		},
	});

	const radioOptions = useFieldArray({
		control,
		name: 'radioOptions',
	});

	const optionItems = useFieldArray({
		control,
		name: 'optionItems',
	});

	const validationRules = useFieldArray({
		control,
		name: 'validationRules',
	});

	const selectedType = useWatch({ control, name: 'type' });
	const hasValidationRules = useWatch({ control, name: 'hasValidationRules' });

	useEffect(() => {
		radioOptions.replace([]);
		optionItems.replace([]);
		clearErrors('radioOptions');
		clearErrors('optionItems');
	}, [selectedType]);

	useEffect(() => {
		if (hasValidationRules === 'no') {
			validationRules.replace([]);
			clearErrors('validationRules');
		}
	}, [hasValidationRules]);

	const onSubmit = (data: FormValues) => {
		if (data.hasValidationRules === 'yes') {
			const entries = data.validationRules.map((rule) => {
				let parsedValue;

				if (rule.value === 'true') {
					parsedValue = true;
				} else if (rule.value === 'false') {
					parsedValue = false;
				} else if (!isNaN(Number(rule.value))) {
					parsedValue = Number(rule.value);
				} else {
					parsedValue = rule.value;
				}

				return [rule.key, parsedValue];
			});

			const validationRules = Object.fromEntries(entries);
			data.validationRules = validationRules as any;
		}

		const convertToFormField = (json: any): FormField => {
			const baseField: FormField = {
				parentId: json.parentId,
				name: json.name,
				label: json.label,
				className: json.className,
				type: json.type,
				render: json.render,
				value: json.defaultValue,
				validationRules: json.validationRules,
			};

			if (json.type === 'radio') {
				baseField.option = json.radioOptions;
			} else if (json.type === 'options' || json.type === 'multi-select') {
				const optionsList = json.optionItems.map((item: any) => ({
					name: item.value,
				}));

				baseField.option = {
					optionLabel: 'name',
					optionValue: 'name',
					dataKey: 'name',
					options: optionsList,
				};
			}

			return baseField;
		};

		const fields: FormField[] = [convertToFormField(data)];

		console.log(fields, 'clean data');

		// <DynamicForm
		// 	fields={fields}
		// 	onSubmit={(values: any) => {
		// 		console.log('form-data', values);
		// 	}}
		// />;
	};

	return (
		<Card className='max-w-3xl mx-auto mt-10 p-6'>
			<CardContent>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='grid grid-cols-3 gap-4'
				>
					{selectedType === 'text-editor' && (
						<div className='flex flex-col col-span-3'>
							<Label htmlFor='parentId'>Parent ID</Label>
							<Input
								id='parentId'
								{...register('parentId', {
									required: 'Parent ID is required when type is text-editor',
								})}
							/>
							{errors.parentId && (
								<span className='text-red-500 text-sm'>
									{errors.parentId.message}
								</span>
							)}
						</div>
					)}

					<div className='flex flex-col'>
						<Label htmlFor='id'>ID</Label>
						<Input
							id='name'
							{...register('name', { required: 'ID is required' })}
						/>
						{errors.name?.message && (
							<span className='text-red-500 text-sm'>
								{String(errors.name.message)}
							</span>
						)}
					</div>

					<div className='flex flex-col'>
						<Label htmlFor='label'>Label Name</Label>
						<Input
							id='label'
							{...register('label', { required: 'Label Name is required' })}
						/>
						{errors.label?.message && (
							<span className='text-red-500 text-sm'>
								{String(errors.label.message)}
							</span>
						)}
					</div>

					<div className='flex flex-col'>
						<Label htmlFor='className'>Class Name</Label>
						<Input id='className' {...register('className')} />
					</div>

					<div className='flex flex-col'>
						<Label htmlFor='type'>Type</Label>
						<Select
							value={selectedType}
							onValueChange={(value) =>
								setValue('type', value, { shouldValidate: true })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Select a type' />
							</SelectTrigger>
							<SelectContent>
								{inputTypes.map((type) => (
									<SelectItem key={type} value={type}>
										{type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.type?.message && (
							<span className='text-red-500 text-sm'>
								{String(errors.type.message)}
							</span>
						)}
						<input
							type='hidden'
							{...register('type', { required: 'Type is required' })}
						/>
					</div>

					{/* Multi-select options input - only show when type === 'multi-select' */}
					{selectedType === 'multi-select' && (
						<div className='col-span-3'>
							<Label>Multi-Select Options</Label>
							{optionItems.fields.map((field, index) => (
								<div
									key={field.id}
									className='grid grid-cols-2 gap-4 items-end mt-2'
								>
									<div className='flex flex-col'>
										<Input
											{...register(`optionItems.${index}.value`, {
												required: 'Option required',
											})}
										/>
									</div>
									<Button
										type='button'
										variant='destructive'
										onClick={() => optionItems.remove(index)}
									>
										Remove
									</Button>
								</div>
							))}
							<Button
								type='button'
								className='mt-2'
								onClick={() => optionItems.append({ value: '' })}
							>
								Add Option
							</Button>
						</div>
					)}

					{['text', 'number', 'email', 'date', 'password'].includes(
						selectedType
					) && (
						<div className='flex flex-col'>
							<Label htmlFor='defaultValue'>Default Value</Label>
							<Input id='defaultValue' {...register('defaultValue')} />
						</div>
					)}

					{selectedType === 'radio' && (
						<div className='col-span-3'>
							<Label>Radio Options</Label>
							{radioOptions.fields.map((field, index) => (
								<div
									key={field.id}
									className='grid grid-cols-3 gap-4 items-end mt-2'
								>
									<div className='flex flex-col'>
										<Label>Label</Label>
										<Input
											{...register(`radioOptions.${index}.label`, {
												required: 'Label required',
											})}
										/>
									</div>
									<div className='flex flex-col'>
										<Label>Value</Label>
										<Input
											{...register(`radioOptions.${index}.value`, {
												required: 'Value required',
											})}
										/>
									</div>
									<Button
										type='button'
										variant='destructive'
										onClick={() => radioOptions.remove(index)}
									>
										Remove
									</Button>
								</div>
							))}
							<Button
								type='button'
								className='mt-2'
								onClick={() => radioOptions.append({ label: '', value: '' })}
							>
								Add Option
							</Button>
						</div>
					)}

					{selectedType === 'options' && (
						<div className='col-span-3'>
							<Label>Options</Label>
							{optionItems.fields.map((field, index) => (
								<div
									key={field.id}
									className='grid grid-cols-2 gap-4 items-end mt-2'
								>
									<div className='flex flex-col'>
										<Label>Option</Label>
										<Input
											{...register(`optionItems.${index}.value`, {
												required: 'Option required',
											})}
										/>
									</div>
									<Button
										type='button'
										variant='destructive'
										onClick={() => optionItems.remove(index)}
									>
										Remove
									</Button>
								</div>
							))}
							<Button
								type='button'
								className='mt-2'
								onClick={() => optionItems.append({ value: '' })}
							>
								Add Option
							</Button>
						</div>
					)}

					<div className='flex flex-col'>
						<Label>Render</Label>
						<RadioGroup
							value={useWatch({ control, name: 'render' }) ? 'true' : 'false'}
							onValueChange={(value) =>
								setValue('render', value === 'true', { shouldValidate: true })
							}
							className='flex gap-4 mt-2'
						>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='true' id='render-true' />
								<Label htmlFor='render-true'>True</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='false' id='render-false' />
								<Label htmlFor='render-false'>False</Label>
							</div>
						</RadioGroup>
						<input type='hidden' {...register('render')} />
					</div>

					{/* Validation Rules Section */}
					<div className='flex flex-col col-span-3'>
						<Label>Any Validation Rules?</Label>
						<RadioGroup
							value={hasValidationRules}
							onValueChange={(value) =>
								setValue('hasValidationRules', value, { shouldValidate: true })
							}
							className='flex gap-4 mt-2'
						>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='yes' id='validation-yes' />
								<Label htmlFor='validation-yes'>Yes</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='no' id='validation-no' />
								<Label htmlFor='validation-no'>No</Label>
							</div>
						</RadioGroup>

						{hasValidationRules === 'yes' && (
							<div className='mt-4'>
								{validationRules.fields.map((field, index) => (
									<div
										key={field.id}
										className='grid grid-cols-4 gap-4 items-end mb-2'
									>
										<div className='flex flex-col'>
											<Label>Validation Key</Label>
											<Select
												value={field.key || ''}
												onValueChange={(value) =>
													setValue(`validationRules.${index}.key`, value, {
														shouldValidate: true,
													})
												}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select a key' />
												</SelectTrigger>
												<SelectContent>
													{validations.map((v) => (
														<SelectItem key={v} value={v}>
															{v}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className='flex flex-col'>
											<Label>Value</Label>
											<Input {...register(`validationRules.${index}.value`)} />
										</div>
										<div className='col-span-1 flex items-center'>
											<Button
												type='button'
												variant='destructive'
												onClick={() => validationRules.remove(index)}
											>
												Remove
											</Button>
										</div>
									</div>
								))}
								<Button
									type='button'
									className='mt-2'
									onClick={() => validationRules.append({ key: '', value: '' })}
								>
									Add Validation Rule
								</Button>
							</div>
						)}
					</div>

					<div className='col-span-3 mt-4'>
						<Button type='submit'>Submit</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
