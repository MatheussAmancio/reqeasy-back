import { Status } from "../enum/status"

const statusMap = [
    {
        from: Status.CREATED,
        to: [Status.PROCESSING, Status.CANCELED]
    },
    {
        from: Status.PROCESSING,
        to: [Status.COMPLETED, Status.CANCELED]
    },
    {
        from: Status.COMPLETED,
        to: []
    },
    {
        from: Status.CANCELED,
        to: []
    },
]

export class StatusChangeUsecase {
    execute(from: Status, to: Status) {
        const actualStatus = statusMap.filter(status => {
            if (status.from == from) {
                const hasTo = status.to.filter(statusTo => {
                    if (statusTo == to) {
                        return statusTo
                    }
                })
                return hasTo.length ? status : null
            }
        })

        if (!actualStatus.length) return null;

        return to
    }
}