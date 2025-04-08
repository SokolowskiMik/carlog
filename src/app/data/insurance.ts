export interface Insurance {
    id?: string;
    carId?: string;
    insurer: string;
    typeOfInsurance: string;
    service: string;
    policyNumber: string;
    dateOfContractConclusion: string | Date;
    startOfInsurance: string | Date;
    endOfInsurance: string | Date;
    phoneNumberToCall: string;
    createdAt?: any;
    updatedAt?: any;
}