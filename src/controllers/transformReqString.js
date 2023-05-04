if(typeof String.prototype.replaceAll === "undefined") {
    String.prototype.replaceAll = function(match, replace) {
       return this.replace(new RegExp(match, 'g'), () => replace);
    }
}

const transformReqString = (description) => {
    let descriptionMod = description.toUpperCase()
    descriptionMod = descriptionMod.replaceAll(' ', '%')
    if(descriptionMod.slice(-1) != '%'){
        descriptionMod = descriptionMod + '%'
    }
    return descriptionMod
}

module.exports = transformReqString