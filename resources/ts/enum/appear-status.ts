enum AppearStatus
{
    APPEARING = 1,
    APPEARED = 2,
    DISAPPEARING = 3,
    DISAPPEARED = 4
}

namespace AppearStatus
{
    export function isAppeared(status: AppearStatus): boolean
    {
        return status === AppearStatus.APPEARED;
    }

    export function isDisappeared(status: AppearStatus): boolean
    {
        return status === AppearStatus.DISAPPEARED;
    }

    export function isTransitioning(status: AppearStatus): boolean
    {
        return status === AppearStatus.APPEARING || status === AppearStatus.DISAPPEARING;
    }

    export function isAppearing(status: AppearStatus): boolean
    {
        return status === AppearStatus.APPEARING;
    }

    export function isDisappearing(status: AppearStatus): boolean
    {
        return status === AppearStatus.DISAPPEARING;
    }
}

export { AppearStatus }; 