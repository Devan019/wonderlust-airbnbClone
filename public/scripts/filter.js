
const filter = (cat) => {
    let cards = document.querySelectorAll(".card");
    cards.forEach((card)=>{
        let category = card.querySelector("input").value;
        if(!category.includes(cat)){
            card.style.display = "none";
        }else{
            card.style.display = "";
        }
    })
}

let fixedPrices = [];
document.querySelectorAll(".price span").forEach((fixed)=>{
    const number = Number(fixed.innerText.replace(/,/g, ""));
    const price = parseInt(number);
    fixedPrices.push(price);
})

const change = () => {
    let taxSwitch = document.querySelector(".taxSwitch");
    let allgsts = document.querySelectorAll(".taxes");
    let allPrices = document.querySelectorAll(".price span")
    if (taxSwitch.checked) {
        allgsts.forEach((gst) => {
            gst.style.display = "none";
        })
        allPrices.forEach((price) => {
            const number = Number(price.innerText.replace(/,/g, ""));
            const result =parseInt( number + number*.18);
            price.innerText = String(result.toLocaleString("en-IN"))
        })
    } else {
        allgsts.forEach((gst) => {
            gst.style.display = "inline";
        })
        allPrices.forEach((price , idx) => {
            price.innerText = String(fixedPrices[idx].toLocaleString("en-IN"))
        })
    }
}