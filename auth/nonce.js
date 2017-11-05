var repeat = 0
var last = 0
// 必须和auth.js中秘钥过期时间一致
var timeout = 60*1000*1000 //单位us
var nonces = []  

function contains(arr, obj) {  
    let i = arr.length;  
    while (i--) {
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false;  
} 

gen = () => {
    var now = new Date().getTime() * 1000
    if (last === now) {
        ++repeat
    } else {
        repeat=0
        last=now
    }
    return (now+repeat)
}

sort = () => {
    let now = new Date().getTime()*1000
    //console.log('')
    //console.log('  '+now)
    // 第一个都小于timeout，后面更加小于，所以退出，本次没找到
    if(nonces.length>0) {
        //console.log('  '+(now-nonces[0]))
        if((now-nonces[0]) > timeout) {
            let j=-1
            for(i=0; i<nonces.length; i++) {
                if((now-nonces[i]) > timeout) {
                    if((i+1) < nonces.length && (now-nonces[i+i]) < timeout) {
                        j=i
                        break
                    }
                }
            }
            //console.log(index)
            nonces.splice(0,j+1)
        }
    }
}

exports.genjti = () => {
    let jti = gen()
    sort()
    return jti
}

exports.print = () => {
    sort()
    console.log(nonces)
}

exports.isExist = (jti) => {
    let is = contains(nonces, jti)
    if(!is) {
        nonces.push(jti)
    }
    console.log(nonces)
    return is
}