var submit      = document.querySelector("#submit")
var password    = document.querySelector("#password")
var required    = document.querySelectorAll(".required")
var toValidate  = document.querySelector(".validate")
var pattern     = "(?=.*\\d).{8,}"
var comments    = document.querySelectorAll(".replytoggle")
var replycancel = document.querySelectorAll(".replycancel")
var imagepreview = document.getElementById('imagepreview')
var imageinput = document.getElementById('imageinput')
var mobilesearchclose = document.getElementById("mobilesearchclose")
var mobilesearch = document.getElementById("mobilesearch")
var searchiconmobile     = document.getElementById("searchiconmobilecont")





searchiconmobile.addEventListener("click",function(){
  mobilesearch.classList.toggle("hidden")
})

  mobilesearchclose.addEventListener("click",function(){
    mobilesearch.classList.toggle("hidden")
  })



if(imageinput){
  imageinput.addEventListener("change",function(){
    imagepreview.src = window.URL.createObjectURL(this.files[0])
    console.log(imagepreview.src)
  })
}







if(replycancel){
  replycancel.forEach(function(arr){
    arr.addEventListener("click",function(){
      //this.parentNode.parentNode.parentNode.children[1].classList.toggle("hidden")
      this.parentNode.parentNode.children[1].classList.toggle("show")
      this.parentNode.parentNode.children[0].classList.toggle("show")
      this.parentNode.parentNode.parentNode.children[1].classList.toggle("hidden")
    })
  })
}

if(comments){
  comments.forEach(function(arr){
    arr.addEventListener("click",function(){
      this.classList.toggle("hidden")
      this.parentNode.children[2].children[0].classList.toggle("show")
      this.parentNode.children[2].children[1].classList.toggle("show")
    })
  })
}




if(required){
  required.forEach((arr) => {arr.addEventListener("focusout",()=>{arr.setAttribute("required","")})})
  var reviewobj = {
      last: "",
      first: 0
  }
}




if(submit){
  submit.addEventListener("click",()=>{
    required.forEach((arr)=>{
    if(arr.value==""){
        arr.setAttribute("required","")
    }
  })
})}


function emptyCheck(){
  if(toValidate.value){
    return true
  }
  else{
    return false
  }
}



//searchremove.addEventListener("click",()=>{
//  navbar.classList.remove("expanded")
//})

//("#navbar"),searchicon=document.querySelector("#searchicon"),searchremove=document.querySelector("#searchremove");searchicon.addEventListener("click",()=>{navbar.classList.add("expanded")}),searchremove.addEventListener("click",()=>{navbar.classList.remove("expanded")});
