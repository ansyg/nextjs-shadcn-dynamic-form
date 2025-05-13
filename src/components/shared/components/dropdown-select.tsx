"use client";

import type React, {ReactNode} from "react";
import {type ReactNode, useCallback, useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import type {LucideIcon} from "lucide-react";
import {Check, ChevronDown, Loader2, X} from "lucide-react";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {motion} from "framer-motion";

// Define TypeScript types
export type Option = string | number | { [key: string]: any };

export type DynamicSelectProps = {
    options?: Option[],
    optionLabel?: any,
    optionValue?: any,
    placeholder?: string,
    dataKey?: string,
    debugMode?: boolean,
    defaultValue?: string | number | object,
    onValueChange?: (value: any) => void,
    isSearchable?: boolean,
    customLabelRenderer?: (option: Option) => ReactNode,
    disabledOptions?: (string | number | object)[],
    asyncOptions?: () => Promise<Option[]>,
    className?: string,
    isLoading?: boolean,
    icon?: LucideIcon,
    variant?: "default" | "outline" | "custom",
    showAnimation?: boolean,
    clearable?: boolean,
    noResultText?: string,
    disabled?: any
};

const DropDownSelect = <K, >({
                                 options,
                                 optionLabel,
                                 optionValue,
                                 placeholder = "Select an option",
                                 defaultValue,
                                 onValueChange,
                                 isSearchable = false,
                                 customLabelRenderer,
                                 disabledOptions = [],
                                 asyncOptions,
                                 className,
                                 debugMode = false,
                                 isLoading = false,
                                 icon: Icon,
                                 variant = "default",
                                 showAnimation = true,
                                 clearable = false,
                                 noResultText = " No results found.",
                                 disabled,
                                 dataKey,
                             }: DynamicSelectProps) => {
    const [open, setOpen] = useState(false);
    const [allOptions, setAllOptions] = useState<Option[]>();
    const [filteredOptions, setFilteredOptions] = useState<Option[]>();
    const [selectedValue, setSelectedValue] = useState<string>(
        defaultValue?.toString() || ""
    );
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Load async options if provided
    useEffect(() => {
        const loadOptions = async () => {
            if (asyncOptions) {
                try {
                    const data = await asyncOptions();
                    setAllOptions(data);
                    setFilteredOptions(data);
                } catch (error) {
                    console.error("Failed to load options:", error);
                }
            } else {
                setAllOptions(options);
                setFilteredOptions(options);
            }
        };

        loadOptions();
    }, [asyncOptions, options]);

    // Reset filtered options when all options change
    useEffect(() => {
        if (options && options?.length > 0) {
            setAllOptions(options);
            setFilteredOptions(options);
        }
    }, [options]);

    // Filter options based on search term
    useEffect(() => {
        if (!isSearchable || searchTerm === "") {
            setFilteredOptions(allOptions);
            return;
        }

        try {
            if (debugMode) {
                console.log("Filtering with search term:", searchTerm);
                console.log("Available options:", allOptions);
                console.log("Using optionLabel:", optionLabel);
                console.log("Using optionValue:", optionValue);
            }
            // Check if we're filtering objects without a optionValue
            if (
                allOptions &&
                allOptions?.length > 0 &&
                typeof allOptions[0] === "object" &&
                allOptions[0] !== null &&
                !optionValue
            ) {
                console.error(
                    "ERROR: You are filtering objects without providing a optionValue. " +
                    "Please provide a optionValue prop to DropDownSelect when filtering objects."
                );
            }

            const filtered = allOptions?.filter((option: Option) => {
                // Handle different option types
                if (typeof option === "string" || typeof option === "number") {
                    const result = String(option)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    if (debugMode) {
                        console.log(
                            `Filtering string/number option: ${option}, result: ${result}`
                        );
                    }
                    return result;
                } else if (typeof option === "object" && option !== null) {
                    // For objects, search in the display field (optionLabel)
                    if (!optionLabel) {
                        console.error(
                            "ERROR: optionLabel is required for filtering objects"
                        );
                        return false;
                    }

                    const displayValue = option[optionLabel as string];
                    if (displayValue !== undefined && displayValue !== null) {
                        const result = String(displayValue)
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase());
                        if (debugMode) {
                            console.log(`Filtering object option: ${JSON.stringify(option)}`);
                            console.log(
                                `Using optionLabel: ${String(
                                    optionLabel
                                )}, value: ${displayValue}, result: ${result}`
                            );
                        }
                        return result;
                    } else {
                        console.warn(
                            `Object is missing the optionLabel "${String(optionLabel)}":`,
                            option
                        );
                    }
                }
                return false;
            });

            if (debugMode) console.log("Filtered options:", filtered);
            setFilteredOptions(filtered);
        } catch (error) {
            console.error("Error filtering options:", error);
            // Fallback to showing all options
            setFilteredOptions(allOptions);
        }
    }, [searchTerm, allOptions, optionLabel, optionValue, isSearchable]);

    // Get value for an option
    const getOptionValue = useCallback(
        (option: Option): string => {
            try {
                if (typeof option === "string" || typeof option === "number") {
                    return String(option);
                } else if (typeof option === "object" && option !== null) {
                    // Use optionValue for the value
                    const value = option[(dataKey || optionValue) as string];
                    return value !== undefined && value !== null ? String(value) : "";
                }
            } catch (error) {
                console.error("Error getting option value:", error);
            }
            return "";
        },
        [optionValue]
    );

    // Get label for an option
    const getOptionLabel = useCallback(
        (option: Option): React.ReactNode => {
            try {
                if (customLabelRenderer) {
                    return customLabelRenderer(option);
                }

                if (typeof option === "string" || typeof option === "number") {
                    return String(option);
                } else if (typeof option === "object" && option !== null) {
                    // Use optionLabel for the display
                    const label = option[optionLabel as string];
                    return label !== undefined && label !== null ? String(label) : "";
                }
            } catch (error) {
                console.error("Error getting option label:", error);
            }
            return "";
        },
        [customLabelRenderer, optionLabel]
    );

    // Check if an option is disabled
    const isOptionDisabled = useCallback(
        (option: Option): boolean => {
            try {
                if (typeof option === "object" && optionValue && option !== null) {
                    const value = getOptionValue(option[optionValue as string]);

                    return disabledOptions.some(
                        (option) => option[optionValue as keyof typeof option] === value
                    );
                } else {
                    const value = getOptionValue(option);

                    return disabledOptions.includes(value as any);
                }
            } catch (error) {
                console.error("Error checking if option is disabled:", error);
                return false;
            }
        },
        [disabledOptions, getOptionValue]
    );

    // Handle selection
    const handleSelect = useCallback(
        (value: any) => {
            try {
                // if (!value) {
                //     return
                // }
                setSelectedValue(value);

                // Find the selected option
                const selectedOption = allOptions?.find(
                    (option) => getOptionValue(option) === value
                );

                if (selectedOption && onValueChange) {

                    /*if optionValue is specified on field config
                    *then we return the value and not object, unless if optionValue
                    * is not specified we will return object
                     */

                    optionValue ? onValueChange(value) :
                        onValueChange(selectedOption as keyof K);
                }

                setOpen(false);
            } catch (error) {
                console.error("Error handling selection:", error);
            }
        },
        [allOptions, getOptionValue, onValueChange]
    );

    // Handle clear selection
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the dropdown
        setSelectedValue("");
        if (onValueChange) {
            onValueChange(null);
        }
    };

    // Get the display value for the selected option
    const displayValue = useCallback(() => {
        try {
            if (!selectedValue) return "";

            const selectedOption = allOptions?.find(
                (option) => getOptionValue(option) === selectedValue
            );

            if (!selectedOption) return "";

            if (customLabelRenderer && typeof selectedOption === "object") {
                // Just return the text part, not the full JSX
                return typeof selectedOption === "object" && optionLabel
                    ? selectedOption[optionLabel]?.toString()
                    : selectedOption?.toString();
            }

            return getOptionLabel(selectedOption)?.toString() || "";
        } catch (error) {
            console.error("Error getting display value:", error);
            return "";
        }
    }, [
        selectedValue,
        allOptions,
        getOptionValue,
        getOptionLabel,
        customLabelRenderer,
        optionLabel,
    ]);

    // Handle search input change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    // If not searchable, use regular Select component
    if (!isSearchable) {
        return (
            <div className={cn(" relative ", className)}>
                <Select
                    value={selectedValue}
                    onValueChange={handleSelect}
                    disabled={isLoading}>
                    <SelectTrigger
                        className={cn(
                            "transition-all duration-200 text-left justify-start",
                            variant === "custom" && "shadow-md hover:shadow-lg",
                            className
                        )}>
                        {isLoading ? (
                            <div className="flex items-start">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <div className="flex items-start w-full">
                                {Icon && <Icon className="mr-2 h-4 w-4 shrink-0"/>}
                                <SelectValue placeholder={placeholder} className="text-left"/>
                            </div>
                        )}
                    </SelectTrigger>
                    <SelectContent
                        className={cn("rounded-md ", variant === "custom" && "shadow-md")}>
                        {isLoading ? (
                            <div className="flex justify-center items-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                <span className="ml-2">Loading...</span>
                            </div>
                        ) : allOptions && allOptions?.length > 0 ? (
                            allOptions.map((option, index) => {
                                const value = getOptionValue(option);
                                const label = getOptionLabel(option);
                                const isDisabled = isOptionDisabled(option);

                                return (
                                    <SelectItem
                                        className={cn(
                                            "transition-colors duration-200",
                                            isDisabled
                                                ? "hover:cursor-not-allowed opacity-50"
                                                : "hover:cursor-pointer",
                                            selectedValue === value &&
                                            variant === "custom" &&
                                            "bg-slate-100 font-medium"
                                        )}
                                        key={`${value}-${index}`}
                                        value={value}
                                        disabled={isDisabled}>
                                        {label}
                                    </SelectItem>
                                );
                            })
                        ) : (
                            <></>
                            // <div className="py-6 text-center text-sm text-muted-foreground">{noResultText}</div>
                        )}
                    </SelectContent>
                </Select>
                {clearable && selectedValue && !isLoading && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Clear selection">
                        <X className="h-4 w-4 text-gray-500"/>
                    </button>
                )}
            </div>
        );
    }

    // For searchable, use Command component with custom filtering
    // @ts-ignore
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className={cn(" relative ", className)}>
                <PopoverTrigger
                    asChild
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        className
                    )}>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full h-11 flex items-center justify-between text-left font-normal transition-all duration-200",
                            variant === "custom" && "shadow-md hover:shadow-lg"
                        )}
                        disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <span className="flex items-center flex-1 truncate">
                {Icon && <Icon className="mr-2 h-4 w-4 shrink-0"/>}
                                {selectedValue ? displayValue() : placeholder}
              </span>
                        )}
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                open && "transform rotate-180"
                            )}
                        />
                    </Button>
                </PopoverTrigger>
                {clearable && selectedValue && !isLoading && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 transition-colors"
                        aria-label="Clear selection">
                        <X className="h-4 w-4 text-gray-500"/>
                    </button>
                )}
            </div>
            <PopoverContent
                className={cn(
                    "w-[var(--radix-popover-trigger-width)] p-0",
                    variant === "custom" && "shadow-md rounded-md"
                )}
                align="start">
                <Command shouldFilter={false}>
                    <div className="px-3 py-2 border-b">
                        <CommandInput
                            placeholder="Search..."
                            value={searchTerm}
                            onValueChange={handleSearchChange}
                            className="h-9 border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        />
                    </div>
                    <CommandList>
                        {/*<CommandEmpty>{noResultText}.</CommandEmpty>*/}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                <span className="ml-2">Loading...</span>
                            </div>
                        ) : (
                            <CommandGroup>
                                {filteredOptions && filteredOptions?.length > 0 ? (
                                    filteredOptions.map((option, index) => {
                                        const value = getOptionValue(option);
                                        const label = getOptionLabel(option);
                                        const isDisabled = isOptionDisabled(option);

                                        return showAnimation ? (
                                            <motion.div
                                                key={`${value}-${index}`}
                                                initial={{opacity: 0, y: 5}}
                                                animate={{opacity: 1, y: 0}}
                                                transition={{duration: 0.2, delay: index * 0.03}}>
                                                <CommandItem
                                                    value={value}
                                                    disabled={isDisabled}
                                                    onSelect={handleSelect}
                                                    className={cn(
                                                        "flex items-center gap-2 transition-colors duration-200 my-1 rounded-md",
                                                        isDisabled
                                                            ? "opacity-50 pointer-events-none cursor-not-allowed"
                                                            : "hover:cursor-pointer",
                                                        selectedValue === value &&
                                                        "bg-slate-100 font-medium"
                                                    )}>
                                                    <Check
                                                        className={cn(
                                                            "h-4 w-4",
                                                            selectedValue === value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {label}
                                                </CommandItem>
                                            </motion.div>
                                        ) : (
                                            <CommandItem
                                                key={`${value}-${index}`}
                                                value={value}
                                                disabled={isDisabled}
                                                onSelect={handleSelect}
                                                className={cn(
                                                    "flex items-center gap-2 transition-colors duration-200 my-1 rounded-md",
                                                    isDisabled
                                                        ? "opacity-50 pointer-events-none cursor-not-allowed"
                                                        : "hover:cursor-pointer",
                                                    selectedValue === value && "bg-slate-100 font-medium"
                                                )}>
                                                <Check
                                                    className={cn(
                                                        "h-4 w-4",
                                                        selectedValue === value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {label}
                                            </CommandItem>
                                        );
                                    })
                                ) : (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                        {noResultText}
                                    </div>
                                )}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default DropDownSelect;
