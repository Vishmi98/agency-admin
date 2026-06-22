import { DropdownType } from "@/type/common.types";
import { WebUniversityDataType } from "../university/university.types";

export type AddModalProps = {
    isOpen: boolean;
    onClose: () => void;
    handleReload: () => void;
}

export type CountriesResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type CountriesResponseDataType = {
    success: boolean;
    message: string;
    countries: DropdownType[] | []
}

export type CreateCountryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        country: DropdownType;
    }
}

export type CreateCountryResponseType = {
    success: boolean;
    message: string;
    data: string;
}

export type TableProps = {
    reload?: boolean;
    handleReload?: () => void;
}

export type WebCountryType = {
    country: string;
    image: string;
    title: string;
    shortDescription: string;
    popularity: string;
    advantage1: string;
    advantage2: string;
    advantage3: string;
    advantage4: string;
    advantage5: string;
    requirement1: string;
    requirement2: string;
    requirement3: string;
    requirement4: string;
    requirement5: string;
    cost1: string;
    cost2: string;
    cost3: string;
    cost4: string;
    scholarships1: string;
    scholarships2: string;
    scholarships3: string;
    scholarships4: string;
    universities: number[] | [];
    url: string;
    isPublish: boolean;
}

export type WebCountryDataType = {
    id: number;
    country: string;
    image: string;
    title: string;
    shortDescription: string;
    popularity: string;
    advantage1: string;
    advantage2: string;
    advantage3: string;
    advantage4: string;
    advantage5: string;
    requirement1: string;
    requirement2: string;
    requirement3: string;
    requirement4: string;
    requirement5: string;
    cost1: string;
    cost2: string;
    cost3: string;
    cost4: string;
    scholarships1: string;
    scholarships2: string;
    scholarships3: string;
    scholarships4: string;
    universities: number[];
    url: string;
    universitiesInfo: WebUniversityDataType[];
    isPublish: boolean;
}

export type WebCountriesResponseType = {
    success: boolean;
    message: string;
    data: { countries: WebCountryDataType[] | [] };
}

export type WebCountriesResponseDataType = {
    success: boolean;
    message: string;
    countries: WebCountryDataType[] | []
}

export type CreateWebCountryResponseType = {
    success: boolean;
    message: string;
    data: WebCountryType;
}

export type CreateWebCountryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        country: WebCountryType;
    }
}

export type PublishWebCountryResponseDataType = {
    success: boolean;
    message: string;
    data: WebCountryType
}
