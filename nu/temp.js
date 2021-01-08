function customfavfunction() 
{ 
    var post_id = getpostid(); Favorite.create(post_id); 
} 

function getpostid()
{
    post_id = document.getElementById("post-view").firstChild.nextSibling.innerText;
    alert(post_id) 
    return post_id;
}


















var post_id = document.getElementById("post-view").firstChild.nextSibling.innerText; 
Favorite.create(post_id); 












function whichButton(e) {
    if (!e) var e = window.event;
    switch (e.which) {
        case 1: alert("Left"); break;
        case 2: alert("Middle"); break;
        case 3: alert("Right"); break;
    }
}