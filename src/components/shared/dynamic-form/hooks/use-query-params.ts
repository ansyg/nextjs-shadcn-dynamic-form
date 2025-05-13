// hooks/useQueryParams.ts
'use client';

import {useMemo} from 'react';
// @ts-ignore
import {useSearchParams} from "next/navigation";

export const useQueryParams = () => {
    const searchParams = useSearchParams();

    return useMemo(() => {
        const params: Record<string, string> = {};
        searchParams.forEach((value: any, key: any) => {
            params[key] = value;
        });
        return params;
    }, [searchParams]);
};