export const transformReqString = (description) => {
    let descriptionMod = description.toUpperCase()
    descriptionMod = descriptionMod.replaceAll(' ', '%')
    if(descriptionMod.slice(-1) != '%'){
        descriptionMod = descriptionMod + '%'
    }
    return descriptionMod
}