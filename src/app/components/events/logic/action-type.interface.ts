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
    name?: string;
    role?: any,
    phoneNumber?: string
}
