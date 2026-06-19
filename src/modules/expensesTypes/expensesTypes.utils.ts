import * as Yup from "yup";

export const addDropdownInitialValues = {
    title: "",
};

export const addDropdownValidationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
});
