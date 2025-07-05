

export function random(len: number){
    let options = "sihuhw2jbcjdihisjijuihdihdijeijid";
    let size  = options.length;

    let ans ="";

    for(let i=0;i<len;i++){

        ans += options[Math.floor((Math.random() *size))];
    }

    console.log(ans);
    return ans;
}