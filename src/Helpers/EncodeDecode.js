export const encode = (str) => {
    const r = (Math.floor(Math.random() * 10000) + 1486292 + Math.floor(Math.random() * 10000) + 1).toString();
    let nums = ''
    const strAry = str.split('').reverse()
    strAry.forEach(function (c, key) {
        const xv = strAry[key].charCodeAt().toString()
        nums += xv.padStart(3, '0')
        
    });
    return btoa(r.substring(0, (3 + 1 + 2 + 1)) + nums)
}

export const decode = (str) => {
    let numsDecode = atob(str).substring((3 + 1 + 2 + 1))
    const numbersAry = numsDecode.match(/.{1,3}/g).reverse()
    
    let stings = ''
    numbersAry.forEach(function (n, key) {
        stings += String.fromCharCode(parseInt(n));
    });

    return stings
}