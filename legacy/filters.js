function accuracyDigester(accuracy) {
    let acc_obj = {
        display: '',
        zoom: 1
    }
    if (accuracy < 1) {
        acc_obj.display = `< 1m`
    } else if (accuracy < 1000) {
        acc_obj.display = `~ ${ accuracy.toFixed(0) }m`
    } else {
        acc_obj.display = `~ ${ (accuracy / 1000).toFixed(1) }km`   
    }
    if (accuracy < 50) {
        acc_obj.zoom = 19
    } else if (accuracy < 150) {
        acc_obj.zoom = 18
    } else if (accuracy < 250) {
        acc_obj.zoom = 17
    } else if (accuracy < 500) {
        acc_obj.zoom = 16
    } else if (accuracy < 1000) {
        acc_obj.zoom = 15
    } else if (accuracy < 2500) {
        acc_obj.zoom = 14
    } else if (accuracy < 5000) {
        acc_obj.zoom = 13
    } else if (accuracy < 10000) {
        acc_obj.zoom = 12
    } else if (accuracy < 15000) {
        acc_obj.zoom = 11
    } else if (accuracy < 25000) {
        acc_obj.zoom = 10
    } else if (accuracy < 50000) {
        acc_obj.zoom = 9
    } else if (accuracy < 150000) {
        acc_obj.zoom = 8
    } else if (accuracy < 250000) {
        acc_obj.zoom = 7
    } else {
        acc_obj.zoom = 6
    }
    return acc_obj
}

export {
    accuracyDigester
}