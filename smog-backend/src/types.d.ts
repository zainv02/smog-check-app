
export interface Fee {
    label: string,
    amount: number
}

export interface UserVehicleInfo {
    name?: string,
    address?: string,
    city?: string,
    phone?: string,
    source?: string,
    vin?: string,
    year?: number,
    make?: string,
    model?: string,
    plate?: string,
    mileage?: number,
    date?: string,
    fees?: Fee[],
    estimate?: number,
    signature?: number[][]
}

export interface UserSessionData extends UserVehicleInfo {
    id?: string,
    userState?: 'new' | 'old'
}