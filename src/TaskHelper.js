export function getName(taskCategory) {
    let name = "";
    switch(taskCategory) {
        case 1:
            name = "Dispatch";
            break;
        case 2:
            name = "Food/Shopping";
            break;
        case 3:
            name = "Event Crew";
            break;
        case 4:
            name = "Flyering";
            break;
        case 5:
            name = "Promoter";
            break;
        case 6:
            name = "Academic";
            break;
        case 7:
            name = "Daycare";
            break;
        case 8:
            name = "Housekeeping";
            break;
        case 9:
            name = "Cooking";
            break;
    }

    return name;
}

export function getImage(taskCategory) {
    if(taskCategory === 1) {
        return require("./assets/icon_dispatch.png");
    } else if(taskCategory === 2) {
        return require("./assets/icon_shopping.png");
    } else if(taskCategory === 3) {
        return require("./assets/icon_eventcrew.png");
    } else if(taskCategory === 4) {
        return require("./assets/icon_flyering.png");
    } else if(taskCategory === 5) {
        return require("./assets/icon_promoter.png");
    } else if(taskCategory === 6) {
        return require("./assets/icon_academic.png");
    } else if(taskCategory === 7) {
        return require("./assets/icon_daycare.png");
    } else if(taskCategory === 8) {
        return require("./assets/icon_housekeeping.png");
    } else if(taskCategory === 9) {
        return require("./assets/icon_cooking.png");
    }
}
