export interface Product {
    Name: string;
    Type: string;
    Price?: number;
    Description?: string;
}

export interface ProductCategory {
    name: string;
    products: Product[]
}

export interface UpdateOrderAction {
    action: "add" | "remove"
    name: string;
    category?: string;
    price: number;
}

export interface SelectedProject {
    projectName: string;
    projectNumber: number;
    state : string;
    selectedcity: string;
    sprojectfloor: number;
    sprojectpour: number;
    sworktype:string;
}
