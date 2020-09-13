export interface ActionTypeJobInterface {
    id?: number;
    description?: any;
}

export interface ActionTypeInterface {
    id?: number;
    actionDescription?: any;
    actionTypeJobModels: ActionTypeJobInterface[];
}

export interface UserEventHandlerInterface {
    id?: number;
    email?: string;
    emailTemp?: string;
    name?: string;
    role?: any,
    editable?: boolean;
    phoneNumber?: string;
    phoneNumberTemp?: string;
}
