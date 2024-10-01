// Helper function to calculate age from date of birth
export const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff); // Convert to date
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Calculate age
};

export const formatDateForInput = (date: string) => {
    return date ? new Date(date).toISOString().split('T')[0] : '';
};

export const defaultPagination: any = {
    page: -1,
    limit: -1,
    search: "",
    sort: "createdAt",
    order: "asc",
};
